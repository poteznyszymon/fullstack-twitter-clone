import { Link, useNavigate, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { BsCalendar2Week } from "react-icons/bs";
import { FaLink } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@/models/interfaces";
import { ChangeEvent, useEffect, useState } from "react";
import NavSkeleton from "@/components/skeletons/NavSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import useFollow from "@/hooks/useFollow";
import EditProfileDialog from "./EditProfileDialog";
import { formatMemberSinceDate } from "@/utils/dataFormat";
import { MdEdit } from "react-icons/md";
import ProfileSkeleton from "@/components/skeletons/ProfileSkeleton";
import Posts from "@/components/Posts";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { follow } = useFollow();
  const { username } = useParams();
  const [feedType, setFeedType] = useState<"posts" | "likes">("posts");
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [coverImg, setCoverImg] = useState<string | null>(null);
  const queryClinet = useQueryClient();

  const { data: authUser } = useQuery<User>({
    queryKey: ["authUser"],
  });

  const {
    data: user,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery<User>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/user/profile/${username}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        const errorMessage = (error as Error).message || "";
        toast({
          variant: "destructive",
          title: `${errorMessage}`,
        });
        navigate("/");
      }
    },
  });

  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } =
    useMutation({
      mutationFn: async () => {
        try {
          const res = await fetch("/api/user/update", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ coverImg, profileImg }),
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || "something went wrong");
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
        Promise.all([
          queryClinet.invalidateQueries({ queryKey: ["authUser"] }),
          queryClinet.invalidateQueries({ queryKey: ["userProfile"] }),
        ]);
        toast({
          title: "User updated successfully",
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: `${error}`,
        });
      },
    });

  const myProfile = authUser?._id === user?._id;

  const handleImgChange = (
    e: ChangeEvent<HTMLInputElement>,
    state: "coverImg" | "profileImg"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (state === "coverImg") {
          setCoverImg(reader.result as string);
        } else if (state === "profileImg") {
          setProfileImg(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    refetch();
  }, [username, refetch]);

  return (
    <div className="flex-1 flex-col min-h-screen max-w-xl border-r-2 border-l-2 border-dark-gray text-text-main ">
      <div className="h-14 w-full flex sticky top-0 z-10 bg-black bg-opacity-90 backdrop-blur-sm">
        <Link to="/">
          <div className="w-16 h-full flex justify-center items-center">
            <div className="hover:bg-white/10 p-2 rounded-full">
              <IoArrowBack size={22} />
            </div>
          </div>
        </Link>
        {!isLoading && !isRefetching ? (
          <div className="flex  items-center">
            <h1 className="text-lg font-bold">{user?.username}</h1>
          </div>
        ) : (
          <NavSkeleton />
        )}
      </div>
      {!isLoading && !isRefetching ? (
        <div className="w-full aspect-[3/1]  relative group/cover ">
          <img
            className="w-full h-full object-cover "
            src={coverImg || user?.coverImg || "/cover.png"}
            alt="cover-img"
          />
          <label htmlFor="cover">
            {myProfile && (
              <div className="absolute top-1 right-1 text-twitter-blue bg-black p-2 rounded-full cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200">
                <MdEdit />
              </div>
            )}
            <input
              type="file"
              id="cover"
              hidden
              onChange={(e) => handleImgChange(e, "coverImg")}
            />
          </label>

          <div className="w-28 h-28 border-4 border-black rounded-full absolute bottom-0 left-6 translate-y-[50%] group/avatar">
            <img
              className=" rounded-full w-full h-full"
              src={profileImg || user?.profileImg || "/profile-skeleton.jpg"}
              alt="user-profile-photo"
            />
            {myProfile && (
              <label htmlFor="profile">
                <div className="absolute top-0 right-0 text-twitter-blue bg-black p-2 rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer transition duration-200">
                  <MdEdit />
                </div>
              </label>
            )}
            <input
              id="profile"
              type="file"
              hidden
              onChange={(e) => handleImgChange(e, "profileImg")}
            />
          </div>
        </div>
      ) : (
        <ProfileSkeleton />
      )}
      <div className="h-20 flex justify-end items-center px-3 gap-2">
        {!isLoading && !isRefetching ? (
          myProfile && authUser ? (
            <EditProfileDialog authUser={authUser} />
          ) : (
            <Button
              onClick={() => {
                if (user?._id) {
                  follow(user._id);
                } else {
                  toast({
                    variant: "destructive",
                    title: "User ID is missing",
                  });
                }
              }}
              className="rounded-full"
            >
              {authUser?.following.includes(user?._id || "")
                ? "Unfollow"
                : "Follow"}
            </Button>
          )
        ) : (
          <Skeleton className="rounded-full w-24 h-10" />
        )}
        {(coverImg || profileImg) && (
          <Button
            onClick={async () => {
              await updateProfile();
              setProfileImg(null);
              setCoverImg(null);
            }}
            className="rounded-full bg-twitter-blue text-white hover:bg-twitter-blue/90 flex items-center gap-1"
          >
            <p>{isUpdatingProfile ? "Updating" : "Update"}</p>
            <div>
              {isUpdatingProfile && (
                <img className="w-4" src="/loading-icon-white.svg"></img>
              )}
            </div>
          </Button>
        )}
      </div>
      <div className="flex flex-col px-3">
        {!isLoading && !isRefetching ? (
          <h1 className="text-lg font-bold">{user?.fullname}</h1>
        ) : (
          <Skeleton className="w-32 h-4" />
        )}
        {!isLoading && !isRefetching ? (
          <p className="text-sm text-secondary-gray">@{user?.username}</p>
        ) : (
          <Skeleton className="w-24 h-4 mt-4" />
        )}
        {!isLoading && !isRefetching ? (
          <div className="mt-4 text-sm font-semibold">{user?.bio}</div>
        ) : (
          <Skeleton className="h-4 w-60 my-4" />
        )}
        {user?.link && !isLoading && !isRefetching && (
          <div className="flex items-center mt-4 gap-2 text-secondary-gray">
            <FaLink />
            <a
              className="text-sm hover:underline text-twitter-blue "
              href={user?.link}
            >
              {user?.link}
            </a>
          </div>
        )}
        {!isLoading && !isRefetching ? (
          <div className="flex text-secondary-gray mb-2 items-center gap-2">
            <BsCalendar2Week />
            <p className="text-sm font-semibold">
              {formatMemberSinceDate(user?.createdAt || "")}
            </p>
          </div>
        ) : (
          <div className="mb-2">
            <Skeleton className="w-48 h-12" />
          </div>
        )}
        {!isLoading && !isRefetching && (
          <div className="flex text-sm gap-5">
            <div className="flex gap-1">
              <span className="font-bold">{user?.following.length}</span>
              <p className="text-secondary-gray">Following</p>
            </div>
            <div className="flex gap-1">
              <span className="font-bold">{user?.followers.length}</span>
              <p className="text-secondary-gray">Followers</p>
            </div>
          </div>
        )}
      </div>
      <div className="w-full mt-5">
        <div className="w-full h-14 flex border-b-2 border-dark-gray z-10 bg-black bg-opacity-70 backdrop-blur-xl">
          <div
            className="relative w-1/2 flex justify-center items-center hover:bg-dark-gray transition-all duration-300 cursor-pointer"
            onClick={() => setFeedType("posts")}
          >
            <p
              className={`text-sm transition-all duration-300 ${
                feedType === "posts"
                  ? "text-text-main font-bold"
                  : "text-secondary-gray"
              }`}
            >
              Posts
            </p>
            <div
              className={`absolute bottom-0 h-1 bg-twitter-blue rounded-full transition-all duration-300 overflow-hidden ${
                feedType === "posts" ? "w-14" : "w-0"
              }`}
            ></div>
          </div>
          <div
            className="relative w-1/2 flex justify-center items-center hover:bg-dark-gray transition-all duration-300 cursor-pointer"
            onClick={() => setFeedType("likes")}
          >
            <p
              className={`text-sm transition-all duration-300 ${
                feedType === "likes"
                  ? "text-text-main font-bold"
                  : "text-secondary-gray"
              }`}
            >
              Likes
            </p>
            <div
              className={`absolute bottom-0 h-1 bg-twitter-blue rounded-full transition-all duration-300 overflow-hidden ${
                feedType === "likes" ? "w-14" : "w-0"
              }`}
            ></div>
          </div>
        </div>
        <Posts user={authUser} feedType={feedType} />
      </div>
    </div>
  );
};

export default ProfilePage;
