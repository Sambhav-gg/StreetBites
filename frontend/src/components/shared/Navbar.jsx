import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import LanguageSelector from "../LanguageSelector";

// UI + Icons
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User2, MapPin, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { setAuthUser } from "../redux/authSlice";
import { USER_API_END_POINT } from "../utils/constants";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logOutHandler = async () => {
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/logout`,
        {},
        { withCredentials: true }
      );

      if (res.data.message) {
        dispatch(setAuthUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Logout failed. Try again."
      );
    }
  };

  const handleProfileNavigation = () => {
    if (user.role === "vendor") {
      navigate("/vendor/profile");
    } else {
      navigate("/profile");
    }
  };

  const handleDashboardNavigation = () => {
    if (user.role === "vendor") {
      navigate("/vendor/dashboard");
    } else {
      navigate("/user/home");
    }
  };

  return (
    <header className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 shadow-2xl border-b-4 border-yellow-400 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-yellow-300/20 to-orange-300/20 animate-pulse"></div>
        <div className="absolute top-2 left-10 w-4 h-4 bg-yellow-300 rounded-full animate-bounce"></div>
        <div className="absolute top-6 right-20 w-3 h-3 bg-red-400 rounded-full animate-bounce delay-100"></div>
        <div className="absolute bottom-2 left-1/3 w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-200"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-3xl sm:text-4xl animate-bounce">🍛</div>
          <Link
            to="/"
            className="text-xl sm:text-3xl font-black tracking-tight text-white hover:text-yellow-200 transition-all duration-300 transform hover:scale-105 drop-shadow-lg"
          >
            Street<span className="text-yellow-200">Bites</span>
          </Link>
          <div className="hidden sm:flex items-center gap-1 ml-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-200 text-xs font-semibold">LIVE</span>
          </div>
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          {/* Language Selector */}
          <div className="bg-white/15 backdrop-blur-md rounded-xl p-2 border border-white/20">
            <LanguageSelector />
          </div>
          

          {/* Authentication Section */}
          {!user ? (
            <div className="flex gap-3 items-center">
              <Link
                to="/login"
                className="bg-white text-orange-600 px-4 lg:px-6 py-2 lg:py-2.5 rounded-xl font-bold hover:bg-yellow-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border-2 border-transparent hover:border-yellow-300 text-sm lg:text-base"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-orange-900 px-4 lg:px-6 py-2 lg:py-2.5 rounded-xl font-bold hover:from-yellow-300 hover:to-yellow-200 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border-2 border-yellow-500 text-sm lg:text-base"
              >
                Join Free
              </Link>
            </div>
          ) : (
            <div className="flex gap-3 lg:gap-4 items-center">
              {/* Welcome Message */}
              <div className="hidden xl:block text-white/95 text-sm bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/20">
                Hey, <span className="font-bold text-yellow-200">{user.name.split(' ')[0]}!</span> 👋
              </div>

              {/* Dashboard Button */}
              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDashboardNavigation}
                className="bg-white/10 hover:bg-white/20 text-white px-3 lg:px-4 py-2 rounded-xl font-semibold transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/40 text-sm lg:text-base"
              >
                🏠 Dashboard
              </motion.button> */}

              {/* User Avatar Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <div className="relative cursor-pointer group">
                    <Avatar className="w-10 h-10 lg:w-12 lg:h-12 ring-4 ring-yellow-300/70 hover:ring-yellow-200 transition-all duration-200 transform group-hover:scale-110 shadow-lg">
                      <AvatarImage
                        src={
                          user.profilePhoto ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
                        }
                        alt={user.name}
                      />
                    </Avatar>
                    {/* Enhanced Status Indicator */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 bg-green-400 rounded-full border-2 lg:border-3 border-white shadow-lg animate-pulse"></div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="bg-white w-72 lg:w-80 mt-2 p-0 rounded-2xl shadow-2xl border-0 ring-1 ring-orange-200/50 overflow-hidden">
                  {/* User Info Header */}
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 lg:p-6 text-white">
                    <div className="flex items-center gap-3 lg:gap-4">
                      <Avatar className="w-12 h-12 lg:w-16 lg:h-16 ring-4 ring-white/30 shadow-lg">
                        <AvatarImage
                          src={
                            user.profilePhoto ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
                          }
                          alt={user.name}
                        />
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-lg lg:text-xl truncate">{user.name}</p>
                        <p className="text-orange-100 text-sm truncate">{user.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-white/30">
                            {user.role === "vendor" ? "🏪 Vendor" : "🍽️ Foodie"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 space-y-3">
                    <Button
                      onClick={handleProfileNavigation}
                      className="w-full flex gap-3 items-center justify-start h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white transition-all duration-200 rounded-xl font-semibold"
                    >
                      <User2 size={20} />
                      <span>View Profile</span>
                    </Button>

                    {/* <Button
                      onClick={handleDashboardNavigation}
                      className="w-full flex gap-3 items-center justify-start h-12 bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 rounded-xl font-semibold"
                    >
                      <ShoppingBag size={20} />
                      <span>{user.role === "vendor" ? "Vendor Dashboard" : "Browse Stalls"}</span>
                    </Button> */}

                    <hr className="my-3 border-gray-200" />

                    <Button
                      onClick={logOutHandler}
                      className="w-full flex gap-3 items-center justify-start h-12 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200 rounded-xl font-semibold border border-red-200"
                    >
                      <LogOut size={20} />
                      <span>Logout</span>
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          {user && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDashboardNavigation}
              className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20"
            >
              🏠
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gradient-to-r from-orange-600 to-amber-600 border-t border-yellow-400/50 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-4">
              {!user ? (
                <>
                  {/* Language Selector Mobile */}
                  <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/20">
                    <LanguageSelector />
                  </div>
                  
                  {/* Mobile Auth Buttons */}
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full bg-white text-orange-600 px-6 py-3 rounded-xl font-bold text-center hover:bg-yellow-50 transition-all duration-200 shadow-lg"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full bg-gradient-to-r from-yellow-400 to-yellow-300 text-orange-900 px-6 py-3 rounded-xl font-bold text-center hover:from-yellow-300 hover:to-yellow-200 transition-all duration-200 shadow-lg"
                    >
                      Join Free
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  {/* User Info Mobile */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12 ring-4 ring-yellow-300/70">
                        <AvatarImage
                          src={
                            user.profilePhoto ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
                          }
                          alt={user.name}
                        />
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white truncate">{user.name}</p>
                        <p className="text-orange-100 text-sm truncate">{user.email}</p>
                        <span className="inline-block px-2 py-1 bg-white/20 text-white text-xs font-bold rounded-full mt-1">
                          {user.role === "vendor" ? "🏪 Vendor" : "🍽️ Foodie"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        handleProfileNavigation();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex gap-3 items-center justify-center bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg"
                    >
                      <User2 size={20} />
                      View Profile
                    </button>

                    {/* <button
                      onClick={() => {
                        handleDashboardNavigation();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex gap-3 items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg"
                    >
                      <ShoppingBag size={20} />
                      {user.role === "vendor" ? "Vendor Dashboard" : "Browse Stalls"}
                    </button> */}

                    <button
                      onClick={() => {
                        logOutHandler();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex gap-3 items-center justify-center bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg"
                    >
                      <LogOut size={20} />
                      Logout
                    </button>
                  </div>

                  {/* Language Selector Mobile */}
                  <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/20">
                    <LanguageSelector />
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;