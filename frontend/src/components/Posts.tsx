import PostSkeleton from "@/components/skeletons/PostSkeleton";
import { GetPostsResponse, User } from "@/models/interfaces";
import { useInfiniteQuery } from "@tanstack/react-query";
import PostComponent from "./PostComponent";
import { useToast } from "./ui/use-toast";
import { useEffect } from "react";
import InfiniteScrollContainer from "./InfiniteScrollContainer";

interface PostsProps {
  feedType: "forYou" | "following" | "posts" | "likes";
  user?: User;
}

const Posts = ({ feedType, user }: PostsProps) => {
  const { toast } = useToast();

  const getEndPoint = () => {
    switch (feedType) {
      case "forYou":
        return "/api/posts/all";
      case "following":
        return "/api/posts/following";
      case "posts":
        return `/api/posts/user/${user?.username}`;
      case "likes":
        return `/api/posts/liked/${user?._id}`;
      default:
        return "/api/posts/all";
    }
  };

  const POST_ENDPOINT = getEndPoint();

  const {
    data,
    isLoading,
    refetch,
    isRefetching,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery<GetPostsResponse>({
    queryKey: ["posts", feedType],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const res = await fetch(`${POST_ENDPOINT}?page=${pageParam}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        const errorMessage =
          (error as Error).message || "Unknown error occurred";

        console.log(error);
        toast({
          variant: "destructive",
          title: `${errorMessage}`,
        });
        throw error;
      }
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
    initialPageParam: 1,
  });

  useEffect(() => {
    refetch();
  }, [feedType, refetch]);

  return (
    <InfiniteScrollContainer
      className="min-h-screen"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {(isLoading || isRefetching) && (
        <div>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {data?.pages
        .flatMap((page) => page.posts)
        .map((post) => (
          <PostComponent key={post._id} post={post} />
        ))}

      {isFetchingNextPage && (
        <div className="flex justify-center items-center py-8">
          <img className="w-10" src="/loading-icon-white.svg" />
        </div>
      )}
    </InfiniteScrollContainer>
  );
};

export default Posts;
