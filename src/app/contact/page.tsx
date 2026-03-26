
"use client"

import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, MessageCircle, ExternalLink } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-2xl mx-auto p-6 md:py-12">
        <h1 className="text-3xl font-bold font-headline mb-6 text-primary text-center">हमसे संपर्क करें (Contact Us)</h1>
        <p className="text-muted-foreground mb-8 text-center text-sm">यदि आपके पास कोई प्रश्न या सुझाव है, तो कृपया बेझिझक हमसे संपर्क करें।</p>
        
        <div className="grid gap-6">
          {/* Telegram Support Group - Featured */}
          <Card className="border-none shadow-xl bg-[#0088cc]/10 border-2 border-[#0088cc]/20 overflow-hidden transform transition-transform hover:scale-[1.01]">
            <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6 justify-between">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-[#0088cc] rounded-[2rem] text-white shadow-2xl">
                  <MessageCircle className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#0088cc] uppercase tracking-tighter">Telegram Support</h3>
                  <p className="text-sm font-bold text-muted-foreground">24/7 लाइव सहायता के लिए ग्रुप ज्वाइन करें</p>
                </div>
              </div>
              <a href="https://t.me/srbis" target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
                <Button className="w-full md:w-auto h-14 px-8 rounded-2xl bg-[#0088cc] hover:bg-[#006699] text-white font-black text-lg gap-3 shadow-xl">
                  JOIN GROUP <ExternalLink className="h-5 w-5" />
                </Button>
              </a>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm bg-muted/30 rounded-3xl">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">ईमेल</p>
                  <p className="font-bold text-sm">rajahribabakumar@gmail.com</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-muted/30 rounded-3xl">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">फोन</p>
                  <p className="font-bold text-sm">+91 9682316132</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-sm bg-muted/30 rounded-3xl">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">स्थान</p>
                <p className="font-bold text-sm">भारत (India)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
      <BottomNav />
    </div>
  )
}
