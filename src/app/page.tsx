
"use client"

import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { PostCard } from "@/components/feed/post-card"
import { AppDownloadBanner } from "@/components/layout/app-download-banner"
import { useCollection, useFirestore, useMemoFirebase, useDoc } from "@/firebase"
import { collection, query, orderBy, limit, doc } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { PlusSquare, TrendingUp, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Home() {
  const db = useFirestore()
  const router = useRouter()
  
  const postsQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(20))
  }, [db])

  const { data: realPosts, isLoading } = useCollection(postsQuery)

  // Fetch AdSense code from settings
  const settingsRef = useMemoFirebase(() => doc(db, "app_settings", "global"), [db])
  const { data: settings } = useDoc(settingsRef)

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-background/50">
      <Header />
      
      {/* Floating Upload Button for Users */}
      <Button 
        onClick={() => router.push("/upload")}
        className="fixed bottom-20 right-4 z-50 rounded-full h-14 w-14 shadow-2xl md:bottom-8 md:right-8"
      >
        <PlusSquare className="h-8 w-8" />
      </Button>

      <div className="container max-w-xl mx-auto px-4 pt-6 mb-12">
        
        <AppDownloadBanner />

        {/* AdSense Placeholder (Rendered from DB) */}
        {settings?.adsenseCode && (
          <div className="my-6 p-2 bg-muted/20 rounded-xl flex items-center justify-center min-h-[100px] border border-dashed border-primary/20">
            <div dangerouslySetInnerHTML={{ __html: settings.adsenseCode }} />
          </div>
        )}

        {/* Trending Section */}
        <div className="mb-8">
          <h2 className="text-xl font-headline font-bold mb-6 flex items-center gap-2">
            <Sparkles className="text-primary h-5 w-5 fill-current" />
            आज के चर्चित (Trending)
          </h2>
          {realPosts && realPosts[0] && (
            <PostCard
              id={realPosts[0].id}
              userId={realPosts[0].userId}
              userName={realPosts[0].userName || "क्रिएटर"}
              imageUrl={realPosts[0].photoUrl}
              title={realPosts[0].title}
              description={realPosts[0].description}
              likeIds={realPosts[0].likeIds}
              isFeatured={true}
            />
          )}
        </div>

        {/* Feed Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-headline font-bold flex items-center gap-2">
              <TrendingUp className="text-primary h-5 w-5" /> ताज़ा फीड
            </h2>
          </div>
          
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2].map(i => (
                <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden">
                  <div className="p-4 flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-[400px] w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : realPosts && realPosts.length > 0 ? (
            realPosts.map((post: any) => (
              <PostCard
                key={post.id}
                id={post.id}
                userId={post.userId}
                userName={post.userName || "यूज़र"}
                imageUrl={post.photoUrl}
                title={post.title}
                description={post.description}
                likeIds={post.likeIds}
              />
            ))
          ) : (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
              <p className="text-muted-foreground font-medium">कोई पोस्ट नहीं मिली।</p>
              <Button variant="link" onClick={() => router.push("/upload")} className="text-primary font-bold">
                पहली पोस्ट आप करें!
              </Button>
            </div>
          )}

          <div className="py-12 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
              {isLoading ? "लोड हो रहा है..." : "आपने सब कुछ देख लिया है ✨"}
            </p>
          </div>
        </div>
      </div>
      <Footer />
      <BottomNav />
    </div>
  )
}
