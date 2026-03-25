import { getEntries, getProfile } from "@/lib/supabase/actions"
import { TrendsClient } from "@/components/trends-client"

export default async function TrendsPage() {
  const [entries, profile] = await Promise.all([getEntries(), getProfile()])

  return <TrendsClient entries={entries} profile={profile} />
}
