"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Bot } from "lucide-react"

export function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-in slide-in-from-bottom-2 duration-300">
      {/* Avatar */}
      <Avatar className="w-8 h-8 mt-1">
        <AvatarFallback className="bg-muted">
          <Bot className="w-4 h-4 animate-pulse" />
        </AvatarFallback>
      </Avatar>

      {/* Typing Animation */}
      <div className="flex flex-col max-w-[80%] sm:max-w-[70%]">
        <Card className="p-3 bg-card border-border shadow-sm animate-pulse">
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" />
            </div>
            <span className="text-xs text-muted-foreground ml-2 animate-pulse">AI is typing...</span>
          </div>
        </Card>
      </div>
    </div>
  )
}
