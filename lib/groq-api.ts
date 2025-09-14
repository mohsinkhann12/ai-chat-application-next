import type { Message } from "@/types/chat"
const GQOQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY
export async function getChatCompletion(messages: Message[]): Promise<string> {
  const url = "https://api.groq.com/openai/v1/chat/completions"
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${GQOQ_API_KEY}
`,
  }
  

  const openAIMessages = [
    {
      role: "system",
      content: "You are a helpful AI assistant. Provide clear, accurate, and helpful responses.",
    },
    ...messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
  ]

  const payload = {
    model: "llama-3.3-70b-versatile",
    messages: openAIMessages,
    temperature: 0.7,
    max_tokens: 2048,
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error("Error calling Groq API:", error)
    throw error
  }
}
