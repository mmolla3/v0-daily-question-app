"use client"

import React from "react"

import { useState } from "react"
import { Flame, Sun, Cloud, Minus, Wind, CloudLightning, Check, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAppState, store } from "@/lib/store"
import {
  getQuestionsForToday,
  categoryLabels,
  categoryDescriptions,
  type Mood,
  type Category,
} from "@/lib/mock-data"
import { AppShell } from "./app-shell"

const categories: Category[] = ["self-reflection", "mental-health", "career", "emotional-awareness", "mix"]

const moodOptions: { value: Mood; label: string; icon: React.ReactNode }[] = [
  { value: "happy", label: "Happy", icon: <Sun className="w-5 h-5" /> },
  { value: "calm", label: "Calm", icon: <Cloud className="w-5 h-5" /> },
  { value: "neutral", label: "Neutral", icon: <Minus className="w-5 h-5" /> },
  { value: "anxious", label: "Anxious", icon: <Wind className="w-5 h-5" /> },
  { value: "stressed", label: "Stressed", icon: <CloudLightning className="w-5 h-5" /> },
]

function WeeklySetup({ profile }: { profile: NonNullable<ReturnType<typeof useAppState>["profile"]> }) {
  const [selectedCategory, setSelectedCategory] = useState<Category>(profile.category)
  const [questionsPerDay, setQuestionsPerDay] = useState(profile.questionsPerDay)

  return (
    <AppShell>
      <div className="pb-24 sm:pb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <RefreshCw className="w-4 h-4 text-primary" />
          </div>
          <h2 className="font-serif text-2xl text-foreground">New Week Setup</h2>
        </div>
        <p className="text-muted-foreground mb-8">
          {"It's a new week! Would you like to adjust your reflection settings, or keep things as they are?"}
        </p>

        {/* Category picker */}
        <div className="mb-6">
          <p className="font-medium text-foreground text-sm mb-3">Question Category</p>
          <div className="flex flex-col gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left p-3.5 rounded-lg border transition-colors ${
                  selectedCategory === cat
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground text-sm">{categoryLabels[cat]}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{categoryDescriptions[cat]}</p>
                  </div>
                  {selectedCategory === cat && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 ml-3">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Questions per day */}
        <div className="mb-8">
          <p className="font-medium text-foreground text-sm mb-3">Questions Per Day</p>
          <div className="flex gap-3">
            {[1, 2, 3].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setQuestionsPerDay(count)}
                className={`flex-1 p-4 rounded-lg border text-center transition-colors ${
                  questionsPerDay === count
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <p className="font-serif text-2xl text-foreground">{count}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {count === 1 ? "question" : "questions"}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            size="lg"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6"
            onClick={() => store.confirmWeeklySettings(selectedCategory, questionsPerDay)}
          >
            {"Start this week's reflections"}
          </Button>
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={() => store.skipWeeklySetup()}
          >
            Keep current settings
          </Button>
        </div>
      </div>
    </AppShell>
  )
}

export function DailyQuestions() {
  const { profile, todayEntry, needsWeeklySetup } = useAppState()
  const [answers, setAnswers] = useState<string[]>([])
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null)
  const [submitted, setSubmitted] = useState(false)

  if (!profile) return null

  if (needsWeeklySetup) {
    return <WeeklySetup profile={profile} />
  }

  const questions = getQuestionsForToday(profile.category, profile.questionsPerDay)

  if (answers.length === 0 && !submitted) {
    setAnswers(new Array(questions.length).fill(""))
  }

  const today = new Date()
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  const alreadyAnswered = submitted || todayEntry !== null

  function handleSubmit() {
    if (!selectedMood) return
    store.saveDailyEntry(answers, selectedMood)
    setSubmitted(true)
  }

  const canSubmit = selectedMood && answers.every((a) => a.trim().length > 0)

  return (
    <AppShell>
      <div className="pb-24 sm:pb-8">
        {/* Date & streak */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-muted-foreground">Today</p>
            <h2 className="font-serif text-2xl text-foreground">{dateStr}</h2>
          </div>
          <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full">
            <Flame className="w-4 h-4" />
            <span className="text-sm font-medium">{profile.currentStreak} day streak</span>
          </div>
        </div>

        {/* Category badge */}
        <div className="mb-6">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {categoryLabels[profile.category]}
          </span>
        </div>

        {alreadyAnswered ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-serif text-xl text-foreground mb-2">
              {"You've reflected today"}
            </h3>
            <p className="text-muted-foreground text-sm">
              Come back tomorrow for new questions. Your streak is growing!
            </p>
            <Button
              variant="outline"
              className="mt-6 border-border text-foreground bg-transparent"
              onClick={() => store.navigate("archive")}
            >
              View past reflections
            </Button>
          </div>
        ) : (
          <>
            {/* Question cards */}
            <div className="flex flex-col gap-6 mb-8">
              {questions.map((question, i) => (
                <div
                  key={question}
                  className="bg-card border border-border rounded-lg p-5"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-md flex-shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-foreground font-medium leading-relaxed">{question}</p>
                  </div>
                  <Textarea
                    placeholder="Write your reflection..."
                    className="min-h-[100px] bg-background border-border resize-none text-foreground placeholder:text-muted-foreground/60"
                    value={answers[i] || ""}
                    onChange={(e) => {
                      const next = [...answers]
                      next[i] = e.target.value
                      setAnswers(next)
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Mood selector */}
            <div className="bg-card border border-border rounded-lg p-5 mb-8">
              <p className="font-medium text-foreground mb-4">How are you feeling today?</p>
              <div className="flex flex-wrap gap-2">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => setSelectedMood(mood.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-colors ${
                      selectedMood === mood.value
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {mood.icon}
                    {mood.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <Button
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6"
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              Save reflection
            </Button>
          </>
        )}
      </div>
    </AppShell>
  )
}
