"use client"

import { Smartphone, Download, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function AppDownloadBanner() {
  const [isVisible, setIsVisible] = useState(true)

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
          <h3 className="text-xl font-bold font-headline mb-1">धनधारा ऐप डाउनलोड करें!</h3>
          <p className="text-sm opacity-90 mb-4">
            बेहतर अनुभव, तेज़ ब्राउज़िंग और एक्सक्लूसिव रिवॉर्ड्स के लिए आज ही हमारा मोबाइल ऐप इंस्टॉल करें।
          </p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <Button variant="secondary" className="gap-2 font-bold bg-white text-primary hover:bg-white/90">
              <Download className="h-4 w-4" />
              Google Play
            </Button>
            <Button variant="outline" className="gap-2 border-white text-white hover:bg-white/10">
              <Download className="h-4 w-4" />
              App Store
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative circles */}
      <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute -top-6 -left-6 h-24 w-24 bg-white/10 rounded-full blur-2xl" />
    </div>
  )
}
