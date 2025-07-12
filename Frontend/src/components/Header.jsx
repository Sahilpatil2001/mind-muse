import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "../utils/ToastHelper";

import Button from "./Button";
const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignup = () => {
    navigate("/register"); // this redirects to your /register route
  };

  const handleLogout = () => {
    // logout logic here (clear tokens, redirect, etc.)
    navigate("/login");
    console.log("Logged out!");
    localStorage.removeItem("token");
    navigate("/login");
    showSuccessToast("🎉 Logged Out successfully!");
  };

  return (
    <header className="bg-[#030015] text-white shadow-md py-8">
      <div className="w-full flex justify-between items-center">
        {/* Logo or Brand */}
        <Link to="/" className="text-3xl font-bold tracking-wide">
          MindMuse🔊
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 items-center justify-end w-[40%]">
          <Link to="/" className="hover:text-blue-400 transition">
            Home
          </Link>
          <Link to="/dashboard" className="hover:text-blue-400 transition">
            Dashboard
          </Link>

          <Button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-700 text-white px-6 py-1 rounded-md  shadow-red-600 shadow-md"
          >
            Logout
          </Button>
          <Button
            onClick={handleSignup}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white px-6 py-1 rounded-md"
          >
            Sign up
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 8h16M4 16h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-3 space-y-3 px-2 pb-4">
          <Link
            to="/"
            className="block text-white hover:text-blue-400 transition"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className="block text-white hover:text-blue-400 transition"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="block bg-red-600 hover:bg-red-700 w-full text-left px-4 py-2 rounded-md text-white"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
