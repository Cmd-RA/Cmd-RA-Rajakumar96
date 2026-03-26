
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
  Trophy, Users, Heart, LayoutGrid, DollarSign, 
  LogOut, Loader2, Landmark, Save, AlertTriangle, CheckCircle2
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
            <Avatar className="h-28 w-28 ring-4 ring-primary/20 shadow-xl">
              <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.uid}/200`} />
              <AvatarFallback>{user.displayName?.[0] || "U"}</AvatarFallback>
            </Avatar>
            {isMonetized && (
              <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-full border-4 border-background shadow-lg">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
            {user.displayName || user.email?.split('@')[0]}
            {isMonetized && <Badge className="bg-primary/10 text-primary border-primary/20">Verified Artist</Badge>}
          </h1>
          <p className="text-muted-foreground text-sm mb-6">क्रिएटर आईडी: @{user.uid.substring(0, 8)}</p>
          
          <div className="grid grid-cols-3 gap-8 w-full mb-8">
            <div className="text-center">
              <p className="font-black text-2xl text-primary">{posts?.length || 0}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">पोस्ट</p>
            </div>
            <div className="text-center border-x">
              <p className="font-black text-2xl text-primary">{followerCount}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">फॉलोअर्स</p>
            </div>
            <div className="text-center">
              <p className="font-black text-2xl text-primary">{totalLikes}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">कुल लाइक</p>
            </div>
          </div>

          <div className="flex gap-3 w-full">
            <Button className="flex-1 rounded-2xl h-12 font-bold shadow-lg" onClick={() => router.push("/upload")}>
              नई कला जोड़ें
            </Button>
            <Button variant="outline" className="rounded-2xl h-12 w-12" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Monetization Progress */}
        <div className="mt-8 space-y-6">
          <Card className="border-none shadow-xl bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4">
              <Trophy className={cn("h-12 w-12 opacity-10 rotate-12", isMonetized ? "text-yellow-500 opacity-30" : "text-primary")} />
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" /> मोनेटाइजेशन प्रोग्रेस
                </CardTitle>
                <Badge variant={isMonetized ? "default" : "secondary"} className="rounded-full">
                  {isMonetized ? "सक्रिय (Active)" : "प्रक्रिया में"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-3xl font-black">{followerCount}</p>
                    <p className="text-xs text-muted-foreground font-bold">कुल फॉलोअर्स</p>
                  </div>
                  <p className="text-xs font-bold text-primary">लक्ष्य: 1,000</p>
                </div>
                <Progress value={progressValue} className="h-3 bg-primary/10" />
                <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                  * मोनेटाइजेशन चालू करने के लिए 1,000 फॉलोअर्स होना अनिवार्य है।
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Original Content Policy Notice */}
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-yellow-800">कंटेंट पॉलिसी</p>
              <p className="text-[10px] text-yellow-700 mt-0.5 leading-relaxed">
                कृपया केवल अपनी खुद की खींची हुई ओरिजिनल फोटो ही अपलोड करें। कॉपीराइटेड या इंटरनेट से उठाई गई फोटो पाए जाने पर आपका अकाउंट स्थायी रूप से बंद कर दिया जाएगा।
              </p>
            </div>
          </div>

          {/* Payment Settings */}
          <Card className="border-none shadow-xl rounded-[2rem]">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Landmark className="h-5 w-5 text-primary" /> पेमेंट जानकारी (Withdrawal)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">बैंक अकाउंट नंबर</label>
                <Input 
                  className="rounded-xl h-12 bg-muted/50 border-none"
                  placeholder="0000 0000 0000 0000" 
                  value={bankInfo.bankAccount}
                  onChange={(e) => setBankInfo({...bankInfo, bankAccount: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">IFSC कोड</label>
                <Input 
                  className="rounded-xl h-12 bg-muted/50 border-none"
                  placeholder="SBIN000XXXX" 
                  value={bankInfo.ifscCode}
                  onChange={(e) => setBankInfo({...bankInfo, ifscCode: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">गूगल पे नंबर (GPay)</label>
                <Input 
                  className="rounded-xl h-12 bg-muted/50 border-none"
                  placeholder="+91 XXXXX XXXXX" 
                  value={bankInfo.gpayNumber}
                  onChange={(e) => setBankInfo({...bankInfo, gpayNumber: e.target.value})}
                />
              </div>
              <Button className="w-full gap-2 rounded-2xl h-14 text-md font-bold shadow-lg" onClick={handleUpdateBank} disabled={isUpdating}>
                {isUpdating ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
                जानकारी सुरक्षित करें
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* User Gallery */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="font-black font-headline text-xl flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-primary" /> आपकी गैलरी
            </h2>
            <Badge variant="outline" className="rounded-full">{posts?.length || 0} आइटम्स</Badge>
          </div>
          
          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {posts.map((post: any) => (
                <div key={post.id} className="aspect-square relative group cursor-pointer overflow-hidden rounded-2xl bg-muted shadow-md">
                  <Image src={post.photoUrl} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                    <Heart className="h-5 w-5 fill-current text-red-500 mb-1" />
                    <span className="text-xs font-bold">{post.likeIds?.length || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/20 rounded-[3rem] border-4 border-dashed border-muted">
              <p className="text-muted-foreground font-bold mb-4">कोई पोस्ट नहीं मिली।</p>
              <Button onClick={() => router.push("/upload")} variant="default" className="rounded-full px-8">पहली फोटो अपलोड करें</Button>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
