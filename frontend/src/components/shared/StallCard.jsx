import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaRegHeart, FaStar, FaMapMarkerAlt, FaEye } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";
import { PERSON_API_END_POINT } from "../utils/constants";
import { STALL_API_END_POINT } from '../utils/constants';

const StallCard = ({ stall }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [showReviews, setShowReviews] = useState(false);

  // 🛑 Directly check from redux store
  const isInitiallyLiked = user?.likedStalls?.includes(stall._id);

  const [liked, setLiked] = useState(isInitiallyLiked);

  const handleViewMore = async () => {
    try {
      await axios.put(
        `${ STALL_API_END_POINT }/impression/${stall._id}`,
        {},
        { withCredentials: true }
      );
      navigate(`/stall/${stall._id}`);
    } catch (err) {
      console.error("Failed to track impression");
    }
  };

  const toggleLike = async () => {
    try {
      if (liked) {
        await axios.delete(`${PERSON_API_END_POINT}/unlike/${stall._id}`, {
          withCredentials: true,
        });
      } else {
        await axios.post(
          `${PERSON_API_END_POINT}/like/${stall._id}`,
          {},
          { withCredentials: true }
        );
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Failed to toggle like:", error.message);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ 
          scale: 1.05,
          y: -8,
          rotateY: 5,
        }}
        whileTap={{ scale: 0.98 }}
        className="group bg-gradient-to-br from-white/90 to-orange-50/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-white/50 hover:border-orange-200/70 overflow-hidden cursor-pointer relative"
      >
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-t-2xl">
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            src={stall.mainImage || "/placeholder.jpg"}
            alt={stall.stallName}
            className="h-48 w-full object-cover"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Like Button */}
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              toggleLike();
            }}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200"
          >
            <motion.div
              animate={liked ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {liked ? (
                <FaHeart className="text-red-500 text-lg" />
              ) : (
                <FaRegHeart className="text-gray-600 text-lg hover:text-red-400" />
              )}
            </motion.div>
          </motion.button>

          {/* View Indicator */}
          <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <FaEye size={10} />
            Click to view
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          {/* Stall Name */}
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-200 line-clamp-2">
              {stall.stallName}
            </h3>
          </div>

          {/* Address */}
          <div className="flex items-center gap-2 text-gray-600">
            <FaMapMarkerAlt className="text-orange-500 text-sm flex-shrink-0" />
            <p className="text-sm line-clamp-2 font-medium">{stall.address}</p>
          </div>

          {/* Rating */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowReviews(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-xl border border-yellow-200 hover:border-yellow-300 cursor-pointer transition-all duration-200"
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`text-sm ${
                    i < Math.floor(stall.averageRating || 0)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="font-bold text-gray-800">
              {stall.averageRating ? stall.averageRating.toFixed(1) : "N/A"}
            </span>
            <span className="text-sm text-gray-600 font-medium">
              ({stall.numReviews || 0} reviews)
            </span>
          </motion.div>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              handleViewMore();
            }}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <FaEye />
            View Details
          </motion.button>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-400/0 via-orange-400/10 to-amber-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </motion.div>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviews && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={() => setShowReviews(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gradient-to-br from-white to-orange-50 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl border-2 border-white/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">⭐ Reviews</h2>
                    <p className="text-orange-100 font-medium">{stall.stallName}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowReviews(false)}
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all duration-200"
                  >
                    <span className="text-2xl leading-none">×</span>
                  </motion.button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-96">
                {stall.reviews && stall.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {stall.reviews.map((review, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-orange-200 shadow-sm"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`text-sm ${
                                  i < review.rating ? "text-yellow-500" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-bold text-orange-600">{review.rating}/5</span>
                        </div>
                        <p className="text-gray-700 font-medium leading-relaxed">{review.comment}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">No Reviews Yet</h3>
                    <p className="text-gray-600">Be the first to review this amazing stall!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StallCard;
