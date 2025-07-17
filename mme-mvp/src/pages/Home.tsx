import Button from "../components/common/Button.tsx";
import type { FC } from "react";

import { useNavigate } from "react-router-dom";

const Home: FC = () => {
  const navigate = useNavigate();

  return (
    <main className="w-full text-white h-screen flex flex-col items-center justify-around">
      <h1 className="text-6xl text-center font-medium bg-gradient-to-r from-purple-300 to-white bg-clip-text text-transparent tracking-wide">
        Empower Your Vision
      </h1>

      <Button
        onClick={() => navigate("/step-form")}
        className="text-lg bg-transparent py-5 px-10 shadow-none border border-slate-800 hover:bg-transparent tracking-wider"
      >
        Start New Visualization
      </Button>
    </main>
  );
};

export default Home;
