"use client"

import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-2xl mx-auto p-6 md:py-12">
        <h1 className="text-3xl font-bold font-headline mb-6 text-primary">हमारे बारे में (About Us)</h1>
        <div className="prose prose-sm prose-neutral dark:prose-invert space-y-4">
          <p>
            <strong>मोनेटाइजेशन</strong> एक उभरता हुआ सोशल मीडिया प्लेटफॉर्म है जो कंटेंट क्रिएटर्स को उनकी कला के लिए न केवल पहचान, बल्कि आर्थिक लाभ (Earnings) दिलाने के उद्देश्य से बनाया गया है।
          </p>
          <p>
            हमारा मिशन भारतीय फोटोग्राफरों और क्रिएटर्स को एक ऐसा मंच प्रदान करना है जहाँ वे अपनी बेहतरीन यादें और तस्वीरें साझा कर सकें। हम सुरक्षित और आकर्षक वातावरण सुनिश्चित करते हैं जहाँ आपकी तस्वीरों की सुरक्षा हमारी प्राथमिकता है।
          </p>
          <p>
            हमारा विजन हर क्रिएटर को उनके कंटेंट के माध्यम से सशक्त बनाना है। मोनेटाइजेशन प्लेटफॉर्म पर आप अपने फॉलोअर्स बढ़ाकर और बेहतरीन कंटेंट के जरिए पैसे कमाना शुरू कर सकते हैं।
          </p>
        </div>
      </div>
      <Footer />
      <BottomNav />
    </div>
  )
}
