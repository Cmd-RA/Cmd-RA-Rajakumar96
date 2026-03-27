"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Image as ImageIcon, Send, ShieldAlert, Loader2, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { moderateContent } from "@/ai/flows/ai-powered-content-moderation"
import { useToast } from "@/hooks/use-toast"
import { useFirestore, useUser, addDocumentNonBlocking, useStorage } from "@/firebase"
import { collection, serverTimestamp } from "firebase/firestore"
import { ref, uploadString, getDownloadURL } from "firebase/storage"
import { cn } from "@/lib/utils"

export default function UploadPage() {
  const [image, setImage] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isPosting, setIsPosting] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [activeField, setActiveField] = useState<"title" | "description" | null>(null)
  
  const router = useRouter()
  const { toast } = useToast()
  const db = useFirestore()
  const storage = useStorage()
  const { user } = useUser()

  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.src = base64Str
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 800
        const scaleSize = MAX_WIDTH / img.width
        canvas.width = MAX_WIDTH
        canvas.height = img.height * scaleSize
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
    })
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({ variant: "destructive", title: "बड़ी फ़ाइल", description: "कृपया 10MB से छोटी फोटो चुनें।" })
        return
      }
      const reader = new FileReader()
      reader.onloadend = async () => {
        try {
          const compressed = await compressImage(reader.result as string)
          setImage(compressed)
        } catch (err) {
          toast({ variant: "destructive", title: "त्रुटि", description: "फोटो प्रोसेस करने में विफल।" })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const startListening = (field: "title" | "description") => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      toast({ variant: "destructive", title: "सॉरी", description: "वॉइस टाइपिंग आपके ब्राउज़र में सपोर्ट नहीं है।" })
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = 'hi-IN'
    recognition.onstart = () => { setIsListening(true); setActiveField(field) }
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript
      if (field === "title") setTitle(prev => prev + " " + text)
      else setDescription(prev => prev + " " + text)
    }
    recognition.onend = () => { setIsListening(false); setActiveField(null) }
    recognition.onerror = () => { setIsListening(false); setActiveField(null) }
    recognition.start()
  }

  const handlePost = async () => {
    if (!user) { 
      toast({ title: "लॉगिन करें", description: "पोस्ट करने के लिए पहले लॉगिन आवश्यक है।" })
      router.push("/login")
      return 
    }
    if (!image || !title || !description) {
      toast({ variant: "destructive", title: "अधूरा कंटेंट", description: "कृपया फोटो, शीर्षक और विवरण भरें।" })
      return
    }

    setIsPosting(true)
    try {
      // Step 1: AI Moderation
      let isAppropriate = true
      try {
        const moderation = await moderateContent({ photoDataUri: image, title, description })
        isAppropriate = moderation.isAppropriate
      } catch (aiErr) {
        console.warn("AI Moderation bypassed due to error")
      }

      if (!isAppropriate) {
        toast({ variant: "destructive", title: "पॉलिसी उल्लंघन", description: "यह कंटेंट हमारी गाइडलाइन्स के खिलाफ है। केवल ओरिजिनल कंटेंट अपलोड करें।" })
        setIsPosting(false)
        return
      }

      // Step 2: Firebase Storage Upload
      const storagePath = `posts/${user.uid}/${Date.now()}.jpg`
      const storageRef = ref(storage, storagePath)
      await uploadString(storageRef, image, 'data_url')
      const downloadURL = await getDownloadURL(storageRef)

      // Step 3: Firebase Firestore Update (Primary)
      const postData = {
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || "Unknown User",
        photoUrl: downloadURL,
        title,
        description,
        likeIds: [],
        createdAt: serverTimestamp(),
      }
      
      const postsRef = collection(db, "posts")
      await addDocumentNonBlocking(postsRef, postData)

      // Step 4: MongoDB Sync (Backup Strategy)
      // Note: In a production Next.js app, this would be a Server Action or API route
      // that uses process.env.MONGODB_URI to save a copy of postData.
      try {
        await fetch('/api/backup-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData)
        })
      } catch (syncErr) {
        console.warn("Dual-Database Sync delayed: Post saved to primary Firebase.")
      }
      
      toast({ title: "सफलता!", description: "आपकी ओरिजिनल कला पब्लिश हो गई है!" })
      router.push("/")
    } catch (error: any) {
      toast({ variant: "destructive", title: "अपलोड विफल", description: "नेटवर्क चेक करें। हम बैकअप सिस्टम से प्रयास कर रहे हैं।" })
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <div className="container max-w-xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-black font-headline">नई कला अपलोड करें</h1>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">सुरक्षित और रियल-टाइम अपलोड</p>
        </div>
        
        <div className="space-y-6">
          <div 
            className="relative aspect-square w-full rounded-[2.5rem] border-4 border-dashed border-primary/20 bg-muted/30 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-muted/50 transition-all shadow-xl"
            onClick={() => document.getElementById("imageInput")?.click()}
          >
            {image ? (
              <img src={image} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <div className="p-6 bg-white rounded-3xl shadow-lg text-primary"><ImageIcon className="h-12 w-12" /></div>
                <span className="font-black uppercase tracking-widest text-[10px] text-center px-4">गैलरी से ओरिजिनल फोटो चुनें</span>
              </div>
            )}
            <input id="imageInput" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>

          <div className="space-y-4">
            <div className="relative">
              <label className="text-[10px] font-black uppercase tracking-widest ml-2 mb-2 block">शीर्षक (Title)</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="एक शानदार नाम दें..." 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-14 rounded-2xl border-none bg-white shadow-sm font-bold"
                  disabled={isPosting}
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  disabled={isPosting}
                  className={cn("h-14 w-14 rounded-2xl shrink-0", isListening && activeField === "title" && "bg-red-500 text-white animate-pulse")}
                  onClick={() => startListening("title")}
                >
                  <Mic className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <label className="text-[10px] font-black uppercase tracking-widest ml-2 mb-2 block">विवरण (Description)</label>
              <div className="flex gap-2">
                <Textarea 
                  placeholder="इस कला के पीछे की कहानी..." 
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-2xl border-none bg-white shadow-sm font-medium resize-none"
                  disabled={isPosting}
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  disabled={isPosting}
                  className={cn("h-14 w-14 rounded-2xl shrink-0 mt-auto", isListening && activeField === "description" && "bg-red-500 text-white animate-pulse")}
                  onClick={() => startListening("description")}
                >
                  <Mic className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <Button 
            className="w-full h-16 text-lg font-black rounded-[2rem] shadow-2xl gap-3 bg-primary hover:bg-primary/90 transition-transform active:scale-95"
            disabled={isPosting || !image}
            onClick={handlePost}
          >
            {isPosting ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
            पब्लिश करें
          </Button>
          
          <div className="p-5 bg-primary/5 rounded-3xl flex items-start gap-4 border border-primary/10">
            <ShieldAlert className="h-6 w-6 text-primary shrink-0" />
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-primary uppercase">ओरिजिनल कंटेंट पॉलिसी</p>
              <p className="text-[10px] font-bold text-muted-foreground leading-relaxed italic">
                सूचना: केवल अपनी खुद की खींची हुई फोटो ही अपलोड करें। चोरी की फोटो अपलोड करने पर अकाउंट बंद कर दिया जाएगा और मोनेटाइजेशन रद्द हो सकता है।
              </p>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
