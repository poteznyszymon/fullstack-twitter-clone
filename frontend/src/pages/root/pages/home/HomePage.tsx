import { useState } from "react";
import CreatePostTile from "../../../../components/CreatePostTile";
import Posts from "@/components/Posts";

const HomePage = () => {
  const [feedType, setFeedType] = useState<
    "forYou" | "following" | "posts" | "likes"
  >("forYou");

  return (
    <div className="flex-1 min-h-screen max-w-xl border-r-2 border-l-2 border-dark-gray">
      <div className="w-full h-14 flex border-b-2 border-dark-gray sticky top-0 z-10 bg-black bg-opacity-70 backdrop-blur-xl">
        <div
          className="relative w-1/2 flex justify-center items-center hover:bg-dark-gray transition-all duration-300 cursor-pointer"
          onClick={() => setFeedType("forYou")}
        >
          <p
            className={`text-sm transition-all duration-300 ${
              feedType === "forYou"
                ? "text-text-main font-bold"
                : "text-secondary-gray"
            }`}
          >
            For you
          </p>
          <div
            className={`absolute bottom-0 h-1 bg-twitter-blue rounded-full transition-all duration-300 overflow-hidden ${
              feedType === "forYou" ? "w-14" : "w-0"
            }`}
          ></div>
        </div>
        <div
          className="relative w-1/2 flex justify-center items-center hover:bg-dark-gray transition-all duration-300 cursor-pointer"
          onClick={() => setFeedType("following")}
        >
          <p
            className={`text-sm transition-all duration-300 ${
              feedType === "following"
                ? "text-text-main font-bold"
                : "text-secondary-gray"
            }`}
          >
            Following
          </p>
          <div
            className={`absolute bottom-0 h-1 bg-twitter-blue rounded-full transition-all duration-300 overflow-hidden ${
              feedType === "following" ? "w-14" : "w-0"
            }`}
          ></div>
        </div>
      </div>
      <CreatePostTile />
      <Posts feedType={feedType} />
    </div>
  );
};

export default HomePage;
