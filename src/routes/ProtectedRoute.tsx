import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const token = localStorage.getItem("jwtToken");
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const isAuthorized = roles.some((role: string) => allowedRoles.includes(role));

  return isAuthorized ? children : <Navigate to="/403" replace />;
};

export default ProtectedRoute;

