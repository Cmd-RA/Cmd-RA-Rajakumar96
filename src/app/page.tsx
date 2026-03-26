
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
import { Sparkles, Star, Info, LayoutGrid, AlertCircle } from "lucide-react"

export default function Home() {
  const db = useFirestore()
  
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

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-background/30">
      <Header />
      
      <div className="container max-w-2xl mx-auto px-4 pt-8">
        
        <AppDownloadBanner />

        {/* TOP AD FRAME - High Visibility for AdSense Bots */}
        <div className="my-8">
          {settings?.adsenseCode ? (
            <div className="p-6 bg-white rounded-[2.5rem] border border-primary/5 shadow-sm overflow-hidden flex flex-col items-center min-h-[120px]">
               <p className="text-[9px] font-black uppercase text-muted-foreground mb-4 tracking-[0.2em]">Sponsored Content</p>
               <div dangerouslySetInnerHTML={{ __html: settings.adsenseCode }} className="w-full flex justify-center" />
            </div>
          ) : (
            <div className="p-6 bg-muted/20 rounded-[2.5rem] border border-dashed border-muted-foreground/20 flex flex-col items-center justify-center min-h-[120px]">
              <AlertCircle className="h-5 w-5 text-muted-foreground/40 mb-2" />
              <p className="text-[9px] font-black uppercase text-muted-foreground/40 tracking-widest">AD FRAME READY (HEADER)</p>
            </div>
          )}
        </div>

        {/* ADMIN EXCLUSIVE PLAYLIST - Always at Top */}
        <div className="mb-12">
          <h2 className="text-2xl font-black font-headline mb-6 flex items-center gap-3 px-2">
            <div className="p-2.5 bg-primary/20 rounded-full shadow-lg"><Star className="text-primary h-6 w-6 fill-current" /></div>
            विशेष प्रस्तुतियाँ (Editor's Choice)
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar snap-x">
            {videosLoading ? (
              [1, 2].map(i => <Skeleton key={i} className="min-w-[300px] h-[200px] rounded-[2.5rem]" />)
            ) : (
              videos?.map((v: any) => (
                <VideoCard key={v.id} id={v.id} title={v.title} videoUrl={v.videoUrl} type={v.type} />
              ))
            )}
            {videos?.length === 0 && !videosLoading && (
              <p className="text-xs text-muted-foreground italic px-4">जल्द ही नए वीडियो आ रहे हैं...</p>
            )}
          </div>
        </div>

        {/* FEATURED FEED - Users Posts with Strategic Ad Frames */}
        <div className="space-y-12">
          <div className="flex items-center justify-between px-2 mb-8">
            <h2 className="text-2xl font-black font-headline flex items-center gap-3">
              <div className="p-2.5 bg-yellow-400/10 rounded-full"><Sparkles className="text-yellow-600 h-6 w-6 fill-current" /></div>
              कलाकारों की दुनिया
            </h2>
            <LayoutGrid className="text-muted-foreground h-5 w-5" />
          </div>
          
          {postsLoading ? (
            <div className="space-y-12">
              {[1, 2].map(i => <Skeleton key={i} className="h-[500px] w-full rounded-[3rem]" />)}
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
                
                {/* IN-FEED AD FRAME - Automatically placed every 3 posts for Max Revenue */}
                {(index + 1) % 3 === 0 && (
                  <div className="my-12">
                    {settings?.adsenseCode ? (
                      <div className="p-8 bg-white rounded-[2.5rem] shadow-xl flex flex-col items-center border border-primary/5 transition-all hover:shadow-2xl min-h-[280px]">
                        <p className="text-[9px] font-black text-muted-foreground uppercase mb-4 tracking-tighter">Recommended For You</p>
                        <div dangerouslySetInnerHTML={{ __html: settings.adsenseCode }} className="w-full flex justify-center" />
                      </div>
                    ) : (
                      <div className="p-8 bg-muted/10 rounded-[2.5rem] border-2 border-dashed border-muted-foreground/10 flex flex-col items-center justify-center min-h-[250px]">
                        <p className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.4em]">IN-FEED AD FRAME (EVERY 3 POSTS)</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* BOTTOM AD FRAME - Final slot for scrolling users */}
        <div className="my-24">
          {settings?.adsenseCode ? (
            <div className="p-8 bg-muted/20 rounded-[2.5rem] flex flex-col items-center border border-dashed min-h-[100px]">
              <p className="text-[9px] font-black text-muted-foreground uppercase mb-4">Advertisement</p>
              <div dangerouslySetInnerHTML={{ __html: settings.adsenseCode }} className="w-full flex justify-center" />
            </div>
          ) : (
            <div className="p-8 bg-muted/5 rounded-[2.5rem] border border-dotted border-muted-foreground/20 flex flex-col items-center justify-center min-h-[100px]">
              <p className="text-[9px] font-black text-muted-foreground/20 uppercase tracking-widest">BOTTOM AD FRAME</p>
            </div>
          )}
        </div>

        <div className="py-24 text-center">
           <div className="flex justify-center mb-6 opacity-20"><Info className="h-12 w-12" /></div>
           <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.5em]">
             कला की कोई सीमा नहीं होती ✨
           </p>
        </div>
      </div>
      <Footer />
      <BottomNav />
    </div>
  )
}
