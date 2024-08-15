import { IoIosSearch } from "react-icons/io";
import UserTile from "./UserTile";
import SuggestedSkeleton from "./skeletons/SuggestedSkeleton";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/models/interfaces";

const RightPanel = () => {
  const { data: suggestedUsers, isLoading } = useQuery<User[]>({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      const res = await fetch("/api/user/suggested");
      const data = await res.json();
      console.log(data);
      return data;
    },
  });

  return (
    <>
      <div className="w-72 xl:w-80 h-screen hidden lg:flex flex-col text-text-main">
        <div className="bg-dark-gray  h-11 rounded-full flex items-center fixed w-72 xl:w-80 top-2 mx-5">
          <label
            htmlFor="search"
            className="text-secondary-gray px-3 cursor-pointer"
          >
            <IoIosSearch size={23} />
          </label>
          <input
            id="search"
            className="grow mr-5 bg-transparent placeholder:text-secondary-gray text-white outline-none"
            type="text"
            placeholder="Search"
          />
        </div>
        <div className="w-72 xl:w-80 border border-dark-gray mx-5 rounded-2xl fixed top-16 p-3 flex flex-col gap-4">
          <h1 className="text-lg font-bold tracking-tighter">Who to follow</h1>
          {isLoading && (
            <div className="flex flex-col gap-3">
              <SuggestedSkeleton />
              <SuggestedSkeleton />
              <SuggestedSkeleton />
              <SuggestedSkeleton />
            </div>
          )}
          {!isLoading && (
            <div className="flex flex-col gap-3">
              {suggestedUsers?.map((user) => (
                <UserTile user={user} key={user._id} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="h-screen bg-black hidden sm:block sm:w-20 lg:hidden"></div>
    </>
  );
};

export default RightPanel;
