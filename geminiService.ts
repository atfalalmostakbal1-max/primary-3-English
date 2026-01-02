
import { GoogleGenAI, Modality } from "@google/genai";
import { TeachingMode, LessonStep, Unit, Lesson } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const TEACHER_SYSTEM_PROMPT = `
أنتِ معلمة افتراضية ذكية متخصصة في تدريس اللغة الإنجليزية لأطفال الصف الثالث الابتدائي في مصر.
المنهج: كتاب الوزارة للتيرم الأول 2025/2026.
العمر: 8-9 سنوات.

الأسلوب التربوي:
- شرح المفاهيم بوضوح ومرح.
- استخدام التعبيرات: "Look! 👀", "Listen and repeat! 👂", "Let's practice! ✍️".
- عند وجود "Phonics": ركزي على مخارج الحروف كما في الكتاب (مثل wh, ph, x, ck).
- عند وجود "Grammar": اشرحي القاعدة ببساطة (Verb to be, Past Simple, Present Continuous).

التعامل مع التدريبات:
1. في مرحلة "Activity": اطلبي من الطفل حل تدريب من نوع (Match, Fill in the blanks, Reorder, Circle the correct word).
2. قدمي التدريب كأنه لعبة.
3. انتظري إجابة تخيلية من الطفل، ثم قولي: "Excellent! You matched the picture with the word correctly! 🌟".
4. شجعي الطفل على استخدام الميكروفون للنطق.

القواعد اللغوية:
- Arabic Mode: اشرحي بالعامية المصرية المحببة للأطفال مع نطق المصطلحات الإنجليزية بوضوح.
- English Mode: استخدمي لغة إنجليزية بسيطة جداً (Basic English).
`;

export const getTeacherDialogue = async (
  unit: Unit,
  lesson: Lesson,
  step: LessonStep,
  mode: TeachingMode
) => {
  const prompt = `
  Context:
  Unit: Unit ${unit.id} - ${unit.title} (${unit.arabicTitle})
  Lesson: Lesson ${lesson.id} - ${lesson.title}
  Current Lesson Phase: ${step}
  
  Lesson Content:
  - Vocabulary: ${lesson.content.vocabulary.join(", ")}
  - Phonics: ${lesson.content.phonics || "No specific phonics for this lesson"}
  - Grammar/Language: ${lesson.content.language}
  - Key Skills: ${lesson.content.skills.join(", ")}

  Teacher Task:
  Act as the teacher for the "${step}" part of this specific lesson. 
  If the phase is "VOCABULARY", introduce the words.
  If the phase is "PHONICS", teach the sound.
  If the phase is "ACTIVITY", give the child an interactive challenge based on the book exercises (like reordering words or matching).
  Always end with an encouraging question or instruction.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: TEACHER_SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    return response.text || "Let's try that again, hero! ✨";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Oops! Let's restart our fun lesson! 🌟";
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
      systemInstruction: TEACHER_SYSTEM_PROMPT + "\nLesson Context: " + currentContext + "\nRespond based on the current unit and lesson goals.",
    },
    callbacks
  });
};
