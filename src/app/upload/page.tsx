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
import { useFirestore, useUser, useStorage } from "@/firebase"
import { collection, serverTimestamp, addDoc } from "firebase/firestore"
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
        const MAX_WIDTH = 1200
        const scaleSize = MAX_WIDTH / img.width
        canvas.width = MAX_WIDTH
        canvas.height = img.height * scaleSize
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.7))
      }
    })
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
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
    if (!SpeechRecognition) return
    const recognition = new SpeechRecognition()
    recognition.lang = 'hi-IN'
    recognition.onstart = () => { setIsListening(true); setActiveField(field) }
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript
      if (field === "title") setTitle(prev => prev + " " + text)
      else setDescription(prev => prev + " " + text)
    }
    recognition.onend = () => { setIsListening(false); setActiveField(null) }
    recognition.start()
  }

  const handlePost = async () => {
    if (!user || !image || !title || !description) {
      toast({ variant: "destructive", title: "अधूरा फॉर्म", description: "कृपया फोटो, शीर्षक और विवरण भरें।" });
      return;
    }

    if (!db || !storage) {
      toast({ variant: "destructive", title: "सिस्टम त्रुटि", description: "सर्वर सेवाएं तैयार नहीं हैं। कृपया पेज रिफ्रेश करें।" });
      return;
    }

    setIsPosting(true)
    try {
      const moderation = await moderateContent({ photoDataUri: image, title, description })
      if (!moderation.isAppropriate) {
        toast({ variant: "destructive", title: "पॉलिसी उल्लंघन", description: moderation.reason })
        setIsPosting(false)
        return
      }

      const storagePath = `posts/${user.uid}/${Date.now()}.jpg`
      const storageRef = ref(storage, storagePath)
      await uploadString(storageRef, image, 'data_url')
      const photoUrl = await getDownloadURL(storageRef)

      const postData = {
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0],
        photoUrl,
        title,
        description,
        likeIds: [],
        createdAt: serverTimestamp(),
      }
      
      await addDoc(collection(db, "posts"), postData)

      try {
        await fetch('/api/backup-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            ...postData, 
            createdAt: new Date().toISOString()
          })
        })
      } catch (backupError) {
        console.warn('MongoDB Sync delayed.')
      }

      toast({ title: "सफलता!", description: "आपकी फोटो पब्लिश हो गई है और सुरक्षित है!" })
      router.push("/")
    } catch (error: any) {
      toast({ variant: "destructive", title: "अपलोड विफल", description: error.message || "कुछ गलत हुआ।" })
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <div className="container max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-black font-headline mb-6">नई कला अपलोड करें</h1>
        <div className="space-y-6">
          <div 
            className="relative aspect-square w-full rounded-[2.5rem] border-4 border-dashed border-primary/20 bg-muted/30 flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={() => document.getElementById("imageInput")?.click()}
          >
            {image ? (
              <img src={image} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ImageIcon className="h-12 w-12" />
                <span className="font-bold text-xs uppercase">गैलरी से फोटो चुनें</span>
              </div>
            )}
            <input id="imageInput" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Input placeholder="शीर्षक (Title)" value={title} onChange={(e) => setTitle(e.target.value)} className="h-14 rounded-2xl" />
              <Button variant="outline" size="icon" className={cn("h-14 w-14 rounded-2xl", isListening && activeField === "title" && "bg-red-500 text-white")} onClick={() => startListening("title")}>
                <Mic className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Textarea placeholder="विवरण (Description)" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-2xl" />
              <Button variant="outline" size="icon" className={cn("h-14 w-14 rounded-2xl mt-auto", isListening && activeField === "description" && "bg-red-500 text-white")} onClick={() => startListening("description")}>
                <Mic className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <Button className="w-full h-16 text-lg font-black rounded-[2rem] shadow-xl" disabled={isPosting || !image} onClick={handlePost}>
            {isPosting ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />} पब्लिश करें
          </Button>

          <div className="p-4 bg-primary/5 rounded-3xl border border-primary/10 flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-primary shrink-0" />
            <p className="text-[10px] font-bold text-muted-foreground italic">आपका डेटा सुरक्षित है। हम Firebase और MongoDB दोनों में बैकअप रखते हैं।</p>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
