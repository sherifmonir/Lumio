import { Link } from "react-router-dom";

import type { IUser } from "@/types";
import FollowButton from "./FollowButton";

type UserCardProps  = {
  user: IUser
};

const UserCard = ({ user }: UserCardProps) => {
  return (    
      <Link to={`/profile/${user.$id}`} className="user-card">
        <img
          src={user.imageUrl}
          alt="creator"
          className="rounded-full w-18 h-18"
        />
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {user.name}
        </p>
        <div >
       <FollowButton targetUserId={user.$id}/>
      </div>
      </Link>
    
    
  
  )
}

export default UserCard