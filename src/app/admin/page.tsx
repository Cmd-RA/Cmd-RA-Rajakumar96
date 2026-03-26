
"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useFirestore, useUser, useDoc, useCollection, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase"
import { doc, setDoc, collection, query, orderBy, serverTimestamp } from "firebase/firestore"
import { 
  Users, BarChart3, ShieldAlert, Code2, Settings2, Trash2, 
  CheckCircle2, AlertCircle, Save, Loader2, Video, Plus, Link as LinkIcon
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
  const [videoDesc, setVideoDesc] = useState("")
  const [isAddingVideo, setIsAddingVideo] = useState(false)

  // Auth Protection
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
      toast({ title: "सफलता", description: "AdSense कोड सुरक्षित कर लिया गया है।" })
    } catch (e) {
      toast({ variant: "destructive", title: "त्रुटि", description: "सेव करने में विफल।" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddVideo = async () => {
    if (!videoTitle || !videoUrl) {
      toast({ variant: "destructive", title: "त्रुटि", description: "शीर्षक और लिंक अनिवार्य हैं।" })
      return
    }

    setIsAddingVideo(true)
    const isYoutube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")
    
    try {
      await addDocumentNonBlocking(collection(db, "videos"), {
        title: videoTitle,
        videoUrl: videoUrl,
        description: videoDesc,
        type: isYoutube ? "youtube" : "direct",
        createdAt: serverTimestamp()
      })
      toast({ title: "सफलता", description: "वीडियो प्लेलिस्ट में जोड़ दिया गया है।" })
      setVideoTitle("")
      setVideoUrl("")
      setVideoDesc("")
    } catch (e) {
      toast({ variant: "destructive", title: "त्रुटि", description: "वीडियो जोड़ने में विफल।" })
    } finally {
      setIsAddingVideo(false)
    }
  }

  const handleDeleteVideo = (id: string) => {
    deleteDocumentNonBlocking(doc(db, "videos", id))
    toast({ title: "हटाया गया", description: "वीडियो प्लेलिस्ट से हटा दिया गया है।" })
  }

  if (isUserLoading || !user) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <div className="container max-w-6xl mx-auto p-4 pt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-headline text-primary">एडमिन डैशबोर्ड</h1>
            <p className="text-muted-foreground">राज कुमार - मुख्य नियंत्रण केंद्र</p>
          </div>
          <Badge className="px-4 py-1 text-sm bg-primary/20 text-primary border-primary">
            Super Admin
          </Badge>
        </div>

        {/* Video Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-1 border-none shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Video className="text-primary" /> नया वीडियो जोड़ें
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">वीडियो शीर्षक</label>
                <Input placeholder="वीडियो का नाम..." value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">वीडियो लिंक (YouTube/MP4)</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-10" placeholder="https://..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">विवरण (Optional)</label>
                <Textarea placeholder="वीडियो के बारे में..." value={videoDesc} onChange={(e) => setVideoDesc(e.target.value)} />
              </div>
              <Button className="w-full gap-2" onClick={handleAddVideo} disabled={isAddingVideo}>
                {isAddingVideo ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus className="h-4 w-4" />}
                प्लेलिस्ट में जोड़ें
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 border-none shadow-md overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">वीडियो प्लेलिस्ट</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[400px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>वीडियो</TableHead>
                      <TableHead>टाइप</TableHead>
                      <TableHead className="text-right">एक्शन</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allVideos?.map((v: any) => (
                      <TableRow key={v.id}>
                        <TableCell className="font-medium max-w-[200px] truncate">{v.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="uppercase text-[10px]">{v.type}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteVideo(v.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!allVideos || allVideos.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">कोई वीडियो नहीं है।</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* AdSense Manager */}
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="text-primary" /> Google AdSense कोड
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea 
                className="w-full h-48 p-4 text-xs font-mono bg-muted rounded-xl border focus:ring-2 ring-primary/20 outline-none"
                placeholder="Paste your AdSense <script> here..."
                value={adsenseCode}
                onChange={(e) => setAdsenseCode(e.target.value)}
              />
              <div className="flex gap-2">
                <Button className="flex-1 gap-2" onClick={saveAdsense} disabled={isSaving}>
                  {isSaving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                  कोड सेव करें
                </Button>
                <Button variant="outline" className="text-destructive" onClick={() => setAdsenseCode("")}>
                  क्लियर
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* User Payment Requests */}
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="text-primary" /> पेमेंट रिक्वेस्ट (Bank Info)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[300px] overflow-auto pr-2">
                {allUsers?.filter(u => u.bankAccount).map((u: any) => (
                  <div key={u.id} className="p-4 bg-muted/30 rounded-xl border border-border">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-sm">{u.name}</p>
                      <Badge variant="secondary" className="text-[10px]">VERIFIED</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Bank: {u.bankAccount}</p>
                    <p className="text-xs text-muted-foreground">IFSC: {u.ifscCode}</p>
                    <p className="text-xs text-muted-foreground">GPay: {u.gpayNumber}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management Table */}
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle>यूज़र मैनेजमेंट</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>नाम</TableHead>
                  <TableHead>ईमेल</TableHead>
                  <TableHead>मोनेटाइजेशन</TableHead>
                  <TableHead className="text-right">एक्शन</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allUsers?.map((u: any) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-bold">{u.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <Badge variant={u.monetizationEnabled ? "default" : "secondary"}>
                        {u.monetizationEnabled ? "सक्रिय" : "अयोग्य"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <BottomNav />
    </div>
  )
}
