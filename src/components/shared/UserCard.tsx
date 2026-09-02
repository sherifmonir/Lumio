import { Link } from "react-router-dom";

import type { IUser } from "@/types";
import FollowButton from "./FollowButton";

type UserCardProps  = {
  user: IUser
};

const UserCard = ({ user }: UserCardProps) => {
  return (
<<<<<<< HEAD
    
      <Link to={`/profile/${user.$id}`} className="user-card">
        <img
          src={user.imageUrl}
          alt="creator"
          className="rounded-full w-18 h-18"
        />
=======
    <div className="user-card">
    <Link to={`/profile/${user.$id}`} className="flex-center flex-col gap-2 mb-5">
      <img
        src={user.imageUrl || (user.imageUrl)}
        alt="creator"
        className="rounded-full w-14 h-14"
      />
>>>>>>> 50199f104dbf3f46397349842b01e1e912203278
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