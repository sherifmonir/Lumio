import { Link } from "react-router-dom";

import type { IUser } from "@/types";
import FollowButton from "./FollowButton";

type UserCardProps  = {
  user: IUser
};

const UserCard = ({ user }: UserCardProps) => {
  return (
    <div className="user-card">
    <Link to={`/profile/${user.$id}`} className="flex-center flex-col gap-2 mb-5">
      <img
        src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14"
      />
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {user.name}
        </p>
    </Link>
    <div >
        <FollowButton targetUserId={user.$id}/>
      </div>
    </div>
  
  )
}

export default UserCard