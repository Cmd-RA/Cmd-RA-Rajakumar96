"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Camera, Image as ImageIcon, Sparkles, Send, ShieldAlert, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { suggestPhotoContent } from "@/ai/flows/post-caption-and-title-generation"
import { moderateContent } from "@/ai/flows/ai-powered-content-moderation"
import { useToast } from "@/hooks/use-toast"

export default function UploadPage() {
  const [image, setImage] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateAIContent = async () => {
    if (!image) return
    setIsGenerating(true)
    try {
      const result = await suggestPhotoContent({
        photoDataUri: image,
        userPrompt: "इस फोटो के लिए एक बहुत ही आकर्षक और हिंदी में शीर्षक और विवरण लिखें।"
      })
      setTitle(result.suggestedTitle)
      setDescription(result.suggestedDescription)
      toast({
        title: "AI ने सुझाव दिया!",
        description: "आपके फोटो के लिए बेहतरीन शीर्षक और विवरण तैयार है।",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "त्रुटि",
        description: "AI सुझाव जनरेट करने में विफल रहा।",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePost = async () => {
    if (!image || !title || !description) {
      toast({
        variant: "destructive",
        title: "अधूरा कंटेंट",
        description: "कृपया फोटो, शीर्षक और विवरण भरें।",
      })
      return
    }

    setIsPosting(true)
    try {
      // Moderate content
      const moderation = await moderateContent({
        photoDataUri: image,
        title,
        description
      })

      if (!moderation.isAppropriate) {
        toast({
          variant: "destructive",
          title: "कंटेंट ब्लॉक किया गया",
          description: moderation.reason || "यह कंटेंट हमारे नियमों के खिलाफ है।",
        })
        return
      }

      // Simulate post upload
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "सफलता!",
        description: "आपकी पोस्ट सफलतापूर्वक अपलोड कर दी गई है।",
      })
      router.push("/")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "त्रुटि",
        description: "पोस्ट अपलोड करने में समस्या आई।",
      })
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <div className="container max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-bold font-headline mb-6">नया पोस्ट बनाएँ</h1>
        
        <div className="space-y-6">
          {/* Image Upload Area */}
          <div 
            className="relative aspect-square w-full rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 flex items-center justify-center overflow-hidden cursor-pointer group hover:border-primary/50 transition-colors"
            onClick={() => document.getElementById("imageInput")?.click()}
          >
            {image ? (
              <img src={image} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                <ImageIcon className="h-12 w-12" />
                <span className="font-medium">फोटो चुनें</span>
              </div>
            )}
            <input 
              id="imageInput"
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageChange}
            />
          </div>

          {image && (
            <Button 
              variant="outline" 
              className="w-full gap-2 border-primary/20 hover:bg-primary/5"
              onClick={generateAIContent}
              disabled={isGenerating}
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-accent" />}
              AI से शीर्षक और विवरण पाएँ
            </Button>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">शीर्षक</label>
              <Input 
                placeholder="अपनी पोस्ट का एक सुंदर शीर्षक दें" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold">विवरण</label>
              <Textarea 
                placeholder="इस पोस्ट के बारे में कुछ बतायें..." 
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <Button 
            className="w-full h-12 text-lg font-bold gap-2"
            disabled={isPosting || !image}
            onClick={handlePost}
          >
            {isPosting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            पोस्ट करें
          </Button>
          
          <div className="p-4 bg-muted/50 rounded-xl flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              आपकी पोस्ट का AI द्वारा स्वचालित रूप से मॉडरेशन किया जाएगा। अभद्र भाषा या अनुचित सामग्री पाए जाने पर पोस्ट ब्लॉक की जा सकती है।
            </p>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}