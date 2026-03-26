"use client"

import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-2xl mx-auto p-6 md:py-12">
        <h1 className="text-3xl font-bold font-headline mb-6 text-primary">गोपनीयता नीति (Privacy Policy)</h1>
        <div className="prose prose-sm prose-neutral dark:prose-invert space-y-4 text-muted-foreground">
          <p>अंतिम अपडेट: {new Date().toLocaleDateString('hi-IN')}</p>
          <h2 className="text-xl font-bold text-foreground">1. जानकारी जो हम एकत्र करते हैं</h2>
          <p>जब आप मोनेटाइजेशन ऐप का उपयोग करते हैं, तो हम आपका नाम, ईमेल, फोन नंबर और आपके द्वारा अपलोड की गई तस्वीरें एकत्र करते हैं।</p>
          
          <h2 className="text-xl font-bold text-foreground">2. जानकारी का उपयोग</h2>
          <p>हम आपकी जानकारी का उपयोग आपको बेहतर सेवा प्रदान करने, आपके अकाउंट को सुरक्षित रखने और विज्ञापन (Ads) दिखाने के लिए करते हैं।</p>
          
          <h2 className="text-xl font-bold text-foreground">3. कुकीज़ (Cookies)</h2>
          <p>हम यूज़र अनुभव को बेहतर बनाने और Google AdSense जैसे तीसरे पक्ष के विज्ञापनों को दिखाने के लिए कुकीज़ का उपयोग कर सकते हैं।</p>
          
          <h2 className="text-xl font-bold text-foreground">4. डेटा सुरक्षा</h2>
          <p>आपकी तस्वीरों और व्यक्तिगत डेटा की सुरक्षा के लिए हम आधुनिक एन्क्रिप्शन और फायरबेस सुरक्षा नियमों का उपयोग करते हैं।</p>
        </div>
      </div>
      <Footer />
      <BottomNav />
    </div>
  )
}
