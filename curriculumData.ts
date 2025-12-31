
import { Unit } from './types';

export const curriculum: Unit[] = [
  {
    id: 1,
    title: "Let's Learn Together!",
    arabicTitle: "هيا نتعلم معًا!",
    theme: "Greetings, introductions, classroom rules, daily routines",
    lessons: [
      {
        id: 1,
        title: "Greetings and Introductions",
        content: {
          vocabulary: ["Hello", "Good morning", "How are you?", "Nice to meet you", "Goodbye", "Egypt"],
          language: "I am... / My name is...",
          skills: ["Self-awareness", "Social Etiquette"]
        }
      },
      {
        id: 2,
        title: "Classroom Rules & Phonics",
        content: {
          vocabulary: ["Raise your hand", "Listen carefully", "Sit down", "Be kind", "Don't shout"],
          phonics: "Digraph 'wh' (what, whale, white, wheel, when, where)",
          language: "May I go to the bathroom?",
          skills: ["Following Rules", "Respect"]
        }
      }
    ]
  },
  {
    id: 2,
    title: "My Family and I",
    arabicTitle: "أنا وعائلتي",
    theme: "Family members, jobs, traditions",
    lessons: [
      {
        id: 1,
        title: "Meet My Family",
        content: {
          vocabulary: ["Father", "Mother", "Brother", "Sister", "Grandmother", "Grandfather", "Aunt", "Uncle", "Cousin"],
          language: "Possessive pronouns (my, his, her)",
          skills: ["Appreciation of Family"]
        }
      },
      {
        id: 2,
        title: "Jobs in My Family",
        content: {
          vocabulary: ["Teacher", "Doctor", "Baker", "Farmer", "Pilot"],
          phonics: "Digraph 'ph' (phone, photo, elephant) & 'x' (exam, exit)",
          language: "He/She works as a...",
          skills: ["Understanding Work Roles"]
        }
      }
    ]
  },
  {
    id: 3,
    title: "New Adventures",
    arabicTitle: "مغامرات جديدة",
    theme: "Places, landmarks, prepositions, past tense",
    lessons: [
      {
        id: 1,
        title: "Places Around Me",
        content: {
          vocabulary: ["House", "Museum", "Supermarket", "Park", "Library", "Train station"],
          language: "Prepositions of place (in, on, under, next to, behind)",
          skills: ["Spatial Awareness"]
        }
      }
    ]
  },
  {
    id: 4,
    title: "Let's Tell Stories!",
    arabicTitle: "هيا نحكي القصص!",
    theme: "Emotions, past simple narrative",
    lessons: [
      {
        id: 1,
        title: "How We Feel",
        content: {
          vocabulary: ["Happy", "Scared", "Shy", "Sad", "Excited", "Angry", "Tired", "Bored"],
          phonics: "Hard 'c' (/k/ cat) & Soft 'c' (/s/ city)",
          language: "Past simple narrative (He went..., They saw...)",
          skills: ["Emotional Intelligence"]
        }
      }
    ]
  },
  {
    id: 5,
    title: "Together Is Better",
    arabicTitle: "معًا أفضل",
    theme: "Chores, teamwork, action verbs",
    lessons: [
      {
        id: 1,
        title: "Teamwork & Chores",
        content: {
          vocabulary: ["Chores", "Tidy up", "Share", "Care", "Win", "Cheer", "Plant", "Donate"],
          phonics: "Hard 'g' (/g/ dog) & Soft 'g' (/dʒ/ giraffe)",
          language: "Action verbs for cooperation",
          skills: ["Teamwork", "Volunteerism"]
        }
      }
    ]
  },
  {
    id: 6,
    title: "Dare to Dream",
    arabicTitle: "تجرأ على الحلم",
    theme: "Goals, success, present continuous",
    lessons: [
      {
        id: 1,
        title: "My Goal, My Dream",
        content: {
          vocabulary: ["Goal", "Try", "Step", "Plan", "Practice", "Celebrate", "Success", "Achieve"],
          phonics: "Three-consonant clusters (spr, spl, scr)",
          language: "Present Continuous",
          skills: ["Goal Setting", "Perseverance"]
        }
      }
    ]
  }
];
