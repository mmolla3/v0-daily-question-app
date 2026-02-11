export type Category = "self-reflection" | "mental-health" | "career" | "emotional-awareness" | "mix"

export type Mood = "happy" | "calm" | "neutral" | "anxious" | "stressed"

export interface UserProfile {
  id: string
  name: string
  email: string
  category: Category
  questionsPerDay: number
  currentStreak: number
  longestStreak: number
  totalAnswered: number
  joinedAt: string
}

export interface DailyEntry {
  id: string
  date: string
  questions: { question: string; answer: string }[]
  mood: Mood
}

const questionPool: Record<Category, string[]> = {
  "self-reflection": [
    "What gave you energy today?",
    "What drained your energy today?",
    "What is one thing you learned about yourself recently?",
    "What are you most grateful for right now?",
    "What would you tell your younger self today?",
    "What boundary do you need to set or reinforce?",
    "What is something you did today that aligned with your values?",
    "What made you feel proud this week?",
    "What is one thing you want to let go of?",
    "How did you show up for yourself today?",
  ],
  "mental-health": [
    "What has been on your mind the most lately?",
    "What emotion did you feel the strongest today?",
    "What is one thing you can do to take care of yourself right now?",
    "How did you manage stress today?",
    "What is something that brought you peace today?",
    "What thought pattern have you noticed recurring?",
    "How are you really feeling right now, honestly?",
    "What is one small step you can take for your wellbeing?",
    "Who or what made you feel safe today?",
    "What do you need more of in your life right now?",
  ],
  career: [
    "Did today move you closer to your goals?",
    "What is one professional skill you want to develop?",
    "What challenge at work taught you something?",
    "What would your ideal workday look like?",
    "What accomplishment are you overlooking?",
    "What is one risk worth taking in your career?",
    "Who inspires your professional growth?",
    "What would you do if failure wasn't an option?",
    "What is draining you at work and how can you change it?",
    "What value do you bring that nobody else does?",
  ],
  "emotional-awareness": [
    "What emotion are you carrying right now?",
    "When did you feel the most at ease today?",
    "What triggered a strong reaction in you recently?",
    "How do you typically respond when you feel overwhelmed?",
    "What emotion do you tend to avoid?",
    "What makes you feel truly understood?",
    "How did you express your feelings today?",
    "What emotion surprised you today?",
    "What do you need emotionally right now?",
    "When did you last feel completely present?",
  ],
  mix: [
    "What gave you energy today?",
    "What has been on your mind the most lately?",
    "Did today move you closer to your goals?",
    "What emotion are you carrying right now?",
    "What made you feel proud this week?",
    "How are you really feeling right now, honestly?",
    "What would you do if failure wasn't an option?",
    "What do you need emotionally right now?",
    "What is one thing you learned about yourself recently?",
    "What is something that brought you peace today?",
  ],
}

export function getQuestionsForToday(category: Category, count: number): string[] {
  const pool = questionPool[category]
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const shuffled = [...pool].sort((a, b) => {
    const hashA = (seed * a.length) % 100
    const hashB = (seed * b.length) % 100
    return hashA - hashB
  })
  return shuffled.slice(0, count)
}

export const categoryLabels: Record<Category, string> = {
  "self-reflection": "Self-Reflection",
  "mental-health": "Mental Health",
  career: "Career & Ambition",
  "emotional-awareness": "Emotional Awareness",
  mix: "Mix",
}

export const categoryDescriptions: Record<Category, string> = {
  "self-reflection": "Explore who you are and what matters to you",
  "mental-health": "Check in with your mental wellbeing",
  career: "Reflect on your professional journey and goals",
  "emotional-awareness": "Understand and process your emotions",
  mix: "A blend of questions from all categories",
}

export const moodLabels: Record<Mood, string> = {
  happy: "Happy",
  calm: "Calm",
  neutral: "Neutral",
  anxious: "Anxious",
  stressed: "Stressed",
}

export const moodIcons: Record<Mood, string> = {
  happy: "Sun",
  calm: "Cloud",
  neutral: "Minus",
  anxious: "Wind",
  stressed: "CloudLightning",
}

// Generate mock past entries for demo
function generateMockEntries(): DailyEntry[] {
  const entries: DailyEntry[] = []
  const moods: Mood[] = ["happy", "calm", "neutral", "anxious", "stressed"]
  const allQuestions = questionPool.mix

  for (let i = 1; i <= 14; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const numQ = Math.floor(Math.random() * 3) + 1
    const questions = []
    for (let j = 0; j < numQ; j++) {
      questions.push({
        question: allQuestions[(i * 3 + j) % allQuestions.length],
        answer: [
          "I felt really connected to my work today. Small wins added up.",
          "Taking a walk helped me clear my mind and refocus.",
          "I realized I need to be kinder to myself about setbacks.",
          "Talking to a friend reminded me of what really matters.",
          "I noticed I was holding tension and took time to breathe.",
          "Progress isn't always visible, but I can feel it.",
        ][(i + j) % 6],
      })
    }
    entries.push({
      id: `entry-${i}`,
      date: date.toISOString().split("T")[0],
      questions,
      mood: moods[(i + 2) % moods.length],
    })
  }
  return entries
}

export const mockEntries: DailyEntry[] = generateMockEntries()

export const defaultProfile: UserProfile = {
  id: "user-1",
  name: "Alex",
  email: "alex@example.com",
  category: "self-reflection",
  questionsPerDay: 2,
  currentStreak: 7,
  longestStreak: 14,
  totalAnswered: 42,
  joinedAt: "2026-01-15",
}
