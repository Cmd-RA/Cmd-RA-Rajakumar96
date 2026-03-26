
"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Trophy, LayoutGrid, DollarSign, PlusCircle,
  LogOut, Loader2, Landmark, Save, AlertTriangle, CheckCircle2, ShieldCheck
} from "lucide-react"
import { useUser, useFirestore, useCollection, useMemoFirebase, useAuth, useDoc } from "@/firebase"
import { collection, query, where, orderBy, doc, setDoc, serverTimestamp } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

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

  const { data: posts } = useCollection(userPostsQuery)

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
      toast({ title: "सफलता", description: "पेमेंट जानकारी अपडेट कर दी गई है।" })
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

  const followerCount = profileData?.followerCount || 0
  const totalLikes = posts?.reduce((acc: number, post: any) => acc + (post.likeIds?.length || 0), 0) || 0
  const monetizationGoal = 1000
  const progressValue = Math.min((followerCount / monetizationGoal) * 100, 100)
  const isMonetized = followerCount >= monetizationGoal

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <div className="container max-w-xl mx-auto p-4">
        {/* Profile Header */}
        <div className="flex flex-col items-center pt-8 pb-8 border-b">
          <div className="relative mb-4">
            <Avatar className="h-32 w-32 ring-4 ring-primary/20 shadow-2xl">
              <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.uid}/200`} />
              <AvatarFallback>{user.displayName?.[0] || "U"}</AvatarFallback>
            </Avatar>
            {isMonetized && (
              <div className="absolute -bottom-1 -right-1 bg-primary text-white p-2 rounded-full border-4 border-background shadow-lg">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
            {user.displayName || user.email?.split('@')[0]}
            {isMonetized && <ShieldCheck className="h-5 w-5 text-primary" />}
          </h1>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1">@creator_{user.uid.substring(0, 6)}</p>
          
          <div className="grid grid-cols-3 gap-10 w-full my-8">
            <div className="text-center">
              <p className="font-black text-2xl text-primary">{posts?.length || 0}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-black">पोस्ट</p>
            </div>
            <div className="text-center border-x">
              <p className="font-black text-2xl text-primary">{followerCount}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-black">फॉलोअर्स</p>
            </div>
            <div className="text-center">
              <p className="font-black text-2xl text-primary">{totalLikes}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-black">कुल लाइक</p>
            </div>
          </div>

          <div className="flex gap-4 w-full px-4">
            <Button className="flex-1 rounded-2xl h-14 font-black text-md shadow-xl gap-2 bg-primary hover:bg-primary/90 transition-all hover:scale-[1.02]" onClick={() => router.push("/upload")}>
              <PlusCircle className="h-5 w-5" /> नई कला अपलोड करें
            </Button>
            <Button variant="outline" className="rounded-2xl h-14 w-14 border-primary/20 text-muted-foreground" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Monetization Progress */}
        <div className="mt-8 space-y-6">
          <Card className="border-none shadow-2xl bg-gradient-to-br from-primary/10 via-background to-accent/5 overflow-hidden rounded-[2rem]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2 font-black uppercase">
                  <DollarSign className="h-5 w-5 text-primary" /> मोनेटाइजेशन प्रोग्रेस
                </CardTitle>
                <Badge variant={isMonetized ? "default" : "secondary"} className="rounded-full px-4">
                  {isMonetized ? "सक्रिय" : "सीख रहे हैं"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-4xl font-black">{followerCount}</p>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">वर्तमान फॉलोअर्स</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-primary">लक्ष्य: 1,000</p>
                  </div>
                </div>
                <Progress value={progressValue} className="h-4 bg-primary/10 rounded-full" />
                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-[11px] font-bold text-muted-foreground leading-relaxed italic">
                    सूचना: मुद्रीकरण के लिए 1,000 फॉलोअर्स और 100% ओरिजिनल फोटो होना अनिवार्य है। गूगल एडसेंस के लिए आपका कंटेंट साफ़ होना चाहिए।
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Settings */}
          <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 font-black uppercase tracking-tight">
                <Landmark className="h-5 w-5 text-primary" /> पेमेंट सेटिंग्स (मुद्रीकरण)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">बैंक अकाउंट नंबर</label>
                <Input 
                  className="rounded-2xl h-14 bg-muted/30 border-none px-6 font-bold"
                  placeholder="0000 0000 0000 0000" 
                  value={bankInfo.bankAccount}
                  onChange={(e) => setBankInfo({...bankInfo, bankAccount: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">IFSC कोड</label>
                <Input 
                  className="rounded-2xl h-14 bg-muted/30 border-none px-6 font-bold"
                  placeholder="SBIN0000000" 
                  value={bankInfo.ifscCode}
                  onChange={(e) => setBankInfo({...bankInfo, ifscCode: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">गूगल पे नंबर (GPay)</label>
                <Input 
                  className="rounded-2xl h-14 bg-muted/30 border-none px-6 font-bold"
                  placeholder="+91 00000 00000" 
                  value={bankInfo.gpayNumber}
                  onChange={(e) => setBankInfo({...bankInfo, gpayNumber: e.target.value})}
                />
              </div>
              <Button className="w-full gap-2 rounded-2xl h-14 text-md font-black shadow-lg bg-primary" onClick={handleUpdateBank} disabled={isUpdating}>
                {isUpdating ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
                डेटाबेस में सुरक्षित करें
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* User Gallery */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="font-black font-headline text-2xl flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full"><LayoutGrid className="h-5 w-5 text-primary" /></div>
              आपकी गैलरी
            </h2>
          </div>
          
          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {posts.map((post: any) => (
                <div key={post.id} className="aspect-square relative group cursor-pointer overflow-hidden rounded-[1.5rem] bg-muted shadow-md border-2 border-transparent hover:border-primary/30 transition-all">
                  <Image src={post.photoUrl} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Badge className="bg-white/20 backdrop-blur-md text-white font-black">{post.likeIds?.length || 0} Likes</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/10 rounded-[3rem] border-4 border-dashed border-muted">
              <p className="text-muted-foreground font-black mb-6 uppercase tracking-widest text-xs">अभी कोई पोस्ट नहीं है</p>
              <Button onClick={() => router.push("/upload")} variant="secondary" className="rounded-full px-8 font-black">पहली फोटो डालें</Button>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
