import Link from "next/link"
import { Settings, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 max-w-2xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold font-headline tracking-tighter text-primary">
            धनधारा
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <ShieldCheck className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}