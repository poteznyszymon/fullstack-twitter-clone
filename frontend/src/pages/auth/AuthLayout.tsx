import { Outlet } from "react-router-dom";
import LogoSvg from "../../svgs/LogoSvg";
import { Toaster } from "@/components/ui/toaster";

const AuthLayout = () => {
  return (
    <div className="flex justify-center items-center h-screen text-text-main">
      <div className="h-screen w-1/2 hidden md:flex items-center justify-center">
        <LogoSvg className="h-1/2" />
      </div>
      <div className="h-screen w-1/2">
        <Outlet />
        <Toaster />
      </div>
    </div>
  );
};

export default AuthLayout;
