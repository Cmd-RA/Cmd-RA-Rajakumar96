
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
import { PlusSquare, TrendingUp, Sparkles, PlayCircle, Loader2, Info } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Home() {
  const db = useFirestore()
  const router = useRouter()
  
  const postsQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(30))
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
        className="fixed bottom-24 right-4 z-50 rounded-full h-16 w-16 shadow-2xl md:bottom-8 md:right-8 bg-primary hover:bg-primary/90 transition-transform active:scale-90"
      >
        <PlusSquare className="h-8 w-8" />
      </Button>

      <div className="container max-w-2xl mx-auto px-4 pt-6 mb-12">
        
        <AppDownloadBanner />

        {/* AdSense Top Placeholder */}
        {settings?.adsenseCode && (
          <div className="my-8 p-6 bg-white/60 rounded-[2.5rem] flex flex-col items-center justify-center min-h-[150px] border-4 border-dashed border-primary/10 shadow-inner overflow-hidden">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-4">प्रायोजित विज्ञापन (AD)</p>
            <div dangerouslySetInnerHTML={{ __html: settings.adsenseCode }} className="w-full flex justify-center" />
          </div>
        )}

        {/* Video Playlist Section */}
        <div className="mb-12 overflow-hidden bg-white/30 p-4 rounded-[2.5rem]">
          <h2 className="text-xl font-headline font-black mb-6 flex items-center gap-3 px-2">
            <div className="p-2 bg-primary/10 rounded-full"><PlayCircle className="text-primary h-6 w-6" /></div>
            विशेष वीडियो प्लेलिस्ट
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
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">कोई वीडियो नहीं है</p>
              </div>
            )}
          </div>
        </div>

        {/* Trending Post */}
        <div className="mb-12">
          <h2 className="text-xl font-headline font-black mb-6 flex items-center gap-3">
             <div className="p-2 bg-yellow-400/10 rounded-full"><Sparkles className="text-yellow-500 h-5 w-5 fill-current" /></div>
            आज के चर्चित सितारे
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

        {/* Middle Ad Placeholder */}
        {settings?.adsenseCode && realPosts && realPosts.length > 3 && (
           <div className="my-10 p-4 bg-muted/30 rounded-3xl flex flex-col items-center justify-center min-h-[100px] border border-muted shadow-sm">
             <p className="text-[9px] font-bold text-muted-foreground uppercase mb-2">Advertisement</p>
             <div dangerouslySetInnerHTML={{ __html: settings.adsenseCode }} />
           </div>
        )}

        {/* Main Feed Section */}
        <div className="space-y-12">
          <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="text-2xl font-headline font-black flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full"><TrendingUp className="text-primary h-6 w-6" /></div>
              ताज़ा फीड
            </h2>
          </div>
          
          {postsLoading ? (
            <div className="space-y-10">
              {[1, 2].map(i => (
                <Card key={i} className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
                  <div className="p-5 flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                  <Skeleton className="h-[450px] w-full" />
                  <div className="p-8 space-y-4">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : realPosts && realPosts.length > 0 ? (
            realPosts.map((post: any, index: number) => (
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
                {/* Insert ad every 5 posts */}
                {index > 0 && index % 5 === 0 && settings?.adsenseCode && (
                  <div className="my-12 p-6 bg-white rounded-3xl border shadow-sm flex flex-col items-center">
                    <p className="text-[9px] font-black text-muted-foreground mb-4 uppercase tracking-tighter">Recommended for you</p>
                    <div dangerouslySetInnerHTML={{ __html: settings.adsenseCode }} />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-24 bg-white rounded-[3.5rem] border-8 border-dashed border-primary/5 shadow-2xl">
              <div className="mb-6 inline-flex p-6 bg-primary/5 rounded-full"><PlusSquare className="h-12 w-12 text-primary/40" /></div>
              <p className="text-xl font-bold text-muted-foreground mb-6">अभी कोई पोस्ट नहीं है।</p>
              <Button onClick={() => router.push("/upload")} className="rounded-full px-12 h-14 font-black text-lg shadow-xl">
                अपनी पहली पोस्ट करें
              </Button>
            </div>
          )}

          <div className="py-24 text-center">
             <div className="flex justify-center mb-6"><Info className="h-10 w-10 text-muted/30" /></div>
            <p className="text-[12px] text-muted-foreground uppercase tracking-[0.5em] font-black leading-relaxed">
              {postsLoading ? "शानदार कला लोड हो रही है..." : "अद्भुत! आपने आज की पूरी गैलरी देख ली है ✨"}
            </p>
          </div>
        </div>
      </div>
      <Footer />
      <BottomNav />
    </div>
  )
}
