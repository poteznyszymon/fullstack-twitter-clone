import { Skeleton } from "../ui/skeleton";

const NavSkeleton = () => {
  return (
    <div className="flex flex-col items-start justify-center gap-1">
      <Skeleton className="w-28 h-4"/>
      <Skeleton className="w-12 h-4"/>
    </div>
  );
};

export default NavSkeleton;
