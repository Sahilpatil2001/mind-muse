import type { FC } from "react";
import { Outlet } from "react-router-dom";
import AsideBar from "../components/AsideBar";

const MainLayout: FC = () => {
  return (
    <>
      <div className="w-full flex items-center">
        <AsideBar />
        <div className="w-full flex h-screen ">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default MainLayout;
