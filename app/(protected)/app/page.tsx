import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getProfile, getTodayEntry, getQuestionsForCategory } from "@/lib/supabase/actions"
import { isNewWeek } from "@/lib/types"
import { DailyQuestionsClient } from "@/components/daily-questions-client"

export default async function AppPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const profile = await getProfile()

  if (!profile) {
    redirect("/onboarding")
  }

  // Check if user needs weekly setup
  const needsWeeklySetup = isNewWeek(profile.weekly_chosen_at)

  // Get today's questions
  const questions = await getQuestionsForCategory(
    profile.category,
    profile.questions_per_day
  )

  // Check if already submitted today
  const todayEntry = await getTodayEntry()

  return (
    <DailyQuestionsClient
      profile={profile}
      questions={questions}
      todayEntry={todayEntry}
      needsWeeklySetup={needsWeeklySetup}
    />
  )
}
