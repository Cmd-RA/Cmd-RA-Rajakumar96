
"use client"

import Link from "next/link"
import { Settings, ShieldCheck, User as UserIcon, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser } from "@/firebase"

export function Header() {
  const { user, isUserLoading } = useUser()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 max-w-2xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black font-headline tracking-tighter text-primary">
            मोनेटाइजेशन
          </span>
        </Link>
        <div className="flex items-center gap-1">
          {user ? (
            <>
              {/* Admin Access if specific email */}
              {user.email === "rajahribabakumar@gmail.com" && (
                <Link href="/admin">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary transition-colors">
                    <ShieldCheck className="h-5 w-5" />
                  </Button>
                </Link>
              )}
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary transition-colors">
                  <UserIcon className="h-5 w-5" />
                </Button>
              </Link>
            </>
          ) : (
            !isUserLoading && (
              <Link href="/login">
                <Button variant="default" size="sm" className="gap-2 font-black rounded-full px-5 h-9">
                  <LogIn className="h-4 w-4" /> लॉगिन
                </Button>
              </Link>
            )
          )}
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
