import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  MapPin,
  Clock,
  Phone,
  Star,
  ArrowLeft,
  Heart,
  Share2,
  Tag,
  Camera,
} from "lucide-react";
import ImageSlider from "../pages/ImageSlider";
import ReviewsPopover from "./ReviewsPopover";
import StallMenuDrawer from "./StallMenuDrawer";
import { STALL_API_END_POINT } from "../utils/constants";
const StallDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stall, setStall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  // const handleGetDirections = () => {
  //   const [lng, lat] = stall.coordinates.coordinates; // GeoJSON format
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const userLat = position.coords.latitude;
  //         const userLng = position.coords.longitude;

  //         const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${lat},${lng}&travelmode=walking`;

  //         window.open(googleMapsUrl, "_blank");
  //       },
  //       (error) => {
  //         console.error("Error getting location:", error);
  //         alert("Unable to get your location.");
  //       }
  //     );
  //   } else {
  //     alert("Geolocation is not supported by this browser.");
  //   }
  // };
  const handleGetDirections = () => {
  const [lng, lat] = stall.coordinates.coordinates; // GeoJSON format
  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
  window.open(googleMapsUrl, '_blank');
};

  // ✅ Moved outside useEffect
  const fetchStall = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${STALL_API_END_POINT}/api/stalls/${id}`);
      setStall(res.data);
    } catch (err) {
      console.error("Failed to load stall details", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStall();
  }, [id]);

  const toggleLike = () => {
    setLiked(!liked);
    // Add API call here for like/unlike
  };

  const shareStall = () => {
    if (navigator.share) {
      navigator.share({
        title: stall.stallName,
        text: `Check out ${stall.stallName} on StreetBites!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You can add a toast notification here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-orange-300 border-t-orange-600 rounded-full"
        />
      </div>
    );
  }

  if (!stall) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Stall Not Found
          </h2>
          <p className="text-gray-600">
            The stall you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const allImages = [stall.mainImage, ...(stall.otherImages || [])].filter(
    Boolean
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 text-6xl opacity-8 animate-bounce">
          🍛
        </div>
        <div className="absolute top-1/3 right-32 text-5xl opacity-10 animate-bounce delay-300">
          ⭐
        </div>
        <div className="absolute bottom-1/4 left-40 text-7xl opacity-6 animate-bounce delay-600">
          📍
        </div>
        <div className="absolute bottom-32 right-20 text-4xl opacity-12 animate-bounce delay-900">
          ❤️
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        {/* Header with Back Button */}
        <motion.div
          variants={itemVariants}
          className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-orange-200 shadow-sm"
        >
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="flex items-center gap-3 bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-xl font-semibold transition-all duration-200"
            >
              <ArrowLeft size={20} />
              Back
            </motion.button>

            <div className="flex items-center gap-3">
              {/* <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleLike}
                className={`p-3 rounded-full transition-all duration-200 ${
                  liked
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500"
                }`}
              >
                <Heart size={20} fill={liked ? "currentColor" : "none"} />
              </motion.button> */}

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={shareStall}
                className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition-all duration-200"
              >
                <Share2 size={20} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="max-w-6xl mx-auto p-6">
          {/* Image Section */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="bg-gradient-to-br from-white/80 to-orange-50/60 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border-2 border-white/50">
              {allImages.length > 0 ? (
                <div className="relative overflow-hidden rounded-2xl">
                  <ImageSlider images={allImages} />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src="/placeholder.jpg"
                    alt="No image"
                    className="w-full h-80 object-cover rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <Camera size={48} className="mx-auto mb-2 opacity-70" />
                      <p className="text-lg font-semibold">
                        No images available
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stall Header */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-white/80 to-orange-50/60 backdrop-blur-lg rounded-2xl p-8 shadow-xl border-2 border-white/50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-black text-gray-900 mb-2">
                      {stall.stallName}
                    </h1>
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="text-orange-500" size={18} />
                      <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {stall.category}
                      </span>
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2">
                      <Star size={18} fill="currentColor" />
                      <span className="font-bold">
                        {stall.averageRating
                          ? stall.averageRating.toFixed(1)
                          : "N/A"}
                      </span>
                    </div>
                    <div className="text-xs text-center">
                      {stall.numReviews} reviews
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 text-lg leading-relaxed font-medium">
                  {stall.description ||
                    "A delicious street food experience awaits you!"}
                </p>
              </motion.div>

              {/* Location & Contact Info */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-white/80 to-amber-50/60 backdrop-blur-lg rounded-2xl p-6 shadow-xl border-2 border-white/50"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  📍 Location & Hours
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-white/50 rounded-xl">
                    <MapPin
                      className="text-orange-500 flex-shrink-0 mt-1"
                      size={20}
                    />
                    <div>
                      <p className="font-semibold text-gray-800">Address</p>
                      <p className="text-gray-600">{stall.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl">
                    <Clock className="text-orange-500" size={20} />
                    <div>
                      <p className="font-semibold text-gray-800">
                        Opening Hours
                      </p>
                      <p className="text-gray-600">
                        {stall.openingTime} - {stall.closingTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl">
                    <Phone className="text-orange-500" size={20} />
                    <div>
                      <p className="font-semibold text-gray-800">Contact</p>
                      <a
                        href={`tel:${stall.phoneNumber}`}
                        className="text-orange-600 hover:text-orange-800 font-medium hover:underline"
                      >
                        {stall.phoneNumber}
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Additional Gallery */}
              {stall.images?.others?.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-br from-white/80 to-yellow-50/60 backdrop-blur-lg rounded-2xl p-6 shadow-xl border-2 border-white/50"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    📸 Photo Gallery
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {stall.images.others.map((url, idx) => (
                      <motion.img
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        src={url}
                        alt={`Stall image ${idx}`}
                        className="w-full h-32 object-cover rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Action Buttons */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-white/80 to-orange-50/60 backdrop-blur-lg rounded-2xl p-6 shadow-xl border-2 border-white/50 sticky top-24"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Quick Actions
                </h3>

                <div className="space-y-4">
                  <StallMenuDrawer stall={stall} />

                  <ReviewsPopover
                    stallId={stall._id}
                    reviews={stall.reviews || []}
                    onReviewAdded={fetchStall}
                  />

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    📞 Call Now
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    onClick={handleGetDirections}
                  >
                    🗺️ Get Directions
                  </motion.button>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 pt-6 border-t border-orange-200">
                  <h4 className="font-bold text-gray-800 mb-3">At a Glance</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-semibold text-gray-800">
                        {stall.category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <span className="font-semibold text-gray-800">
                        ⭐ {stall.averageRating?.toFixed(1) || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reviews:</span>
                      <span className="font-semibold text-gray-800">
                        {stall.numReviews || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default StallDetailPage;
