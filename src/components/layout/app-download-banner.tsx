"use client"

import { Smartphone, Download, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function AppDownloadBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const { toast } = useToast()

  const handleDownloadAPK = () => {
    // REAL DOWNLOAD LOGIC: Use a relative path or direct link
    // Users should place their monetization.apk in public/downloads/ folder
    const apkUrl = "/downloads/monetization.apk" 
    
    const link = document.createElement('a')
    link.href = apkUrl
    link.setAttribute('download', 'Monetization_v1.apk')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({ 
      title: "डाउनलोड शुरू", 
      description: "मोनेटाइजेशन APK फाइल आपके फोन में सेव हो रही है।" 
    })
  }

  if (!isVisible) return null

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-accent to-primary p-8 text-white shadow-2xl mb-12 border-4 border-white/10 group">
      <button 
        onClick={() => setIsVisible(false)} 
        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors z-10"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Decorative BG element */}
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
          >
            <Download className="h-7 w-7" /> अभी इंस्टॉल करें
          </Button>
        </div>
      </div>
    </div>
  )
}
