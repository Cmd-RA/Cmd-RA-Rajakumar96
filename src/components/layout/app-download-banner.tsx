
"use client"

import { Smartphone, Download, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export function AppDownloadBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstalling, setIsInstalling] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast({ 
        title: "ऐप इंस्टॉल उपलब्ध नहीं", 
        description: "यदि आप पहले ही इंस्टॉल कर चुके हैं या आपका ब्राउज़र इसका समर्थन नहीं करता, तो यह बटन काम नहीं करेगा।" 
      })
      return
    }

    setIsInstalling(true)
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      toast({ title: "धन्यवाद!", description: "मोनेटाइजेशन ऐप इंस्टॉल किया जा रहा है।" })
      setDeferredPrompt(null)
    }
    setIsInstalling(false)
  }

  if (!isVisible) return null

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-accent to-primary p-8 text-white shadow-2xl mb-12 border-4 border-white/10 group animate-in fade-in zoom-in duration-500">
      <button 
        onClick={() => setIsVisible(false)} 
        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors z-10"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />

      <div className="flex flex-col md:flex-row items-center gap-8 relative z-0">
        <div className="bg-white/20 p-6 rounded-[2.5rem] shadow-inner animate-bounce duration-[3000ms]">
          <Smartphone className="h-16 w-16" />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-3xl font-black font-headline mb-2 tracking-tight">असली ऐप इंस्टॉल करें!</h3>
          <p className="text-sm opacity-90 mb-6 font-bold leading-relaxed max-w-md">
            बिना किसी रुकावट के तेज़ फोटो अपलोड और रियल-टाइम कमाई ट्रैक करने के लिए "Install" बटन दबाएं।
          </p>
          
          <Button 
            variant="secondary" 
            className="h-16 px-12 rounded-2xl bg-white text-primary font-black text-xl gap-3 hover:scale-105 transition-all shadow-[0_15px_30px_-10px_rgba(0,0,0,0.3)] border-b-4 border-muted active:border-b-0 active:translate-y-1"
            onClick={handleInstallClick}
            disabled={isInstalling}
          >
            {isInstalling ? (
              <Loader2 className="h-7 w-7 animate-spin" />
            ) : (
              <Download className="h-7 w-7" />
            )}
            {isInstalling ? "प्रोसेसिंग..." : "अभी इंस्टॉल करें"}
          </Button>
        </div>
      </div>
    </div>
  )
}
