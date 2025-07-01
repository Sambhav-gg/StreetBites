import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";
import { PERSON_API_END_POINT } from "../utils/constants";

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
        `/api/stalls/impression/${stall._id}`,
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
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-xl transition duration-300"
    >
      <img
        src={stall.mainImage || "/placeholder.jpg"}
        alt={stall.stallName}
        className="h-40 w-full object-cover"
      />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">
            {stall.stallName}
          </h3>
          <button onClick={toggleLike}>
            {liked ? (
              <FaHeart className="text-red-500" />
            ) : (
              <FaRegHeart className="text-gray-400" />
            )}
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-1">{stall.address}</p>
        <div
          className="flex items-center text-yellow-500 gap-1 p-2 text-sm mb-3"
        >
          <FaStar />
          <span className="font-medium cursor-pointer" onClick={() => setShowReviews(true)}>
            {stall.averageRating ?? "N/A"} ({stall.numReviews} reviews)
          </span>
        </div>

        <button
          onClick={handleViewMore}
          className="text-sm text-white bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded-md w-full"
        >
          View More
        </button>
      </div>


                  {/* Review Modal */}
      {showReviews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-96 max-h-[70vh] overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Reviews</h2>
              <button
                onClick={() => setShowReviews(false)}
                className="text-red-500 text-xl"
              >
                &times;
              </button>
            </div>

            {stall.reviews && stall.reviews.length > 0 ? (
              stall.reviews.map((review, index) => (
                <div key={index} className="mb-3 border-b pb-2">
                  <p className="font-medium">⭐ {review.rating}</p>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        </div>
      )}


    </motion.div>

    
  );
};

export default StallCard;
