import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pen, ArrowLeft, User, Mail, Calendar, Heart } from "lucide-react";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { REVIEW_API_END_POINT } from "../utils/constants";


const Profile = () => {
  const { user } = useSelector((store) => store.auth);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [total,setTotal] = useState();

   useEffect(() => {
    if (user?._id) {
      fetchUserReviews(user._id);
    }
  }, [user]);
  
  const fetchUserReviews = async () => {
  try {
    const response = await axios.get(`${REVIEW_API_END_POINT}/user/${user._id}`);
    
    const reviews = response.data;
    setTotal(reviews.length); // Set total number of reviews

    // You can also return the reviews if needed
    return reviews;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    setTotal(0); // fallback if error
    return [];
  }
};

  const avatarSrc =
    user.profilePhoto ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || "User")}`;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Floating Food Emojis */}
        <div className="absolute top-20 left-20 text-6xl opacity-8 animate-bounce">👤</div>
        <div className="absolute top-1/3 right-32 text-5xl opacity-10 animate-bounce delay-300">🍛</div>
        <div className="absolute bottom-1/4 left-40 text-7xl opacity-6 animate-bounce delay-600">⭐</div>
        <div className="absolute bottom-32 right-20 text-4xl opacity-12 animate-bounce delay-900">❤️</div>
        
        {/* Gradient Blobs */}
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-300/15 to-yellow-300/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-amber-300/15 to-orange-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center justify-center px-4 py-10 min-h-screen"
      >
        {/* Header */}
        <motion.div 
          variants={itemVariants}
          className="w-full max-w-4xl mb-8"
        >
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/user/home")}
              className="flex items-center gap-3 bg-white/70 backdrop-blur-sm text-orange-600 hover:text-orange-800 transition-all duration-200 px-4 py-2 rounded-xl font-semibold border border-orange-200 hover:border-orange-300 shadow-lg"
            >
              <ArrowLeft size={20} />
              Back to Home
            </motion.button>
            
            <div className="text-center">
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">
                👤 My Profile
              </h1>
              <p className="text-gray-600 font-medium">Manage your StreetBites account</p>
            </div>
            
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-gradient-to-br from-white/80 to-orange-50/60 backdrop-blur-lg border-2 border-white/50 w-full max-w-4xl rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300"
        >
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Avatar Section */}
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative"
              >
                <Avatar className="w-32 h-32 ring-6 ring-orange-300 shadow-2xl">
                  <AvatarImage src={avatarSrc} alt={user.name || "User"} />
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white flex items-center justify-center">
                  <span className="text-xs">✓</span>
                </div>
              </motion.div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center lg:text-left space-y-4">
              <div>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                  {user.name}
                </h2>
                <div className="flex flex-col lg:flex-row gap-4 text-gray-600">
                  <div className="flex items-center justify-center lg:justify-start gap-2">
                    <Mail className="text-orange-500" size={18} />
                    <span className="font-medium">{user.email || "No email provided"}</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-2">
                    <User className="text-orange-500" size={18} />
                    <span className="font-medium capitalize">{user.role || "User"}</span>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-center border border-orange-200">
                  <div className="text-2xl font-bold text-orange-600">
                    {user.likedStalls?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">❤️ Liked Stalls</div>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-center border border-orange-200">
                  <div className="text-2xl font-bold text-orange-600">
                    {total || 0}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">⭐ Reviews</div>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-center border border-orange-200">
                  <div className="text-2xl font-bold text-orange-600">
                    {user.role === 'vendor' ? 'Vendor' : 'Foodie'}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {user.role === 'vendor' ? '🏪 Status' : '🍽️ Status'}
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <div className="flex flex-col gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpen(true)}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-orange-400"
              >
                <Pen size={20} />
                Edit Profile
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(user.role === 'vendor' ? '/vendor/dashboard' : '/user/home')}
                className="bg-white/70 hover:bg-white/90 text-orange-600 hover:text-orange-800 px-8 py-3 rounded-xl font-semibold border-2 border-orange-200 hover:border-orange-300 transition-all duration-200"
              >
                🏠 Go to Dashboard
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Additional Info Cards */}
        <motion.div 
          variants={itemVariants}
          className="w-full max-w-4xl mt-8  gap-6"
        >
          {/* Account Details */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-white/70 to-yellow-50/50 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/50 shadow-lg"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              📋 Account Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-orange-200">
                <span className="text-gray-600 font-medium">Phone Number:</span>
                <span className="font-semibold text-gray-900">{user.phoneNumber || 'Not provided'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-orange-200">
                <span className="text-gray-600 font-medium">Member Since:</span>
                <span className="font-semibold text-gray-900">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 font-medium">Account Type:</span>
                <span className={`font-bold px-3 py-1 rounded-full text-sm ${
                  user.role === 'vendor' 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {user.role === 'vendor' ? '🏪 Vendor' : '🍽️ Food Lover'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          {/* <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-white/70 to-amber-50/50 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/50 shadow-lg"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              ⚡ Quick Actions
            </h3>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02, x: 5 }}
                onClick={() => navigate('/favorites')}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/50 hover:bg-white/70 border border-orange-200 hover:border-orange-300 transition-all duration-200"
              >
                <Heart className="text-red-500" size={20} />
                <span className="font-semibold text-gray-800">View Liked Stalls</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02, x: 5 }}
                onClick={() => navigate('/user/home')}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/50 hover:bg-white/70 border border-orange-200 hover:border-orange-300 transition-all duration-200"
              >
                <span className="text-xl">🗺️</span>
                <span className="font-semibold text-gray-800">Explore Stalls</span>
              </motion.button>
              
              {user.role === 'vendor' && (
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  onClick={() => navigate('/vendor/add-stall')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/50 hover:bg-white/70 border border-orange-200 hover:border-orange-300 transition-all duration-200"
                >
                  <span className="text-xl">➕</span>
                  <span className="font-semibold text-gray-800">Add New Stall</span>
                </motion.button>
              )}
            </div>
          </motion.div> */}
        </motion.div>
      </motion.div>

      {/* Dialog */}
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;