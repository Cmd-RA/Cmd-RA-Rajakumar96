
"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Image as ImageIcon, Sparkles, Send, ShieldAlert, Loader2, Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { moderateContent } from "@/ai/flows/ai-powered-content-moderation"
import { useToast } from "@/hooks/use-toast"
import { useFirestore, useUser, addDocumentNonBlocking } from "@/firebase"
import { collection, serverTimestamp } from "firebase/firestore"
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
  const { user } = useUser()

  // Image Compression to save Firebase space (Keep it free!)
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
        resolve(canvas.toDataURL('image/jpeg', 0.7)) // 70% quality jpeg
      }
    })
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string)
        setImage(compressed)
      }
      reader.readAsDataURL(file)
    }
  }

  const startListening = (field: "title" | "description") => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({ variant: "destructive", title: "सॉरी", description: "वॉइस टाइपिंग सपोर्ट नहीं है।" })
      return
    }
    const recognition = new (window as any).webkitSpeechRecognition()
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
    if (!user) { router.push("/login"); return }
    if (!image || !title || !description) {
      toast({ variant: "destructive", title: "अधूरा कंटेंट", description: "कृपया फोटो और जानकारी भरें।" })
      return
    }

    setIsPosting(true)
    try {
      // Content Moderation via Genkit
      const moderation = await moderateContent({ photoDataUri: image, title, description })
      if (!moderation.isAppropriate) {
        toast({ variant: "destructive", title: "ब्लॉक किया गया", description: moderation.reason })
        setIsPosting(false)
        return
      }

      const postsRef = collection(db, "posts")
      await addDocumentNonBlocking(postsRef, {
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0],
        photoUrl: image,
        title,
        description,
        likeIds: [],
        createdAt: serverTimestamp(),
      })
      
      toast({ title: "सफलता!", description: "आपकी पोस्ट पब्लिश हो गई है।" })
      router.push("/")
    } catch (error) {
      toast({ variant: "destructive", title: "त्रुटि", description: "अपलोड में समस्या आई।" })
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <div className="container max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-black font-headline mb-6">नया पोस्ट बनाएँ</h1>
        
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
                <span className="font-black uppercase tracking-widest text-xs">फोटो चुनें (गैलरी)</span>
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
                />
                <Button 
                  variant="outline" 
                  size="icon" 
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
                />
                <Button 
                  variant="outline" 
                  size="icon" 
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
          
          <div className="p-5 bg-yellow-400/10 rounded-3xl flex items-start gap-4 border border-yellow-400/20">
            <ShieldAlert className="h-6 w-6 text-yellow-600 shrink-0" />
            <p className="text-[11px] font-bold text-yellow-800 leading-relaxed italic">
              <strong>महत्वपूर्ण:</strong> केवल ओरिजिनल फोटो ही अपलोड करें। चोरी की गई फोटो पाए जाने पर अकाउंट मोनेटाइज नहीं होगा।
            </p>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
