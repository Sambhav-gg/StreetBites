import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const VendorProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "vendor") return <Navigate to="/user/home" replace />;

  return children;
};

export default VendorProtectedRoute;
