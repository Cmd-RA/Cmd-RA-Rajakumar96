import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search as SearchIcon, TrendingUp, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function SearchPage() {
  const trendingTags = ["#हिमालय", "#भोजन", "#दिवाली", "#फोटोग्राफी", "#कमाई", "#धनधारा"]
  const suggestedUsers = [
    { name: "अंजलि शर्मा", handle: "@anjali_clicks", avatar: "https://picsum.photos/seed/user1/100" },
    { name: "अमित वर्मा", handle: "@amit_v", avatar: "https://picsum.photos/seed/user2/100" },
    { name: "नेहा सिंह", handle: "@neha_arts", avatar: "https://picsum.photos/seed/user3/100" },
  ]

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <div className="container max-w-xl mx-auto p-4">
        {/* Search Bar */}
        <div className="relative mb-8">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="यूज़र या पोस्ट सर्च करें..." 
            className="pl-10 h-12 rounded-2xl bg-muted/50 border-none"
          />
        </div>

        {/* Trending Tags */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="font-bold font-headline text-lg">ट्रेंडिंग टॉपिक्स</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="px-4 py-2 rounded-full cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Suggested Users */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="font-bold font-headline text-lg">नए क्रिएटर खोजें</h2>
          </div>
          <div className="space-y-4">
            {suggestedUsers.map((user, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-card rounded-2xl border shadow-sm">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-sm leading-none">{user.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{user.handle}</p>
                  </div>
                </div>
                <button className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-full">
                  फॉलो करें
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}