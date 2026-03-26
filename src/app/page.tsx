
"use client"

import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { PostCard } from "@/components/feed/post-card"
import { VideoCard } from "@/components/feed/video-card"
import { AppDownloadBanner } from "@/components/layout/app-download-banner"
import { useCollection, useFirestore, useMemoFirebase, useDoc } from "@/firebase"
import { collection, query, orderBy, limit, doc } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PlusSquare, TrendingUp, Sparkles, PlayCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Home() {
  const db = useFirestore()
  const router = useRouter()
  
  const postsQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(20))
  }, [db])

  const { data: realPosts, isLoading: postsLoading } = useCollection(postsQuery)

  const videosQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "videos"), orderBy("createdAt", "desc"), limit(10))
  }, [db])

  const { data: videos, isLoading: videosLoading } = useCollection(videosQuery)

  // Fetch AdSense code from settings
  const settingsRef = useMemoFirebase(() => doc(db, "app_settings", "global"), [db])
  const { data: settings } = useDoc(settingsRef)

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-background/50">
      <Header />
      
      {/* Floating Upload Button */}
      <Button 
        onClick={() => router.push("/upload")}
        className="fixed bottom-24 right-4 z-50 rounded-full h-14 w-14 shadow-2xl md:bottom-8 md:right-8 bg-primary hover:bg-primary/90"
      >
        <PlusSquare className="h-8 w-8" />
      </Button>

      <div className="container max-w-2xl mx-auto px-4 pt-6 mb-12">
        
        <AppDownloadBanner />

        {/* AdSense Placeholder */}
        {settings?.adsenseCode && (
          <div className="my-6 p-4 bg-white/40 rounded-3xl flex items-center justify-center min-h-[120px] border border-dashed border-primary/20 shadow-sm">
            <div dangerouslySetInnerHTML={{ __html: settings.adsenseCode }} />
          </div>
        )}

        {/* Video Playlist Section */}
        <div className="mb-12 overflow-hidden">
          <h2 className="text-xl font-headline font-bold mb-6 flex items-center gap-2 px-1">
            <PlayCircle className="text-primary h-6 w-6" />
            वीडियो प्लेलिस्ट (New)
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-6 px-1 no-scrollbar snap-x">
            {videosLoading ? (
              [1, 2, 3].map(i => <Skeleton key={i} className="min-w-[280px] h-[220px] rounded-3xl" />)
            ) : videos && videos.length > 0 ? (
              videos.map((v: any) => (
                <VideoCard 
                  key={v.id}
                  id={v.id}
                  title={v.title}
                  videoUrl={v.videoUrl}
                  type={v.type}
                />
              ))
            ) : (
              <div className="w-full py-12 text-center bg-muted/20 rounded-3xl border border-dashed border-muted flex items-center justify-center flex-col gap-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">कोई वीडियो नहीं मिला</p>
              </div>
            )}
          </div>
        </div>

        {/* Trending Post */}
        <div className="mb-12">
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

        {/* Main Feed Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-headline font-bold flex items-center gap-2">
              <TrendingUp className="text-primary h-6 w-6" /> ताज़ा फीड
            </h2>
          </div>
          
          {postsLoading ? (
            <div className="space-y-8">
              {[1, 2].map(i => (
                <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden">
                  <div className="p-4 flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-[400px] w-full" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-8 w-3/4" />
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
            <div className="text-center py-24 bg-white rounded-[40px] border-4 border-dashed border-primary/10">
              <p className="text-muted-foreground font-bold mb-4">अभी कोई पोस्ट नहीं है।</p>
              <Button onClick={() => router.push("/upload")} className="rounded-full px-8 font-bold">
                अपनी पहली पोस्ट करें
              </Button>
            </div>
          )}

          <div className="py-20 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black">
              {postsLoading ? "लोड हो रहा है..." : "अद्भुत! आपने सब कुछ देख लिया है ✨"}
            </p>
          </div>
        </div>
      </div>
      <Footer />
      <BottomNav />
    </div>
  )
}
