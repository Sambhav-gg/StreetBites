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
            res = await axios.get(`/api/person/liked-stalls`);
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
    if (selectedFilter === "liked") return "You haven't liked any stalls yet.";
    if (selectedFilter === "top-rated") return "No top-rated stalls available right now.";
    if (selectedFilter === "all") return "No stalls available right now.";
    if (selectedFilter === "nearby" && locationDenied) return "";
    return "No stalls found.";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"
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
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl"
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
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              selectedFilter={selectedFilter}
            />
          </motion.div>

          <AnimatePresence mode="wait">
            {selectedFilter === "nearby" && locationDenied && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.4 }}
                className="text-center my-8"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-gray-700 mb-2">Location Access Required</p>
                <p className="text-gray-500">Please allow location access to discover nearby stalls</p>
              </motion.div>
            )}
          </AnimatePresence>

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
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
                  >
                    <div className="animate-pulse space-y-4">
                      <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-32 rounded-xl bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]"></div>
                      <div className="space-y-3">
                        <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-4 rounded bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]"></div>
                        <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-3 rounded w-3/4 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]"></div>
                        <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-3 rounded w-1/2 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]"></div>
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
                          className="w-24 h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-lg"
                        >
                          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </motion.div>
                        <motion.div
                          className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"
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
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No Results Found</h3>
                      <p className="text-gray-500 text-center max-w-md leading-relaxed">
                        {getEmptyStateMessage()}
                      </p>
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