import type { FC } from "react";
import MyAudios from "../components/MyAudios";

const Dashboard: FC = () => {
  return (
    <div className="flex w-full justify-center items-center h-screen">
      <div className="w-1/2">
        <MyAudios />
      </div>
    </div>
  );
};

export default Dashboard;
