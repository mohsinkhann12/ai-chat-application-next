import type { Chat } from "@/types/chat"

const STORAGE_KEYS = {
  CHATS: "ai-chats",
  THEME: "ai-chat-theme",
  SIDEBAR_STATE: "ai-chat-sidebar",
  USER_PREFERENCES: "ai-chat-preferences",
} as const

export interface UserPreferences {
  sidebarOpen: boolean
  theme: "light" | "dark" | "system"
  lastActiveChat: string | null
}

// Safe localStorage operations with error handling
export const storage = {
  // Chat operations
  saveChats: (chats: Chat[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats))
    } catch (error) {
      console.error("Failed to save chats to localStorage:", error)
    }
  },

  loadChats: (): Chat[] => {
    try {
      const savedChats = localStorage.getItem(STORAGE_KEYS.CHATS)
      return savedChats ? JSON.parse(savedChats) : []
    } catch (error) {
      console.error("Failed to load chats from localStorage:", error)
      return []
    }
  },

  clearChats: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.CHATS)
    } catch (error) {
      console.error("Failed to clear chats from localStorage:", error)
    }
  },

  // User preferences operations
  savePreferences: (preferences: UserPreferences): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences))
    } catch (error) {
      console.error("Failed to save preferences to localStorage:", error)
    }
  },

  loadPreferences: (): UserPreferences => {
    try {
      const savedPreferences = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES)
      return savedPreferences
        ? JSON.parse(savedPreferences)
        : {
            sidebarOpen: true,
            theme: "system" as const,
            lastActiveChat: null,
          }
    } catch (error) {
      console.error("Failed to load preferences from localStorage:", error)
      return {
        sidebarOpen: true,
        theme: "system" as const,
        lastActiveChat: null,
      }
    }
  },

  // Individual preference operations
  saveSidebarState: (isOpen: boolean): void => {
    try {
      const preferences = storage.loadPreferences()
      storage.savePreferences({ ...preferences, sidebarOpen: isOpen })
    } catch (error) {
      console.error("Failed to save sidebar state:", error)
    }
  },

  saveLastActiveChat: (chatId: string | null): void => {
    try {
      const preferences = storage.loadPreferences()
      storage.savePreferences({ ...preferences, lastActiveChat: chatId })
    } catch (error) {
      console.error("Failed to save last active chat:", error)
    }
  },

  // Utility functions
  isStorageAvailable: (): boolean => {
    try {
      const test = "__storage_test__"
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  },

  getStorageSize: (): number => {
    try {
      let total = 0
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length
        }
      }
      return total
    } catch {
      return 0
    }
  },

  // Export/Import functionality
  exportData: (): string => {
    try {
      const chats = storage.loadChats()
      const preferences = storage.loadPreferences()
      return JSON.stringify({
        chats,
        preferences,
        exportDate: new Date().toISOString(),
        version: "1.0",
      })
    } catch (error) {
      console.error("Failed to export data:", error)
      throw error
    }
  },

  importData: (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData)
      if (data.chats && Array.isArray(data.chats)) {
        storage.saveChats(data.chats)
      }
      if (data.preferences) {
        storage.savePreferences(data.preferences)
      }
      return true
    } catch (error) {
      console.error("Failed to import data:", error)
      return false
    }
  },
}
