import { Skeleton } from "../ui/skeleton";

const SuggestedSkeleton = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <Skeleton className="w-9 h-9 rounded-full" />
        <div className="flex flex-col justify-center gap-2">
          <Skeleton className="w-24 h-3" />
          <Skeleton className="w-14 h-3" />
        </div>
      </div>
      <Skeleton className="h-8 w-16 rounded-full" />
    </div>
  );
};

export default SuggestedSkeleton;
