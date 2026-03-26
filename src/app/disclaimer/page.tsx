"use client"

import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-2xl mx-auto p-6 md:py-12">
        <h1 className="text-3xl font-bold font-headline mb-6 text-primary">डिस्क्लेमर (Disclaimer)</h1>
        <div className="prose prose-sm prose-neutral dark:prose-invert space-y-4">
          <p>
            मोनेटाइजेशन (Monetization) वेबसाइट पर उपलब्ध जानकारी केवल सामान्य सूचना के उद्देश्यों के लिए है। हम जानकारी की सटीकता या पूर्णता के बारे में कोई वारंटी नहीं देते हैं।
          </p>
          <p>
            <strong>कमाई का डिस्क्लेमर:</strong> मुद्रीकरण से होने वाली कमाई यूज़र के कंटेंट की गुणवत्ता और फॉलोअर्स की संख्या पर निर्भर करती है। हम किसी भी निश्चित आय की गारंटी नहीं देते हैं।
          </p>
          <p>
            वेबसाइट का उपयोग करने पर होने वाले किसी भी नुकसान या क्षति के लिए मोनेटाइजेशन उत्तरदायी नहीं होगा। बाहरी लिंकों पर हमारा कोई नियंत्रण नहीं है।
          </p>
        </div>
      </div>
      <Footer />
      <BottomNav />
    </div>
  )
}
