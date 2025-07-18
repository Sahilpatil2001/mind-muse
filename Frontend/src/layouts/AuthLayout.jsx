// src/layouts/AuthLayout.jsx
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
