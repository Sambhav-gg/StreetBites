import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { IndianRupee, Utensils, X, Search, Filter } from 'lucide-react';

const StallMenuDrawer = ({ stall }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'price-low', 'price-high'

  console.log(stall);

  const menu = stall.menu || [];

  console.log(menu);

  // Filter and sort menu items
  const filteredAndSortedMenu = menu
    .filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    console.log(filteredAndSortedMenu);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  const modalVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", damping: 25, stiffness: 300 }
    },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 border-2 border-orange-400"
        >
          <Utensils size={20} />
          View Menu 🍽️
        </motion.button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[90vh] bg-gradient-to-br from-white/95 to-orange-50/80 backdrop-blur-lg shadow-2xl rounded-3xl p-0 border-2 border-white/50 overflow-hidden">
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black flex items-center gap-3">
                    🍽️ Menu
                  </h2>
                  <p className="text-orange-100 font-semibold text-lg">
                    {stall.stallName}
                  </p>
                </div>
                <div className="text-right">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-1">
                    <span className="text-sm font-bold">
                      {filteredAndSortedMenu.length} items
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-2 right-4 text-4xl opacity-20">🍛</div>
            <div className="absolute bottom-2 left-4 text-3xl opacity-20">⭐</div>
          </div>

          {/* Search and Filter Section */}
          <div className="p-6 border-b border-orange-200/50">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-orange-200 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-200 bg-white/70 backdrop-blur-sm transition-all duration-200"
                />
              </div>
              
              {/* Sort */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-10 pr-8 py-2 rounded-xl border-2 border-orange-200 focus:border-orange-500 focus:outline-none bg-white/70 backdrop-blur-sm transition-all duration-200 font-medium"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-6">
            {filteredAndSortedMenu.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar"
              >
                {filteredAndSortedMenu.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="group flex justify-between items-center p-4 rounded-2xl bg-gradient-to-r from-white/70 to-orange-50/50 hover:from-white/90 hover:to-orange-50/70 backdrop-blur-sm border-2 border-white/50 hover:border-orange-200 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg group-hover:text-orange-700 transition-colors">
                        {item.name}
                      </h4>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1 font-medium">
                          {item.description}
                        </p>
                      )}
                      {item.category && (
                        <span className="inline-block mt-2 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold">
                          {item.category}
                        </span>
                      )}
                    </div>
                    
                    <div className="ml-4 text-right">
                      <div className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-2 rounded-xl font-bold text-lg shadow-lg group-hover:shadow-xl transition-all duration-200">
                        <IndianRupee size={18} />
                        <span>{item.price}</span>
                      </div>
                      {item.isVeg !== undefined && (
                        <div className="mt-2 flex justify-center">
                          <div className={`w-4 h-4 border-2 ${
                            item.isVeg 
                              ? 'border-green-500 bg-green-100' 
                              : 'border-red-500 bg-red-100'
                          } rounded-sm flex items-center justify-center`}>
                            <div className={`w-2 h-2 rounded-full ${
                              item.isVeg ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">
                  {searchTerm ? 'No items found' : 'No menu available'}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {searchTerm 
                    ? `No menu items match "${searchTerm}". Try searching for something else!`
                    : 'This stall hasn\'t uploaded their menu yet. Contact them directly for available items!'
                  }
                </p>
                {searchTerm && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSearchTerm('')}
                    className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-semibold transition-colors"
                  >
                    Clear Search
                  </motion.button>
                )}
              </motion.div>
            )}
          </div>

          {/* Footer */}
          {filteredAndSortedMenu.length > 0 && (
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 border-t border-orange-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="font-medium">
                  💡 Tip: Contact the stall to confirm availability
                </span>
                <span className="font-semibold">
                  {filteredAndSortedMenu.length} of {menu.length} items shown
                </span>
              </div>
            </div>
          )}
        </motion.div>

        <style>{`
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #fb923c #fed7aa;
          }
          
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #fed7aa;
            border-radius: 3px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #fb923c;
            border-radius: 3px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #ea580c;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};

export default StallMenuDrawer;