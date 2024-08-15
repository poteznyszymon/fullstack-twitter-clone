import PostSkeleton from "@/components/skeletons/PostSkeleton";
import { GetPostsResponse } from "@/models/interfaces";
import { useQuery } from "@tanstack/react-query";
import PostComponent from "./PostComponent";
import { useToast } from "./ui/use-toast";
import { useEffect } from "react";

interface PostsProps {
  feedType: "forYou" | "following" | "posts" | "likes";
}

const Posts = ({ feedType }: PostsProps) => {
  const { toast } = useToast();

  const getEndPoint = () => {
    switch (feedType) {
      case "forYou":
        return "/api/posts/all";
      case "following":
        return "/api/posts/following";
      case "posts":
        return "";
      case "likes":
        return "";
    }
  };

  const POST_ENDPOINT = getEndPoint();

  const { data, isLoading, refetch, isRefetching } = useQuery<GetPostsResponse>(
    {
      queryKey: ["posts"],
      queryFn: async () => {
        try {
          const res = await fetch(`${POST_ENDPOINT}?page=${1}`);
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || "Something went wrong");
          }
          console.log(data);
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
    }
  );

  useEffect(() => {
    refetch();
  }, [feedType, refetch]);

  return (
    <div>
      {isLoading ||
        (isRefetching && (
          <div>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        ))}
      {data?.posts.map((post) => (
        <PostComponent key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
