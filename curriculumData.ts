
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
          language: "Present simple (verb to be: I am..., My name is...)",
          skills: ["Self-awareness", "Social Etiquette"]
        }
      },
      {
        id: 2,
        title: "Classroom Rules",
        content: {
          vocabulary: ["Raise your hand", "Listen carefully", "Sit down", "Be kind", "Keep your classroom clean", "Don't shout"],
          phonics: "Digraph 'wh' (what, whale, white, wheel, when, where)",
          language: "May I go to the bathroom?",
          skills: ["Following Rules", "Respect"]
        }
      },
      {
        id: 3,
        title: "Describing People",
        content: {
          vocabulary: ["tall", "short", "curly hair", "straight hair", "funny", "shy", "friendly", "helpful", "polite"],
          language: "Adjectives for personality and looks",
          skills: ["Empathy", "Kindness"]
        }
      },
      {
        id: 4,
        title: "Daily Routines",
        content: {
          vocabulary: ["wake up", "brush my teeth", "get dressed", "have breakfast", "go to school", "do my homework", "make my bed"],
          language: "Present simple (daily routines)",
          skills: ["Routine Management"]
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
        title: "Family Traditions and Celebrations",
        content: {
          vocabulary: ["Eid Al-Fitr", "Sham El-Nessim", "Mother's Day", "6th of October"],
          phonics: "Letter 'x' = /gz/ (exam, exit, example, exercise)",
          language: "Discussing favorite celebrations",
          skills: ["Cultural Awareness"]
        }
      },
      {
        id: 3,
        title: "My Family Helps Me Grow",
        content: {
          vocabulary: ["cooks", "takes me to school", "helps me", "reads a story"],
          phonics: "Digraph 'ph' = /f/ (phone, photo, elephant, graph, alphabet)",
          language: "How family supports growth",
          skills: ["Gratitude", "Recognition"]
        }
      },
      {
        id: 4,
        title: "Jobs in My Family",
        content: {
          vocabulary: ["Teacher", "Doctor", "Baker", "Farmer", "Pilot"],
          language: "He/She works as a... (He works at a school, She helps patients)",
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
          phonics: "Double-consonant endings: 'zz', 'ss', 'll' (buzz, miss, bell)",
          language: "Prepositions of place (in, on, under, next to, behind, in front of, between)",
          skills: ["Spatial Awareness"]
        }
      },
      {
        id: 2,
        title: "Egypt's Landmarks",
        content: {
          vocabulary: ["Cairo Tower", "Alexandria Library", "The Pyramids of Giza"],
          language: "Capitalization and punctuation (., ?)",
          skills: ["Community Awareness", "Observation"]
        }
      },
      {
        id: 3,
        title: "Map It Out",
        content: {
          vocabulary: ["on the box", "under the box", "behind the box", "between the boxes", "in front of the box"],
          phonics: "Digraph 'ck' = /k/ (duck, neck, truck, sock, back)",
          language: "Giving directions and locating items",
          skills: ["Directional Thinking"]
        }
      },
      {
        id: 4,
        title: "A School Trip to the Zoo",
        content: {
          vocabulary: ["lions", "monkeys", "elephants", "ticket", "sandwiches", "chips"],
          language: "Past Simple Tense (Regular verbs: walked, played, jumped, kicked, pushed)",
          skills: ["Responsibility", "Independence"]
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
          phonics: "Hard 'c' (/k/ cat) & Soft 'c' (/s/ city, face)",
          language: "Past Simple Tense (Irregular verbs: go->went, eat->ate, see->saw, come->came)",
          skills: ["Emotional Intelligence"]
        }
      },
      {
        id: 2,
        title: "A Helping Hand",
        content: {
          vocabulary: ["fell", "hurt", "helped", "thank you", "felt better"],
          language: "Linking words (then, but, and)",
          skills: ["Problem Solving", "Empathy"]
        }
      },
      {
        id: 3,
        title: "A Big Win",
        content: {
          vocabulary: ["nervous", "worried", "goal", "proud", "team"],
          language: "Expressing feelings in the past",
          skills: ["Creativity", "Expression"]
        }
      },
      {
        id: 4,
        title: "Storytelling Skills",
        content: {
          vocabulary: ["First", "Then", "After that", "Finally"],
          language: "Narrative structure using linking words",
          skills: ["Communication"]
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
          vocabulary: ["Chores", "Tidy up the bed", "Share", "Care", "Win", "Cheer", "Plant", "Donate"],
          phonics: "Hard 'g' (/g/ gum, go, dog)",
          language: "Action verbs for cooperation (help, plan, share, fix, agree)",
          skills: ["Teamwork", "Helping at Home"]
        }
      },
      {
        id: 2,
        title: "Teamwork at School",
        content: {
          vocabulary: ["bridge", "wood", "puddle", "crossed", "project", "ideas"],
          language: "Using action verbs in sentences",
          skills: ["Volunteerism", "Planning"]
        }
      },
      {
        id: 3,
        title: "Teamwork in Sports",
        content: {
          vocabulary: ["coach", "pass the ball", "scored", "won together", "fair"],
          phonics: "Soft 'g' (/dʒ/ giraffe, Egypt, page, huge)",
          language: "Agreement and teamwork in play",
          skills: ["Teamwork"]
        }
      },
      {
        id: 4,
        title: "I Help My Community",
        content: {
          vocabulary: ["donate clothes", "plants a tree", "clean the street", "proud to help"],
          language: "Action verbs in present simple",
          skills: ["Community Service"]
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
          vocabulary: ["goal", "try", "step", "plan", "practice", "celebrate", "success", "reach"],
          language: "Present Continuous Tense (Samer is scoring, they are celebrating)",
          skills: ["Goal Setting"]
        }
      },
      {
        id: 2,
        title: "A Day to Remember",
        content: {
          vocabulary: ["spring", "spraying water", "splash", "spins", "split", "bounces back"],
          phonics: "Three-consonant clusters (spr, spl, str, scr)",
          language: "Present Continuous (actions happening now)",
          skills: ["Perseverance"]
        }
      },
      {
        id: 3,
        title: "I Did It!",
        content: {
          vocabulary: ["studied hard", "math exam", "nervous", "full marks", "clapped", "smiled"],
          language: "Describing success using past and present",
          skills: ["Celebrating Success"]
        }
      },
      {
        id: 4,
        title: "Helping Others Succeed",
        content: {
          vocabulary: ["fast runner", "field", "needed help", "race", "big cheers"],
          language: "Supporting others to reach goals",
          skills: ["Confidence Building", "Supporting Others"]
        }
      }
    ]
  }
];
