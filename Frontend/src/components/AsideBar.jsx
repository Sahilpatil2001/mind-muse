import React from "react";

const AsideBar = ({ children }) => {
  return (
    <aside className="w-full text-white overflow-y-auto">{children}</aside>
  );
};

export default AsideBar;
