import React from "react";
import AsideBar from "../components/AsideBar";
import MainSection from "../components/MainSection";
import AudioGallery from "../components/AudioGallery";

const Dashboard = () => {
  return (
    <>
      <div className="flex w-full">
        <div className="w-[30%] py-20 px-10 bg-blue-950">
          <AsideBar>Aside Content</AsideBar>
        </div>
        <div className="w-[70%] py-10 px-20">
          <AudioGallery />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
