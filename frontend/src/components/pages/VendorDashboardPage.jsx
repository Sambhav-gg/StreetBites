import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MdAddBusiness, MdMenu, MdClose } from "react-icons/md";
import { 
  FaStore, 
  FaChartBar, 
  FaCog, 
  FaReceipt, 
  FaPlus,
  FaEye,
  FaHeart,
  FaStar,
  FaLock
} from "react-icons/fa";
import axios from "axios";
import VendorStallCard from "../shared/VendorStallCard";

const sidebarItems = [
  { 
    name: "Your Stalls", 
    icon: <FaStore />, 
    route: "/vendor/dashboard",
    emoji: "🏪",
    description: "Manage your stalls"
  },
  { 
    name: "Analytics", 
    icon: <FaChartBar />, 
    route: "/vendor/analytics",
    emoji: "📊",
    description: "View performance data"
  },
  
];

const VendorDashboardPage = () => {
  const navigate = useNavigate();
  const [userStalls, setUserStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalStalls: 0,
    totalViews: 0,
    totalLikes: 0,
    averageRating: 0
  });

  useEffect(() => {
    const fetchStalls = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/stalls/vendor", {
          withCredentials: true,
        });
        const stalls = Array.isArray(res.data)
  ? res.data
  : Array.isArray(res.data.data)
    ? res.data.data
    : [];

setUserStalls(stalls);
        
        // Calculate stats
       const totalStalls = stalls.length;
const totalViews = stalls.reduce((acc, stall) => acc + (stall.views || 0), 0);
const totalLikes = stalls.reduce((acc, stall) => acc + (stall.likes || 0), 0);
const avgRating = totalStalls > 0
  ? (stalls.reduce((acc, stall) => acc + (stall.averageRating || 0), 0) / totalStalls).toFixed(1)
  : 0;

