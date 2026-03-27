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
import { Sparkles, Star, Info, LayoutGrid } from "lucide-react"

export default function Home() {
  const db = useFirestore()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  const postsQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(100))
  }, [db])
  const { data: realPosts, isLoading: postsLoading } = useCollection(postsQuery)

  const videosQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "videos"), orderBy("createdAt", "desc"), limit(10))
  }, [db])
  const { data: videos, isLoading: videosLoading } = useCollection(videosQuery)

  const settingsRef = useMemoFirebase(() => db ? doc(db, "app_settings", "global") : null, [db])
  const { data: settings } = useDoc(settingsRef)

  const AdFrame = ({ label }: { label: string }) => {
    if (!isMounted) return <div className="min-h-[150px] my-8 bg-muted/5 animate-pulse rounded-[2.5rem]" />
    
    return (
      <div className="my-10 w-full px-2">
        <div className="p-8 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border-2 border-primary/5 shadow-xl flex flex-col items-center justify-center min-h-[180px]">
           <p className="text-[9px] font-black uppercase text-muted-foreground/40 mb-4 tracking-[0.4em]">Google Advertisement Space</p>
           {settings?.adsenseCode ? (
             <div dangerouslySetInnerHTML={{ __html: settings.adsenseCode }} className="w-full flex justify-center" />
           ) : (
             <p className="text-[10px] font-black text-muted-foreground/20 italic">Ad Slot Ready: {label}</p>
           )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-background/30">
      <Header />
      
      <div className="container max-w-2xl mx-auto px-4 pt-8">
        <AppDownloadBanner />

        <AdFrame label="Header Master Ad" />

        {/* Admin Featured Playlist */}
        <div className="mb-12">
          <h2 className="text-2xl font-black font-headline mb-6 flex items-center gap-3">
            <div className="p-3 bg-primary/20 rounded-2xl"><Star className="text-primary h-7 w-7 fill-current" /></div>
            आज की विशेष प्रस्तुतियाँ
          </h2>
          <div className="flex gap-5 overflow-x-auto pb-8 no-scrollbar">
            {videosLoading ? (
              <Skeleton className="min-w-[320px] h-[220px] rounded-[3rem]" />
            ) : (
              videos?.map((v: any) => (
                <VideoCard key={v.id} id={v.id} title={v.title} videoUrl={v.videoUrl} type={v.type} />
              ))
            )}
            {!videosLoading && (!videos || videos.length === 0) && (
              <div className="min-w-full text-center py-10 text-muted-foreground text-sm font-bold">एडमिन ने अभी कोई वीडियो नहीं जोड़ा है</div>
            )}
          </div>
        </div>

        <AdFrame label="Mid-Feed Ad Slot" />

        {/* Global User Feed */}
        <div className="space-y-12">
          <div className="flex items-center justify-between px-2 mb-8">
            <h2 className="text-2xl font-black font-headline flex items-center gap-3">
              <div className="p-3 bg-yellow-400/10 rounded-2xl"><Sparkles className="text-yellow-600 h-7 w-7 fill-current" /></div>
              कलाकारों की नई दुनिया
            </h2>
            <LayoutGrid className="text-muted-foreground h-5 w-5" />
          </div>
          
          {postsLoading ? (
            <div className="space-y-8">
              <Skeleton className="h-[400px] w-full rounded-[3rem]" />
              <Skeleton className="h-[400px] w-full rounded-[3rem]" />
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
                  isFeatured={index < 3}
                />
                
                {/* INFINITE AD FLOW: Every 2 posts, show an Ad Frame */}
                {(index + 1) % 2 === 0 && (
                  <AdFrame label={`Feed Slot ${Math.floor(index / 2) + 1}`} />
                )}
              </div>
            ))
          )}
        </div>

        <AdFrame label="Footer Infinite Ad" />

        <div className="py-24 text-center">
           <div className="p-6 bg-white/5 shadow-inner rounded-full inline-block mb-4">
             <Info className="h-10 w-10 text-primary opacity-20" />
           </div>
           <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.5em]">कला, कमाई और सुरक्षा का संगम ✨</p>
        </div>
      </div>
      <Footer />
      <BottomNav />
    </div>
  )
}
