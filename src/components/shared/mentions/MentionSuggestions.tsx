import type { IUser } from "@/types"

type MentionSuggestionsProps = {
  suggestions: IUser[]
  onSelect: (username: string) => void
}

const MentionSuggestions = ({ suggestions, onSelect }: MentionSuggestionsProps) => {
  if (suggestions.length === 0) return null

  return (
    <div className="absolute z-20 mt-1 w-full max-w-xs bg-dark-3 rounded-lg shadow-lg overflow-hidden">
      {suggestions.map((suggestedUser) => (
        <button
          key={suggestedUser.$id}
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onSelect(suggestedUser.username!)}
          className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-dark-4 cursor-pointer"
        >
          <img src={suggestedUser.imageUrl} alt={suggestedUser.name} className="w-6 h-6 rounded-full object-cover" />
          <span className="text-sm text-white">{suggestedUser.name}</span>
          <span className="text-xs text-light-3">@{suggestedUser.username}</span>
        </button>
      ))}
    </div>
  )
}

export default MentionSuggestions