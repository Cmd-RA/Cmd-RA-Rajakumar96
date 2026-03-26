
"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Heart, MessageCircle, Share2, MoreHorizontal, Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, updateDocumentNonBlocking } from "@/firebase"
import { doc, arrayUnion, arrayRemove } from "firebase/firestore"

interface PostCardProps {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  imageUrl: string
  title: string
  description: string
  likeIds?: string[]
  isFeatured?: boolean
}

export function PostCard({
  id,
  userId,
  userName,
  userAvatar,
  imageUrl,
  title,
  description,
  likeIds = [],
  isFeatured = false,
}: PostCardProps) {
  const { user } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(likeIds.length)

  useEffect(() => {
    if (user && likeIds.includes(user.uid)) {
      setIsLiked(true)
    }
  }, [user, likeIds])

  const handleLike = () => {
    if (!user) {
      toast({ variant: "destructive", title: "लॉगिन आवश्यक", description: "लाइक करने के लिए लॉगिन करें।" })
      return
    }

    const postRef = doc(db, "posts", id)
    if (isLiked) {
      setIsLiked(false)
      setLikeCount(prev => prev - 1)
      updateDocumentNonBlocking(postRef, { likeIds: arrayRemove(user.uid) })
    } else {
      setIsLiked(true)
      setLikeCount(prev => prev + 1)
      updateDocumentNonBlocking(postRef, { likeIds: arrayUnion(user.uid) })
    }
  }

  const handleShare = async (platform?: string) => {
    const shareUrl = `${window.location.origin}/post/${id}`
    const shareText = `मोनेटाइजेशन पर इस शानदार फोटो को देखें: ${title}`

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank')
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')
    } else if (navigator.share) {
      try {
        await navigator.share({ title, text: description, url: shareUrl })
      } catch (err) { console.error("Error sharing:", err) }
    } else {
      navigator.clipboard.writeText(shareUrl)
      toast({ title: "लिंक कॉपी", description: "अब आप इसे कहीं भी शेयर कर सकते हैं।" })
    }
  }

  return (
    <Card className={cn("overflow-hidden border-none shadow-md mb-6 rounded-3xl bg-white select-none transition-all hover:shadow-lg", isFeatured && "ring-2 ring-primary/30")}>
      <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-primary/10">
            <AvatarImage src={userAvatar || `https://picsum.photos/seed/${userId}/100`} />
            <AvatarFallback>{userName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-bold leading-none">{userName}</p>
            {isFeatured && (
              <Badge className="mt-1 h-4 text-[9px] bg-primary/10 text-primary border-none uppercase tracking-tighter">
                FEATURED
              </Badge>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      {/* Protected Image Container */}
      <div 
        className="relative aspect-square w-full overflow-hidden bg-muted cursor-default"
        onContextMenu={(e) => e.preventDefault()}
      >
        <Image
          src={imageUrl}
          alt={title}
          fill
          draggable={false}
          className="object-cover pointer-events-none"
          priority={isFeatured}
        />
        {/* Invisible protection layer */}
        <div className="absolute inset-0 z-10 bg-transparent select-none" />
      </div>

      <CardContent className="p-5">
        <h3 className="font-bold text-xl mb-2 text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium">
          {description}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col items-start border-t border-muted/30">
        <div className="flex items-center gap-6 mt-4 w-full px-2">
          <button
            onClick={handleLike}
            className={cn(
              "flex items-center gap-2 transition-all active:scale-125",
              isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
            )}
          >
            <Heart className={cn("h-7 w-7", isLiked && "fill-current")} />
            <span className="text-sm font-bold">{likeCount}</span>
          </button>
          
          <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <MessageCircle className="h-7 w-7" />
            <span className="text-sm font-bold">0</span>
          </button>

          <div className="flex-1" />

          <button 
            onClick={() => handleShare()}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all active:rotate-12"
          >
            <Share2 className="h-7 w-7" />
          </button>
        </div>

        {/* Quick Social Share Buttons */}
        <div className="flex gap-3 mt-6 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-10 text-[11px] gap-2 rounded-xl border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/5 font-bold"
            onClick={() => handleShare('whatsapp')}
          >
            <Send className="h-4 w-4" /> WhatsApp
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-10 text-[11px] gap-2 rounded-xl border-[#1877F2]/30 text-[#1877F2] hover:bg-[#1877F2]/5 font-bold"
            onClick={() => handleShare('facebook')}
          >
            <Share2 className="h-4 w-4" /> Facebook
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
