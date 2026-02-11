"use client"

import React from "react"

import { Sun, Cloud, Minus, Wind, CloudLightning } from "lucide-react"
import { useAppState } from "@/lib/store"
import { moodLabels, type Mood } from "@/lib/mock-data"
import { AppShell } from "./app-shell"

const moodIconMap: Record<Mood, React.ReactNode> = {
  happy: <Sun className="w-4 h-4" />,
  calm: <Cloud className="w-4 h-4" />,
  neutral: <Minus className="w-4 h-4" />,
  anxious: <Wind className="w-4 h-4" />,
  stressed: <CloudLightning className="w-4 h-4" />,
}

export function ReflectionArchive() {
  const { entries } = useAppState()

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T12:00:00")
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <AppShell>
      <div className="pb-24 sm:pb-8">
        <h2 className="font-serif text-2xl text-foreground mb-1">Reflection Archive</h2>
        <p className="text-sm text-muted-foreground mb-8">
          Look back at your past reflections and see how far you have come.
        </p>

        {entries.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">
              No reflections yet. Complete your first daily entry to see it here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-card border border-border rounded-lg p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-foreground">
                    {formatDate(entry.date)}
                  </p>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    {moodIconMap[entry.mood]}
                    <span>{moodLabels[entry.mood]}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {entry.questions.map((qa) => (
                    <div key={qa.question}>
                      <p className="text-sm font-medium text-foreground mb-1">
                        {qa.question}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {qa.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
