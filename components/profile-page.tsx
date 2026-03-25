"use client"

import { useState } from "react"
import { Flame, MessageSquare, Calendar, LogOut, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppState, store } from "@/lib/store"
import type { Category } from "@/lib/mock-data"
import { categoryLabels } from "@/lib/mock-data"
import { AppShell } from "./app-shell"

const categories: Category[] = ["self-reflection", "mental-health", "career", "emotional-awareness", "mix"]

export function ProfilePage() {
  const { profile } = useAppState()
  const [showCategoryPicker, setShowCategoryPicker] = useState(false)

  if (!profile) return null

  const joinDate = new Date(profile.joinedAt + "T12:00:00")
  const joinStr = joinDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  return (
    <AppShell>
      <div className="pb-24 sm:pb-8">
        <h2 className="font-serif text-2xl text-foreground mb-1">Profile</h2>
        <p className="text-sm text-muted-foreground mb-8">
          Your reflection journey at a glance.
        </p>

        {/* User info */}
        <div className="bg-card border border-border rounded-lg p-5 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-serif text-primary">
                {profile.name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-medium text-foreground">{profile.name}</p>
              <p className="text-sm text-muted-foreground">Reflecting since {joinStr}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <Flame className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="font-serif text-2xl text-foreground">{profile.currentStreak}</p>
            <p className="text-xs text-muted-foreground">Streak</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <MessageSquare className="w-5 h-5 text-accent mx-auto mb-2" />
            <p className="font-serif text-2xl text-foreground">{profile.totalAnswered}</p>
            <p className="text-xs text-muted-foreground">Answered</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <Calendar className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
            <p className="font-serif text-2xl text-foreground">{profile.longestStreak}</p>
            <p className="text-xs text-muted-foreground">Best Streak</p>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-card border border-border rounded-lg divide-y divide-border">
          {/* Category */}
          <div className="p-5">
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium text-foreground text-sm">Weekly Category</p>
              <button
                type="button"
                onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                className="text-sm text-primary hover:underline"
              >
                {showCategoryPicker ? "Done" : "Change"}
              </button>
            </div>
            {!showCategoryPicker && (
              <p className="text-sm text-muted-foreground">
                {categoryLabels[profile.category]}
                <span className="text-xs ml-1 opacity-70">(changes apply immediately)</span>
              </p>
            )}
            {showCategoryPicker && (
              <div className="flex flex-col gap-2 mt-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      store.updateCategory(cat)
                      setShowCategoryPicker(false)
                    }}
                    className={`flex items-center justify-between text-left text-sm px-3 py-2 rounded-md border transition-colors ${
                      profile.category === cat
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {categoryLabels[cat]}
                    {profile.category === cat && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Questions per day */}
          <div className="p-5">
            <p className="font-medium text-foreground text-sm mb-1">Questions Per Day</p>
            <p className="text-xs text-muted-foreground mb-2">Chosen weekly, but you can adjust anytime</p>
            <div className="flex gap-2">
              {[1, 2, 3].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => store.updateQuestionsPerDay(count)}
                  className={`px-4 py-2 rounded-md border text-sm transition-colors ${
                    profile.questionsPerDay === count
                      ? "border-primary bg-primary/5 text-primary font-medium"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full mt-6 border-border text-muted-foreground hover:text-foreground bg-transparent"
          onClick={() => store.logout()}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log out
        </Button>
      </div>
    </AppShell>
  )
}
