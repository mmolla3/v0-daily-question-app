import { Feather, Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
          <Mail className="w-8 h-8 text-accent" />
        </div>
        
        <h1 className="font-serif text-3xl text-foreground mb-3">Check your email</h1>
        <p className="text-muted-foreground mb-8">
          {"We've sent you a confirmation link. Click it to activate your account and begin your reflection journey."}
        </p>

        <div className="p-4 rounded-lg bg-card border border-border mb-6">
          <div className="flex items-center gap-3">
            <Feather className="w-5 h-5 text-primary flex-shrink-0" />
            <p className="text-sm text-foreground text-left">
              {"Once confirmed, you'll choose your question category and how many questions you'd like each day."}
            </p>
          </div>
        </div>

        <Button asChild variant="outline" className="w-full">
          <Link href="/auth/login">Return to sign in</Link>
        </Button>
      </div>
    </div>
  )
}
