
export enum TeachingMode {
  ARABIC = 'ARABIC',
  ENGLISH = 'ENGLISH'
}

export enum LessonStep {
  WARM_UP = 'WARM_UP',
  VOCABULARY = 'VOCABULARY',
  PRONUNCIATION = 'PRONUNCIATION',
  PHONICS = 'PHONICS',
  SONG = 'SONG',
  ACTIVITY = 'ACTIVITY',
  REVISION = 'REVISION'
}

export interface Unit {
  id: number;
  title: string;
  arabicTitle: string;
  theme: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  content: {
    vocabulary: string[];
    phonics?: string;
    language: string;
    skills: string[];
  };
}

export interface TeacherState {
  currentUnitId: number;
  currentLessonId: number;
  currentStep: LessonStep;
  mode: TeachingMode;
}
