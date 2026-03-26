"use client"

import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-2xl mx-auto p-6 md:py-12">
        <h1 className="text-3xl font-bold font-headline mb-6 text-primary">नियम और शर्तें (Terms & Conditions)</h1>
        <div className="prose prose-sm prose-neutral dark:prose-invert space-y-4">
          <p>मोनेटाइजेशन का उपयोग करके, आप इन शर्तों से सहमत होते हैं:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>आप केवल वही कंटेंट अपलोड करेंगे जिसके पास आपके कानूनी अधिकार हैं।</li>
            <li>अभद्र, अश्लील या कॉपीराइट उल्लंघन करने वाला कंटेंट प्रतिबंधित है।</li>
            <li>हम बिना किसी पूर्व सूचना के नियमों का उल्लंघन करने वाले अकाउंट को निलंबित करने का अधिकार रखते हैं।</li>
            <li>मुद्रीकरण के लिए न्यूनतम फॉलोअर्स की शर्त पूरी करना अनिवार्य है।</li>
          </ul>
        </div>
      </div>
      <Footer />
      <BottomNav />
    </div>
  )
}
