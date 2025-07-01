// src/components/auth/PublicRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// const PublicRoute = ({ children }) => {
//   const { user } = useSelector((state) => state.auth);

//   if (user === undefined) {
//     return null; // wait until Redux persist loads
//   }

//   return user ? <Navigate to="/user/home" replace /> : children;
// };

// export default PublicRoute;
const PublicRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
  
    if (user === undefined) return null;
  
    if (user?.role === "vendor") return <Navigate to="/vendor/home" replace />;
    if (user?.role === "user") return <Navigate to="/user/home" replace />;
  
    return children;
  };
  export default PublicRoute;
