"use client"

import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full border-t bg-muted/20 py-12 pb-24 md:pb-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold font-headline text-primary">मोनेटाइजेशन</h3>
            <p className="text-xs text-muted-foreground">
              कंटेंट बनाएँ, साझा करें और अपनी कला को मुद्रीकृत करें।
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold">कानूनी</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold">कंपनी</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold">सहायता</h4>
            <ul className="space-y-2 text-xs">
              <li className="text-muted-foreground">राज बाबू कुमार</li>
              <li className="text-muted-foreground">9682316132</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
          © {new Date().getFullYear()} मोनेटाइजेशन | सर्वाधिकार सुरक्षित
        </div>
      </div>
    </footer>
  )
}
