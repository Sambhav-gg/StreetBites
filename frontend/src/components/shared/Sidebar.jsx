import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaStar, FaMapMarkerAlt, FaThLarge, FaCompass } from 'react-icons/fa';

const Sidebar = ({ selected, onSelect }) => {
  const options = [
    { 
      label: 'All Stalls', 
      value: 'all', 
      icon: <FaThLarge />, 
      emoji: '🌟',
      description: 'Browse all available stalls',
      color: 'from-blue-500 to-purple-500'
    }, 
    { 
      label: 'Nearby', 
      value: 'nearby', 
      icon: <FaCompass />, 
      emoji: '📍',
      description: 'Find stalls near your location',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      label: 'Top Rated', 
      value: 'top-rated', 
      icon: <FaStar />, 
      emoji: '⭐',
      description: 'Highest rated stalls',
      color: 'from-yellow-500 to-orange-500'
    },
    { 
      label: 'Liked By You', 
      value: 'liked', 
      icon: <FaHeart />, 
      emoji: '❤️',
      description: 'Your favorite stalls',
      color: 'from-pink-500 to-red-500'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-80 bg-gradient-to-b from-white/80 to-orange-50/60 backdrop-blur-lg shadow-2xl border-r-2 border-white/50 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 text-6xl">🍛</div>
        <div className="absolute bottom-20 left-10 text-5xl">🌮</div>
        <div className="absolute top-1/2 right-5 text-4xl">🥘</div>
      </div>

      {/* Header */}
      <div className="p-6 border-b border-orange-200/50 relative z-10">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 mb-2">
          🔍 Discover
        </h2>
        <p className="text-gray-600 font-medium">Find your perfect meal</p>
      </div>

      {/* Filter Options */}
      <div className="p-4 space-y-3 relative z-10">
        {options.map(({ label, value, icon, emoji, description, color }) => (
          <motion.button
            key={value}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02,
              x: 5,
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(value)}
            className={`w-full group relative overflow-hidden rounded-2xl transition-all duration-300 ${
              selected === value 
                ? 'bg-gradient-to-r ' + color + ' text-white shadow-lg shadow-orange-200' 
                : 'bg-white/70 hover:bg-white/90 text-gray-700 hover:text-gray-900 border border-orange-100 hover:border-orange-200'
            }`}
          >
            {/* Button Content */}
            <div className="relative z-10 p-4 flex items-center gap-4">
              {/* Emoji */}
              <div className={`text-2xl transition-transform duration-200 ${
                selected === value ? 'scale-110' : 'group-hover:scale-110'
              }`}>
                {emoji}
              </div>
              
              {/* Icon and Text */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-3 mb-1">
                  <div className={`transition-colors duration-200 ${
                    selected === value ? 'text-white' : 'text-orange-500'
                  }`}>
                    {icon}
                  </div>
                  <span className="font-bold text-lg">{label}</span>
                </div>
                <p className={`text-sm transition-colors duration-200 ${
                  selected === value ? 'text-white/80' : 'text-gray-500'
                }`}>
                  {description}
                </p>
              </div>

              {/* Selection Indicator */}
              {selected === value && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 15, stiffness: 300 }}
                  className="text-white text-xl"
                >
                  ✓
                </motion.div>
              )}
            </div>

            {/* Hover Effect Background */}
            {selected !== value && (
              <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-amber-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}

            {/* Active Selection Background Animation */}
            {selected === value && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-r opacity-20 bg-white rounded-2xl"
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl p-4 border border-orange-200">
        <div className="text-center">
          <div className="text-3xl mb-2">🎯</div>
          <p className="text-sm font-semibold text-orange-700">
            Tip: Use filters to find exactly what you're craving!
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;