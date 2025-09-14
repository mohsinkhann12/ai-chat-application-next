"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Menu, Bot, Loader2 } from "lucide-react"
import type { Chat, Message } from "@/types/chat"
import { generateMessageId } from "@/lib/utils"
import { getChatCompletion } from "@/lib/groq-api"
import { MessageBubble } from "@/components/message-bubble"
import { TypingIndicator } from "@/components/typing-indicator"

interface ChatInterfaceProps {
  chat: Chat
  onAddMessage: (chatId: string, message: Message) => void
  onToggleSidebar: () => void
}

export function ChatInterface({ chat, onAddMessage, onToggleSidebar }: ChatInterfaceProps) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [chat.messages, isLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: generateMessageId(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }

    // Add user message
    onAddMessage(chat.id, userMessage)
    setInput("")
    setIsLoading(true)

    try {
      // Get AI response with conversation history
      const response = await getChatCompletion([...chat.messages, userMessage])

      const assistantMessage: Message = {
        id: generateMessageId(),
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
      }

      onAddMessage(chat.id, assistantMessage)
    } catch (error) {
      console.error("Error getting AI response:", error)
      const errorMessage: Message = {
        id: generateMessageId(),
        role: "assistant",
        content: "Sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date().toISOString(),
      }
      onAddMessage(chat.id, errorMessage)
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="hover:bg-accent transition-colors duration-200"
          >
            <Menu className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="font-semibold text-balance">{chat.name}</h2>
            <p className="text-xs text-muted-foreground">
              {chat.messages.length} message{chat.messages.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {chat.messages.length === 0 ? (
            <div className="text-center py-12 animate-in fade-in-50 duration-500">
              <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
              <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
              <p className="text-muted-foreground text-pretty">
                Send a message to begin chatting with the AI assistant.
              </p>
            </div>
          ) : (
            chat.messages.map((message, index) => (
              <div
                key={message.id}
                className="animate-in slide-in-from-bottom-2 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <MessageBubble message={message} />
              </div>
            ))
          )}

          {isLoading && <TypingIndicator />}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
