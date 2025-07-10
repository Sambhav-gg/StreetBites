import EditStallPage from "./components/pages/EditStallPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import UserHomePage from "./components/pages/UserHomePage";
import Profile from "./components/profile/Profile";
import StallDetailPage from "./components/pages/StallDetailPage";
import VendorHomePage from "./components/pages/vendorHomePage";
import AddStallPage from "./components/pages/AddStallPage";
// Route guards
import PublicRoute from "./components/auth/PublicRoute";
import UserProtectedRoute from "./components/auth/UserProtectedRoute";
import VendorProtectedRoute from "./components/auth/VendorProtectedRoute";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import AnalyticsDashboard from "./components/pages/AnalyticsDashboard";
import VendorDashboardPage from "./components/pages/VendorDashboardPage";
import ScrollToTop from "./components/utils/ScrollToTop";
function App() {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* ---------- Public Routes ---------- */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* ---------- User Protected Routes ---------- */}
        <Route
          path="/user/home"
          element={
            <UserProtectedRoute>
              <UserHomePage />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <UserProtectedRoute>
              <Profile />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/stall/:id"
          element={
            <UserProtectedRoute>
              <StallDetailPage />
            </UserProtectedRoute>
          }
        />
      {/* ---------- Vendor Protected Routes ---------- */}

        <Route
          path="/vendor/profile"
          element={
            <VendorProtectedRoute>
              <Profile />
            </VendorProtectedRoute>
          }
        />
        <Route
          path="/vendor/stalls/add"
          element={
            <VendorProtectedRoute>
              <AddStallPage />
            </VendorProtectedRoute>
          }
        />

        <Route
          path="/vendor/home"
          element={
            <VendorProtectedRoute>
              <VendorHomePage />
            </VendorProtectedRoute>
          }
        />
        <Route
          path="/vendor/dashboard"
          element={
            <VendorProtectedRoute>
              <VendorDashboardPage />
            </VendorProtectedRoute>
          }
        />
        <Route path="/vendor/edit-stall/:id" element={<EditStallPage />} />
        <Route
          path="/vendor/analytics"
          element={
            <VendorProtectedRoute>
              <AnalyticsDashboard />
            </VendorProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
