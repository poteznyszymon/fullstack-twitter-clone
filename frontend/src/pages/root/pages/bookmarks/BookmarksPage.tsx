import { IoArrowBack } from "react-icons/io5";
import { Link } from "react-router-dom";

const BookmarksPage = () => {
  return (
    <div className="flex-1 flex-col min-h-screen max-w-xl border-r-2 border-l-2 border-dark-gray text-text-main">
      <div className="flex sticky top-0 z-10 bg-black">
        <Link to="/">
          <div className="w-16 h-full flex justify-center items-center">
            <div className="hover:bg-white/10 p-2 rounded-full">
              <IoArrowBack size={22} />
            </div>
          </div>
        </Link>
        <Link to="/bookmarks">
          <div className="h-14 w-full flex-col items-center px-3 pt-2">
            <h1 className="font-bold text-xl">Bookmarks</h1>
            <p className="text-xs text-secondary-gray">@poteznyszymon</p>
          </div>
        </Link>
      </div>
      <div className="w-full h-screen items-center mt-20 sm:mt-14 text-white flex flex-col">
        <div>
          <h1 className="text-3xl font-bold">Save posts for later</h1>
          <p className="text-secondary-gray">
            Bookmark posts to easily find them again in the {<br />}future.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookmarksPage;
