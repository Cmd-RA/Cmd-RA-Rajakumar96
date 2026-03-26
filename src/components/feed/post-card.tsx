
"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Heart, MessageCircle, Share2, MoreHorizontal, Send, UserPlus, Check } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, updateDocumentNonBlocking } from "@/firebase"
import { doc, arrayUnion, arrayRemove, increment } from "firebase/firestore"

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
  const [isFollowing, setIsFollowing] = useState(false)

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

  const handleFollow = () => {
    if (!user) {
      toast({ variant: "destructive", title: "लॉगिन आवश्यक", description: "फॉलो करने के लिए लॉगिन करें।" })
      return
    }
    if (user.uid === userId) {
      toast({ title: "सूचना", description: "आप खुद को फॉलो नहीं कर सकते।" })
      return
    }

    const creatorRef = doc(db, "users", userId)
    setIsFollowing(true)
    updateDocumentNonBlocking(creatorRef, { followerCount: increment(1) })
    toast({ title: "सफलता", description: `अब आप ${userName} को फॉलो कर रहे हैं!` })
  }

  const handleShare = async (platform?: string) => {
    const shareUrl = `${window.location.origin}/post/${id}`
    const shareText = `मोनेटाइजेशन पर इस शानदार कला को देखें: ${title}`

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
    <Card className={cn("overflow-hidden border-none shadow-2xl mb-10 rounded-[2.5rem] bg-white select-none transition-all hover:-translate-y-1", isFeatured && "ring-4 ring-primary/20")}>
      <CardHeader className="p-6 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 ring-2 ring-primary/10 shadow-sm">
            <AvatarImage src={userAvatar || `https://picsum.photos/seed/${userId}/100`} />
            <AvatarFallback>{userName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-md font-black leading-none">{userName}</p>
            {isFeatured && (
              <Badge className="mt-1 h-5 text-[9px] bg-yellow-400 text-yellow-900 border-none uppercase tracking-widest font-black">
                Featured Artist
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!isFollowing ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full h-8 px-4 text-xs font-black border-primary/20 text-primary hover:bg-primary/5"
              onClick={handleFollow}
            >
              <UserPlus className="h-3 w-3 mr-1.5" /> फॉलो
            </Button>
          ) : (
            <Badge variant="secondary" className="rounded-full h-8 px-4 text-xs font-black bg-primary/5 text-primary border-none">
              <Check className="h-3 w-3 mr-1.5" /> फॉलोइंग
            </Badge>
          )}
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      
      {/* Protected Image Container */}
      <div 
        className="relative aspect-[4/5] w-full overflow-hidden bg-muted cursor-default"
        onContextMenu={(e) => e.preventDefault()}
      >
        <Image
          src={imageUrl}
          alt={title}
          fill
          draggable={false}
          className="object-cover pointer-events-none transition-transform duration-700 hover:scale-105"
          priority={isFeatured}
        />
        {/* Anti-screenshot/copy protection layer */}
        <div className="absolute inset-0 z-10 bg-transparent select-none" />
      </div>

      <CardContent className="p-8">
        <h3 className="font-black text-2xl mb-3 text-foreground tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed font-medium">
          {description}
        </p>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex flex-col items-start border-t border-muted/20">
        <div className="flex items-center gap-8 mt-6 w-full px-2">
          <button
            onClick={handleLike}
            className={cn(
              "flex items-center gap-2.5 transition-all active:scale-150 group",
              isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
            )}
          >
            <div className={cn("p-2 rounded-full transition-colors", isLiked ? "bg-red-50" : "bg-transparent group-hover:bg-red-50")}>
              <Heart className={cn("h-7 w-7", isLiked && "fill-current")} />
            </div>
            <span className="text-md font-black">{likeCount}</span>
          </button>
          
          <button className="flex items-center gap-2.5 text-muted-foreground hover:text-primary transition-colors group">
            <div className="p-2 rounded-full transition-colors group-hover:bg-primary/5">
              <MessageCircle className="h-7 w-7" />
            </div>
            <span className="text-md font-black">0</span>
          </button>

          <div className="flex-1" />

          <button 
            onClick={() => handleShare()}
            className="flex items-center gap-2.5 text-muted-foreground hover:text-primary transition-all active:rotate-12 group"
          >
            <div className="p-2 rounded-full transition-colors group-hover:bg-primary/5">
              <Share2 className="h-7 w-7" />
            </div>
          </button>
        </div>

        {/* Action Share Row */}
        <div className="grid grid-cols-2 gap-4 mt-8 w-full">
          <Button 
            variant="outline" 
            className="h-12 text-[12px] gap-2 rounded-2xl border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/5 font-black uppercase tracking-wider"
            onClick={() => handleShare('whatsapp')}
          >
            <Send className="h-4 w-4" /> WhatsApp
          </Button>
          <Button 
            variant="outline" 
            className="h-12 text-[12px] gap-2 rounded-2xl border-[#1877F2]/40 text-[#1877F2] hover:bg-[#1877F2]/5 font-black uppercase tracking-wider"
            onClick={() => handleShare('facebook')}
          >
            <Share2 className="h-4 w-4" /> Facebook
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
