"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { BookOpen, BarChart3, Archive, User } from "lucide-react"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    { href: "/app", label: "Today", icon: BookOpen },
    { href: "/app/archive", label: "Archive", icon: Archive },
    { href: "/app/trends", label: "Trends", icon: BarChart3 },
    { href: "/app/profile", label: "Profile", icon: User },
  ]

  const isActive = (href: string) => {
    if (href === "/app") return pathname === "/app"
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-4 border-b border-border lg:px-12">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/app" className="font-serif text-xl text-foreground">
            InnerLog
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${isActive(item.href)
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
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
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-md text-xs transition-colors ${isActive(item.href)
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
                  }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
