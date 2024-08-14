import { Outlet } from "react-router-dom";
import LeftPanel from "../../components/LeftPanel";
import RightPanel from "../../components/RightPanel";
import { Toaster } from "@/components/ui/toaster";

const RootLayout = () => {
  return (
    <div className="max-w-7xl mx-auto flex justify-center">
      <LeftPanel />
      <Outlet />
      <Toaster />
      <RightPanel />
    </div>
  );
};

export default RootLayout;
