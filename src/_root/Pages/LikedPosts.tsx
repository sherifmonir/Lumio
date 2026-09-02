import GridPostList from "@/components/shared/GridPostList";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutatuins";
import { ClipLoader } from "react-spinners";

const LikedPosts = () => {
  const { data: currentUser } = useGetCurrentUser();

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <ClipLoader />
      </div>
    );

  return (
    <div className="liked-container">
      {currentUser.liked.length === 0 && (
        <p className="text-light-4">No liked posts</p>
      )}

      <GridPostList posts={currentUser.liked} showUser={false} showStats={false} />
    </div>
  );
};

export default LikedPosts;