
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
import { PlusSquare, TrendingUp, Sparkles, PlayCircle, Info, Star } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Home() {
  const db = useFirestore()
  const router = useRouter()
  
  // Fetch user posts - Newest first
  const postsQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(50))
  }, [db])

  const { data: realPosts, isLoading: postsLoading } = useCollection(postsQuery)

  // Fetch admin videos
  const videosQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "videos"), orderBy("createdAt", "desc"), limit(5))
  }, [db])

  const { data: videos, isLoading: videosLoading } = useCollection(videosQuery)

  // Fetch AdSense code from settings
  const settingsRef = useMemoFirebase(() => doc(db, "app_settings", "global"), [db])
  const { data: settings } = useDoc(settingsRef)

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-background/50">
      <Header />
      
      {/* Floating Upload Button - Main Upload Action */}
      <Button 
        onClick={() => router.push("/upload")}
        className="fixed bottom-24 right-6 z-50 rounded-full h-16 w-16 shadow-2xl md:bottom-8 md:right-8 bg-primary hover:bg-primary/90 transition-transform active:scale-90"
      >
        <PlusSquare className="h-8 w-8" />
      </Button>

      <div className="container max-w-2xl mx-auto px-4 pt-6 mb-12">
        
        <AppDownloadBanner />

        {/* AdSense Top Placeholder - CRITICAL FOR APPROVAL */}
        {settings?.adsenseCode && (
          <div className="my-6 p-4 bg-white/40 rounded-3xl border border-dashed border-primary/20 flex flex-col items-center justify-center min-h-[120px] overflow-hidden">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2">Sponsorship</p>
            <div dangerouslySetInnerHTML={{ __html: settings.adsenseCode }} className="w-full flex justify-center" />
          </div>
        )}

        {/* ADMIN SPECIAL VIDEOS - Top Section */}
        <div className="mb-10 p-6 bg-gradient-to-b from-primary/5 to-transparent rounded-[2.5rem] border-x border-t border-primary/10">
          <h2 className="text-xl font-headline font-black mb-6 flex items-center gap-3 px-2">
            <div className="p-2 bg-primary/20 rounded-full shadow-lg"><Star className="text-primary h-6 w-6 fill-current" /></div>
            एडमिन की विशेष प्लेलिस्ट
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x">
            {videosLoading ? (
              [1, 2].map(i => <Skeleton key={i} className="min-w-[280px] h-[180px] rounded-3xl" />)
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
              <div className="w-full py-10 text-center bg-muted/20 rounded-3xl border border-dashed flex items-center justify-center flex-col gap-2">
                <p className="text-xs font-bold text-muted-foreground uppercase">कोई विशेष वीडियो नहीं है</p>
              </div>
            )}
          </div>
        </div>

        {/* Trending/Featured Post */}
        <div className="mb-12">
          <h2 className="text-xl font-headline font-black mb-6 flex items-center gap-3">
             <div className="p-2 bg-yellow-400/10 rounded-full"><Sparkles className="text-yellow-500 h-5 w-5 fill-current" /></div>
            आज का चर्चित सितारा
          </h2>
          {realPosts && realPosts[0] && (
            <PostCard
              id={realPosts[0].id}
              userId={realPosts[0].userId}
              userName={realPosts[0].userName || "मोनेटाइजेशन क्रिएटर"}
              imageUrl={realPosts[0].photoUrl}
              title={realPosts[0].title}
              description={realPosts[0].description}
              likeIds={realPosts[0].likeIds}
              isFeatured={true}
            />
          )}
        </div>

        {/* Middle Ad Placement */}
        {settings?.adsenseCode && (
           <div className="my-10 p-4 bg-muted/20 rounded-3xl flex flex-col items-center justify-center border border-muted/30">
             <p className="text-[8px] font-bold text-muted-foreground uppercase mb-2">Advertisement</p>
             <div dangerouslySetInnerHTML={{ __html: settings.adsenseCode }} />
           </div>
        )}

        {/* MAIN USER FEED -Infinite Stream Style */}
        <div className="space-y-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-headline font-black flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full"><TrendingUp className="text-primary h-6 w-6" /></div>
              क्रिएटर्स की गैलरी
            </h2>
          </div>
          
          {postsLoading ? (
            <div className="space-y-10">
              {[1, 2].map(i => (
                <Card key={i} className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
                  <div className="p-5 flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                  <Skeleton className="h-[400px] w-full" />
                </Card>
              ))}
            </div>
          ) : realPosts && realPosts.length > 0 ? (
            realPosts.slice(1).map((post: any, index: number) => (
              <div key={post.id}>
                <PostCard
                  id={post.id}
                  userId={post.userId}
                  userName={post.userName || "यूज़र"}
                  imageUrl={post.photoUrl}
                  title={post.title}
                  description={post.description}
                  likeIds={post.likeIds}
                />
                {/* Insert ad every few posts for revenue */}
                {(index + 1) % 4 === 0 && settings?.adsenseCode && (
                  <div className="my-10 p-6 bg-white rounded-[2rem] border shadow-sm flex flex-col items-center">
                    <p className="text-[8px] font-black text-muted-foreground mb-3 uppercase">Recommended for you</p>
                    <div dangerouslySetInnerHTML={{ __html: settings.adsenseCode }} />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border-4 border-dashed border-primary/5">
              <p className="text-muted-foreground font-bold mb-4">अभी कोई यूज़र पोस्ट नहीं है।</p>
              <Button onClick={() => router.push("/upload")} className="rounded-full px-10 h-12">
                पहली पोस्ट आप करें
              </Button>
            </div>
          )}

          <div className="py-20 text-center border-t border-muted/20">
             <div className="flex justify-center mb-4"><Info className="h-8 w-8 text-muted/30" /></div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-black">
              आप दुनिया भर की बेहतरीन कला देख रहे हैं ✨
            </p>
          </div>
        </div>
      </div>
      <Footer />
      <BottomNav />
    </div>
  )
}
