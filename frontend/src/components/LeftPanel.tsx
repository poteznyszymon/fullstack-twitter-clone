import { Link } from "react-router-dom";
import XSvg from "../svgs/LogoSvg";
import { IoIosMore } from "react-icons/io";
import HomeSvg from "../svgs/HomeSvg";
import NotificationSvg from "../svgs/NotificationSvg";
import ProfileSvg from "../svgs/ProfileSvg";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./ui/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { User } from "@/models/interfaces";
import BookmarksSvg from "@/svgs/BookmarksSvg";

const LeftPanel = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: authUser } = useQuery<User>({ queryKey: ["authUser"] });

  const { mutate: logoutMutation, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
        });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast({
        title: "User logout successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: `${error.message}`,
      });
    },
  });

  const handleClick = () => {
    logoutMutation();
  };
  return (
    <div className="w-16 xl:w-72 p-0 xl:p-4 h-screen flex flex-col text-text-main  sticky top-0">
      <Link to={"/"}>
        <div className="fill-white w-8 m-4 xl:m-0 xl:w-11 xl:pl-3">
          <XSvg />
        </div>
      </Link>
      <div className="flex-1 mt-6">
        <Link to="/">
          <div className="flex gap-3 items-center py-2 hover:bg-white/10 rounded-full pl-0 xl:pl-3 mx-1 xl:mx-0 justify-center xl:justify-start transition-all duration-300">
            <HomeSvg className="w-7" />
            <h2 className="font-bold tracking-tighter hidden xl:block">Home</h2>
          </div>
        </Link>
        <Link to={`/notifications`}>
          <div className="flex gap-3 items-center py-2 hover:bg-white/10 rounded-full pl-0 xl:pl-3 mx-1 xl:mx-0 justify-center xl:justify-start transition-all duration-300">
            <NotificationSvg className="w-7" />
            <h2 className="font-bold tracking-tighter hidden xl:block">
              Notifications
            </h2>
          </div>
        </Link>
        <Link to={`/bookmarks`}>
          <div className="flex gap-3 items-center py-2 hover:bg-white/10 rounded-full pl-0 xl:pl-3 mx-1 xl:mx-0 justify-center xl:justify-start transition-all duration-300">
            <BookmarksSvg className="w-7" />
            <h2 className="font-bold tracking-tighter hidden xl:block">
              Bookmarks
            </h2>
          </div>
        </Link>
        <Link to={`/profile/${authUser?.username}`}>
          <div className="flex gap-3 items-center py-2 hover:bg-white/10 rounded-full pl-0 xl:pl-3 mx-1 xl:mx-0 justify-center xl:justify-start transition-all duration-300">
            <ProfileSvg className="w-7" />
            <h2 className="font-bold tracking-tighter hidden xl:block">
              Profile
            </h2>
          </div>
        </Link>
      </div>
      {authUser ? (
        <Popover>
          <PopoverTrigger>
            <div className="h-16 w-full cursor-pointer active:bg-white/20 hover:bg-white/10 transition-all duration-300 rounded-full flex items-center  px-0 py-3 xl:px-4 justify-center">
              <div className="w-10 h-10 bg-white rounded-full ml-3 xl:ml-0 overflow-hidden">
                <img
                  src={authUser.profileImg || "/profile-skeleton.jpg"}
                  className="object-contain"
                  alt="profile-image"
                />
              </div>
              <div className="flex-1 h-full flex flex-col justify-center ml-3 text-start">
                <h2 className="font-bold text-sm hidden xl:block ">
                  {authUser.fullname}
                </h2>
                <p className="text-xs text-secondary-gray hidden xl:block">
                  @{authUser.username}
                </p>
              </div>
              <div className="hidden xl:block p-2 rounded-full">
                <IoIosMore size={25} />
              </div>
            </div>
            <PopoverContent className="border-none bg-transparent">
              <Button
                className="w-full flex gap-1 items-center"
                onClick={handleClick}
              >
                <p>Logout {`@${authUser?.username}`}</p>
                {isPending && (
                  <img
                    src="/loading-icon-black.svg"
                    alt="loading-icon"
                    className="h-4"
                  />
                )}
              </Button>
            </PopoverContent>
          </PopoverTrigger>
        </Popover>
      ) : (
        <div className="h-16 w-full"></div>
      )}
    </div>
  );
};

export default LeftPanel;
