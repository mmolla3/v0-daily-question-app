"use client"

import { Flame, Trophy } from "lucide-react"
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts"
import { useAppState } from "@/lib/store"
import type { Mood } from "@/lib/mock-data"
import { AppShell } from "./app-shell"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const moodToValue: Record<Mood, number> = {
  happy: 5,
  calm: 4,
  neutral: 3,
  anxious: 2,
  stressed: 1,
}

const valueToMoodLabel: Record<number, string> = {
  1: "Stressed",
  2: "Anxious",
  3: "Neutral",
  4: "Calm",
  5: "Happy",
}

export function TrendsPage() {
  const { profile, entries } = useAppState()

  if (!profile) return null

  const chartData = [...entries]
    .reverse()
    .map((entry) => {
      const date = new Date(entry.date + "T12:00:00")
      return {
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        mood: moodToValue[entry.mood],
      }
    })

  const moodCounts: Record<Mood, number> = { happy: 0, calm: 0, neutral: 0, anxious: 0, stressed: 0 }
  for (const entry of entries) {
    moodCounts[entry.mood]++
  }
  const totalMoods = entries.length
  const moodPercentages = Object.entries(moodCounts)
    .map(([mood, count]) => ({
      mood: mood as Mood,
      count,
      percentage: totalMoods > 0 ? Math.round((count / totalMoods) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)

  const moodColors: Record<Mood, string> = {
    happy: "#b8860b",
    calm: "#5a8a6a",
    neutral: "#8a8a8a",
    anxious: "#c4a35a",
    stressed: "#c45a5a",
  }

  return (
    <AppShell>
      <div className="pb-24 sm:pb-8">
        <h2 className="font-serif text-2xl text-foreground mb-1">Trends</h2>
        <p className="text-sm text-muted-foreground mb-8">
          See your emotional patterns and track your consistency.
        </p>

        {/* Streak cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Flame className="w-5 h-5" />
              <span className="text-sm font-medium">Current Streak</span>
            </div>
            <p className="font-serif text-3xl text-foreground">{profile.currentStreak}</p>
            <p className="text-xs text-muted-foreground mt-1">days</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center gap-2 text-accent mb-2">
              <Trophy className="w-5 h-5" />
              <span className="text-sm font-medium">Longest Streak</span>
            </div>
            <p className="font-serif text-3xl text-foreground">{profile.longestStreak}</p>
            <p className="text-xs text-muted-foreground mt-1">days</p>
          </div>
        </div>

        {/* Mood chart */}
        <div className="bg-card border border-border rounded-lg p-5 mb-8">
          <h3 className="font-medium text-foreground mb-4">Mood over time</h3>
          {chartData.length > 0 ? (
            <ChartContainer
              config={{
                mood: {
                  label: "Mood",
                  color: "#8B5E34",
                },
              }}
              className="h-[200px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5E34" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#8B5E34" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[1, 5]}
                    ticks={[1, 2, 3, 4, 5]}
                    tickFormatter={(v: number) => valueToMoodLabel[v] || ""}
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    width={55}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => valueToMoodLabel[value as number] || value}
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="mood"
                    stroke="#8B5E34"
                    strokeWidth={2}
                    fill="url(#moodGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Complete a few daily reflections to see your mood trends.
            </p>
          )}
        </div>

        {/* Mood breakdown */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-medium text-foreground mb-4">Mood breakdown</h3>
          <div className="flex flex-col gap-3">
            {moodPercentages.map(({ mood, count, percentage }) => (
              <div key={mood} className="flex items-center gap-3">
                <span className="text-sm text-foreground w-16 capitalize">{mood}</span>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: moodColors[mood],
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-16 text-right">
                  {count} ({percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
