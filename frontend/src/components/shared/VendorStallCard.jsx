import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEdit,
  FaStar,
  FaChartBar,
  FaTrashAlt,
  FaUtensils,
  FaPlus,
  FaEye,
  FaHeart,
  FaMapMarkerAlt,
  FaExclamationTriangle
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IndianRupee, X, Save, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { STALL_API_END_POINT } from "../utils/constants";
const VendorStallCard = ({ stall }) => {
  const navigate = useNavigate();

  const [confirmDelete, setConfirmDelete] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState(stall.menu || []);
  const [showReviews, setShowReviews] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingMenu, setIsSavingMenu] = useState(false);

  const handleDelete = async () => {
    if (confirmDelete.trim().toLowerCase() !== "delete") {
      toast.error('You must type "delete" to confirm');
      return;
    }

    try {
      setIsDeleting(true);
      await axios.delete(`${ STALL_API_END_POINT }/delete/${stall._id}`, {
        withCredentials: true,
      });

      toast.success("Stall deleted successfully! 🗑️");
      window.location.reload(); // or trigger parent state refresh
    } catch (err) {
      toast.error("Failed to delete stall");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMenuChange = (index, field, value) => {
    const updated = [...menuItems];
    updated[index][field] = value;
    setMenuItems(updated);
  };

  const handleRemoveItem = (index) => {
    setMenuItems(menuItems.filter((_, i) => i !== index));
  };

  const addMenuItem = () => {
    setMenuItems([...menuItems, { name: "", price: "" }]);
  };

  const saveUpdatedMenu = async () => {
    // Filter out empty items
    const validItems = menuItems.filter(item => 
      item.name.trim() && item.price && parseFloat(item.price) > 0
    );

    if (validItems.length === 0) {
      toast.error("Please add at least one valid menu item");
      return;
    }

    try {
      setIsSavingMenu(true);
      await axios.put(
        `/api/stalls/menu/${stall._id}`,
        { menuItems: validItems },
        { withCredentials: true }
      );
      toast.success("Menu updated successfully! 🍽️");
      setMenuOpen(false);
    } catch {
      toast.error("Failed to update menu");
    } finally {
      setIsSavingMenu(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const imageVariants = {
    hover: { scale: 1.05 }
  };

  return (
    <>
      <motion.div
        variants={cardVariants}
        whileHover={{ 
          scale: 1.02,
          y: -5,
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
        }}
        className="group bg-gradient-to-br from-white/90 to-orange-50/60 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-white/50 hover:border-orange-200"
      >
        {/* Image Section */}
        <div className="relative overflow-hidden">
          <motion.img
            variants={imageVariants}
            whileHover="hover"
            src={stall.mainImage || "/placeholder.jpg"}
            alt={stall.stallName}
            className="w-full h-48 object-cover transition-transform duration-300"
          />
          
          {/* Overlay with Quick Actions */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4 flex justify-between">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(`/stall/${stall._id}`)}
                className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-2 rounded-xl font-semibold text-sm hover:bg-white transition-colors flex items-center gap-2"
              >
                <FaEye size={14} />
                Preview
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(`/vendor/edit-stall/${stall._id}`)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2"
              >
                <FaEdit size={14} />
                Edit
              </motion.button>
            </div>
          </div>

          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              ✅ Active
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          {/* Header */}
          <div>
            <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
              {stall.stallName}
            </h3>
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <FaMapMarkerAlt className="text-orange-500" size={14} />
              <p className="text-sm font-medium line-clamp-1">{stall.address}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowReviews(true)}
              className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-xl text-center cursor-pointer hover:shadow-md transition-all border border-yellow-200 hover:border-yellow-300"
            >
              <div className="flex items-center justify-center gap-1 text-yellow-600 mb-1">
                <FaStar size={14} />
                <span className="font-bold text-sm">
                  {stall.averageRating ? stall.averageRating.toFixed(1) : "N/A"}
                </span>
              </div>
              <div className="text-xs text-gray-600 font-medium">
                {stall.numReviews || 0} reviews
              </div>
            </motion.div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-xl text-center border border-blue-200">
              <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                <FaEye size={14} />
                <span className="font-bold text-sm">{stall.impressions?.length || 0}</span>
              </div>
              <div className="text-xs text-gray-600 font-medium">Views</div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-pink-50 p-3 rounded-xl text-center border border-red-200">
              <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
                <FaHeart size={14} />
                <span className="font-bold text-sm">{stall.likes?.length || 0}</span>
              </div>
              <div className="text-xs text-gray-600 font-medium">Likes</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* Menu Dialog */}
            <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
              <DialogTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <FaUtensils size={16} />
                  Menu
                </motion.button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-2xl max-h-[90vh] bg-gradient-to-br from-white/95 to-green-50/80 backdrop-blur-lg shadow-2xl rounded-3xl p-0 border-2 border-white/50 overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white">
                    <h2 className="text-3xl font-black flex items-center gap-3">
                      🍽️ Edit Menu
                    </h2>
                    <p className="text-green-100 font-medium">{stall.stallName}</p>
                  </div>

                  {/* Content */}
                  <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {/* Add Item Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={addMenuItem}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 rounded-xl mb-6 flex items-center justify-center gap-2 transition-all duration-200"
                    >
                      <FaPlus />
                      Add Menu Item
                    </motion.button>

                    {/* Menu Items */}
                    {menuItems.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-5xl mb-4">🍽️</div>
                        <p className="text-gray-600 font-medium">No menu items yet. Add your first dish!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <AnimatePresence>
                          {menuItems.map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className="flex gap-3 items-center bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-green-200"
                            >
                              <div className="flex-1">
                                <Input
                                  value={item.name}
                                  onChange={(e) =>
                                    handleMenuChange(index, "name", e.target.value)
                                  }
                                  placeholder="Dish name (e.g., Samosa, Dosa)"
                                  className="mb-2 border-2 border-green-200 focus:border-green-500"
                                />
                              </div>
                              
                              <div className="w-32">
                                <div className="relative">
                                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                  <Input
                                    type="number"
                                    value={item.price}
                                    onChange={(e) =>
                                      handleMenuChange(index, "price", e.target.value)
                                    }
                                    placeholder="Price"
                                    className="pl-10 border-2 border-green-200 focus:border-green-500"
                                    min="1"
                                  />
                                </div>
                              </div>
                              
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleRemoveItem(index)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <X size={18} />
                              </motion.button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="p-6 border-t border-green-200 bg-green-50/50">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={saveUpdatedMenu}
                      disabled={isSavingMenu}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 disabled:opacity-50"
                    >
                      {isSavingMenu ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Saving Menu...
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          Save Menu Changes
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <FaTrashAlt size={16} />
                  Delete
                </motion.button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md bg-gradient-to-br from-white/95 to-red-50/80 backdrop-blur-lg shadow-2xl rounded-3xl p-0 border-2 border-white/50 overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 text-white">
                    <div className="flex items-center gap-3">
                      <FaExclamationTriangle size={24} />
                      <h2 className="text-2xl font-black">⚠️ Confirm Deletion</h2>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div className="text-center">
                      <div className="text-5xl mb-4">🗑️</div>
                      <p className="text-gray-700 font-medium mb-4">
                        This action cannot be undone. Your stall and all its data will be permanently deleted.
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        Type <strong className="text-red-600 font-bold">"delete"</strong> to confirm deletion of <strong>{stall.stallName}</strong>
                      </p>
                    </div>

                    <Input
                      value={confirmDelete}
                      onChange={(e) => setConfirmDelete(e.target.value)}
                      placeholder='Type "delete" to confirm'
                      className="text-center font-medium border-2 border-red-200 focus:border-red-500"
                    />

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDelete}
                      disabled={isDeleting || confirmDelete.trim().toLowerCase() !== "delete"}
                      className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 size={20} />
                          Confirm Delete
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.div>

      {/* Reviews Modal */}
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
              className="bg-gradient-to-br from-white to-yellow-50 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl border-2 border-white/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">⭐ Reviews</h2>
                    <p className="text-yellow-100">{stall.stallName}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowReviews(false)}
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all duration-200"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-96">
                {stall.reviews && stall.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {stall.reviews.map((review, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-yellow-200"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`text-sm ${
                                  i < review.rating ? "text-yellow-500" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-bold text-yellow-600">{review.rating}/5</span>
                        </div>
                        <p className="text-gray-700 font-medium">{review.comment}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">No Reviews Yet</h3>
                    <p className="text-gray-600">Your customers haven't left any reviews yet.</p>
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

export default VendorStallCard;
