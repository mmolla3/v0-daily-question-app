"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Flame,
  Sun,
  Cloud,
  Minus,
  Wind,
  CloudLightning,
  Check,
  RefreshCw,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AppShell } from "./app-shell"
import { saveDailyEntry, updateProfile } from "@/lib/supabase/actions"
import {
  type Mood,
  type Category,
  type Profile,
  type DailyEntry,
  categoryLabels,
  categoryDescriptions,
  getCurrentWeekMonday,
} from "@/lib/types"

const categories: Category[] = [
  "self-reflection",
  "mental-health",
  "career",
  "emotional-awareness",
  "mix",
]

const moodOptions: { value: Mood; label: string; icon: React.ElementType }[] = [
  { value: "great", label: "Great", icon: Flame },
  { value: "good", label: "Good", icon: Sun },
  { value: "okay", label: "Okay", icon: Cloud },
  { value: "low", label: "Low", icon: Wind },
  { value: "rough", label: "Rough", icon: CloudLightning },
]

interface Props {
  profile: Profile
  questions: string[]
  todayEntry: DailyEntry | null
  needsWeeklySetup: boolean
}

function WeeklySetup({ profile }: { profile: Profile }) {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<Category>(profile.category)
  const [questionsPerDay, setQuestionsPerDay] = useState(profile.questions_per_day)
  const [saving, setSaving] = useState(false)

  const handleConfirm = async () => {
    setSaving(true)
    try {
      await updateProfile({
        category: selectedCategory,
        questions_per_day: questionsPerDay,
        weekly_chosen_at: getCurrentWeekMonday(),
      })
      router.refresh()
    } catch (error) {
      console.error("Failed to update weekly settings:", error)
      setSaving(false)
    }
  }

  const handleSkip = async () => {
    setSaving(true)
    try {
      await updateProfile({
        weekly_chosen_at: getCurrentWeekMonday(),
      })
      router.refresh()
    } catch (error) {
      console.error("Failed to skip weekly setup:", error)
      setSaving(false)
    }
  }

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
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {categoryDescriptions[cat]}
                    </p>
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
            onClick={handleConfirm}
            disabled={saving}
          >
            {saving ? "Saving..." : "Start this week's reflections"}
          </Button>
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={handleSkip}
            disabled={saving}
          >
            Keep current settings
          </Button>
        </div>
      </div>
    </AppShell>
  )
}

function CompletedView({ todayEntry }: { todayEntry: DailyEntry }) {
  const mood = moodOptions.find((m) => m.value === todayEntry.mood)

  return (
    <AppShell>
      <div className="pb-24 sm:pb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="font-serif text-2xl text-foreground">{"Today's reflection"}</h2>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
        </div>

        {mood && (
          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-2">How you felt</p>
            <div className="flex items-center gap-2">
              <mood.icon className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">{mood.label}</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {todayEntry.responses?.map((response, idx) => (
            <div key={idx} className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm font-medium text-foreground mb-2">{response.question_text}</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {response.answer_text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}

export function DailyQuestionsClient({ profile, questions, todayEntry, needsWeeklySetup }: Props) {
  const router = useRouter()
  const [answers, setAnswers] = useState<string[]>(questions.map(() => ""))
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null)
  const [saving, setSaving] = useState(false)

  if (needsWeeklySetup) {
    return <WeeklySetup profile={profile} />
  }

  if (todayEntry) {
    return <CompletedView todayEntry={todayEntry} />
  }

  const canSubmit = answers.every((a) => a.trim().length > 0) && selectedMood !== null

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSaving(true)

    try {
      await saveDailyEntry(
        questions.map((q, i) => ({ question: q, answer: answers[i] })),
        selectedMood
      )
      router.refresh()
    } catch (error) {
      console.error("Failed to save entry:", error)
      setSaving(false)
    }
  }

  const today = new Date()
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  return (
    <AppShell>
      <div className="pb-24 sm:pb-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Flame className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{profile.current_streak} day streak</p>
          </div>
        </div>
        <h2 className="font-serif text-2xl text-foreground mb-1">{dateStr}</h2>
        <p className="text-sm text-muted-foreground mb-6">
          {categoryLabels[profile.category]} &middot; {questions.length}{" "}
          {questions.length === 1 ? "question" : "questions"}
        </p>

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {questions.map((question, idx) => (
            <div key={idx} className="bg-card border border-border rounded-lg p-4">
              <p className="font-medium text-foreground mb-3">{question}</p>
              <Textarea
                placeholder="Write your thoughts..."
                value={answers[idx]}
                onChange={(e) => {
                  const newAnswers = [...answers]
                  newAnswers[idx] = e.target.value
                  setAnswers(newAnswers)
                }}
                className="min-h-[100px] bg-background border-border resize-none"
              />
            </div>
          ))}
        </div>

        {/* Mood selection */}
        <div className="mb-8">
          <p className="font-medium text-foreground text-sm mb-3">How are you feeling today?</p>
          <div className="flex gap-2">
            {moodOptions.map((mood) => {
              const Icon = mood.icon
              return (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setSelectedMood(mood.value)}
                  className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-lg border transition-colors ${
                    selectedMood === mood.value
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <Icon className="w-5 h-5 text-foreground" />
                  <span className="text-xs text-muted-foreground">{mood.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Submit */}
        <Button
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6"
          disabled={!canSubmit || saving}
          onClick={handleSubmit}
        >
          {saving ? "Saving..." : "Complete today's reflection"}
        </Button>
      </div>
    </AppShell>
  )
}
