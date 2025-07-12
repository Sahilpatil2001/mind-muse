import React from "react";

const Button = ({ children, onClick, type, className = "" }) => {
  return (
    <>
      <div className="">
        <button
          type={type}
          onClick={onClick}
          className={`py-3 bg-blue-500 text-white font-semibold rounded-[10px] cursor-pointer  hover:bg-blue-700 transition duration-200 shadow-md shadow-blue-800  ${className}`}
        >
          {children}
        </button>
      </div>
    </>
  );
};

export default Button;
