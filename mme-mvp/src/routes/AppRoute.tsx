import type { FC } from "react";
import { Routes, Route } from "react-router-dom";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/404";
import StepForm from "../components/StepForm";

const AppRoute: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/step-form" element={<StepForm />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoute;
