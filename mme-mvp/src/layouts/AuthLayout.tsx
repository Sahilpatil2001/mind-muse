import type { FC } from "react";
import { Outlet } from "react-router-dom";

const AuthLayout: FC = () => {
    return (
        <div className="auth-layout">
            <Outlet />
        </div>
    );
};

export default AuthLayout;
