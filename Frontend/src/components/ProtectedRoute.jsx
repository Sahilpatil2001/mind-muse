// components / ProtectedRoute.jsx;
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // const token = localStorage.getItem("token");

  // if (!token) {
  //   return token ? children : <Navigate to="/login" replace />;
  // }

  return children;
};

export default ProtectedRoute;
