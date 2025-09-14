"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { User, Bot } from "lucide-react"
import type { Message } from "@/types/chat"
import { formatTimestamp } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { MarkdownRenderer } from "@/components/markdown-renderer"

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user"

  return (
    <div
      className={cn(
        "flex gap-3 animate-in slide-in-from-bottom-2 duration-300",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      {/* Avatar */}
      <Avatar className="w-8 h-8 mt-1">
        <AvatarFallback className={cn("text-xs", isUser ? "bg-primary text-primary-foreground" : "bg-muted")}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className={cn("flex flex-col max-w-[80%] sm:max-w-[70%]", isUser ? "items-end" : "items-start")}>
        <Card
          className={cn(
            "p-3 shadow-sm transition-all duration-200 hover:shadow-md",
            isUser ? "bg-primary text-primary-foreground ml-auto" : "bg-card border-border",
          )}
        >
          <div className="text-sm leading-relaxed">
            {isUser ? (
              <div className="whitespace-pre-wrap break-words">{message.content}</div>
            ) : (
              <MarkdownRenderer content={message.content} />
            )}
          </div>
        </Card>

        {/* Timestamp */}
        <div className={cn("text-xs text-muted-foreground mt-1 px-1", isUser ? "text-right" : "text-left")}>
          {formatTimestamp(message.timestamp)}
        </div>
      </div>
    </div>
  )
}
