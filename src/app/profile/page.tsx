
"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Trophy, Users, Heart, LayoutGrid, DollarSign, 
  LogOut, Loader2, Landmark, PhoneCall, Save 
} from "lucide-react"
import { useUser, useFirestore, useCollection, useMemoFirebase, useAuth, useDoc } from "@/firebase"
import { collection, query, where, orderBy, doc, setDoc, serverTimestamp } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { user, isUserLoading } = useUser()
  const db = useFirestore()
  const auth = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [bankInfo, setBankInfo] = useState({
    bankAccount: "",
    ifscCode: "",
    gpayNumber: ""
  })
  const [isUpdating, setIsUpdating] = useState(false)

  const userDocRef = useMemoFirebase(() => user ? doc(db, "users", user.uid) : null, [db, user])
  const { data: profileData } = useDoc(userDocRef)

  const userPostsQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(
      collection(db, "posts"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    )
  }, [db, user])

  const { data: posts, isLoading: isPostsLoading } = useCollection(userPostsQuery)

  useEffect(() => {
    if (profileData) {
      setBankInfo({
        bankAccount: profileData.bankAccount || "",
        ifscCode: profileData.ifscCode || "",
        gpayNumber: profileData.gpayNumber || ""
      })
    }
  }, [profileData])

  const handleUpdateBank = async () => {
    if (!userDocRef) return
    setIsUpdating(true)
    try {
      await setDoc(userDocRef, {
        ...bankInfo,
        updatedAt: serverTimestamp()
      }, { merge: true })
      toast({ title: "सफलता", description: "आपकी पेमेंट जानकारी अपडेट कर दी गई है।" })
    } catch (e) {
      toast({ variant: "destructive", title: "त्रुटि", description: "अपडेट करने में विफल।" })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
    router.push("/login")
  }

  if (isUserLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  if (!user) { router.push("/login"); return null; }

  const followers = profileData?.followerCount || 0
  const isMonetized = followers >= 1000

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <div className="container max-w-xl mx-auto p-4">
        {/* Profile Header */}
        <div className="flex flex-col items-center pt-8 pb-8 border-b">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24 ring-4 ring-primary/20">
              <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.uid}/200`} />
              <AvatarFallback>{user.displayName?.[0] || "U"}</AvatarFallback>
            </Avatar>
            {isMonetized && (
              <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full border-2 border-background">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold font-headline">{user.displayName || user.email?.split('@')[0]}</h1>
          <p className="text-muted-foreground text-sm mb-4">मोनेटाइजेशन क्रिएटर चैनल 🎥</p>
          
          <div className="flex gap-10 mb-6">
            <div className="text-center">
              <p className="font-bold text-xl">{posts?.length || 0}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">पोस्ट</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-xl">{followers}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">फॉलोअर्स</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-xl">0</p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">फॉलोइंग</p>
            </div>
          </div>

          <div className="flex gap-2 w-full">
            <Button className="flex-1 rounded-full" variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> लॉगआउट
            </Button>
            <Button variant="default" className="flex-1 rounded-full shadow-lg">प्रोफ़ाइल एडिट करें</Button>
          </div>
        </div>

        {/* Monetization & Payment Section */}
        <div className="space-y-6 mt-6">
          <Card className="border-none shadow-md bg-gradient-to-br from-primary/10 to-accent/5">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" /> मुद्रीकरण (Earnings)
                </CardTitle>
                <Badge variant={isMonetized ? "default" : "secondary"}>
                  {isMonetized ? "एक्टिव" : "अयोग्य"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4">
                1,000 फॉलोअर्स होने पर आप विज्ञापन से पैसे कमाना शुरू कर सकते हैं।
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>प्रगति</span>
                  <span>{followers}/1000</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-700" 
                    style={{ width: `${Math.min((followers / 1000) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details Form */}
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Landmark className="h-5 w-5 text-primary" /> पेमेंट सेटिंग्स
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">बैंक अकाउंट नंबर</label>
                <Input 
                  placeholder="0000 0000 0000 0000" 
                  value={bankInfo.bankAccount}
                  onChange={(e) => setBankInfo({...bankInfo, bankAccount: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">IFSC कोड</label>
                <Input 
                  placeholder="SBIN000XXXX" 
                  value={bankInfo.ifscCode}
                  onChange={(e) => setBankInfo({...bankInfo, ifscCode: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">गूगल पे नंबर (GPay)</label>
                <Input 
                  placeholder="+91 XXXXX XXXXX" 
                  value={bankInfo.gpayNumber}
                  onChange={(e) => setBankInfo({...bankInfo, gpayNumber: e.target.value})}
                />
              </div>
              <Button className="w-full gap-2 rounded-xl" onClick={handleUpdateBank} disabled={isUpdating}>
                {isUpdating ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                जानकारी सेव करें
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Post Grid */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <LayoutGrid className="h-5 w-5 text-primary" />
            <h2 className="font-bold">आपकी कला (Gallery)</h2>
          </div>
          
          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-3 gap-1 md:gap-2">
              {posts.map((post: any) => (
                <div key={post.id} className="aspect-square relative group cursor-pointer overflow-hidden rounded-xl bg-muted shadow-sm">
                  <Image src={post.photoUrl} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                    <Heart className="h-4 w-4 fill-current" />
                    <span className="text-xs font-bold">{post.likeIds?.length || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
              <p className="text-muted-foreground mb-4">अभी तक कोई पोस्ट नहीं है।</p>
              <Button onClick={() => router.push("/upload")} variant="default" className="rounded-full px-8">पहली पोस्ट अपलोड करें</Button>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}

function CheckCircle2({ className }: { className: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
  )
}
