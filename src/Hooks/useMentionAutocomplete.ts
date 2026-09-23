import { useRef, useState, useMemo, useCallback } from "react"
import { useSearchUsersByUsername } from "@/lib/react-query/queriesAndMutatuins"

export function useMentionAutocomplete(value: string, onChange: (next: string) => void) {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)
  const [cursorPosition, setCursorPosition] = useState(0)

  const setInputRef = useCallback((el: HTMLInputElement | HTMLTextAreaElement | null) => {
    inputRef.current = el
  }, [])

  const activeMention = useMemo(() => {
    const textBeforeCursor = value.slice(0, cursorPosition)
    const atIndex = textBeforeCursor.lastIndexOf("@")
    if (atIndex === -1) return null

    const query = textBeforeCursor.slice(atIndex + 1)
    if (/\s/.test(query)) return null

    return { query, startIndex: atIndex }
  }, [value, cursorPosition])

  const { data: suggestions } = useSearchUsersByUsername(activeMention?.query)

  const trackCursor = () => {
    if (inputRef.current) setCursorPosition(inputRef.current.selectionStart ?? 0)
  }

  const selectMention = (username: string) => {
    if (!activeMention) return

    const before = value.slice(0, activeMention.startIndex)
    const after = value.slice(cursorPosition)
    const next = `${before}@${username} ${after}`
    onChange(next)

    requestAnimationFrame(() => {
      const newCursorPosition = before.length + username.length + 2
      inputRef.current?.setSelectionRange(newCursorPosition, newCursorPosition)
      inputRef.current?.focus()
    })
  }

  return { setInputRef, trackCursor, activeMention, suggestions: suggestions ?? [], selectMention }
}
