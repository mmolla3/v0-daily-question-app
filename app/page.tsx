"use client"

import { useAppState } from "@/lib/store"
import { LandingPage } from "@/components/landing-page"
import { Onboarding } from "@/components/onboarding"
import { DailyQuestions } from "@/components/daily-questions"
import { ReflectionArchive } from "@/components/reflection-archive"
import { TrendsPage } from "@/components/trends-page"
import { ProfilePage } from "@/components/profile-page"

export default function Page() {
  const { currentView } = useAppState()

  switch (currentView) {
    case "landing":
      return <LandingPage />
    case "onboarding":
      return <Onboarding />
    case "daily":
      return <DailyQuestions />
    case "archive":
      return <ReflectionArchive />
    case "trends":
      return <TrendsPage />
    case "profile":
      return <ProfilePage />
    default:
      return <LandingPage />
  }
}
