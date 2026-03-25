"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react"
import { AppShell } from "./app-shell"
import { type DailyEntry, type Mood, moodLabels } from "@/lib/types"

const moodColors: Record<Mood, string> = {
  great: "bg-accent",
  good: "bg-primary",
  okay: "bg-muted-foreground",
  low: "bg-chart-5",
  rough: "bg-destructive",
}

interface Props {
  entries: DailyEntry[]
}

export function ArchiveClient({ entries }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

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
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-serif text-2xl text-foreground">Your Reflections</h2>
            <p className="text-sm text-muted-foreground">
              {entries.length} {entries.length === 1 ? "entry" : "entries"}
            </p>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No reflections yet. Complete your first one today!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => {
              const isExpanded = expandedId === entry.id
              return (
                <div key={entry.id} className="bg-card border border-border rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${moodColors[entry.mood]}`} />
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {formatDate(entry.entry_date)}
                        </p>
                        <p className="text-xs text-muted-foreground">{moodLabels[entry.mood]}</p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>

                  {isExpanded && entry.responses && (
                    <div className="px-4 pb-4 space-y-3">
                      {entry.responses.map((response, idx) => (
                        <div key={idx} className="bg-background rounded-md p-3">
                          <p className="text-xs text-muted-foreground mb-1">{response.question_text}</p>
                          <p className="text-sm text-foreground whitespace-pre-wrap">
                            {response.answer_text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AppShell>
  )
}
