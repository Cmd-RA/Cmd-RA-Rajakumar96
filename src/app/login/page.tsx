
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/firebase"
import { 
  initiateEmailSignIn, 
  initiateEmailSignUp, 
  initiateGoogleSignIn 
} from "@/firebase/non-blocking-login"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/layout/header"
import { Separator } from "@/components/ui/separator"

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

  const handleGoogleLogin = () => {
    initiateGoogleSignIn(auth)
    toast({ title: "गूगल लॉगिन", description: "प्रमाणीकरण शुरू हो रहा है..." })
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
            {/* Google Login Button */}
            <Button 
              variant="outline" 
              className="w-full h-12 gap-3 mb-6 font-bold"
              onClick={handleGoogleLogin}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google के साथ लॉगिन करें
            </Button>

            <div className="flex items-center gap-4 mb-6">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">या ईमेल से</span>
              <Separator className="flex-1" />
            </div>

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
