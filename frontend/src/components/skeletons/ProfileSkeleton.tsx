import { Skeleton } from "../ui/skeleton";

const ProfileSkeleton = () => {
  return (
    <div className="w-full aspect-[3/1] relative">
      <Skeleton className="w-full h-full rounded-none" />
      <div className="bg-black w-28 h-28 absolute bottom-0 left-6 translate-y-[50%] rounded-full">
        <Skeleton className="w-28 h-28 border-4 border-black rounded-full " />
      </div>
    </div>
  );
};

export default ProfileSkeleton;
