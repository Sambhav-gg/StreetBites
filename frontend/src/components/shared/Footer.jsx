import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaInstagram, FaHeart, FaCode } from 'react-icons/fa';

const Footer = () => {
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
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <footer className="bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-10 text-4xl">🍛</div>
        <div className="absolute top-8 right-20 text-3xl">🌮</div>
        <div className="absolute bottom-4 left-1/4 text-5xl">🥘</div>
        <div className="absolute bottom-6 right-1/3 text-2xl">⭐</div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl opacity-5">🏪</div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-6 py-8 relative z-10"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
              <span className="text-4xl">🍛</span>
              <h3 className="text-3xl font-black text-yellow-100">
                Street<span className="text-white">Bites</span>
              </h3>
            </div>
            <p className="text-orange-100 font-medium text-lg mb-2">
              Connecting food lovers with local street vendors
            </p>
            <p className="text-orange-200 text-sm">
              © {new Date().getFullYear()} StreetBites. All rights reserved.
            </p>
          </motion.div>

          {/* Creators Section */}
          <motion.div variants={itemVariants} className="flex flex-col items-center gap-6">
            <div className="text-center">
              <h4 className="text-xl font-bold text-yellow-100 mb-2 flex items-center justify-center gap-2">
                <FaCode className="text-yellow-200" />
                Built with <FaHeart className="text-red-300 animate-pulse" size={16} /> by
              </h4>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-8">
              {/* Sambhav Garg */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-col items-center gap-3"
              >
                <div className="text-center">
                  <h5 className="text-lg font-bold text-white mb-2">👨‍💻 Sambhav Garg</h5>
                  <p className="text-orange-100 text-sm mb-3">Full-Stack Developer</p>
                </div>
                <div className="flex items-center gap-3">
                  <motion.a
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href="https://www.linkedin.com/in/yourprofile1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white/20 hover:bg-blue-600 p-3 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/30 hover:border-blue-500"
                  >
                    <FaLinkedin className="text-xl text-white group-hover:text-white transition-colors" />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href="https://www.instagram.com/yourprofile1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white/20 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 p-3 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/30 hover:border-pink-500"
                  >
                    <FaInstagram className="text-xl text-white group-hover:text-white transition-colors" />
                  </motion.a>
                </div>
              </motion.div>

              {/* Separator */}
              <div className="hidden sm:block w-px h-20 bg-white/30"></div>
              <div className="sm:hidden w-20 h-px bg-white/30"></div>

              {/* Swyam Yadav */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-col items-center gap-3"
              >
                <div className="text-center">
                  <h5 className="text-lg font-bold text-white mb-2">👨‍💻 Swyam Yadav</h5>
                  <p className="text-orange-100 text-sm mb-3">Full-Stack Developer</p>
                </div>
                <div className="flex items-center gap-3">
                  <motion.a
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href="https://www.linkedin.com/in/yourprofile2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white/20 hover:bg-blue-600 p-3 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/30 hover:border-blue-500"
                  >
                    <FaLinkedin className="text-xl text-white group-hover:text-white transition-colors" />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href="https://www.instagram.com/yourprofile2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white/20 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 p-3 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/30 hover:border-pink-500"
                  >
                    <FaInstagram className="text-xl text-white group-hover:text-white transition-colors" />
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div 
          variants={itemVariants}
          className="mt-8 pt-6 border-t border-white/20 text-center"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-orange-100">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              <span className="font-medium">Empowering Street Food Vendors</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤝</span>
              <span className="font-medium">Connecting Food Communities</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💝</span>
              <span className="font-medium">100% Free Platform</span>
            </div>
          </div>
          
          <motion.div 
            className="mt-4 text-yellow-200 font-medium"
            animate={{ 
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Made with ❤️ for the street food community of India 🇮🇳
          </motion.div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;