setStats({
  totalStalls,
  totalViews,
  totalLikes,
  averageRating: avgRating
});
      } catch (err) {
        console.error("Failed to fetch vendor stalls", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStalls();
  }, []);

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
      {/* Navbar */}
      <Navbar />

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 min-h-screen bg-gradient-to-b from-white/95 to-orange-50/80 backdrop-blur-xl border-r-2 border-white/50 shadow-2xl">
          <div className="p-6 space-y-6">
            {/* Sidebar Header */}
            <div className="text-center pt-4">
              <div className="text-5xl mb-3">🏪</div>
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">
                Vendor Panel
              </h2>
              <p className="text-gray-600 font-medium">Manage your business</p>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-white/60 to-orange-50/40 backdrop-blur-sm rounded-2xl p-4 border border-white/50">
              <h3 className="font-bold text-gray-800 mb-3 text-center">📊 Quick Stats</h3>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <div className="text-2xl font-bold text-orange-600">{stats.totalStalls}</div>
                  <div className="text-xs text-gray-600">Stalls</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.totalViews}</div>
                  <div className="text-xs text-gray-600">Views</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{stats.totalLikes}</div>
                  <div className="text-xs text-gray-600">Likes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{stats.averageRating}</div>
                  <div className="text-xs text-gray-600">Rating</div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-3">
              {sidebarItems.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.route}
                  className="group flex items-center gap-4 px-4 py-4 rounded-2xl text-gray-700 hover:bg-white/60 hover:text-orange-600 transition-all duration-200 border border-transparent hover:border-orange-200 hover:shadow-lg"
                >
                  <div className="text-2xl">{item.emoji}</div>
                  <div className="flex-1">
                    <div className="font-bold text-lg">{item.name}</div>
                    <div className="text-sm text-gray-500 group-hover:text-orange-500">
                      {item.description}
                    </div>
                  </div>
                  <div className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </div>
                </Link>
              ))}

              {/* Coming Soon Items */}
              <div className="flex items-center gap-4 px-4 py-4 rounded-2xl text-gray-400 cursor-not-allowed select-none bg-gray-100/50 border border-gray-200">
                <FaLock className="text-xl" />
                <div className="flex-1">
                  <div className="font-bold">📋 Orders</div>
                  <div className="text-sm">Coming soon!</div>
                </div>
              </div>

              <div className="flex items-center gap-4 px-4 py-4 rounded-2xl text-gray-400 cursor-not-allowed select-none bg-gray-100/50 border border-gray-200">
                <FaLock className="text-xl" />
                <div className="flex-1">
                  <div className="font-bold">🚀 Promote</div>
                  <div className="text-sm">Coming soon!</div>
                </div>
              </div>
            </nav>

            {/* Quick Add Button */}
            <Link
              to="/vendor/stalls/add"
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 border-2 border-orange-400"
            >
              <FaPlus />
              Add New Stall
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {/* Mobile Header with Menu Button */}
          <div className="lg:hidden bg-gradient-to-r from-white/80 to-orange-50/60 backdrop-blur-lg border-b-2 border-white/50 p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <MdMenu size={24} />
              </button>
              <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">
                🏪 Your Stalls
              </h1>
              <Link
                to="/vendor/stalls/add"
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <FaPlus size={20} />
              </Link>
            </div>
          </div>

          {/* Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-4 lg:p-8"
          >
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 hidden lg:block pointer-events-none">
              <div className="absolute top-32 right-32 text-6xl opacity-8 animate-bounce">🏪</div>
              <div className="absolute top-1/2 right-20 text-5xl opacity-10 animate-bounce delay-300">📊</div>
              <div className="absolute bottom-1/4 right-40 text-7xl opacity-6 animate-bounce delay-600">⭐</div>
            </div>

            {/* Desktop Header - Hidden on Mobile */}
            <motion.div variants={itemVariants} className="hidden lg:block mb-8 relative z-10">
              <div className="bg-gradient-to-r from-white/80 to-orange-50/60 backdrop-blur-lg rounded-2xl p-8 shadow-xl border-2 border-white/50">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
                      🏪 Your Stalls
                    </h1>
                    <p className="text-gray-600 font-medium text-lg">
                      Manage and monitor your street food business
                    </p>
                  </div>
                  
                  <Link
                    to="/vendor/stalls/add"
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 border-2 border-orange-400"
                  >
                    <FaPlus />
                    Add New Stall
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Content Grid */}
            <div className="relative z-10">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  >
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-gradient-to-br from-white/80 to-orange-50/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30"
                      >
                        <div className="animate-pulse space-y-4">
                          <div className="bg-gradient-to-r from-orange-200 via-amber-200 to-yellow-200 h-48 rounded-xl"></div>
                          <div className="space-y-3">
                            <div className="bg-gradient-to-r from-orange-200 via-amber-200 to-yellow-200 h-4 rounded"></div>
                            <div className="bg-gradient-to-r from-orange-200 via-amber-200 to-yellow-200 h-3 rounded w-3/4"></div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : userStalls.length === 0 ? (
                  <motion.div
                    variants={itemVariants}
                    className="flex flex-col items-center justify-center py-20"
                  >
                    <div className="bg-gradient-to-br from-white/80 to-orange-50/60 backdrop-blur-lg rounded-3xl p-8 lg:p-12 shadow-2xl border-2 border-white/50 text-center max-w-2xl mx-auto">
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
                        className="text-8xl mb-6"
                      >
                        🏪
                      </motion.div>
                      
                      <h2 className="text-2xl lg:text-3xl font-black text-gray-900 mb-4">
                        Ready to Start Your Journey?
                      </h2>
                      <p className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed">
                        You haven't added any stalls yet. Create your first stall listing and start reaching hungry customers in your area!
                      </p>
                      
                      <Link
                        to="/vendor/stalls/add"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-orange-400"
                      >
                        <MdAddBusiness className="text-2xl" />
                        Add Your First Stall
                      </Link>
                      
                      <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="text-green-500">✅</span>
                          <span>100% Free Forever</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="text-green-500">✅</span>
                          <span>No Commission Fees</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="text-green-500">✅</span>
                          <span>Instant Visibility</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  >
                    {userStalls.map((stall, index) => (
                      <motion.div
                        key={stall._id}
                        variants={itemVariants}
                        layout
                        layoutId={stall._id}
                      >
                        <VendorStallCard
                          stall={stall}
                          onEdit={(stall) =>
                            navigate(`/vendor/stalls/${stall._id}/edit`)
                          }
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Success Tips Section */}
            {userStalls.length > 0 && (
              <motion.div variants={itemVariants} className="mt-12 relative z-10">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 backdrop-blur-lg rounded-2xl p-8 shadow-xl border-2 border-green-200">
                  <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
                    💡 Pro Tips for Success
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📸</div>
                      <h4 className="font-bold text-green-700 mb-1">Great Photos</h4>
                      <p className="text-sm text-green-600">High-quality images increase orders by 40%</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl mb-2">⏰</div>
                      <h4 className="font-bold text-green-700 mb-1">Update Hours</h4>
                      <p className="text-sm text-green-600">Keep your operating hours current</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl mb-2">💬</div>
                      <h4 className="font-bold text-green-700 mb-1">Engage Reviews</h4>
                      <p className="text-sm text-green-600">Respond to customer feedback promptly</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />
            
            {/* Mobile Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 w-80 h-full bg-gradient-to-b from-white/95 to-orange-50/80 backdrop-blur-xl shadow-2xl z-50 lg:hidden overflow-y-auto"
            >
              {/* Mobile Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🏪</div>
                  <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">
                    Vendor Panel
                  </h2>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <MdClose size={20} />
                </button>
              </div>

              {/* Mobile Sidebar Content */}
              <div className="p-4 space-y-6">
                {/* Quick Stats */}
                <div className="bg-gradient-to-r from-white/60 to-orange-50/40 backdrop-blur-sm rounded-2xl p-4 border border-white/50">
                  <h3 className="font-bold text-gray-800 mb-3 text-center">📊 Quick Stats</h3>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div>
                      <div className="text-xl font-bold text-orange-600">{stats.totalStalls}</div>
                      <div className="text-xs text-gray-600">Stalls</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-blue-600">{stats.totalViews}</div>
                      <div className="text-xs text-gray-600">Views</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-red-600">{stats.totalLikes}</div>
                      <div className="text-xs text-gray-600">Likes</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-yellow-600">{stats.averageRating}</div>
                      <div className="text-xs text-gray-600">Rating</div>
                    </div>
                  </div>
                </div>

                {/* Mobile Navigation */}
                <nav className="space-y-3">
                  {sidebarItems.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.route}
                      onClick={() => setSidebarOpen(false)}
                      className="group flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-white/60 hover:text-orange-600 transition-all duration-200 border border-transparent hover:border-orange-200"
                    >
                      <div className="text-xl">{item.emoji}</div>
                      <div className="flex-1">
                        <div className="font-bold">{item.name}</div>
                        <div className="text-sm text-gray-500 group-hover:text-orange-500">
                          {item.description}
                        </div>
                      </div>
                      <div className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </div>
                    </Link>
                  ))}

                  {/* Coming Soon Items */}
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 cursor-not-allowed bg-gray-100/50 border border-gray-200">
                    <FaLock />
                    <div className="flex-1">
                      <div className="font-bold text-sm">📋 Orders</div>
                      <div className="text-xs">Coming soon!</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 cursor-not-allowed bg-gray-100/50 border border-gray-200">
                    <FaLock />
                    <div className="flex-1">
                      <div className="font-bold text-sm">🚀 Promote</div>
                      <div className="text-xs">Coming soon!</div>
                    </div>
                  </div>
                </nav>

                {/* Mobile Add Button */}
                <Link
                  to="/vendor/stalls/add"
                  onClick={() => setSidebarOpen(false)}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-3 border-2 border-orange-400"
                >
                  <FaPlus />
                  Add New Stall
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendorDashboardPage;
