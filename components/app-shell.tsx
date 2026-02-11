"use client"

import React from "react"

import { BookOpen, BarChart3, Archive, User } from "lucide-react"
import { store, useAppState } from "@/lib/store"

export function AppShell({ children }: { children: React.ReactNode }) {
  const { currentView } = useAppState()

  const navItems = [
    { id: "daily" as const, label: "Today", icon: BookOpen },
    { id: "archive" as const, label: "Archive", icon: Archive },
    { id: "trends" as const, label: "Trends", icon: BarChart3 },
    { id: "profile" as const, label: "Profile", icon: User },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-4 border-b border-border lg:px-12">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1
            className="font-serif text-xl text-foreground cursor-pointer"
            onClick={() => store.navigate("daily")}
            onKeyDown={(e) => {
              if (e.key === "Enter") store.navigate("daily")
            }}
            role="button"
            tabIndex={0}
          >
            Innerlog
          </h1>
          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => store.navigate(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    currentView === item.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1 px-6 py-6 lg:px-12">
        <div className="max-w-2xl mx-auto">{children}</div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 py-2 z-50">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => store.navigate(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-md text-xs transition-colors ${
                  currentView === item.id
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
