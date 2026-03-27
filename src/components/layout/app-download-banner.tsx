"use client"

import { Smartphone, Download, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase"
import { doc } from "firebase/firestore"

export function AppDownloadBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  const { toast } = useToast()
  const db = useFirestore()

  const settingsRef = useMemoFirebase(() => db ? doc(db, "app_settings", "global") : null, [db])
  const { data: settings } = useDoc(settingsRef)

  const handleDownloadAPK = async () => {
    setIsDownloading(true)
    
    try {
      // Fetch URL from Admin Settings or use local fallback
      const apkUrl = settings?.appDownloadUrl || "/downloads/monetization.apk" 
      
      if (!apkUrl || apkUrl === "/downloads/monetization.apk") {
        console.warn("Using default or placeholder path. Ensure file exists in public/downloads/ if local.")
      }

      const link = document.createElement('a')
      link.href = apkUrl
      link.setAttribute('download', 'Monetization_App.apk')
      link.target = "_blank" // Open in new tab for safety
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({ 
        title: "डाउनलोड शुरू", 
        description: "मोनेटाइजेशन APK फाइल डाउनलोड की जा रही है।" 
      })
    } catch (err) {
      toast({ 
        variant: "destructive",
        title: "डाउनलोड त्रुटि", 
        description: "सर्वर से फाइल प्राप्त करने में विफल। एडमिन से संपर्क करें।" 
      })
    } finally {
      setTimeout(() => setIsDownloading(false), 2000)
    }
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
          <h3 className="text-3xl font-black font-headline mb-2 tracking-tight">ऑफिसियल APK डाउनलोड करें!</h3>
          <p className="text-sm opacity-90 mb-6 font-bold leading-relaxed max-w-md">
            बिना किसी रुकावट के तेज़ फोटो अपलोड और रियल-टाइम कमाई (Earnings) ट्रैक करने के लिए हमारा ऐप इंस्टॉल करें।
          </p>
          
          <Button 
            variant="secondary" 
            className="h-16 px-12 rounded-2xl bg-white text-primary font-black text-xl gap-3 hover:scale-105 transition-all shadow-[0_15px_30px_-10px_rgba(0,0,0,0.3)] border-b-4 border-muted active:border-b-0 active:translate-y-1"
            onClick={handleDownloadAPK}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="h-7 w-7 animate-spin" />
            ) : (
              <Download className="h-7 w-7" />
            )}
            {isDownloading ? "प्रोसेसिंग..." : "अभी इंस्टॉल करें"}
          </Button>
        </div>
      </div>
    </div>
  )
}
