import type { FC } from "react";
import { Link } from "react-router-dom";

const NotFound: FC = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-6">Whoops! 🥲 Page Not Found</p>
      <Link
        to="/"
        className="w-[10%] py-4 bg-purple-600 text-white text-center font-semibold rounded-[10px] cursor-pointer hover:bg-purple-700 transition duration-200"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
