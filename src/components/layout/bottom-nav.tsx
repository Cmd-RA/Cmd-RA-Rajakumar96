"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, PlusSquare, Bell, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "होम", icon: Home, href: "/" },
  { label: "खोज", icon: Search, href: "/search" },
  { label: "अपलोड", icon: PlusSquare, href: "/upload" },
  { label: "सूचनाएँ", icon: Bell, href: "/notifications" },
  { label: "प्रोफ़ाइल", icon: User, href: "/profile" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 bottom-nav-blur border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              <item.icon className={cn("h-6 w-6", isActive && "fill-current")} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}