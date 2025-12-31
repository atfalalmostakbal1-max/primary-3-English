
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TeachingMode, LessonStep, Unit, Lesson } from './types';
import { curriculum } from './curriculumData';
import { getTeacherDialogue, getTeacherAudio, connectToTeacherLive } from './geminiService';

// Audio Encoding & Decoding Utilities
function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate = 24000): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const buffer = ctx.createBuffer(1, dataInt16.length, sampleRate);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}

const ProgressBar = ({ currentStep }: { currentStep: LessonStep }) => {
  const steps = Object.values(LessonStep);
  const index = steps.indexOf(currentStep);
  const progress = ((index + 1) / steps.length) * 100;

  return (
    <div className="w-full bg-blue-100 rounded-full h-3 mb-6 relative overflow-hidden shadow-inner">
      <div 
        className="bg-gradient-to-r from-blue-400 to-indigo-500 h-full transition-all duration-700 rounded-full" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

const TeacherAvatar = ({ 
  script, 
  mode, 
  isPlaying, 
  isLive, 
  onPlay 
}: { 
  script: string; 
  mode: TeachingMode; 
  isPlaying: boolean; 
  isLive: boolean;
  onPlay: () => void 
}) => {
  return (
    <div className="flex flex-col items-center mb-4">
      <div className="relative mb-6">
        {/* Animated Rings for Voice */}
        {(isPlaying || isLive) && (
          <>
            <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-0 bg-blue-300 rounded-full animate-ping opacity-10 delay-300"></div>
          </>
        )}
        <div className={`relative w-40 h-40 bg-yellow-300 rounded-full flex items-center justify-center text-8xl shadow-2xl border-4 border-white overflow-hidden transition-all duration-500 ${(isPlaying || isLive) ? 'scale-110 rotate-3' : ''}`}>
          <span className={isPlaying || isLive ? 'animate-bounce' : ''}>👩‍🏫</span>
        </div>
        <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-md border-2 border-white flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-white'}`}></div>
          {mode === TeachingMode.ARABIC ? "المعلمة ذكية" : "Teacher Smart"}
        </div>
      </div>
      <div className="bg-white p-6 rounded-[2rem] shadow-xl border-b-8 border-blue-100 max-w-lg w-full relative">
        <button 
          onClick={onPlay}
          disabled={isPlaying || isLive}
          className="absolute -right-4 -top-4 w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-600 transition-all active:scale-90 disabled:opacity-50"
        >
          {isPlaying ? "🔊" : "▶️"}
        </button>
        <div className="prose prose-blue whitespace-pre-line text-lg text-blue-900 leading-relaxed font-bold">
          {isLive ? "أنا أسمعك الآن يا بطل! قل لي ما تريد... 🎤" : script}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [mode, setMode] = useState<TeachingMode | null>(null);
  const [currentUnit, setCurrentUnit] = useState<Unit | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [step, setStep] = useState<LessonStep>(LessonStep.WARM_UP);
  const [script, setScript] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLive, setIsLive] = useState<boolean>(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const liveAudioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const liveSessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const liveSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const steps = Object.values(LessonStep);

  const stopAllAudio = () => {
    if (currentSourceRef.current) {
      currentSourceRef.current.stop();
      currentSourceRef.current = null;
    }
    for (const source of liveSourcesRef.current) {
      source.stop();
    }
    liveSourcesRef.current.clear();
    setIsPlaying(false);
  };

  const playAudio = async (text: string) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    stopAllAudio();
    setIsPlaying(true);
    const base64 = await getTeacherAudio(text);
    
    if (base64) {
      const bytes = decode(base64);
      const buffer = await decodeAudioData(bytes, audioContextRef.current);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsPlaying(false);
      source.start();
      currentSourceRef.current = source;
    } else {
      setIsPlaying(false);
    }
  };

  const toggleLiveMic = async () => {
    if (isLive) {
      if (liveSessionRef.current) {
        liveSessionRef.current.close();
        liveSessionRef.current = null;
      }
      setIsLive(false);
      return;
    }

    stopAllAudio();
    setIsLive(true);

    if (!liveAudioContextRef.current) {
      liveAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    const contextStr = `الدرس الحالي: ${currentLesson?.title}. الكلمات: ${currentLesson?.content.vocabulary.join(', ')}. نحن في خطوة: ${step}.`;

    const sessionPromise = connectToTeacherLive(mode!, contextStr, {
      onopen: () => {
        const source = inputCtx.createMediaStreamSource(stream);
        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
        processor.onaudioprocess = (e) => {
          const inputData = e.inputBuffer.getChannelData(0);
          const int16 = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            int16[i] = inputData[i] * 32768;
          }
          const pcmBlob = {
            data: encode(new Uint8Array(int16.buffer)),
            mimeType: 'audio/pcm;rate=16000',
          };
          sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
        };
        source.connect(processor);
        processor.connect(inputCtx.destination);
      },
      onmessage: async (msg: any) => {
        const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
        if (audioData && liveAudioContextRef.current) {
          const ctx = liveAudioContextRef.current;
          nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
          const buffer = await decodeAudioData(decode(audioData), ctx, 24000);
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(ctx.destination);
          source.start(nextStartTimeRef.current);
          nextStartTimeRef.current += buffer.duration;
          liveSourcesRef.current.add(source);
          source.onended = () => liveSourcesRef.current.delete(source);
        }
        if (msg.serverContent?.interrupted) {
          for (const s of liveSourcesRef.current) s.stop();
          liveSourcesRef.current.clear();
        }
      },
      onclose: () => setIsLive(false),
      onerror: () => setIsLive(false)
    });

    liveSessionRef.current = await sessionPromise;
  };

  const fetchDialogue = useCallback(async () => {
    if (!currentUnit || !currentLesson || !mode) return;
    setLoading(true);
    const text = await getTeacherDialogue(currentUnit, currentLesson, step, mode);
    setScript(text);
    setLoading(false);
    playAudio(text);
  }, [currentUnit, currentLesson, step, mode]);

  useEffect(() => {
    if (currentLesson && mode && !isLive) {
      fetchDialogue();
    }
  }, [currentLesson, step, mode, fetchDialogue]);

  const handleNext = () => {
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    } else {
      alert("ممتاز يا بطل! أنهينا الدرس بنجاح 🎉");
      setStep(LessonStep.WARM_UP);
      setCurrentLesson(null);
    }
  };

  const handleBack = () => {
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  // Selection Views
  if (!mode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-100 via-white to-purple-100">
        <div className="text-9xl mb-8 animate-bounce">🍎</div>
        <h1 className="text-5xl font-black text-blue-800 mb-4 text-center tracking-tight">Smart Teacher</h1>
        <p className="text-2xl text-blue-600 mb-12 text-center font-bold">أهلاً بك يا بطل! كيف تريد أن نتعلم اليوم؟ 🚀</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          <button onClick={() => setMode(TeachingMode.ARABIC)} className="group bg-white p-10 rounded-[3rem] shadow-2xl hover:scale-105 transition-all border-4 border-green-400 flex flex-col items-center">
            <span className="text-7xl mb-6 group-hover:rotate-12 transition-transform">🟢</span>
            <span className="text-3xl font-black text-gray-800">باللغة العربية</span>
            <p className="text-gray-500 mt-4 text-center font-medium">نشرخ الإنجليزي بالعربي خطوة بخطوة</p>
          </button>
          <button onClick={() => setMode(TeachingMode.ENGLISH)} className="group bg-white p-10 rounded-[3rem] shadow-2xl hover:scale-105 transition-all border-4 border-blue-400 flex flex-col items-center">
            <span className="text-7xl mb-6 group-hover:-rotate-12 transition-transform">🔵</span>
            <span className="text-3xl font-black text-gray-800">English Only</span>
            <p className="text-gray-500 mt-4 text-center font-medium">Listen, speak, and learn completely in English</p>
          </button>
        </div>
      </div>
    );
  }

  if (!currentUnit) {
    return (
      <div className="min-h-screen p-8 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-black text-blue-900">الوحدات الدراسية 📚</h1>
          <button onClick={() => setMode(null)} className="bg-white px-6 py-3 rounded-2xl text-blue-600 font-black shadow-md hover:bg-blue-50">تغيير الطريقة</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {curriculum.map((unit) => (
            <button key={unit.id} onClick={() => setCurrentUnit(unit)} className="bg-white p-8 rounded-[2.5rem] shadow-lg hover:shadow-2xl transition-all border-b-[12px] border-blue-500 text-left relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-[3rem] flex items-center justify-center">
                 <span className="text-blue-600 font-black text-2xl">U{unit.id}</span>
              </div>
              <h2 className="text-2xl font-black text-gray-800 mb-2 mt-6">{unit.title}</h2>
              <p className="text-blue-500 font-bold mb-4">{unit.arabicTitle}</p>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">{unit.theme}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!currentLesson) {
    return (
      <div className="min-h-screen p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-6 mb-12">
          <button onClick={() => setCurrentUnit(null)} className="bg-white w-16 h-16 rounded-[1.5rem] text-blue-600 font-black text-3xl flex items-center justify-center shadow-md hover:shadow-lg transition-all">←</button>
          <div>
            <span className="text-sm font-black text-blue-400 uppercase tracking-widest">Unit {currentUnit.id}</span>
            <h1 className="text-4xl font-black text-blue-900">{currentUnit.title}</h1>
          </div>
        </div>
        <div className="space-y-6">
          {currentUnit.lessons.map((lesson) => (
            <button key={lesson.id} onClick={() => setCurrentLesson(lesson)} className="w-full bg-white p-8 rounded-[2rem] shadow-md hover:shadow-xl transition-all border-l-[12px] border-green-500 flex justify-between items-center group">
              <div className="text-left">
                <h3 className="text-2xl font-black text-gray-800">Lesson {lesson.id}: {lesson.title}</h3>
                <div className="flex gap-3 mt-4">
                  {lesson.content.vocabulary.slice(0, 4).map(v => (
                    <span key={v} className="text-xs bg-indigo-50 text-indigo-500 px-3 py-1 rounded-full font-bold">{v}</span>
                  ))}
                </div>
              </div>
              <span className="text-5xl group-hover:scale-110 transition-transform">🌟</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-10 flex flex-col items-center bg-[#f8fbff]">
      <div className="w-full max-w-3xl flex justify-between items-center mb-8">
        <button onClick={() => setCurrentLesson(null)} className="bg-white px-6 py-3 rounded-2xl text-blue-500 font-black shadow-md hover:shadow-lg transition-all">
          🔚 القائمة
        </button>
        <div className="text-center">
          <span className="block text-xs uppercase text-indigo-400 tracking-[0.2em] font-black mb-1">Unit {currentUnit.id} • Lesson {currentLesson.id}</span>
          <h2 className="text-xl font-black text-blue-900">{currentLesson.title}</h2>
        </div>
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg text-3xl border-2 border-yellow-200">
          🏆
        </div>
      </div>

      <div className="w-full max-w-3xl bg-white/60 backdrop-blur-xl p-8 md:p-12 rounded-[3.5rem] shadow-2xl border-4 border-white/80 relative">
        <ProgressBar currentStep={step} />
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
               <div className="animate-spin rounded-full h-32 w-32 border-b-8 border-indigo-500 opacity-20"></div>
               <div className="absolute inset-0 flex items-center justify-center text-6xl animate-pulse">👩‍🏫</div>
            </div>
            <p className="text-indigo-600 font-black mt-10 text-2xl animate-pulse">تحضر المعلمة المفاجآت...</p>
          </div>
        ) : (
          <>
            <TeacherAvatar 
              script={script} 
              mode={mode} 
              isPlaying={isPlaying}
              isLive={isLive}
              onPlay={() => playAudio(script)}
            />
            
            <div className="flex flex-col gap-6 mt-12">
              {/* Interactive Mic Button */}
              <div className="flex justify-center">
                <button 
                  onClick={toggleLiveMic}
                  className={`relative group w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${isLive ? 'bg-red-500 scale-125' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                  {isLive && (
                    <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-40"></div>
                  )}
                  <span className="text-4xl text-white relative z-10">{isLive ? '🛑' : '🎤'}</span>
                  {!isLive && (
                    <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-blue-600 font-black text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">تحدث معي</span>
                  )}
                </button>
              </div>

              <div className="flex gap-4 w-full mt-4">
                <button onClick={handleBack} disabled={step === LessonStep.WARM_UP} className="flex-1 py-6 bg-white text-blue-400 rounded-3xl font-black shadow-md disabled:opacity-30 border-2 border-blue-50 transition-all active:scale-95">السابق</button>
                <button onClick={handleNext} className="flex-[2] py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl font-black shadow-xl border-b-8 border-indigo-900 text-2xl transition-all active:scale-95">
                  {step === LessonStep.REVISION ? "أنهيت الدرس! 🎉" : "التالي ➡️"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-10 text-center text-blue-400 font-bold max-w-md italic">
        "انقر على الميكروفون واسأل المعلمة عن أي شيء في الدرس!" ✨
      </div>

      <div className="fixed bottom-10 right-10 pointer-events-none">
        <div className="bg-yellow-100 border-4 border-white text-yellow-700 px-8 py-4 rounded-[2rem] shadow-2xl font-black animate-bounce flex items-center gap-4">
          <span className="text-3xl">⭐</span>
          <span className="text-lg">أنت ذكي جداً!</span>
        </div>
      </div>
    </div>
  );
};

export default App;
