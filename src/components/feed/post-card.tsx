"use client"

import Image from "next/image"
import { useState } from "react"
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1)
    } else {
      setLikes(likes + 1)
    }
    setLiked(!liked)
  }

  return (
    <Card className={cn("overflow-hidden border-none shadow-sm mb-4", isFeatured && "ring-2 ring-primary/20")}>
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
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-all hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-1 leading-tight">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between border-t border-border/50">
        <div className="flex items-center gap-4 mt-3">
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
          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
            <Share2 className="h-6 w-6" />
          </button>
        </div>
      </CardFooter>
    </Card>
  )
}