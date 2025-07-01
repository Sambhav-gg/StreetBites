import React from "react";
import Navbar from "../shared/Navbar";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import bootImage from "../ui/boot.webp";
import stallImage from "../ui/stall.webp";
import trackGrowthImage from "../ui/trackgowth.webp";
import Footer from "../shared/Footer";

const VendorHomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Add Your Stall",
      description: "Start showcasing your best dishes now.",
      image: stallImage, // ✅ Pass image directly
    },
    {
      title: "Track Growth",
      description: "See who’s visiting and how you’re growing.",
      image: trackGrowthImage,
    },
    {
      title: "Boost Visibility",
      description: "Promote your stall to attract more customers.",
      image: bootImage,
    },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50 flex flex-col"
      style={{
        backgroundImage: "url(/vendor-bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-10">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold text-red-600 mb-4 drop-shadow-lg"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Welcome, Vendor!
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-700 max-w-3xl mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          Your journey to reaching food lovers starts here. Add your stall,
          track your growth, and build your street food empire!
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.7 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-lg overflow-hidden transition duration-300 hover:shadow-2xl"
            >
              <img
                src={feature.image}
                alt={feature.title}
                className="h-48 w-full object-contain"
                onError={(e) => {
                  e.target.src = "/placeholder.png";
                }}
              />
              <div className="p-6">
                <h4 className="font-bold text-2xl text-gray-800 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.button
          onClick={() => navigate("/vendor/dashboard")}
          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-4 rounded-full text-xl font-semibold shadow-lg transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Go to Dashboard
        </motion.button>
      </div>
      <div className="flex justify-center flex-wrap gap-6 mt-12 mb-8">
        {[
          { text: "No Listing Fees" },
          { text: "Real-Time Analytics" },
          { text: "Direct Customer Reach" },
        ].map((item, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-3 bg-white/80 backdrop-blur-lg px-6 py-4 rounded-xl shadow hover:shadow-lg cursor-default transition"
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-gradient-to-r from-green-400 to-green-500 text-white p-2 rounded-full shadow text-lg">
              ✅
            </div>
            <p className="text-gray-700 font-medium text-lg">{item.text}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="text-center text-gray-700 italic mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.7 }}
      >
        “Thousands of vendors are already growing with StreetBites. Join them
        now!”
      </motion.div>

      <Footer/>
    </div>
  );
};

export default VendorHomePage;
