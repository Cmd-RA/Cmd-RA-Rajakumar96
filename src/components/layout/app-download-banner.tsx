"use client"

import { Smartphone, Download, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function AppDownloadBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  const { toast } = useToast()

  const handleDownloadAPK = async () => {
    setIsDownloading(true)
    
    try {
      // Direct relative path download
      // IMPORTANT: Place your APK in public/downloads/monetization.apk
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
    } catch (err) {
      toast({ 
        variant: "destructive",
        title: "डाउनलोड त्रुटि", 
        description: "सर्वर से फाइल प्राप्त करने में विफल। कृपया बाद में प्रयास करें।" 
      })
    } finally {
      setTimeout(() => setIsDownloading(false), 2000)
    }
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

function Loader2({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}
