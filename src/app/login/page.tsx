"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/firebase"
import { initiateEmailSignIn, initiateEmailSignUp } from "@/firebase/non-blocking-login"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/layout/header"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const auth = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    if (isLogin) {
      initiateEmailSignIn(auth, email, password)
      toast({ title: "लॉगिन किया जा रहा है...", description: "कृपया प्रतीक्षा करें।" })
    } else {
      initiateEmailSignUp(auth, email, password)
      toast({ title: "अकाउंट बनाया जा रहा है...", description: "सफलतापूर्वक साइनअप के बाद आपको रीडायरेक्ट किया जाएगा।" })
    }
    // Auth state changes are handled by the provider, which will redirect or update UI
    setTimeout(() => router.push("/"), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-md mx-auto pt-20 px-4">
        <Card className="border-none shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline font-bold">
              {isLogin ? "वापसी पर स्वागत है" : "नया अकाउंट बनाएँ"}
            </CardTitle>
            <CardDescription>
              {isLogin ? "अपने मोनेटाइजेशन अकाउंट में लॉगिन करें" : "मोनेटाइजेशन प्लेटफॉर्म से जुड़ें और कमाना शुरू करें"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">ईमेल</label>
                <Input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">पासवर्ड</label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full font-bold h-12">
                {isLogin ? "लॉगिन करें" : "साइनअप करें"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary font-medium hover:underline"
              >
                {isLogin ? "नया अकाउंट बनाना चाहते हैं? साइनअप करें" : "पहले से अकाउंट है? लॉगिन करें"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
