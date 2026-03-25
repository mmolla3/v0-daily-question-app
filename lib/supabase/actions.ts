"use server"

import { createClient } from "./server"
import { revalidatePath } from "next/cache"
import type { Category, Mood } from "../types"

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return profile
}

export async function updateProfile(updates: {
  category?: Category
  questions_per_day?: number
  weekly_chosen_at?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  if (error) throw error
  
  revalidatePath("/app", "layout")
}

export async function getQuestionsForCategory(category: Category, count: number) {
  const supabase = await createClient()
  
  // Get questions for the category, using a seed based on the current week
  const today = new Date()
  const day = today.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(today)
  monday.setDate(today.getDate() + diff)
  const weekSeed = monday.toISOString().split("T")[0]

  const { data: questions } = await supabase
    .from("questions")
    .select("question_text")
    .eq("category", category)

  if (!questions || questions.length === 0) return []

  // Deterministic shuffle based on week seed
  const seedNum = weekSeed.split("-").map(Number).reduce((a, b) => a * 100 + b, 0)
  const shuffled = [...questions].sort((a, b) => {
    const hashA = (seedNum * a.question_text.length) % 100
    const hashB = (seedNum * b.question_text.length) % 100
    return hashA - hashB
  })

  return shuffled.slice(0, count).map(q => q.question_text)
}

export async function getTodayEntry() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const today = new Date().toISOString().split("T")[0]

  const { data: entry } = await supabase
    .from("daily_entries")
    .select(`
      *,
      responses (
        question_text,
        answer_text
      )
    `)
    .eq("user_id", user.id)
    .eq("entry_date", today)
    .single()

  return entry
}

export async function saveDailyEntry(
  responses: Array<{ question: string; answer: string }>,
  mood: Mood
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error("Not authenticated")

  const today = new Date().toISOString().split("T")[0]

  // Create or update daily entry
  const { data: entry, error: entryError } = await supabase
    .from("daily_entries")
    .upsert({
      user_id: user.id,
      entry_date: today,
      mood,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: "user_id,entry_date"
    })
    .select()
    .single()

  if (entryError) throw entryError

  // Delete existing responses for this entry and insert new ones
  await supabase
    .from("responses")
    .delete()
    .eq("entry_id", entry.id)

  const { error: responsesError } = await supabase
    .from("responses")
    .insert(
      responses.map(r => ({
        entry_id: entry.id,
        question_text: r.question,
        answer_text: r.answer,
      }))
    )

  if (responsesError) throw responsesError

  // Update streak
  await updateStreak(user.id)

  revalidatePath("/app", "layout")
}

async function updateStreak(userId: string) {
  const supabase = await createClient()
  
  // Get all entries ordered by date descending
  const { data: entries } = await supabase
    .from("daily_entries")
    .select("entry_date")
    .eq("user_id", userId)
    .order("entry_date", { ascending: false })

  if (!entries || entries.length === 0) return

  let streak = 1
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < entries.length - 1; i++) {
    const current = new Date(entries[i].entry_date)
    const next = new Date(entries[i + 1].entry_date)
    const diffDays = (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24)
    
    if (diffDays === 1) {
      streak++
    } else {
      break
    }
  }

  // Update profile with new streak
  const { data: profile } = await supabase
    .from("profiles")
    .select("longest_streak")
    .eq("id", userId)
    .single()

  const longestStreak = Math.max(profile?.longest_streak || 0, streak)

  await supabase
    .from("profiles")
    .update({
      current_streak: streak,
      longest_streak: longestStreak,
      total_answered: entries.length,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
}

export async function getEntries(limit?: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  let query = supabase
    .from("daily_entries")
    .select(`
      *,
      responses (
        question_text,
        answer_text
      )
    `)
    .eq("user_id", user.id)
    .order("entry_date", { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data: entries } = await query

  return entries || []
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
}
