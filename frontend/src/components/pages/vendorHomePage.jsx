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
      title: "🏪 Add Your Stall",
      description: "Start showcasing your best dishes and reach hungry customers instantly.",
      image: stallImage,
      color: "from-orange-500 to-amber-500",
      emoji: "🍛",
    },
    {
      title: "📈 Track Growth",
      description: "Monitor visits, reviews, and customer engagement with real-time analytics.",
      image: trackGrowthImage,
      color: "from-green-500 to-emerald-500",
      emoji: "📊",
    },
    {
      title: "🚀 Boost Visibility",
      description: "Promote your stall and attract more customers with premium features.",
      image: bootImage,
      color: "from-purple-500 to-pink-500",
      emoji: "✨",
    },
  ];

  const benefits = [
    { 
      text: "100% Free Listing", 
      icon: "💰", 
      description: "No hidden fees, ever" 
    },
    { 
      text: "Real-Time Analytics", 
      icon: "📊", 
      description: "Track your performance" 
    },
    { 
      text: "Direct Customer Reach", 
      icon: "🎯", 
      description: "Connect with food lovers" 
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Floating Food Emojis */}
        <motion.div 
          variants={floatingVariants}
          animate="animate"
          className="absolute top-32 left-20 text-6xl opacity-10"
        >
          🏪
        </motion.div>
        <motion.div 
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: '1s' }}
          className="absolute top-1/3 right-32 text-5xl opacity-8"
        >
          🍛
        </motion.div>
        <motion.div 
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: '2s' }}
          className="absolute bottom-1/4 left-40 text-7xl opacity-6"
        >
          📈
        </motion.div>
        <motion.div 
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: '3s' }}
          className="absolute bottom-32 right-20 text-4xl opacity-12"
        >
          ⭐
        </motion.div>
        
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

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex justify-center items-center gap-4 mb-6">
              <span className="text-8xl animate-bounce">🏪</span>
              <span className="text-7xl animate-bounce delay-100">🍛</span>
              <span className="text-8xl animate-bounce delay-200">🚀</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 mb-6 leading-tight">
              Welcome, <br/>
              Amazing Vendor!
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-800 max-w-4xl mx-auto leading-relaxed font-semibold">
              🌟 Your journey to reaching thousands of food lovers starts here! 
              <span className="text-orange-600 font-bold block mt-2">
                Add your stall, track growth, and build your street food empire! 
              </span>
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div variants={itemVariants} className="mb-16">
            <motion.button
              onClick={() => navigate("/vendor/dashboard")}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-12 py-6 rounded-2xl text-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 border-4 border-orange-400"
            >
              <span className="flex items-center gap-3">
                🚀 Go to Dashboard
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </span>
            </motion.button>
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="px-4 py-16">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-5xl font-black text-gray-900 mb-4">
              🎯 Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 font-medium">
              Powerful tools designed specifically for street food vendors
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group bg-gradient-to-br from-white/80 to-orange-50/60 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-300 border-2 border-white/50 hover:border-orange-200"
              >
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute top-4 right-4 text-4xl">{feature.emoji}</div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h4 className="font-black text-2xl text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-gray-700 font-medium text-lg leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Action Hint */}
                  <div className={`mt-6 bg-gradient-to-r ${feature.color} text-white px-4 py-2 rounded-full text-sm font-bold text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    Get Started →
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Benefits Section */}
        <motion.div variants={itemVariants} className="px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-4xl font-black text-center text-gray-900 mb-12">
              ✨ Why Choose StreetBites?
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-white/80 to-green-50/60 backdrop-blur-lg px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl border-2 border-white/50 hover:border-green-200 transition-all duration-300 text-center"
                >
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{item.text}</h4>
                  <p className="text-gray-600 font-medium">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Success Stories Section */}
        <motion.div variants={itemVariants} className="px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-white/80 to-yellow-50/60 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border-2 border-white/50">
              <div className="text-6xl mb-6">🌟</div>
              <blockquote className="text-3xl font-black text-gray-900 mb-6 leading-relaxed">
                "Thousands of vendors are already growing with StreetBites. Join them now!"
              </blockquote>
              
              <div className="grid md:grid-cols-3 gap-8 mt-8">
                <div className="text-center">
                  <div className="text-4xl font-black text-orange-600 mb-2">1000+</div>
                  <div className="text-gray-700 font-semibold">Active Vendors</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-orange-600 mb-2">50K+</div>
                  <div className="text-gray-700 font-semibold">Monthly Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-orange-600 mb-2">₹0</div>
                  <div className="text-gray-700 font-semibold">Commission Fees</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div variants={itemVariants} className="text-center pb-16">
          <motion.button
            onClick={() => navigate("/vendor/stalls/add")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-10 py-4 rounded-2xl text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-green-400"
          >
            🏪 Add Your First Stall FREE
          </motion.button>
        </motion.div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default VendorHomePage;