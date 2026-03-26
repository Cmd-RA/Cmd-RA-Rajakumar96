
"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useFirestore, useUser, useDoc, useCollection, useMemoFirebase } from "@/firebase"
import { doc, setDoc, collection, query, orderBy, serverTimestamp, deleteDoc } from "firebase/firestore"
import { 
  Users, ShieldAlert, Code2, Save, Loader2, Video as VideoIcon, Plus, Trash2, Link as LinkIcon, Info, Play
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const { user, isUserLoading } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  const router = useRouter()
  
  const [adsenseCode, setAdsenseCode] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  
  // Video Form State
  const [videoTitle, setVideoTitle] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [isAddingVideo, setIsAddingVideo] = useState(false)

  // Auth Protection - Main Admin ONLY
  useEffect(() => {
    if (!isUserLoading && (!user || user.email !== "rajahribabakumar@gmail.com")) {
      toast({ variant: "destructive", title: "पहुंच अस्वीकृत", description: "केवल मुख्य एडमिन ही इस पेज को देख सकता है।" })
      router.push("/")
    }
  }, [user, isUserLoading, router, toast])

  const settingsDocRef = useMemoFirebase(() => doc(db, "app_settings", "global"), [db])
  const { data: settings } = useDoc(settingsDocRef)
  
  const usersQuery = useMemoFirebase(() => collection(db, "users"), [db])
  const { data: allUsers } = useCollection(usersQuery)

  const videosQuery = useMemoFirebase(() => query(collection(db, "videos"), orderBy("createdAt", "desc")), [db])
  const { data: allVideos } = useCollection(videosQuery)

  useEffect(() => {
    if (settings?.adsenseCode) setAdsenseCode(settings.adsenseCode)
  }, [settings])

  const saveAdsense = async () => {
    setIsSaving(true)
    try {
      await setDoc(settingsDocRef, { 
        adsenseCode, 
        updatedAt: serverTimestamp() 
      }, { merge: true })
      toast({ title: "सफलता", description: "AdSense कोड अपडेट कर दिया गया है।" })
    } catch (e) {
      toast({ variant: "destructive", title: "त्रुटि", description: "सेव करने में विफल।" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddVideo = async () => {
    if (!videoTitle || !videoUrl) {
      toast({ variant: "destructive", title: "त्रुटि", description: "शीर्षक और लिंक भरें।" })
      return
    }
    setIsAddingVideo(true)
    try {
      const newVideoRef = doc(collection(db, "videos"))
      await setDoc(newVideoRef, {
        id: newVideoRef.id,
        title: videoTitle,
        videoUrl: videoUrl,
        type: videoUrl.includes("youtube") || videoUrl.includes("youtu.be") ? "youtube" : "direct",
        createdAt: serverTimestamp()
      })
      toast({ title: "सफलता", description: "वीडियो प्लेलिस्ट में जोड़ दिया गया है।" })
      setVideoTitle(""); setVideoUrl("")
    } catch (e) {
      toast({ variant: "destructive", title: "त्रुटि", description: "वीडियो जोड़ने में विफल।" })
    } finally {
      setIsAddingVideo(false)
    }
  }

  const handleDeleteVideo = async (id: string) => {
    try {
      await deleteDoc(doc(db, "videos", id))
      toast({ title: "सफलता", description: "वीडियो हटा दिया गया है।" })
    } catch (e) {
      toast({ variant: "destructive", title: "त्रुटि", description: "हटाने में विफल।" })
    }
  }

  if (isUserLoading || !user) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <div className="container max-w-6xl mx-auto p-4 pt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black font-headline text-primary tracking-tighter">एडमिन कंट्रोल सेंटर</h1>
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">मुख्य मालिक: राज कुमार</p>
          </div>
          <Badge className="px-6 py-2 rounded-2xl bg-primary text-white font-black shadow-lg">
            OWNER ACCESS
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* AdSense Manager */}
          <Card className="lg:col-span-2 border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="bg-primary/5 p-8 border-b border-primary/10">
              <CardTitle className="flex items-center gap-3 text-2xl font-black">
                <Code2 className="text-primary h-8 w-8" /> Google AdSense विज्ञापन प्रबंधन
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">गूगल एडसेंस कोड यहाँ डालें (Embed Code)</label>
                <textarea 
                  className="w-full h-64 p-6 text-sm font-mono bg-muted/30 rounded-3xl border-none focus:ring-4 ring-primary/10 outline-none resize-none"
                  placeholder="<script async src='...'></script>"
                  value={adsenseCode}
                  onChange={(e) => setAdsenseCode(e.target.value)}
                />
              </div>
              <Button className="w-full h-16 rounded-[1.5rem] text-lg font-black gap-2 shadow-xl" onClick={saveAdsense} disabled={isSaving}>
                {isSaving ? <Loader2 className="animate-spin h-6 w-6" /> : <Save className="h-6 w-6" />}
                पूरे प्लेटफॉर्म पर विज्ञापन पब्लिश करें
              </Button>
            </CardContent>
          </Card>

          {/* User Stats Card */}
          <Card className="border-none shadow-2xl rounded-[2.5rem] bg-gradient-to-br from-primary to-accent text-white p-2">
             <CardContent className="p-8 flex flex-col justify-between h-full">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <Users className="h-10 w-10 opacity-50" />
                    <Info className="h-6 w-6 opacity-50" />
                  </div>
                  <div>
                    <p className="text-6xl font-black">{allUsers?.length || 0}</p>
                    <p className="text-sm font-bold uppercase tracking-widest opacity-80">कुल पंजीकृत यूज़र्स</p>
                  </div>
                </div>
                <div className="p-6 bg-white/10 rounded-3xl border border-white/20 mt-8">
                  <p className="text-xs font-bold leading-relaxed">
                    सूचना: मुद्रीकरण के लिए यूज़र्स के बैंक डेटा और फॉलोअर्स को यहाँ से ट्रैक करें।
                  </p>
                </div>
             </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Video Add Section */}
           <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-black">
                <VideoIcon className="text-primary h-6 w-6" /> होम प्लेलिस्ट मैनेजमेंट
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground">वीडियो का शीर्षक</label>
                <Input className="rounded-2xl h-12 bg-muted/30 border-none font-bold" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground">वीडियो लिंक (YT/MP4/Embed)</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-12 rounded-2xl h-12 bg-muted/30 border-none font-bold" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
                </div>
              </div>
              <Button className="w-full h-14 rounded-2xl font-black gap-2" onClick={handleAddVideo} disabled={isAddingVideo}>
                {isAddingVideo ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus className="h-4 w-4" />}
                होम पेज पर लाइव करें
              </Button>

              <div className="mt-8 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">मौजूदा वीडियो</p>
                {allVideos?.map((v: any) => (
                  <div key={v.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border">
                    <div className="flex items-center gap-3">
                      <Play className="h-4 w-4 text-primary" />
                      <p className="text-xs font-bold truncate max-w-[120px]">{v.title}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteVideo(v.id)} className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Requests / Table */}
          <Card className="lg:col-span-2 border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
             <CardHeader>
               <CardTitle className="text-xl font-black uppercase tracking-tight">यूज़र पेमेंट और मुद्रीकरण डेटा</CardTitle>
             </CardHeader>
             <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="font-black px-6">क्रिएटर</TableHead>
                      <TableHead className="font-black">पेमेंट जानकारी</TableHead>
                      <TableHead className="font-black text-right px-6">फॉलोअर्स</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allUsers?.map((u: any) => (
                      <TableRow key={u.id}>
                        <TableCell className="px-6">
                           <p className="font-bold text-sm">{u.name}</p>
                           <p className="text-[9px] text-muted-foreground uppercase">{u.email}</p>
                        </TableCell>
                        <TableCell className="text-xs space-y-1">
                          {u.bankAccount || u.gpayNumber ? (
                            <>
                              <p className="font-bold">A/C: {u.bankAccount || "N/A"}</p>
                              <p className="text-muted-foreground">IFSC: {u.ifscCode || "N/A"}</p>
                              <p className="text-primary font-bold">GPay: {u.gpayNumber || "N/A"}</p>
                            </>
                          ) : (
                            <p className="italic text-muted-foreground">कोई डेटा नहीं</p>
                          )}
                        </TableCell>
                        <TableCell className="text-right px-6">
                           <Badge variant={u.followerCount >= 1000 ? "default" : "secondary"}>
                             {u.followerCount || 0}
                           </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
             </CardContent>
          </Card>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
