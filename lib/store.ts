"use client"

import { useSyncExternalStore } from "react"
import type { Category, DailyEntry, Mood, UserProfile } from "./mock-data"
import { defaultProfile, getQuestionsForToday, mockEntries } from "./mock-data"

interface AppState {
  currentView: "landing" | "onboarding" | "daily" | "archive" | "trends" | "profile"
  profile: UserProfile | null
  entries: DailyEntry[]
  todayEntry: DailyEntry | null
  isOnboarded: boolean
}

let state: AppState = {
  currentView: "landing",
  profile: null,
  entries: [...mockEntries],
  todayEntry: null,
  isOnboarded: false,
}

const listeners = new Set<() => void>()

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
}

export const store = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  getSnapshot() {
    return state
  },
  navigate(view: AppState["currentView"]) {
    state = { ...state, currentView: view }
    emitChange()
  },
  login() {
    state = {
      ...state,
      profile: { ...defaultProfile },
      entries: [...mockEntries],
      isOnboarded: true,
      currentView: "daily",
    }
    emitChange()
  },
  completeOnboarding(category: Category, questionsPerDay: number) {
    state = {
      ...state,
      profile: {
        ...defaultProfile,
        category,
        questionsPerDay,
      },
      isOnboarded: true,
      currentView: "daily",
    }
    emitChange()
  },
  updateCategory(category: Category) {
    if (!state.profile) return
    state = {
      ...state,
      profile: { ...state.profile, category },
    }
    emitChange()
  },
  updateQuestionsPerDay(count: number) {
    if (!state.profile) return
    state = {
      ...state,
      profile: { ...state.profile, questionsPerDay: count },
    }
    emitChange()
  },
  saveDailyEntry(answers: string[], mood: Mood) {
    if (!state.profile) return
    const today = new Date().toISOString().split("T")[0]
    const questions = getQuestionsForToday(state.profile.category, state.profile.questionsPerDay)
    const entry: DailyEntry = {
      id: `entry-${Date.now()}`,
      date: today,
      questions: questions.map((q, i) => ({ question: q, answer: answers[i] || "" })),
      mood,
    }
    state = {
      ...state,
      entries: [entry, ...state.entries],
      todayEntry: entry,
      profile: {
        ...state.profile,
        currentStreak: state.profile.currentStreak + 1,
        longestStreak: Math.max(state.profile.longestStreak, state.profile.currentStreak + 1),
        totalAnswered: state.profile.totalAnswered + questions.length,
      },
    }
    emitChange()
  },
  logout() {
    state = {
      currentView: "landing",
      profile: null,
      entries: [],
      todayEntry: null,
      isOnboarded: false,
    }
    emitChange()
  },
}

export function useAppState() {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)
}
