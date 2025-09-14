"use client"

import type React from "react"
import { memo } from "react"
import { useTheme } from "next-themes"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface MarkdownRendererProps {
  content: string
}

export const MarkdownRenderer = memo(function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const { theme } = useTheme()
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(id)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  const parseMarkdown = (text: string) => {
    const parts: React.ReactNode[] = []
    let currentIndex = 0
    let partIndex = 0 // Added part index for unique keys

    // Code blocks (\`\`\`language\ncode\n\`\`\`)
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    let match

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block
      if (match.index > currentIndex) {
        const beforeText = text.slice(currentIndex, match.index)
        parts.push(<span key={`inline-${partIndex++}`}>{parseInlineMarkdown(beforeText)}</span>)
      }

      const language = match[1] || "text"
      const code = match[2].trim()
      const codeId = `code-${Math.random().toString(36).substr(2, 9)}`

      parts.push(
        <div key={codeId} className="relative group my-3">
          <div className="flex items-center justify-between bg-muted px-3 py-2 rounded-t-md border-b">
            <span className="text-xs font-medium text-muted-foreground uppercase">{language}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => copyToClipboard(code, codeId)}
            >
              {copiedCode === codeId ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </Button>
          </div>
          <pre className="bg-muted/50 p-4 rounded-b-md overflow-x-auto text-sm font-mono">
            <code className="text-foreground">{code}</code>
          </pre>
        </div>,
      )

      currentIndex = match.index + match[0].length
    }

    // Add remaining text
    if (currentIndex < text.length) {
      const remainingText = text.slice(currentIndex)
      parts.push(<span key={`inline-${partIndex++}`}>{parseInlineMarkdown(remainingText)}</span>)
    }

    return parts.length > 0 ? parts : [<span key="single-inline">{parseInlineMarkdown(text)}</span>]
  }

  // Parse inline markdown (bold, italic, inline code, links)
  const parseInlineMarkdown = (text: string) => {
    // Inline code (`code`)
    const inlineCodeRegex = /`([^`]+)`/g

    const processedText = text.replace(inlineCodeRegex, (match, code) => {
      return `<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">${code}</code>`
    })

    // Bold (**text** or __text__)
    const boldText = processedText.replace(/\*\*(.*?)\*\*|__(.*?)__/g, "<strong>$1$2</strong>")

    // Italic (*text* or _text_)
    const italicText = boldText.replace(/\*(.*?)\*|_(.*?)_/g, "<em>$1$2</em>")

    // Links [text](url)
    const linkedText = italicText.replace(
      /\[([^\]]+)\]$$([^)]+)$$/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:no-underline">$1</a>',
    )

    return <span dangerouslySetInnerHTML={{ __html: linkedText }} />
  }

  return <div className="prose prose-sm max-w-none dark:prose-invert">{parseMarkdown(content)}</div>
})
