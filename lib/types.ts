export type Category = "self-reflection" | "mental-health" | "career" | "emotional-awareness" | "mix"

export type Mood = "great" | "good" | "okay" | "low" | "rough"

export interface Profile {
  id: string
  category: Category
  questions_per_day: number
  weekly_chosen_at: string | null
  current_streak: number
  longest_streak: number
  total_answered: number
  created_at: string
  updated_at: string
}

export interface DailyEntry {
  id: string
  user_id: string
  entry_date: string
  mood: Mood
  created_at: string
  updated_at: string
  responses: Response[]
}

export interface Response {
  id?: string
  entry_id?: string
  question_text: string
  answer_text: string
}

export const categoryLabels: Record<Category, string> = {
  "self-reflection": "Self-Reflection",
  "mental-health": "Mental Health",
  "career": "Career & Ambition",
  "emotional-awareness": "Emotional Awareness",
  "mix": "Mix of All",
}

export const categoryDescriptions: Record<Category, string> = {
  "self-reflection": "Explore your values, goals, and personal growth",
  "mental-health": "Check in with your mental well-being",
  "career": "Focus on professional development and goals",
  "emotional-awareness": "Understand and process your emotions",
  "mix": "A blend of questions from all categories",
}

export const moodLabels: Record<Mood, string> = {
  great: "Great",
  good: "Good",
  okay: "Okay",
  low: "Low",
  rough: "Rough",
}

/** Get the Monday of the current ISO week */
export function getCurrentWeekMonday(): string {
  const today = new Date()
  const day = today.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(today)
  monday.setDate(today.getDate() + diff)
  return monday.toISOString().split("T")[0]
}

/** Check if user needs to reconfigure weekly settings */
export function isNewWeek(weeklyChosenAt: string | null | undefined): boolean {
  if (!weeklyChosenAt) return true
  return getCurrentWeekMonday() !== weeklyChosenAt
}
