
"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useFirestore, useUser, useDoc, useCollection, useMemoFirebase } from "@/firebase"
import { doc, setDoc, collection, query, limit, serverTimestamp } from "firebase/firestore"
import { 
  Users, BarChart3, ShieldAlert, Code2, Settings2, Trash2, 
  CheckCircle2, AlertCircle, Save, Loader2 
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

  // Auth Protection: Check for specific admin email
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

  const postsQuery = useMemoFirebase(() => collection(db, "posts"), [db])
  const { data: allPosts } = useCollection(postsQuery)

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
            राज कुमार (Super Admin)
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-none shadow-md bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-blue-100 text-blue-600"><Users className="h-8 w-8" /></div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">कुल यूज़र</p>
                <p className="text-3xl font-bold">{allUsers?.length || 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-purple-100 text-purple-600"><BarChart3 className="h-8 w-8" /></div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">कुल पोस्ट</p>
                <p className="text-3xl font-bold">{allPosts?.length || 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-orange-100 text-orange-600"><ShieldAlert className="h-8 w-8" /></div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">एक्टिव मॉडरेशन</p>
                <p className="text-3xl font-bold">सक्रिय</p>
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

          {/* User Requests / Messages */}
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
                      <Badge variant="secondary" className="text-[10px]">NEW</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Bank: {u.bankAccount}</p>
                    <p className="text-xs text-muted-foreground">IFSC: {u.ifscCode}</p>
                    <p className="text-xs text-muted-foreground">GPay: {u.gpayNumber}</p>
                  </div>
                ))}
                {!allUsers?.some(u => u.bankAccount) && (
                  <p className="text-center text-muted-foreground py-8">कोई नई पेमेंट रिक्वेस्ट नहीं है।</p>
                )}
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
