"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { store } from "@/lib/store"
import type { Category } from "@/lib/mock-data"
import { categoryLabels, categoryDescriptions } from "@/lib/mock-data"

const categories: Category[] = ["self-reflection", "mental-health", "career", "emotional-awareness", "mix"]

export function Onboarding() {
  const [step, setStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [questionsPerDay, setQuestionsPerDay] = useState(2)

  function handleComplete() {
    if (!selectedCategory) return
    store.completeOnboarding(selectedCategory, questionsPerDay)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 lg:px-12">
        <h1 className="font-serif text-xl text-foreground">Innerlog</h1>
        <Button
          variant="ghost"
          className="text-muted-foreground"
          onClick={() => store.navigate("landing")}
        >
          Back
        </Button>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-lg">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            <div className={`h-1 flex-1 rounded-full ${step >= 1 ? "bg-primary" : "bg-border"}`} />
            <div className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-primary" : "bg-border"}`} />
          </div>

          {step === 1 && (
            <div>
              <h2 className="font-serif text-3xl text-foreground mb-2">
                What would you like to reflect on?
              </h2>
              <p className="text-muted-foreground mb-8">
                Choose a category for your daily questions. This will be your focus for the week, and
                {"you'll"} get a chance to change it each Monday.
              </p>

              <div className="flex flex-col gap-3">
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
                          <Check className="w-3.5 h-3.5 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-end mt-8">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!selectedCategory}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-serif text-3xl text-foreground mb-2">
                How many questions per day?
              </h2>
              <p className="text-muted-foreground mb-8">
                Start small or go deeper. This applies for the whole week, but you can always adjust from your profile.
              </p>

              <div className="flex gap-4">
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

              <div className="flex justify-between mt-8">
                <Button
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="text-muted-foreground"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Start reflecting
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
