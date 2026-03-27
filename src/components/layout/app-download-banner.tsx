"use client"

import { Smartphone, Download, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export function AppDownloadBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    // Priority 1: APK Download if on mobile
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      window.open("https://your-apk-link.com/app.apk", "_blank")
      toast({ title: "सफलता", description: "APK फाइल डाउनलोड हो रही है।" })
      return
    }

    // Priority 2: PWA Install
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') setDeferredPrompt(null)
    } else {
      toast({ title: "सूचना", description: "ऐप पहले से ही इंस्टॉल है या PWA सपोर्ट नहीं है।" })
    }
  }

  if (!isVisible) return null

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-accent p-6 text-primary-foreground shadow-lg mb-8">
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="bg-white/20 p-4 rounded-2xl">
          <Smartphone className="h-12 w-12" />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-bold font-headline mb-1">मोनेटाइजेशन APK डाउनलोड करें!</h3>
          <p className="text-sm opacity-90 mb-4">
            बेहतर अनुभव और तेज़ कमाई के लिए अभी हमारी वेबसाइट को ऐप (APK) की तरह इंस्टॉल करें।
          </p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <Button 
              variant="secondary" 
              className="gap-2 font-black bg-white text-primary hover:bg-white/90 rounded-xl px-8"
              onClick={handleInstall}
            >
              <Download className="h-4 w-4" />
              APK डाउनलोड करें
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute -top-6 -left-6 h-24 w-24 bg-white/10 rounded-full blur-2xl" />
    </div>
  )
}
