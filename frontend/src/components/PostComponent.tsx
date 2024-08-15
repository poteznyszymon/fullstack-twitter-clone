import { Post } from "@/models/interfaces";
import BookmarksSvg from "@/svgs/BookmarksSvg";
import CommentSvg from "@/svgs/CommentSvg";
import HeartSvg from "@/svgs/HeartSvg";
import RepostSvg from "@/svgs/RepostSvg";
import { formatPostDate } from "@/utils/dataFormat";
import { Link } from "react-router-dom";

interface PostProps {
  post: Post;
}

const PostComponent = ({ post }: PostProps) => {
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
          <img className="h-80 rounded-2xl mt-3 border-2 object-contain" src={post.img}></img>
        )}
        <div className="flex mt-3">
          <div className="flex gap-1 items-center cursor-pointer">
            <CommentSvg className="w-5" />
            <p className="text-xs text-secondary-gray">
              {post.comments.length}
            </p>
          </div>
          <div className="w-full flex justify-evenly">
            <div className="flex items-center gap-1 cursor-pointer">
              <RepostSvg className="w-5" />
              <p className="text-xs text-secondary-gray">
                {post.comments.length}
              </p>
            </div>
            <div className="flex items-center gap-1 cursor-pointer">
              <HeartSvg className="w-5" />
              <p className="text-xs text-secondary-gray">
                {post.comments.length}
              </p>
            </div>
          </div>
          <div className="flex gap-1 items-center cursor-pointer">
            <BookmarksSvg fill="#71767B" className="w-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostComponent;
