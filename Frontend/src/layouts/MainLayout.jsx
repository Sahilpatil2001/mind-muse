// src/layouts/MainLayout.jsx
import Header from "../components/Header";
import AsideBar from "../components/AsideBar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Header />
      <div className="main-content">
        <AsideBar />
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
