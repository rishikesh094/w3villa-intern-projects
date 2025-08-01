import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log("ProtectedRoute: user =", user);
  console.log("ProtectedRoute: loading =", loading);

  // Wait until user info is fetched
  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  // If not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in but doesn't have the required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // All checks passed
  return children;
};

export default ProtectedRoute;
