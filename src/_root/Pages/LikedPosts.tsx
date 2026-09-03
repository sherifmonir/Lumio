import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import GridPostList from "@/components/shared/GridPostList";
import { useUserContext } from "@/context/UseUserContext";
import { useGetLikedPosts } from "@/lib/react-query/queriesAndMutatuins";
import { ClipLoader } from "react-spinners";

const LikedPosts = () => {
  const { user } = useUserContext();
  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage, isFetching } = useGetLikedPosts(user.id);

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  const likedPosts = data?.pages.flatMap((page) => page.posts) ?? [];

  if (!likedPosts.length && !isFetching) {
    return (
      <div className="liked-container">
        <p className="text-light-4">No liked posts</p>
      </div>
    );
  }

  return (
    <div className="liked-container">
      <GridPostList posts={likedPosts} showUser={false} showStats={false} />
      {hasNextPage && (
        <div ref={ref} className="mt-10 flex justify-center w-full">
          <ClipLoader />
        </div>
      )}
    </div>
  );
};

export default LikedPosts