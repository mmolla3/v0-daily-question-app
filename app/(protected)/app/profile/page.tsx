import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/supabase/actions"
import { ProfileClient } from "@/components/profile-client"

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const profile = await getProfile()

  if (!profile) {
    redirect("/onboarding")
  }

  return <ProfileClient profile={profile} userEmail={user.email || ""} userName={user.user_metadata?.name || "User"} />
}
