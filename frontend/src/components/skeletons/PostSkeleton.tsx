import { Skeleton } from "../ui/skeleton";

const PostSkeleton = () => {
  return (
    <div className="flex flex-col p-3 gap-3">
      <div className="w-full flex gap-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col flex-1 gap-2 justify-center">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-36" />
        </div>
      </div>
      <Skeleton className="w-full h-32" />
    </div>
  );
};

export default PostSkeleton;
