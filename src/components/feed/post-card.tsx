"use client"

import Image from "next/image"
import { useState } from "react"
import { Heart, MessageCircle, Share2, MoreHorizontal, Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface PostCardProps {
  id: string
  username: string
  userAvatar: string
  imageUrl: string
  title: string
  description: string
  likes: number
  isFeatured?: boolean
}

export function PostCard({
  username,
  userAvatar,
  imageUrl,
  title,
  description,
  likes: initialLikes,
  isFeatured = false,
}: PostCardProps) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(initialLikes)
  const { toast } = useToast()

  const handleLike = () => {
    setLiked(!liked)
    setLikes(prev => liked ? prev - 1 : prev + 1)
  }

  const handleShare = async (platform?: string) => {
    const shareUrl = window.location.href
    const shareText = `मोनेटाइजेशन पर इस पोस्ट को देखें: ${title}`

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank')
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')
    } else if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    } else {
      navigator.clipboard.writeText(shareUrl)
      toast({
        title: "लिंक कॉपी किया गया",
        description: "आप इसे कहीं भी शेयर कर सकते हैं।",
      })
    }
  }

  return (
    <Card className={cn("overflow-hidden border-none shadow-sm mb-4 select-none", isFeatured && "ring-2 ring-primary/20")}>
      <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 ring-2 ring-background">
            <AvatarImage src={userAvatar} alt={username} />
            <AvatarFallback>{username[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold leading-none">{username}</p>
            {isFeatured && (
              <Badge variant="secondary" className="mt-1 h-4 text-[10px] bg-primary/10 text-primary border-none">
                विशेष पोस्ट
              </Badge>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      {/* Image with Protection */}
      <div 
        className="relative aspect-square w-full overflow-hidden bg-muted"
        onContextMenu={(e) => e.preventDefault()}
      >
        <Image
          src={imageUrl}
          alt={title}
          fill
          draggable={false}
          className="object-cover transition-all pointer-events-none"
        />
        {/* Transparent overlay to block save as */}
        <div className="absolute inset-0 z-10 bg-transparent" />
      </div>

      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-1 leading-tight">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {description}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col items-start border-t border-border/50">
        <div className="flex items-center gap-4 mt-3 w-full">
          <button
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1.5 transition-colors",
              liked ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            <Heart className={cn("h-6 w-6", liked && "fill-current")} />
            <span className="text-sm font-medium">{likes}</span>
          </button>
          
          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
            <MessageCircle className="h-6 w-6" />
            <span className="text-sm font-medium">12</span>
          </button>

          <div className="flex-1" />

          <button 
            onClick={() => handleShare()}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
          >
            <Share2 className="h-6 w-6" />
          </button>
        </div>

        {/* Quick Social Share */}
        <div className="flex gap-2 mt-4 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-8 text-[10px] gap-1 border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/10"
            onClick={() => handleShare('whatsapp')}
          >
            <Send className="h-3 w-3" /> WhatsApp
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-8 text-[10px] gap-1 border-[#1877F2]/20 text-[#1877F2] hover:bg-[#1877F2]/10"
            onClick={() => handleShare('facebook')}
          >
            <Share2 className="h-3 w-3" /> Facebook
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
