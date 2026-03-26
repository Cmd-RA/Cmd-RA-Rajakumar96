"use client"

import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-2xl mx-auto p-6 md:py-12">
        <h1 className="text-3xl font-bold font-headline mb-6 text-primary">हमसे संपर्क करें (Contact Us)</h1>
        <p className="text-muted-foreground mb-8 text-sm">यदि आपके पास कोई प्रश्न या सुझाव है, तो कृपया बेझिझक हमसे संपर्क करें।</p>
        
        <div className="grid gap-6">
          <Card className="border-none shadow-sm bg-muted/30">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">ईमेल</p>
                <p className="font-medium">rajahribabakumar@gmail.com</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-muted/30">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">फोन</p>
                <p className="font-medium">+91 9682316132</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-muted/30">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">स्थान</p>
                <p className="font-medium">भारत (India)</p>
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
