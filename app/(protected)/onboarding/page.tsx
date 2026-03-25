"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Feather, Check, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { updateProfile } from "@/lib/supabase/actions"
import {
  type Category,
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

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [questionsPerDay, setQuestionsPerDay] = useState(2)
  const [saving, setSaving] = useState(false)

  const handleComplete = async () => {
    if (!selectedCategory) return
    setSaving(true)
    
    try {
      await updateProfile({
        category: selectedCategory,
        questions_per_day: questionsPerDay,
        weekly_chosen_at: getCurrentWeekMonday(),
      })
      router.push("/app")
    } catch (error) {
      console.error("Failed to save preferences:", error)
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Feather className="w-5 h-5 text-primary" />
          <span className="font-serif text-lg text-foreground">Innerlog</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className={step === 1 ? "text-primary font-medium" : ""}>Category</span>
          <ChevronRight className="w-4 h-4" />
          <span className={step === 2 ? "text-primary font-medium" : ""}>Questions</span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          {step === 1 ? (
            <div>
              <h2 className="font-serif text-3xl text-foreground mb-2">
                {"What would you like to reflect on?"}
              </h2>
              <p className="text-muted-foreground mb-8">
                {"Choose a category for your daily questions. This will be your focus for the week, and you'll get a chance to change it each Monday."}
              </p>

              <div className="flex flex-col gap-3 mb-8">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      selectedCategory === cat
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{categoryLabels[cat]}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {categoryDescriptions[cat]}
                        </p>
                      </div>
                      {selectedCategory === cat && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 ml-3">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <Button
                size="lg"
                disabled={!selectedCategory}
                onClick={() => setStep(2)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6"
              >
                Continue
              </Button>
            </div>
          ) : (
            <div>
              <h2 className="font-serif text-3xl text-foreground mb-2">
                How many questions per day?
              </h2>
              <p className="text-muted-foreground mb-8">
                Start small or go deeper. This applies for the whole week, but you can always adjust from your profile.
              </p>

              <div className="flex gap-4 mb-8">
                {[1, 2, 3].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionsPerDay(count)}
                    className={`flex-1 p-6 rounded-lg border text-center transition-colors ${
                      questionsPerDay === count
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <p className="font-serif text-3xl text-foreground">{count}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {count === 1 ? "question" : "questions"}
                    </p>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 py-6 bg-transparent"
                >
                  Back
                </Button>
                <Button
                  size="lg"
                  onClick={handleComplete}
                  disabled={saving}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 py-6"
                >
                  {saving ? "Saving..." : "Start reflecting"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
