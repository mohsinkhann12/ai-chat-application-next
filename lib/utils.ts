import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateChatId(): string {
  return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 1) {
    return "Just now"
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`
  } else {
    return date.toLocaleDateString()
  }
}
