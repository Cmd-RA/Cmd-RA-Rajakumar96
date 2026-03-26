
"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Image as ImageIcon, Sparkles, Send, ShieldAlert, Loader2, Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { suggestPhotoContent } from "@/ai/flows/post-caption-and-title-generation"
import { moderateContent } from "@/ai/flows/ai-powered-content-moderation"
import { useToast } from "@/hooks/use-toast"
import { useFirestore, useUser, addDocumentNonBlocking } from "@/firebase"
import { collection, serverTimestamp } from "firebase/firestore"
import { cn } from "@/lib/utils"

export default function UploadPage() {
  const [image, setImage] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [activeField, setActiveField] = useState<"title" | "description" | null>(null)
  
  const router = useRouter()
  const { toast } = useToast()
  const db = useFirestore()
  const { user } = useUser()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  // Voice to Text Feature
  const startListening = (field: "title" | "description") => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({ variant: "destructive", title: "सॉरी", description: "आपका ब्राउज़र वॉइस टाइपिंग सपोर्ट नहीं करता।" })
      return
    }

    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.lang = 'hi-IN'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsListening(true)
      setActiveField(field)
    }

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript
      if (field === "title") setTitle(prev => prev + " " + text)
      else setDescription(prev => prev + " " + text)
    }

    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => {
      setIsListening(false)
      setActiveField(null)
    }

    recognition.start()
  }

  const handlePost = async () => {
    if (!user) {
      toast({ variant: "destructive", title: "लॉगिन आवश्यक", description: "पोस्ट करने के लिए कृपया लॉगिन करें।" })
      router.push("/login")
      return
    }

    if (!image || !title || !description) {
      toast({ variant: "destructive", title: "अधूरा कंटेंट", description: "कृपया फोटो, शीर्षक और विवरण भरें।" })
      return
    }

    setIsPosting(true)
    try {
      const moderation = await moderateContent({ photoDataUri: image, title, description })

      if (!moderation.isAppropriate) {
        toast({ variant: "destructive", title: "ब्लॉक किया गया", description: moderation.reason || "नियमों के खिलाफ कंटेंट।" })
        return
      }

      const postsRef = collection(db, "posts")
      addDocumentNonBlocking(postsRef, {
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0],
        photoUrl: image,
        title,
        description,
        likeIds: [],
        commentIds: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      
      toast({ title: "सफलता!", description: "आपकी पोस्ट पब्लिश हो गई है।" })
      router.push("/")
    } catch (error) {
      toast({ variant: "destructive", title: "त्रुटि", description: "पोस्ट अपलोड करने में समस्या आई।" })
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <div className="container max-w-xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold font-headline">नया पोस्ट</h1>
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </Button>
        </div>
        
        <div className="space-y-6">
          <div 
            className="relative aspect-square w-full rounded-3xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 flex items-center justify-center overflow-hidden cursor-pointer group hover:border-primary/50 transition-all shadow-inner"
            onClick={() => document.getElementById("imageInput")?.click()}
          >
            {image ? (
              <img src={image} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-3 text-muted-foreground group-hover:text-primary">
                <div className="p-4 bg-background rounded-2xl shadow-sm"><ImageIcon className="h-10 w-10" /></div>
                <span className="font-bold">फोटो यहाँ अपलोड करें</span>
              </div>
            )}
            <input id="imageInput" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>

          <div className="space-y-5">
            <div className="space-y-2 relative">
              <label className="text-sm font-bold flex items-center gap-2">
                शीर्षक (Title)
                <button 
                  onClick={() => startListening("title")}
                  className={cn("p-1.5 rounded-full transition-colors", isListening && activeField === "title" ? "bg-red-500 text-white animate-pulse" : "bg-primary/10 text-primary")}
                >
                  {isListening && activeField === "title" ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
              </label>
              <Input 
                placeholder="क्या हो रहा है?" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            
            <div className="space-y-2 relative">
              <label className="text-sm font-bold flex items-center gap-2">
                विवरण (Description)
                <button 
                  onClick={() => startListening("description")}
                  className={cn("p-1.5 rounded-full transition-colors", isListening && activeField === "description" ? "bg-red-500 text-white animate-pulse" : "bg-primary/10 text-primary")}
                >
                  {isListening && activeField === "description" ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
              </label>
              <Textarea 
                placeholder="अपनी कहानी यहाँ लिखें..." 
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-xl resize-none"
              />
            </div>
          </div>

          <Button 
            className="w-full h-14 text-lg font-bold gap-2 rounded-2xl shadow-xl transition-all active:scale-95"
            disabled={isPosting || !image}
            onClick={handlePost}
          >
            {isPosting ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
            पब्लिश करें
          </Button>
          
          <div className="p-4 bg-primary/5 rounded-2xl flex items-start gap-3 border border-primary/10">
            <ShieldAlert className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>मोनेटाइजेशन सुरक्षा:</strong> आपकी फोटो को सीधे डाउनलोड नहीं किया जा सकता। एडमिन पैनल द्वारा इसे ट्रैक किया जाता है।
            </p>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
