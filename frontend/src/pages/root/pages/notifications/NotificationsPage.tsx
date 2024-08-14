import { IoArrowBack } from "react-icons/io5";
import { Link } from "react-router-dom";

const NotificationsPage = () => {
  return (
    <div className="flex-1 flex-col min-h-screen max-w-xl border-r-2 border-l-2 border-dark-gray text-text-main">
      <div className="flex sticky top-0">
        <Link to="/">
          <div className="w-16 h-full flex justify-center items-center">
            <div className="hover:bg-white/10 p-2 rounded-full">
              <IoArrowBack size={22} />
            </div>
          </div>
        </Link>
        <Link to="/notifications">
          <div className="h-14 w-full flex-col items-center px-3 pt-2">
            <h1 className="font-bold text-xl">Notifications</h1>
            <p className="text-xs text-secondary-gray">@poteznyszymon</p>
          </div>
        </Link>
      </div>
      <div className="w-full h-screen"></div>
    </div>
  );
};

export default NotificationsPage;
