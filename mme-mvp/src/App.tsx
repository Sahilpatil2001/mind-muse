import type { FC } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/404";
import StepForm from "./components/StepForm";

import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import CreateAudio from "./components/CreateAudio";

const App: FC = () => {
  return (
    <div className="w-full container mx-auto">
      <Routes>
        {/* Main layout with AsideBar */}
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/step-form"
            element={
              <ProtectedRoute>
                <StepForm />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Auth layout without AsideBar/Header */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/test-audio"
            element={<CreateAudio BASE_URL="http://localhost:8000" />}
          />
        </Route>

        {/* Fallback for any unknown route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default App;
