import useFollow from "@/hooks/useFollow";
import { User } from "@/models/interfaces";
import { Link } from "react-router-dom";

interface userTileProps {
  user: User;
}

const UserTile = ({ user }: userTileProps) => {
  const { follow, isPending } = useFollow();

  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex gap-2 items-center">
        <Link to={`/profile/${user?.username}`}>
          <div className="w-9 h-9 rounded-full bg-white overflow-hidden">
            <img
              className="object-contain"
              src={user?.profileImg || "/profile-skeleton.jpg"}
              alt="user-profile"
            />
          </div>
        </Link>
        <div className="flex flex-col">
          <h2>{user?.fullname}</h2>
          <p className="text-xs text-secondary-gray">@{user?.username}</p>
        </div>
      </div>
      <button
        className="bg-white text-black font-semibold px-3 py-2 rounded-full text-xs hover:bg-opacity-90 active:bg-opacity-80 flex items-center gap-1 "
        onClick={() => follow(user._id)}
      >
        <p>Follow</p>
        {isPending && <img src="/loading-icon-black.svg" className="h-4"></img>}
      </button>
    </div>
  );
};

export default UserTile;
