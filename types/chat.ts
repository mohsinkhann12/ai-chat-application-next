export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export interface Chat {
  id: string
  name: string
  messages: Message[]
  createdAt: string
  updatedAt: string
}
