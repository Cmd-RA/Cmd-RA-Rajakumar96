"use client"

import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Heart, LayoutGrid, DollarSign, ArrowRight, LogOut, Loader2 } from "lucide-react"
import { useUser, useFirestore, useCollection, useMemoFirebase, useAuth } from "@/firebase"
import { collection, query, where, orderBy } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import Image from "next/image"

export default function ProfilePage() {
  const { user, isUserLoading } = useUser()
  const db = useFirestore()
  const auth = useAuth()
  const router = useRouter()

  const userPostsQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(
      collection(db, "posts"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    )
  }, [db, user])

  const { data: posts, isLoading: isPostsLoading } = useCollection(userPostsQuery)

  const followers = 0 // In real app, fetch from /users/{uid}/followers
  const isMonetized = followers >= 1000

  const handleLogout = async () => {
    await signOut(auth)
    router.push("/login")
  }

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <div className="container max-w-xl mx-auto p-4">
        {/* Profile Header */}
        <div className="flex flex-col items-center pt-4 pb-8 border-b">
          <Avatar className="h-24 w-24 ring-4 ring-primary/10 mb-4">
            <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.uid}/200`} alt={user.displayName || "User"} />
            <AvatarFallback>{user.displayName?.[0] || user.email?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold font-headline">{user.displayName || user.email?.split('@')[0]}</h1>
          <p className="text-muted-foreground text-sm mb-4">डिजिटल क्रिएटर | मोनेटाइजेशन यूज़र 📸</p>
          
          <div className="flex gap-8 mb-6">
            <div className="text-center">
              <p className="font-bold text-lg leading-none">{posts?.length || 0}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">पोस्ट</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg leading-none">{followers}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">फॉलोअर्स</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg leading-none">0</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">फॉलोइंग</p>
            </div>
          </div>

          <div className="flex gap-2 w-full">
            <Button className="flex-1" variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> लॉगआउट
            </Button>
            <Button variant="outline" className="flex-1">प्रोफ़ाइल शेयर करें</Button>
          </div>
        </div>

        {/* Monetization Status Card */}
        <Card className="mt-6 border-none shadow-sm bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <h3 className="font-bold">मुद्रीकरण (Monetization)</h3>
              </div>
              <Badge variant={isMonetized ? "default" : "secondary"} className={isMonetized ? "bg-green-500" : ""}>
                {isMonetized ? "सक्रिय" : "अयोग्य"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              1,000 फॉलोअर्स पूरे होने पर आप कमाई शुरू कर सकते हैं।
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span>प्रगति</span>
                <span>{followers}/1000</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500" 
                  style={{ width: `${Math.min((followers / 1000) * 100, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Post Grid */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <LayoutGrid className="h-5 w-5" />
            <h2 className="font-bold">आपकी पोस्ट्स</h2>
          </div>
          
          {isPostsLoading ? (
            <div className="grid grid-cols-3 gap-1 animate-pulse">
              {[1, 2, 3].map(i => <div key={i} className="aspect-square bg-muted rounded-md" />)}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-3 gap-1 md:gap-2">
              {posts.map((post: any) => (
                <div key={post.id} className="aspect-square relative group cursor-pointer overflow-hidden rounded-md bg-muted">
                  <Image 
                    src={post.photoUrl} 
                    alt={post.title} 
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4 fill-current" />
                      <span className="text-xs font-bold">{post.likeIds?.length || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>अभी तक कोई पोस्ट नहीं है।</p>
              <Button variant="link" onClick={() => router.push("/upload")} className="text-primary font-bold">
                पहली पोस्ट अपलोड करें
              </Button>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
