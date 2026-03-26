import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { PostCard } from "@/components/feed/post-card"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { AppDownloadBanner } from "@/components/layout/app-download-banner"

export default function Home() {
  const featuredPost = PlaceHolderImages[0]
  const posts = [...PlaceHolderImages].slice(1)

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      <Header />
      <div className="container max-w-xl mx-auto px-4 pt-4">
        
        {/* App Download Prompt */}
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
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              username={`क्रिएटर_${post.id}`}
              userAvatar={`https://picsum.photos/seed/user${post.id}/100`}
              imageUrl={post.imageUrl}
              title={post.description}
              description="मोनेटाइजेशन पर साझा की गई एक और बेहतरीन याद। कंटेंट बनाएँ और कमाएँ!"
              likes={Math.floor(Math.random() * 500)}
            />
          ))}
          {/* Infinite Scroll Indicator */}
          <div className="py-8 text-center text-muted-foreground text-sm">
            और पोस्ट लोड हो रही हैं...
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
