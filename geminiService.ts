
import { GoogleGenAI, Modality } from "@google/genai";
import { TeachingMode, LessonStep, Unit, Lesson } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const TEACHER_SYSTEM_PROMPT = `
أنتِ معلمة افتراضية ذكية متخصصة في تدريس اللغة الإنجليزية لأطفال الصف الثالث الابتدائي في مصر.
المنهج: كتاب الوزارة للتيرم الأول.
العمر: 8-9 سنوات.
الأسلوب: بسيط، مرح، تفاعلي، مشجع.

القواعد:
1. الالتزام بالمنهج المصري حرفياً.
2. استخدام الرموز التعبيرية 🎵🍎🐱⭐.
3. في طريقة (Arabic): اشرحي الكلمات الإنجليزية بالعربية وانطقي الإنجليزية بوضوح.
4. في طريقة (English): تحدثي بالإنجليزية فقط بجمل قصيرة جداً وبسيطة.
5. شجعي الطفل دائماً: "شاطر 👏"، "برافو!"، "أنت ممتاز!".
6. انتظري إجابة الطفل (تخيليها في ردك).
`;

export const getTeacherDialogue = async (
  unit: Unit,
  lesson: Lesson,
  step: LessonStep,
  mode: TeachingMode
) => {
  const prompt = `
  Instruction Mode: ${mode === TeachingMode.ARABIC ? "🟢 التعليم باللغة العربية" : "🔵 التعليم باللغة الإنجليزية"}
  Unit: ${unit.id} - ${unit.title}
  Lesson: ${lesson.id} - ${lesson.title}
  Current Step: ${step}
  
  Content to cover:
  Vocabulary: ${lesson.content.vocabulary.join(", ")}
  Phonics: ${lesson.content.phonics || "N/A"}
  Grammar: ${lesson.content.language}
  
  Please provide the teacher's script for this specific step. 
  Keep it short, engaging, and suitable for the selected instruction mode.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: TEACHER_SYSTEM_PROMPT,
        temperature: 0.8,
      },
    });

    return response.text || "I'm having a little trouble thinking. Let's try again! ✨";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Oops! Let's restart our lesson! 🌟";
  }
};

export const getTeacherAudio = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};

export const connectToTeacherLive = (mode: TeachingMode, currentContext: string, callbacks: any) => {
  const liveAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return liveAi.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
      },
      systemInstruction: TEACHER_SYSTEM_PROMPT + "\nسياق الدرس الحالي: " + currentContext,
    },
    callbacks
  });
};
