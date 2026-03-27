"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { 
  Trophy, LayoutGrid, DollarSign, PlusCircle, UserCircle,
  LogOut, Loader2, Landmark, Save, AlertTriangle, CheckCircle2, ShieldCheck, MessageCircle, ExternalLink, 
  Settings2, FileText, ShieldAlert, Heart, Info, Camera
} from "lucide-react"
import { useUser, useFirestore, useCollection, useMemoFirebase, useAuth, useDoc } from "@/firebase"
import { collection, query, where, orderBy, doc, setDoc, serverTimestamp } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { signOut, updateProfile } from "firebase/auth"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function ProfilePage() {
  const { user, isUserLoading } = useUser()
  const db = useFirestore()
  const auth = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [profileInfo, setProfileInfo] = useState({
    name: "",
    bio: "",
    photoUrl: ""
  })
  const [bankInfo, setBankInfo] = useState({
    bankAccount: "",
    ifscCode: "",
    gpayNumber: ""
  })
  const [isUpdating, setIsUpdating] = useState(false)

  const userDocRef = useMemoFirebase(() => (user && db) ? doc(db, "users", user.uid) : null, [db, user])
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
      setProfileInfo({
        name: profileData.name || user?.displayName || "",
        bio: profileData.bio || "",
        photoUrl: profileData.profilePhotoUrl || user?.photoURL || ""
      })
      setBankInfo({
        bankAccount: profileData.bankAccount || "",
        ifscCode: profileData.ifscCode || "",
        gpayNumber: profileData.gpayNumber || ""
      })
    }
  }, [profileData, user])

  const handleUpdateProfile = async () => {
    if (!userDocRef || !auth?.currentUser) return
    setIsUpdating(true)
    try {
      // Update Firebase Auth Profile
      await updateProfile(auth.currentUser, {
        displayName: profileInfo.name,
        photoURL: profileInfo.photoUrl
      })

      // Update Firestore User Doc
      await setDoc(userDocRef, {
        name: profileInfo.name,
        bio: profileInfo.bio,
        profilePhotoUrl: profileInfo.photoUrl,
        updatedAt: serverTimestamp()
      }, { merge: true })

      toast({ title: "सफलता", description: "आपकी प्रोफाइल अपडेट कर दी गई है।" })
      setIsEditing(false)
    } catch (e) {
      toast({ variant: "destructive", title: "त्रुटि", description: "अपडेट करने में विफल।" })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleUpdateBank = async () => {
    if (!userDocRef) return
    setIsUpdating(true)
    try {
      await setDoc(userDocRef, {
        ...bankInfo,
        updatedAt: serverTimestamp()
      }, { merge: true })
      toast({ title: "सफलता", description: "पेमेंट जानकारी सुरक्षित कर दी गई है।" })
    } catch (e) {
      toast({ variant: "destructive", title: "त्रुटि", description: "सुरक्षित करने में विफल।" })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth)
      router.push("/login")
    }
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
        
        {/* User Ecosystem Header */}
        <div className="flex flex-col items-center pt-8 pb-8 border-b bg-white/50 backdrop-blur-sm rounded-[3rem] shadow-sm mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/10 to-accent/10 -z-10" />
          
          <div className="relative mb-6">
            <div className="h-32 w-32 rounded-full ring-4 ring-primary/20 overflow-hidden shadow-2xl bg-muted group cursor-pointer">
              <img 
                src={profileInfo.photoUrl || `https://picsum.photos/seed/${user.uid}/200`} 
                alt="Profile" 
                className="h-full w-full object-cover transition-transform group-hover:scale-110"
              />
              {!isEditing && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setIsEditing(true)}>
                  <Camera className="text-white h-8 w-8" />
                </div>
              )}
            </div>
            {isMonetized && (
              <div className="absolute -bottom-1 -right-1 bg-primary text-white p-2 rounded-full border-4 border-background shadow-lg">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            )}
          </div>

          <div className="text-center px-6">
            <h1 className="text-3xl font-black font-headline flex items-center justify-center gap-2">
              {profileInfo.name || user.email?.split('@')[0]}
              {isMonetized && <ShieldCheck className="h-6 w-6 text-primary" />}
            </h1>
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mt-2 bg-muted/50 px-3 py-1 rounded-full inline-block">
              CREATOR ID: {user.uid.substring(0, 8)}
            </p>
            {profileInfo.bio ? (
              <p className="mt-4 text-sm font-medium text-muted-foreground italic leading-relaxed max-w-xs mx-auto">
                "{profileInfo.bio}"
              </p>
            ) : (
              <button onClick={() => setIsEditing(true)} className="mt-4 text-[10px] font-black text-primary uppercase border-b border-primary/20 pb-0.5">
                + अपना बायो लिखें
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-8 w-full mt-10 px-8">
            <div className="text-center">
              <p className="font-black text-2xl text-primary">{posts?.length || 0}</p>
              <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">पोस्ट</p>
            </div>
            <div className="text-center border-x">
              <p className="font-black text-2xl text-primary">{followerCount}</p>
              <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">फॉलोअर्स</p>
            </div>
            <div className="text-center">
              <p className="font-black text-2xl text-primary">{totalLikes}</p>
              <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">लाइक</p>
            </div>
          </div>

          <div className="flex gap-3 w-full px-6 mt-8">
            <Button 
              variant={isEditing ? "outline" : "default"}
              className="flex-1 rounded-2xl h-14 font-black text-md shadow-xl gap-2" 
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <Save className="h-5 w-5" /> : <Settings2 className="h-5 w-5" />}
              {isEditing ? "संपादन बंद करें" : "प्रोफ़ाइल सुधारें"}
            </Button>
            <Button variant="outline" className="rounded-2xl h-14 w-14 border-destructive/20 text-destructive hover:bg-destructive/5" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Profile Editing Form */}
        {isEditing && (
          <Card className="mb-8 border-none shadow-2xl rounded-[2.5rem] bg-primary/5 animate-in fade-in slide-in-from-top-4 duration-500">
            <CardHeader>
              <CardTitle className="text-lg font-black uppercase flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-primary" /> अपनी जानकारी बदलें
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground ml-2">आपका नाम</label>
                <Input 
                  className="rounded-2xl h-12 bg-white border-none font-bold"
                  value={profileInfo.name}
                  onChange={(e) => setProfileInfo({...profileInfo, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground ml-2">प्रोफाइल फोटो URL (Link)</label>
                <Input 
                  className="rounded-2xl h-12 bg-white border-none font-bold"
                  placeholder="https://images.unsplash.com/..."
                  value={profileInfo.photoUrl}
                  onChange={(e) => setProfileInfo({...profileInfo, photoUrl: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground ml-2">आपके बारे में (Bio)</label>
                <Textarea 
                  className="rounded-2xl bg-white border-none font-medium resize-none"
                  rows={3}
                  value={profileInfo.bio}
                  onChange={(e) => setProfileInfo({...profileInfo, bio: e.target.value})}
                />
              </div>
              <Button className="w-full h-12 rounded-xl font-black gap-2" onClick={handleUpdateProfile} disabled={isUpdating}>
                {isUpdating ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                प्रोफ़ाइल सेव करें
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Support Ecosystem */}
        <Card className="mb-8 border-none shadow-2xl bg-[#0088cc]/10 overflow-hidden rounded-[2.5rem] border-2 border-[#0088cc]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#0088cc] rounded-2xl text-white shadow-lg">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-[#0088cc] uppercase tracking-tight">24/7 सहायता केंद्र</h3>
                  <p className="text-[11px] font-bold text-muted-foreground italic">टेलीग्राम ग्रुप ज्वाइन करें और सीधे एडमिन से बात करें।</p>
                </div>
              </div>
              <a href="https://t.me/srbis" target="_blank" rel="noopener noreferrer">
                <Button className="bg-[#0088cc] hover:bg-[#006699] text-white rounded-xl h-10 px-4 font-black text-xs gap-2 shadow-lg">
                  JOIN NOW <ExternalLink className="h-3 w-3" />
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Monetization Ecosystem */}
        <div className="space-y-6">
          <Card className="border-none shadow-2xl bg-gradient-to-br from-primary/10 via-background to-accent/5 overflow-hidden rounded-[2.5rem]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2 font-black uppercase">
                  <DollarSign className="h-5 w-5 text-primary" /> मोनेटाइजेशन प्रोग्रेस
                </CardTitle>
                <Badge variant={isMonetized ? "default" : "secondary"} className="rounded-full px-4 font-black">
                  {isMonetized ? "ACTIVE" : "LEARNING"}
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
                
                <div className="p-4 bg-white/50 rounded-2xl border border-primary/10 space-y-3">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-[11px] font-black uppercase text-primary">कमाई के मुख्य नियम:</p>
                      <ul className="text-[10px] font-bold text-muted-foreground space-y-1">
                        <li>• कम से कम 1,000 फॉलोअर्स होना अनिवार्य है।</li>
                        <li>• आपकी सभी फोटो असली और आपकी स्वयं की होनी चाहिए।</li>
                        <li>• अश्लील या आपत्तिजनक फोटो अपलोड करने पर अकाउंट बंद हो सकता है।</li>
                        <li>• विज्ञापनों (Ads) के प्रदर्शन पर आपको भुगतान मिलेगा।</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Ecosystem */}
          <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden border-t-4 border-primary">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-lg flex items-center gap-2 font-black uppercase tracking-tight">
                <Landmark className="h-5 w-5 text-primary" /> पेमेंट सेटिंग्स (Earnings)
              </CardTitle>
              <CardDescription className="text-[10px] font-bold">कमाई सीधे अपने बैंक या GPay में प्राप्त करने के लिए जानकारी भरें।</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">बैंक अकाउंट नंबर</label>
                <Input 
                  className="rounded-2xl h-12 bg-muted/30 border-none px-6 font-bold focus:ring-2 ring-primary/20"
                  placeholder="0000 0000 0000 0000" 
                  value={bankInfo.bankAccount}
                  onChange={(e) => setBankInfo({...bankInfo, bankAccount: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">IFSC कोड</label>
                <Input 
                  className="rounded-2xl h-12 bg-muted/30 border-none px-6 font-bold focus:ring-2 ring-primary/20"
                  placeholder="SBIN0000000" 
                  value={bankInfo.ifscCode}
                  onChange={(e) => setBankInfo({...bankInfo, ifscCode: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">गूगल पे नंबर (GPay)</label>
                <Input 
                  className="rounded-2xl h-12 bg-muted/30 border-none px-6 font-bold focus:ring-2 ring-primary/20"
                  placeholder="+91 00000 00000" 
                  value={bankInfo.gpayNumber}
                  onChange={(e) => setBankInfo({...bankInfo, gpayNumber: e.target.value})}
                />
              </div>
              <Button className="w-full gap-2 rounded-2xl h-14 text-md font-black shadow-lg bg-primary hover:scale-[1.02] transition-transform" onClick={handleUpdateBank} disabled={isUpdating}>
                {isUpdating ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
                डेटाबेस में सुरक्षित करें
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* User Gallery Ecosystem */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="font-black font-headline text-2xl flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full"><LayoutGrid className="h-5 w-5 text-primary" /></div>
              आपकी गैलरी
            </h2>
            <Link href="/upload">
              <Button variant="outline" size="sm" className="rounded-full gap-2 font-black text-[10px] uppercase border-primary/20">
                <PlusCircle className="h-3 w-3" /> नई फोटो
              </Button>
            </Link>
          </div>
          
          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {posts.map((post: any) => (
                <div key={post.id} className="aspect-square relative group cursor-pointer overflow-hidden rounded-[1.5rem] bg-muted shadow-md border-2 border-transparent hover:border-primary/30 transition-all">
                  <Image src={post.photoUrl} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex items-center gap-1 text-white font-black text-xs">
                      <Heart className="h-3 w-3 fill-current" /> {post.likeIds?.length || 0}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/10 rounded-[3rem] border-4 border-dashed border-muted">
              <p className="text-muted-foreground font-black mb-6 uppercase tracking-widest text-xs">अभी कोई पोस्ट नहीं है</p>
              <Button onClick={() => router.push("/upload")} variant="secondary" className="rounded-full px-8 font-black shadow-md">पहली फोटो डालें</Button>
            </div>
          )}
        </div>

        {/* Policies Ecosystem */}
        <div className="mt-16 pt-8 border-t space-y-4">
          <h3 className="font-black uppercase text-xs text-muted-foreground tracking-widest text-center">कानूनी और सुरक्षा (Legal & Safety)</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/privacy">
              <Button variant="outline" className="w-full rounded-2xl h-12 text-[10px] font-black uppercase gap-2 hover:bg-primary/5">
                <ShieldAlert className="h-4 w-4 text-primary" /> गोपनीयता नीति
              </Button>
            </Link>
            <Link href="/terms">
              <Button variant="outline" className="w-full rounded-2xl h-12 text-[10px] font-black uppercase gap-2 hover:bg-primary/5">
                <FileText className="h-4 w-4 text-primary" /> नियम और शर्तें
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
