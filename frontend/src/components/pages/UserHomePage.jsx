import Navbar from "../shared/Navbar";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

import StallCard from "../shared/StallCard";
import Sidebar from "../shared/Sidebar";
import SearchBar from "../shared/SearchBar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLocation } from "../redux/locationSlice";
import { STALL_API_END_POINT } from "../utils/constants";
import { PERSON_API_END_POINT } from "../utils/constants";

const UserHomePage = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [stalls, setStalls] = useState([]);
  const [likedStalls, setLikedStalls] = useState([]);
  const [locationDenied, setLocationDenied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const { lat, lng } = useSelector((store) => store.location);
  const navigate = useNavigate();

  // Ask for location when 'nearby' is selected
  useEffect(() => {
    if (selectedFilter === "nearby") {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            dispatch(setLocation({ lat: latitude, lng: longitude }));
            setLocationDenied(false);
          },
          (error) => {
            console.error("Error getting location: ", error);
            setLocationDenied(true);
            setStalls([]); // Clear stalls if location is denied
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        setLocationDenied(true);
        setStalls([]); // Clear stalls if location not supported
      }
    }
  }, [selectedFilter, dispatch]);

  const fetchStalls = async () => {
    setIsLoading(true);
    try {
      let res;

      if (searchTerm.trim()) {
        res = await axios.get(
          `${STALL_API_END_POINT}/search?dish=${searchTerm}`
        );
      } else if (selectedCity) {
        res = await axios.get(
          `${STALL_API_END_POINT}/by-city?city=${selectedCity.value}`
        );
      } else {
        switch (selectedFilter) {
          case "all":
            res = await axios.get(`${STALL_API_END_POINT}/all`);
            break;

          case "nearby":
            if (locationDenied || !lat || !lng) {
              res = { data: [] };
            } else {
              res = await axios.get(
                `${STALL_API_END_POINT}/nearby?lat=${lat}&lng=${lng}`
              );
            }
            break;

          case "top-rated":
            res = await axios.get(`${STALL_API_END_POINT}/top-rated`);
            break;

          case "liked":
            res = await axios.get(`${ PERSON_API_END_POINT }/liked-stalls`);
            break;

          default:
            res = { data: [] };
        }
      }

      setStalls(res?.data || []);
    } catch (error) {
      console.error("Failed to fetch stalls:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedFilter === "nearby" && locationDenied) return;
    fetchStalls();
  }, [selectedFilter, searchTerm, lat, lng, locationDenied, selectedCity]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const getEmptyStateMessage = () => {
    if (selectedFilter === "liked") return "You haven't liked any stalls yet. Start exploring to find your favorites! ❤️";
    if (selectedFilter === "top-rated") return "No top-rated stalls available right now. Check back soon! ⭐";
    if (selectedFilter === "all") return "No stalls available right now. Be the first vendor to join! 🏪";
    if (selectedFilter === "nearby" && locationDenied) return "";
    return "No stalls found matching your search. Try different keywords! 🔍";
  };

  const getFilterTitle = () => {
    switch (selectedFilter) {
      case "all": return "🌟 All Amazing Stalls";
      case "nearby": return "📍 Stalls Near You";
      case "top-rated": return "⭐ Top-Rated Favorites";
      case "liked": return "❤️ Your Liked Stalls";
      default: return "🍛 Discover Street Food";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Food Emojis */}
        <div className="absolute top-32 left-20 text-6xl opacity-8 animate-bounce">🍛</div>
        <div className="absolute top-1/3 right-32 text-5xl opacity-10 animate-bounce delay-300">🌮</div>
        <div className="absolute bottom-1/4 left-40 text-7xl opacity-6 animate-bounce delay-600">🥘</div>
        <div className="absolute bottom-32 right-20 text-4xl opacity-12 animate-bounce delay-900">🍜</div>
        <div className="absolute top-1/2 left-10 text-3xl opacity-15 animate-bounce delay-1200">🥙</div>
        
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

      <Navbar />

      <div className="flex flex-1 relative z-10">
        <Sidebar selected={selectedFilter} onSelect={setSelectedFilter} />

        <div className="flex-1 px-8 py-6">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-white/70 to-orange-50/50 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 mb-2">
                {getFilterTitle()}
              </h1>
              <p className="text-gray-600 font-medium">
                {searchTerm && `Searching for "${searchTerm}" • `}
                {selectedCity && `In ${selectedCity.label} • `}
                {Array.isArray(stalls) && stalls.length > 0 ? `${stalls.length} stalls found` : 'Discover amazing street food vendors'}
              </p>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              selectedFilter={selectedFilter}
            />
          </motion.div>

          {/* Location Denied Message */}
          <AnimatePresence mode="wait">
            {selectedFilter === "nearby" && locationDenied && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.4 }}
                className="my-8"
              >
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-8 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full mb-4 shadow-lg">
                    <div className="text-4xl">📍</div>
                  </div>
                  <h3 className="text-2xl font-bold text-red-700 mb-3">Location Access Required</h3>
                  <p className="text-red-600 text-lg mb-4">Please allow location access to discover amazing stalls near you!</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
                  >
                    🔄 Try Again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content Grid */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8"
              >
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-gradient-to-br from-white/80 to-orange-50/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30"
                  >
                    <div className="animate-pulse space-y-4">
                      <div className="bg-gradient-to-r from-orange-200 via-amber-200 to-yellow-200 h-40 rounded-xl bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]"></div>
                      <div className="space-y-3">
                        <div className="bg-gradient-to-r from-orange-200 via-amber-200 to-yellow-200 h-4 rounded bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]"></div>
                        <div className="bg-gradient-to-r from-orange-200 via-amber-200 to-yellow-200 h-3 rounded w-3/4 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]"></div>
                        <div className="bg-gradient-to-r from-orange-200 via-amber-200 to-yellow-200 h-3 rounded w-1/2 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]"></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8"
              >
                {Array.isArray(stalls) && stalls.length > 0 ? (
                  stalls.map((stall, index) => (
                    <motion.div
                      key={stall._id}
                      variants={itemVariants}
                      layout
                      layoutId={stall._id}
                    >
                      <StallCard
                        stall={stall}
                        isLikedPage={selectedFilter === "liked"}
                        likedStalls={likedStalls}
                      />
                    </motion.div>
                  ))
                ) : (
                  !isLoading && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="col-span-full flex flex-col items-center justify-center py-16"
                    >
                      <div className="relative mb-6">
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="w-32 h-32 bg-gradient-to-br from-orange-300 to-amber-400 rounded-full flex items-center justify-center shadow-2xl"
                        >
                          <div className="text-6xl">🔍</div>
                        </motion.div>
                        <motion.div
                          className="absolute -inset-4 bg-gradient-to-r from-orange-400/20 to-amber-400/20 rounded-full blur-xl"
                          animate={{
                            opacity: [0.5, 0.8, 0.5],
                            scale: [1, 1.2, 1]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">No Stalls Found</h3>
                      <p className="text-gray-600 text-center max-w-md leading-relaxed text-lg">
                        {getEmptyStateMessage()}
                      </p>
                      {selectedFilter === "all" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate('/signup')}
                          className="mt-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-xl font-bold hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-lg"
                        >
                          🏪 Become a Vendor
                        </motion.button>
                      )}
                    </motion.div>
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export default UserHomePage;
