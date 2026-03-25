import React from "react"
import Link from "next/link"

import { BookOpen, Flame, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 lg:px-12">
        <h1 className="font-serif text-xl text-foreground">Innerlog</h1>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link href="/auth/login">Log in</Link>
          </Button>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            asChild
          >
            <Link href="/auth/sign-up">Get started</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm font-medium text-primary tracking-wide uppercase mb-4">
            Daily Reflection
          </p>
          <h2 className="font-serif text-4xl md:text-6xl text-foreground leading-tight text-balance mb-6">
            One question a day to understand yourself better.
          </h2>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-10 leading-relaxed">
            Build self-awareness through guided daily reflection. Not a journal
            &mdash; just a few minutes of honest answers each day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base"
              asChild
            >
              <Link href="/auth/sign-up">Start reflecting</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border text-foreground hover:bg-secondary px-8 py-6 text-base bg-transparent"
              asChild
            >
              <Link href="/auth/login">I have an account</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Features */}
      <section className="px-6 py-16 lg:px-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<BookOpen className="w-5 h-5" />}
            title="Guided Questions"
            description="Choose a category that resonates with you. Get thoughtful prompts tailored to your focus."
          />
          <FeatureCard
            icon={<Flame className="w-5 h-5" />}
            title="Build Streaks"
            description="Stay consistent with daily streaks. A few minutes each day adds up to real self-awareness."
          />
          <FeatureCard
            icon={<TrendingUp className="w-5 h-5" />}
            title="Track Your Mood"
            description="Log how you feel each day and see emotional patterns emerge over time."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 text-center text-sm text-muted-foreground border-t border-border">
        <p>Innerlog &mdash; Reflect. Grow. Repeat.</p>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
