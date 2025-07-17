import type { FC } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { showSuccessToast } from "../utils/toastHelper";
import { useNavigate } from "react-router-dom";

import {
  Waves,
  Headphones,
  ShoppingBag,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const AsideBar: FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    showSuccessToast("🎉 Logged Out successfully!");
    navigate("/login");
    console.log("Logged out!");
  };

  return (
    <aside
      className={`h-screen justify-start bg-[transparent] border border-slate-800  text-white transition-all duration-300 ${
        isOpen ? "w-1/3 p-6" : "w-16 p-4"
      } flex flex-col justify-between`}
    >
      {/* Toggle button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-400 hover:text-white cursor-pointer"
        >
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      <div>
        {/* Logo/Brand */}
        {isOpen && (
          <Link
            to="/"
            className="
    text-3xl font-semibold mb-10 mt-20 block
    bg-gradient-to-r from-purple-400 to-white
    bg-clip-text text-transparent
    transition duration-300
    hover:from-purple-600 hover:to-white
    hover:scale-102
    hover:drop-shadow-lg tracking-wider
  "
          >
            MindMuse Echoes
          </Link>
        )}

        {/* Navigation items */}
        <nav className="space-y-8 tracking-wider">
          <NavItem
            icon={<Waves size={30} />}
            label="Create Personalized Audio"
            isOpen={isOpen}
          />
          <NavItem
            icon={<Headphones size={30} />}
            label="My Audios"
            isOpen={isOpen}
            to="/dashboard"
          />
          <NavItem
            icon={<ShoppingBag size={30} />}
            label="Store"
            isOpen={isOpen}
          />
          <NavItem icon={<User size={30} />} label="Profile" isOpen={isOpen} />
        </nav>
      </div>

      {/* Logout at bottom */}
      <div>
        <NavItem
          icon={<LogOut size={30} />}
          label="Logout"
          isOpen={isOpen}
          onClick={handleLogout}
        />
      </div>
    </aside>
  );
};

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  to?: string;
  onClick?: () => void;
};

const NavItem: FC<NavItemProps> = ({ icon, label, isOpen, to, onClick }) => {
  const content = (
    <div
      className="flex items-center gap-6 text-gray-300 hover:text-white mt-10 cursor-pointer"
      onClick={onClick}
    >
      {icon}
      {isOpen && <span className="text-md">{label}</span>}
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
};
export default AsideBar;
