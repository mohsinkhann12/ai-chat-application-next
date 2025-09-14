"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggle } from "@/components/theme-toggle"
import { ChatList } from "@/components/chat-list"
import { ChatInterface } from "@/components/chat-interface"
import { Plus, MessageSquare } from "lucide-react"
import type { Chat, Message } from "@/types/chat"
import { generateChatId } from "@/lib/utils"
import { storage } from "@/lib/local-storage"

export default function HomePage() {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeApp = () => {
      try {
        const preferences = storage.loadPreferences()
        setIsSidebarOpen(preferences.sidebarOpen)

        const savedChats = storage.loadChats()
        setChats(savedChats)

        if (savedChats.length > 0) {
          const lastActiveChat = preferences.lastActiveChat
          const chatExists = savedChats.find((chat) => chat.id === lastActiveChat)
          const activeChatId = chatExists ? lastActiveChat : savedChats[0].id
          setActiveChat(activeChatId)
        } else {
          const initialChat: Chat = {
            id: generateChatId(),
            name: "Welcome Chat",
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          setChats([initialChat])
          setActiveChat(initialChat.id)
        }
      } catch (error) {
        console.error("Failed to initialize app:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [])

  useEffect(() => {
    if (!isLoading && chats.length >= 0) {
      storage.saveChats(chats)
    }
  }, [chats, isLoading])

  useEffect(() => {
    if (!isLoading) {
      storage.saveLastActiveChat(activeChat)
    }
  }, [activeChat, isLoading])

  const toggleSidebar = () => {
    const newState = !isSidebarOpen
    setIsSidebarOpen(newState)
    storage.saveSidebarState(newState)
  }

  const createNewChat = () => {
    const newChat: Chat = {
      id: generateChatId(),
      name: `Chat ${chats.length + 1}`,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setChats((prev) => [newChat, ...prev])
    setActiveChat(newChat.id)
  }

  const updateChat = (chatId: string, updates: Partial<Chat>) => {
    setChats((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, ...updates, updatedAt: new Date().toISOString() } : chat)),
    )
  }

  const deleteChat = (chatId: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId))
    if (activeChat === chatId) {
      const remainingChats = chats.filter((chat) => chat.id !== chatId)
      setActiveChat(remainingChats.length > 0 ? remainingChats[0].id : null)
    }
  }

  const addMessage = (chatId: string, message: Message) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [...chat.messages, message],
              updatedAt: new Date().toISOString(),
            }
          : chat,
      ),
    )
  }

  const currentChat = chats.find((chat) => chat.id === activeChat)

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <div className="text-center">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 animate-pulse text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading your chats...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${isSidebarOpen ? "w-80" : "w-0"} transition-all duration-300 overflow-hidden border-r border-border`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <MessageSquare className="w-6 h-6" />
                AI Chat
              </h1>
              <ThemeToggle />
            </div>
            <Button onClick={createNewChat} className="w-full" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>

          {/* Chat List */}
          <ScrollArea className="flex-1">
            <ChatList
              chats={chats}
              activeChat={activeChat}
              onSelectChat={setActiveChat}
              onUpdateChat={updateChat}
              onDeleteChat={deleteChat}
            />
          </ScrollArea>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <ChatInterface chat={currentChat} onAddMessage={addMessage} onToggleSidebar={toggleSidebar} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">Welcome to AI Chat</h2>
              <p className="text-muted-foreground mb-4">Create a new chat to get started</p>
              <Button onClick={createNewChat}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Chat
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
