"use client"

import { Smartphone, Download, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function AppDownloadBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const { toast } = useToast()

  const handleDownloadAPK = () => {
    // यहाँ आपकी असली APK फाइल का लिंक आएगा
    window.open("https://monetization-app.example/downloads/monetization-v1.apk", "_blank")
    toast({ title: "डाउनलोड शुरू", description: "मोनेटाइजेशन APK फाइल डाउनलोड हो रही है।" })
  }

  if (!isVisible) return null

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-primary to-accent p-8 text-white shadow-2xl mb-12 border-4 border-white/10">
      <button onClick={() => setIsVisible(false)} className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors">
        <X className="h-5 w-5" />
      </button>

      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="bg-white/20 p-6 rounded-[2rem] shadow-inner animate-pulse">
          <Smartphone className="h-14 w-14" />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-2xl font-black font-headline mb-2 tracking-tight">ऑफिसियल APK डाउनलोड करें!</h3>
          <p className="text-sm opacity-90 mb-6 font-bold">
            तेज़ अपलोड और रीयल-टाइम नोटिफिकेशन्स के लिए हमारा एंड्रॉइड ऐप इंस्टॉल करें।
          </p>
          
          <Button 
            variant="secondary" 
            className="h-14 px-10 rounded-2xl bg-white text-primary font-black text-lg gap-3 hover:scale-105 transition-transform shadow-xl"
            onClick={handleDownloadAPK}
          >
            <Download className="h-6 w-6" /> APK डाउनलोड करें
          </Button>
        </div>
      </div>
    </div>
  )
}
