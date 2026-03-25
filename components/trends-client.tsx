"use client"

import { useMemo } from "react"
import { BarChart3, Flame, Calendar, TrendingUp } from "lucide-react"
import { AppShell } from "./app-shell"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, XAxis, YAxis } from "recharts"
import { type DailyEntry, type Mood, type Profile, moodLabels } from "@/lib/types"

const moodValues: Record<Mood, number> = {
  great: 5,
  good: 4,
  okay: 3,
  low: 2,
  rough: 1,
}

const moodColors: Record<Mood, string> = {
  great: "#5a9a72",
  good: "#8B5E34",
  okay: "#9ca3af",
  low: "#d97706",
  rough: "#dc2626",
}

interface Props {
  entries: DailyEntry[]
  profile: Profile | null
}

export function TrendsClient({ entries, profile }: Props) {
  const chartData = useMemo(() => {
    return entries
      .slice()
      .reverse()
      .slice(-14)
      .map((entry) => ({
        date: new Date(entry.entry_date + "T12:00:00").toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        mood: moodValues[entry.mood],
        moodLabel: moodLabels[entry.mood],
      }))
  }, [entries])

  const moodBreakdown = useMemo(() => {
    const counts: Record<Mood, number> = {
      great: 0,
      good: 0,
      okay: 0,
      low: 0,
      rough: 0,
    }
    for (const entry of entries) {
      counts[entry.mood]++
    }
    const total = entries.length || 1
    return Object.entries(counts).map(([mood, count]) => ({
      mood: mood as Mood,
      count,
      percentage: Math.round((count / total) * 100),
    }))
  }, [entries])

  const chartConfig = {
    mood: {
      label: "Mood",
      color: "#8B5E34",
    },
  }

  return (
    <AppShell>
      <div className="pb-24 sm:pb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-primary" />
          </div>
          <h2 className="font-serif text-2xl text-foreground">Your Trends</h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <Flame className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="font-serif text-2xl text-foreground">{profile?.current_streak || 0}</p>
            <p className="text-xs text-muted-foreground">Current streak</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <TrendingUp className="w-5 h-5 text-accent mx-auto mb-2" />
            <p className="font-serif text-2xl text-foreground">{profile?.longest_streak || 0}</p>
            <p className="text-xs text-muted-foreground">Best streak</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <Calendar className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
            <p className="font-serif text-2xl text-foreground">{entries.length}</p>
            <p className="text-xs text-muted-foreground">Total entries</p>
          </div>
        </div>

        {/* Mood chart */}
        {chartData.length > 1 && (
          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <p className="font-medium text-foreground text-sm mb-4">Mood over time</p>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <AreaChart data={chartData} margin={{ left: 0, right: 0 }}>
                <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={10} />
                <YAxis domain={[1, 5]} hide />
                <ChartTooltip
                  content={<ChartTooltipContent labelKey="moodLabel" nameKey="mood" />}
                />
                <Area
                  type="monotone"
                  dataKey="mood"
                  stroke="#8B5E34"
                  fill="#8B5E34"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        )}

        {/* Mood breakdown */}
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="font-medium text-foreground text-sm mb-4">Mood breakdown</p>
          <div className="space-y-3">
            {moodBreakdown.map(({ mood, count, percentage }) => (
              <div key={mood} className="flex items-center gap-3">
                <div className="w-16 text-sm text-foreground">{moodLabels[mood]}</div>
                <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: moodColors[mood],
                    }}
                  />
                </div>
                <div className="w-12 text-right text-sm text-muted-foreground">{count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
