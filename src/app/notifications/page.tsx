import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, UserPlus, Star } from "lucide-react"

export default function NotificationsPage() {
  const notifications = [
    { type: "follow", user: "अमित वर्मा", time: "2 मिनट पहले", icon: UserPlus, color: "text-blue-500" },
    { type: "like", user: "नेहा सिंह", action: "ने आपकी पोस्ट लाइक की", time: "15 मिनट पहले", icon: Heart, color: "text-red-500" },
    { type: "comment", user: "राहुल यादव", action: "ने कमेंट किया: 'बहुत सुंदर!'", time: "1 घंटा पहले", icon: MessageCircle, color: "text-green-500" },
    { type: "admin", user: "एडमिन", action: "ने आपकी पोस्ट को विशेष (Featured) बनाया!", time: "3 घंटे पहले", icon: Star, color: "text-yellow-500" },
  ]

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <div className="container max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-bold font-headline mb-6">सूचनाएँ</h1>
        
        <div className="space-y-1">
          {notifications.map((notif, i) => (
            <div key={i} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors border-b last:border-0">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`https://picsum.photos/seed/notif${i}/100`} />
                  <AvatarFallback>{notif.user[0]}</AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 p-1 rounded-full bg-background shadow-sm border`}>
                  <notif.icon className={`h-3 w-3 ${notif.color}`} />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-bold">{notif.user}</span>{" "}
                  <span className="text-muted-foreground">{notif.action || "ने आपको फॉलो करना शुरू किया"}</span>
                </p>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-medium">{notif.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}