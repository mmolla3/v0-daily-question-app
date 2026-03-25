import { getEntries } from "@/lib/supabase/actions"
import { ArchiveClient } from "@/components/archive-client"

export default async function ArchivePage() {
  const entries = await getEntries()
  return <ArchiveClient entries={entries} />
}
