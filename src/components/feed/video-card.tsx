
"use client"

import { useState } from "react"
import { Play, Share2, MoreVertical } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface VideoCardProps {
  id: string
  title: string
  videoUrl: string
  description?: string
  type: 'youtube' | 'direct'
}

export function VideoCard({ id, title, videoUrl, description, type }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const getYoutubeEmbedUrl = (url: string) => {
    let videoId = ""
    if (url.includes("v=")) {
      videoId = url.split("v=")[1].split("&")[0]
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`
  }

  return (
    <Card className="min-w-[280px] md:min-w-[320px] max-w-[320px] overflow-hidden border-none shadow-lg bg-white rounded-3xl flex-shrink-0 group">
      <div className="relative aspect-video bg-black flex items-center justify-center">
        {isPlaying ? (
          type === 'youtube' ? (
            <iframe
              src={getYoutubeEmbedUrl(videoUrl)}
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <video src={videoUrl} className="w-full h-full" controls autoPlay />
          )
        ) : (
          <div 
            className="w-full h-full relative cursor-pointer group"
            onClick={() => setIsPlaying(true)}
          >
            <img 
              src={`https://picsum.photos/seed/${id}/400/225`} 
              alt={title} 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-4 bg-primary/90 text-white rounded-full shadow-2xl scale-100 group-hover:scale-110 transition-transform">
                <Play className="h-8 w-8 fill-current" />
              </div>
            </div>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 overflow-hidden">
            <h4 className="font-bold text-sm leading-tight line-clamp-2">{title}</h4>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-bold">
              आज की विशेष प्रस्तुति
            </p>
          </div>
          <button className="text-muted-foreground hover:text-primary transition-colors">
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
