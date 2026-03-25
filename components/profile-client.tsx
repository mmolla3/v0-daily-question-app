"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Check, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppShell } from "./app-shell"
import { updateProfile, signOut } from "@/lib/supabase/actions"
import {
  type Category,
  type Profile,
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

interface Props {
  profile: Profile
  userEmail: string
  userName: string
}

export function ProfileClient({ profile, userEmail, userName }: Props) {
  const router = useRouter()
  const [showCategoryPicker, setShowCategoryPicker] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category>(profile.category)
  const [questionsPerDay, setQuestionsPerDay] = useState(profile.questions_per_day)
  const [saving, setSaving] = useState(false)

  const handleCategoryChange = async (category: Category) => {
    setSelectedCategory(category)
    setSaving(true)
    try {
      await updateProfile({
        category,
        weekly_chosen_at: getCurrentWeekMonday(),
      })
      router.refresh()
    } catch (error) {
      console.error("Failed to update category:", error)
    }
    setSaving(false)
    setShowCategoryPicker(false)
  }

  const handleQuestionsChange = async (count: number) => {
    setQuestionsPerDay(count)
    setSaving(true)
    try {
      await updateProfile({
        questions_per_day: count,
        weekly_chosen_at: getCurrentWeekMonday(),
      })
      router.refresh()
    } catch (error) {
      console.error("Failed to update questions per day:", error)
    }
    setSaving(false)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const joinedDate = new Date(profile.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <AppShell>
      <div className="pb-24 sm:pb-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="font-serif text-2xl text-foreground">{userName}</h2>
            <p className="text-sm text-muted-foreground">{userEmail}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <p className="font-serif text-xl text-foreground">{profile.current_streak}</p>
            <p className="text-xs text-muted-foreground">Streak</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <p className="font-serif text-xl text-foreground">{profile.longest_streak}</p>
            <p className="text-xs text-muted-foreground">Best</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <p className="font-serif text-xl text-foreground">{profile.total_answered}</p>
            <p className="text-xs text-muted-foreground">Entries</p>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-card border border-border rounded-lg overflow-hidden mb-6">
          {/* Category */}
          <div className="p-5 border-b border-border">
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium text-foreground text-sm">Weekly Category</p>
              <button
                type="button"
                onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                className="text-sm text-primary hover:underline"
                disabled={saving}
              >
                {showCategoryPicker ? "Done" : "Change"}
              </button>
            </div>
            {!showCategoryPicker && (
              <p className="text-sm text-muted-foreground">
                {categoryLabels[selectedCategory]}
                <span className="text-xs ml-1 opacity-70">(changes apply immediately)</span>
              </p>
            )}

            {showCategoryPicker && (
              <div className="mt-4 space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryChange(cat)}
                    disabled={saving}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedCategory === cat
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-background hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground text-sm">{categoryLabels[cat]}</p>
                        <p className="text-xs text-muted-foreground">{categoryDescriptions[cat]}</p>
                      </div>
                      {selectedCategory === cat && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 ml-2">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Questions per day */}
          <div className="p-5">
            <p className="font-medium text-foreground text-sm mb-1">Questions Per Day</p>
            <p className="text-xs text-muted-foreground mb-3">
              Chosen weekly, but you can adjust anytime
            </p>
            <div className="flex gap-2">
              {[1, 2, 3].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => handleQuestionsChange(count)}
                  disabled={saving}
                  className={`flex-1 p-3 rounded-lg border text-center transition-colors ${
                    questionsPerDay === count
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border bg-background hover:border-primary/40"
                  }`}
                >
                  <p className="font-medium text-foreground">{count}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Member since */}
        <p className="text-center text-sm text-muted-foreground mb-6">
          Reflecting since {joinedDate}
        </p>

        {/* Sign out */}
        <Button
          variant="outline"
          className="w-full text-muted-foreground bg-transparent"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </Button>
      </div>
    </AppShell>
  )
}
