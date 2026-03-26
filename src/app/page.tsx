"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { PostCard } from "@/components/feed/post-card"
import { VideoCard } from "@/components/feed/video-card"
import { AppDownloadBanner } from "@/components/layout/app-download-banner"
import { useCollection, useFirestore, useMemoFirebase, useDoc } from "@/firebase"
import { collection, query, orderBy, limit, doc } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"
import { Footer } from "@/components/layout/footer"
import { Sparkles, Star, Info, LayoutGrid, AlertCircle } from "lucide-react"

export default function Home() {
  const db = useFirestore()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // Fetch user posts - Optimized for infinite feel
  const postsQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(100))
  }, [db])
  const { data: realPosts, isLoading: postsLoading } = useCollection(postsQuery)

  // Fetch admin curated videos
  const videosQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "videos"), orderBy("createdAt", "desc"), limit(10))
  }, [db])
  const { data: videos, isLoading: videosLoading } = useCollection(videosQuery)

  // Get AdSense settings from DB
  const settingsRef = useMemoFirebase(() => doc(db, "app_settings", "global"), [db])
  const { data: settings } = useDoc(settingsRef)

  const AdFrame = ({ label }: { label: string }) => {
    if (!isMounted) return <div className="min-h-[120px] my-8 bg-muted/5 animate-pulse rounded-[2.5rem]" />
    
    return (
      <div className="my-10 w-full px-2">
        {settings?.adsenseCode ? (
          <div className="p-8 bg-white rounded-[2.5rem] border border-primary/10 shadow-xl overflow-hidden flex flex-col items-center min-h-[150px] transition-all hover:shadow-2xl">
             <p className="text-[9px] font-black uppercase text-muted-foreground mb-6 tracking-[0.3em] flex items-center gap-2">
               <span className="h-1 w-1 bg-primary rounded-full" /> Google Sponsored Ad <span className="h-1 w-1 bg-primary rounded-full" />
             </p>
             <div dangerouslySetInnerHTML={{ __html: settings.adsenseCode }} className="w-full flex justify-center min-h-[100px]" />
          </div>
        ) : (
          <div className="p-8 bg-muted/10 rounded-[2.5rem] border-2 border-dashed border-muted-foreground/10 flex flex-col items-center justify-center min-h-[150px]">
            <AlertCircle className="h-6 w-6 text-muted-foreground/20 mb-3" />
            <p className="text-[10px] font-black uppercase text-muted-foreground/30 tracking-widest">Ad Slot Ready: {label}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-background/50">
      <Header />
      
      <div className="container max-w-2xl mx-auto px-4 pt-8">
        
        <AppDownloadBanner />

        {/* Global Top Ad */}
        <AdFrame label="Header Banner Ad" />

        {/* ADMIN EXCLUSIVE PLAYLIST - Always at Top */}
        <div className="mb-12">
          <h2 className="text-2xl font-black font-headline mb-6 flex items-center gap-3 px-2">
            <div className="p-3 bg-primary/20 rounded-2xl shadow-lg rotate-3"><Star className="text-primary h-7 w-7 fill-current" /></div>
            विशेष प्रस्तुतियाँ (Top Pick)
          </h2>
          <div className="flex gap-5 overflow-x-auto pb-8 no-scrollbar snap-x">
            {videosLoading ? (
              [1, 2].map(i => <Skeleton key={i} className="min-w-[320px] h-[220px] rounded-[3rem]" />)
            ) : (
              videos?.map((v: any) => (
                <VideoCard key={v.id} id={v.id} title={v.title} videoUrl={v.videoUrl} type={v.type} />
              ))
            )}
            {videos?.length === 0 && !videosLoading && (
              <div className="px-6 py-12 bg-muted/20 rounded-[2.5rem] border border-dashed w-full text-center">
                <p className="text-xs text-muted-foreground italic font-bold">जल्द ही नए वीडियो आ रहे हैं...</p>
              </div>
            )}
          </div>
        </div>

        {/* Mid-Playlist Ad */}
        <AdFrame label="After Playlist Ad" />

        {/* FEATURED FEED - Users Posts with Strategic Ad Frames Every 2-3 Posts */}
        <div className="space-y-12 mb-12">
          <div className="flex items-center justify-between px-2 mb-8">
            <h2 className="text-2xl font-black font-headline flex items-center gap-3">
              <div className="p-3 bg-yellow-400/10 rounded-2xl -rotate-3"><Sparkles className="text-yellow-600 h-7 w-7 fill-current" /></div>
              कलाकारों की दुनिया
            </h2>
            <div className="p-2 bg-muted/20 rounded-full"><LayoutGrid className="text-muted-foreground h-5 w-5" /></div>
          </div>
          
          {postsLoading ? (
            <div className="space-y-12">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-[550px] w-full rounded-[3.5rem]" />)}
            </div>
          ) : (
            realPosts?.map((post: any, index: number) => (
              <div key={post.id}>
                <PostCard
                  id={post.id}
                  userId={post.userId}
                  userName={post.userName}
                  imageUrl={post.photoUrl}
                  title={post.title}
                  description={post.description}
                  likeIds={post.likeIds}
                  isFeatured={index < 5}
                />
                
                {/* STRATEGIC IN-FEED ADS: Shows every 2 posts for high visibility */}
                {(index + 1) % 2 === 0 && (
                  <AdFrame label={`Feed Slot ${Math.floor(index / 2) + 1}`} />
                )}
              </div>
            ))
          )}
        </div>

        {/* Infinite Scroll Bottom Ad */}
        <AdFrame label="Footer Content Ad" />

        <div className="py-32 text-center">
           <div className="flex justify-center mb-8 opacity-10 animate-bounce"><Info className="h-16 w-16" /></div>
           <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.8em] px-4 leading-loose">
             कला और कमाई का संगम ✨
           </p>
        </div>
      </div>
      <Footer />
      <BottomNav />
    </div>
  )
}
