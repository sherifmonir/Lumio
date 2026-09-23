import { Link } from "react-router-dom"
import { splitByMentions } from "@/lib/utils"
import { useResolveMentions } from "@/lib/react-query/queriesAndMutatuins"

type MentionTextProps = {
  text: string
  className?: string
}

const MentionText = ({ text, className }: MentionTextProps) => {
  const mentionedUsers = useResolveMentions(text)
  const parts = splitByMentions(text)

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith("@")) {
          const user = mentionedUsers.get(part.slice(1))
          if (user) {
            return (
              <Link
                key={index}
                to={`/profile/${user.$id}`}
                onClick={(e) => e.stopPropagation()}
                className="text-primary-500 font-semibold"
              >
                {part}
              </Link>
            )
          }
        }
        return part
      })}
    </span>
  )
}

export default MentionText