import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X, User, Mail, Camera } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import { PERSON_API_END_POINT } from "../utils/constants";
import { setAuthUser } from "../redux/authSlice";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", input.name);
      formData.append("email", input.email);
      if (file) {
        formData.append("profilePhoto", file);
      }

      const res = await axios.put(
        `${PERSON_API_END_POINT}/update-profile`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      dispatch(setAuthUser(res.data.user));
      toast.success(res.data.message || "Profile updated successfully! 🎉");
      setOpen(false);
      removeFile();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    removeFile();
    setInput({
      name: user?.name || "",
      email: user?.email || "",
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={handleClose}>
          <DialogContent className="bg-gradient-to-br from-white/95 to-orange-50/80 backdrop-blur-lg border-2 border-white/50 max-w-md sm:max-w-lg rounded-2xl px-0 py-0 shadow-2xl overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black flex items-center gap-3">
                      <User size={28} />
                      Edit Profile
                    </DialogTitle>
                    <DialogDescription className="text-orange-100 font-medium text-lg">
                      Update your information to keep your profile fresh! ✨
                    </DialogDescription>
                  </DialogHeader>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-2 right-4 text-3xl opacity-20">👤</div>
                <div className="absolute bottom-2 left-4 text-2xl opacity-20">🎯</div>
              </div>

              {/* Form Content */}
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="name" className="text-gray-700 font-bold flex items-center gap-2">
                      <User size={16} className="text-orange-500" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={input.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className="border-2 border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-200 rounded-xl py-3 px-4 font-medium bg-white/70 backdrop-blur-sm transition-all duration-200"
                    />
                  </motion.div>

                  {/* Email Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="email" className="text-gray-700 font-bold flex items-center gap-2">
                      <Mail size={16} className="text-orange-500" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={input.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="border-2 border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-200 rounded-xl py-3 px-4 font-medium bg-white/70 backdrop-blur-sm transition-all duration-200"
                    />
                  </motion.div>

                  {/* Profile Photo Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3"
                  >
                    <Label className="text-gray-700 font-bold flex items-center gap-2">
                      <Camera size={16} className="text-orange-500" />
                      Profile Photo
                    </Label>

                    <div className="space-y-4">
                      {/* File Upload Button */}
                      <div className="relative">
                        <input
                          id="profilePhoto"
                          name="profilePhoto"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <motion.label
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          htmlFor="profilePhoto"
                          className="cursor-pointer flex items-center justify-center gap-3 w-full p-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl transition-all duration-200 font-semibold border-2 border-orange-400 shadow-lg"
                        >
                          <Upload size={20} />
                          Choose New Photo
                        </motion.label>
                      </div>

                      {/* File Preview */}
                      <AnimatePresence>
                        {(file || previewUrl) && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative"
                          >
                            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border-2 border-orange-200">
                              <div className="flex items-center gap-4">
                                <img
                                  src={previewUrl}
                                  alt="Preview"
                                  className="w-16 h-16 rounded-full object-cover border-4 border-orange-300 shadow-lg"
                                />
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-800 truncate">
                                    {file?.name}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Ready to upload! 📸
                                  </p>
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  type="button"
                                  onClick={removeFile}
                                  className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors duration-200"
                                >
                                  <X size={16} />
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Current Photo Display */}
                      {!file && user?.profilePhoto && (
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border-2 border-orange-200">
                          <div className="flex items-center gap-4">
                            <img
                              src={user.profilePhoto}
                              alt="Current"
                              className="w-16 h-16 rounded-full object-cover border-4 border-orange-300 shadow-lg"
                            />
                            <div>
                              <p className="font-semibold text-gray-800">Current Photo</p>
                              <p className="text-sm text-gray-600">Choose a new file to update</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <DialogFooter className="gap-3 pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleClose}
                        className="flex-1 px-6 py-3 bg-white/70 hover:bg-white/90 text-gray-700 hover:text-gray-900 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
                      >
                        Cancel
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        type="submit"
                        disabled={loading}
                        className={`flex-1 flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 shadow-lg ${
                          loading 
                            ? "bg-gray-400 cursor-not-allowed" 
                            : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 hover:shadow-xl border-2 border-orange-400"
                        }`}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="animate-spin" size={20} />
                            Updating...
                          </>
                        ) : (
                          <>
                            ✨ Update Profile
                          </>
                        )}
                      </motion.button>
                    </DialogFooter>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default UpdateProfileDialog;