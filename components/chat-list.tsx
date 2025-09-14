"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, Edit2, Trash2, MessageSquare } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Chat } from "@/types/chat"
import { formatTimestamp } from "@/lib/utils"

interface ChatListProps {
  chats: Chat[]
  activeChat: string | null
  onSelectChat: (chatId: string) => void
  onUpdateChat: (chatId: string, updates: Partial<Chat>) => void
  onDeleteChat: (chatId: string) => void
}

export function ChatList({ chats, activeChat, onSelectChat, onUpdateChat, onDeleteChat }: ChatListProps) {
  const [editingChat, setEditingChat] = useState<string | null>(null)
  const [editName, setEditName] = useState("")

  const handleEditStart = (chat: Chat) => {
    setEditingChat(chat.id)
    setEditName(chat.name)
  }

  const handleEditSave = (chatId: string) => {
    if (editName.trim()) {
      onUpdateChat(chatId, { name: editName.trim() })
    }
    setEditingChat(null)
    setEditName("")
  }

  const handleEditCancel = () => {
    setEditingChat(null)
    setEditName("")
  }

  const handleKeyPress = (e: React.KeyboardEvent, chatId: string) => {
    if (e.key === "Enter") {
      handleEditSave(chatId)
    } else if (e.key === "Escape") {
      handleEditCancel()
    }
  }

  if (chats.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground animate-in fade-in-50 duration-500">
        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No chats yet</p>
      </div>
    )
  }

  return (
    <div className="p-2 space-y-2">
      {chats.map((chat, index) => (
        <Card
          key={chat.id}
          className={`p-3 cursor-pointer transition-all duration-200 hover:bg-accent/50 hover:shadow-sm hover:scale-[1.02] active:scale-[0.98] animate-in slide-in-from-left-2 ${
            activeChat === chat.id ? "bg-accent border-primary/20 shadow-sm scale-[1.02]" : ""
          }`}
          style={{ animationDelay: `${index * 50}ms` }}
          onClick={() => onSelectChat(chat.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              {editingChat === chat.id ? (
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => handleEditSave(chat.id)}
                  onKeyDown={(e) => handleKeyPress(e, chat.id)}
                  className="h-6 text-sm font-medium transition-all duration-200"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <h3 className="font-medium text-sm truncate transition-colors duration-200">{chat.name}</h3>
              )}
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">
                  {chat.messages.length} message{chat.messages.length !== 1 ? "s" : ""}
                </p>
                <p className="text-xs text-muted-foreground">{formatTimestamp(chat.updatedAt)}</p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-accent"
                >
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="animate-in slide-in-from-top-2 duration-200">
                <DropdownMenuItem onClick={() => handleEditStart(chat)} className="transition-colors duration-200">
                  <Edit2 className="w-3 h-3 mr-2" />
                  Rename
                </DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive transition-colors duration-200"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Trash2 className="w-3 h-3 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="animate-in zoom-in-95 duration-200">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Chat</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{chat.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="transition-all duration-200 hover:bg-accent">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDeleteChat(chat.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all duration-200"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      ))}
    </div>
  )
}
