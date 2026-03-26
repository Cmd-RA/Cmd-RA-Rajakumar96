
"use client"

import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { PostCard } from "@/components/feed/post-card"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { AppDownloadBanner } from "@/components/layout/app-download-banner"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, limit } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  const db = useFirestore()
  
  const postsQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(20))
  }, [db])

  const { data: realPosts, isLoading } = useCollection(postsQuery)
  const featuredPost = PlaceHolderImages[0]

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      <Header />
      <div className="container max-w-xl mx-auto px-4 pt-4">
        
        <AppDownloadBanner />

        {/* Featured Section */}
        <div className="mb-6">
          <h2 className="text-lg font-headline font-bold mb-4 flex items-center gap-2">
            <span className="bg-primary/10 text-primary p-1 rounded-md text-xs">⭐</span>
            विशेष आपके लिए
          </h2>
          <PostCard
            id={featuredPost.id}
            username="आधिकारिक एडमिन"
            userAvatar="https://picsum.photos/seed/admin/100"
            imageUrl={featuredPost.imageUrl}
            title={featuredPost.description}
            description="यह एक विशेष रूप से चुनी गई पोस्ट है जिसे एडमिन द्वारा प्रमोट किया गया है।"
            likes={1204}
            isFeatured={true}
          />
        </div>

        {/* Feed Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-headline font-bold mb-4">ताज़ा पोस्ट</h2>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-10 w-40" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : realPosts && realPosts.length > 0 ? (
            realPosts.map((post: any) => (
              <PostCard
                key={post.id}
                id={post.id}
                username={post.userName || "यूज़र"}
                userAvatar={`https://picsum.photos/seed/${post.userId}/100`}
                imageUrl={post.photoUrl}
                title={post.title}
                description={post.description}
                likes={post.likeIds?.length || 0}
              />
            ))
          ) : (
            // Fallback to placeholders if DB is empty
            PlaceHolderImages.slice(1).map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                username={`क्रिएटर_${post.id}`}
                userAvatar={`https://picsum.photos/seed/user${post.id}/100`}
                imageUrl={post.imageUrl}
                title={post.description}
                description="मोनेटाइजेशन पर साझा की गई एक और बेहतरीन याद। कंटेंट बनाएँ और कमाएँ!"
                // Deterministic likes to avoid hydration mismatch
                likes={(parseInt(post.id) * 157) % 500 + 50}
              />
            ))
          )}

          <div className="py-8 text-center text-muted-foreground text-sm">
            {isLoading ? "लोड हो रहा है..." : "सभी पोस्ट देख ली गई हैं!"}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
