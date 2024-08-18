import { Post, User } from "@/models/interfaces";
import BookmarksSvg from "@/svgs/BookmarksSvg";
import CommentSvg from "@/svgs/CommentSvg";
import HeartSvg from "@/svgs/HeartSvg";
import RepostSvg from "@/svgs/RepostSvg";
import { formatPostDate } from "@/utils/dataFormat";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "./ui/use-toast";

interface PostProps {
  post: Post;
}

const PostComponent = ({ post }: PostProps) => {
  const { toast } = useToast();
  const [commentHover, setCommentHover] = useState(false);
  const [repostHover, setRepostHover] = useState(false);
  const [heartHover, setHeartHover] = useState(false);
  const [bookmarksHover, setBookmarksHover] = useState(false);

  const { data: authUser } = useQuery<User>({ queryKey: ["authUser"] });
  const likedPost = post.likes.includes(authUser?._id || "");
  const queryClient = useQueryClient();

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/like/${post._id}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "something went wrong");
        }
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: `${error.message}`,
      });
    },
  });

  const handleLike = () => {
    if (isLiking) {
      return;
    }
    likePost();
  };

  return (
    <div className="flex gap-3 p-3 text-text-main border-b-2">
      <Link to={`/profile/${post.user.username}`}>
        <div className="w-10 h-10 rounded-full overflow-hidden object-contain">
          <img
            src={post.user.profileImg || "/profile-skeleton.jpg"}
            alt="user-profile-image"
          />
        </div>
      </Link>
      <div className="flex flex-col w-full">
        <div className="flex gap-2 items-center">
          <Link to={`/profile/${post.user.username}`}>
            <h3 className="font-bold text-sm hover:underline">
              {post.user.fullname}
            </h3>
          </Link>
          <p className="text-sm text-secondary-gray">@{post.user.username}</p>
          <p className="text-sm text-secondary-gray">
            {formatPostDate(post.createdAt)}
          </p>
        </div>
        <div className="tracking-tight">{post.text}</div>
        {post.img && (
          <img
            className="rounded-2xl mt-3 border-2 object-contain h-full"
            src={post.img}
          ></img>
        )}
        <div className="flex mt-3">
          <div
            className="flex gap-1 items-center cursor-pointer"
            onMouseEnter={() => setCommentHover(true)}
            onMouseLeave={() => setCommentHover(false)}
          >
            <CommentSvg
              fill={commentHover ? "#169cfa" : "#71767B"}
              className="w-5"
            />
            <p
              className={`text-xs ${
                commentHover ? "text-twitter-blue" : "text-secondary-gray"
              }`}
            >
              {post.comments.length}
            </p>
          </div>
          <div className="w-full flex justify-evenly">
            <div
              className="flex items-center gap-1 cursor-pointer "
              onMouseEnter={() => setRepostHover(true)}
              onMouseLeave={() => setRepostHover(false)}
            >
              <RepostSvg
                fill={repostHover ? "#27bf13" : "#71767B"}
                className="w-5"
              />
              <p
                className={`text-xs ${
                  repostHover ? "text-[#27bf13]" : "text-secondary-gray"
                }`}
              >
                {post.comments.length}
              </p>
            </div>
            <div
              className="flex items-center gap-1 cursor-pointer"
              onMouseEnter={() => setHeartHover(true)}
              onMouseLeave={() => setHeartHover(false)}
              onClick={handleLike}
            >
              <HeartSvg
                fill={heartHover || likedPost ? "#d43565" : "#71767B"}
                className="w-5"
              />
              <p
                className={`text-xs ${
                  heartHover || likedPost
                    ? "text-[#d43565]"
                    : "text-secondary-gray"
                }`}
              >
                {post.likes.length}
              </p>
            </div>
          </div>
          <div
            className="flex gap-1 items-center cursor-pointer"
            onMouseEnter={() => setBookmarksHover(true)}
            onMouseLeave={() => setBookmarksHover(false)}
          >
            <BookmarksSvg
              fill={bookmarksHover ? "#169cfa" : "#71767B"}
              className="w-5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostComponent;
