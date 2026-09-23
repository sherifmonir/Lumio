import { useState } from 'react'
import { useMentionAutocomplete } from '@/Hooks/useMentionAutocomplete'
import MentionSuggestions from '../mentions/MentionSuggestions'

type CommentInputProps = {
  onSubmit: (content: string) => void
  isSubmitting: boolean
  placeholder?: string
  onCancel?: () => void
  autoFocus?: boolean
}

const CommentInput = ({ onSubmit, isSubmitting, placeholder = "Add a comment...", onCancel, autoFocus }: CommentInputProps) => {
  const [value, setValue] = useState("")
  const mention = useMentionAutocomplete(value, setValue)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    setValue("")
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex gap-2 items-center">
      <input
        ref={(input) => mention.setInputRef(input)}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onSelect={() => mention.trackCursor()}
        onKeyUp={() => mention.trackCursor()}
        placeholder={placeholder}
        autoFocus={autoFocus}
        disabled={isSubmitting}
        className="flex-1 bg-dark-3 rounded-lg px-3 py-2 text-sm text-white outline-none"
      />
      <button type="submit" disabled={isSubmitting || !value.trim()} className="text-primary-500 text-sm font-semibold disabled:opacity-40 cursor-pointer">
        Post
      </button>
      {onCancel && (
        <button type="button" onClick={onCancel} className="text-light-3 text-sm cursor-pointer">
          Cancel
        </button>
      )}
      {mention.activeMention && (
        <MentionSuggestions suggestions={mention.suggestions} onSelect={mention.selectMention} />
      )}
    </form>
  )
}

export default CommentInput