import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MdStore, 
  MdLocationPin, 
  MdAccessTime, 
  MdPhone, 
  MdCategory,
  MdImage,
  MdDescription
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { 
  MapPin, 
  Clock, 
  Phone, 
  Camera, 
  Upload, 
  CheckCircle,
  ArrowLeft,
  Star
} from "lucide-react";
import { STALL_API_END_POINT } from "../utils/constants";

const categories = [
  "North Indian", "South Indian", "Chinese", "Street Food", "Fast Food", "Snacks & Chaat",
  "Beverages", "Tea & Coffee", "Juices & Shakes", "Bakery", "Sweets & Desserts", "Fusion Food",
  "Tandoori Items", "Breakfast Special", "Healthy / Diet Food", "Thali", "Rolls & Wraps",
  "Rice & Biryani", "Paratha / Roti Items", "Others"
];

const AddStallPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stallData, setStallData] = useState({
    stallName: "",
    address: "",
    openingTime: "",
    closingTime: "",
    phoneNumber: "",
    category: "",
    description: "",
    lat: "",
    lng: "",
    city: "",
  });

  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [otherImages, setOtherImages] = useState([]);
  const [locationFetching, setLocationFetching] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries/cities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: "India" }),
        });
        const data = await res.json();
        const formatted = data.data.map((city) => ({ value: city, label: city }));
        setCities(formatted);
      } catch (err) {
        console.error("City fetch error", err);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStallData({ ...stallData, [name]: value });
  };

  const handleMainImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleOtherImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    setOtherImages(files);
  };

  const getLocation = async () => {
    if (navigator.geolocation) {
      setLocationFetching(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStallData({
            ...stallData,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast.success("Location fetched successfully! 📍");
          setLocationFetching(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Failed to fetch location. Please try again.");
          setLocationFetching(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return stallData.stallName && stallData.address && stallData.city;
      case 2:
        return stallData.openingTime && stallData.closingTime && stallData.phoneNumber && stallData.category;
      case 3:
        return stallData.lat && stallData.lng;
      case 4:
        return mainImage;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mainImage) return toast.error("Main image is required!");
    if (!stallData.lat || !stallData.lng) return toast.error("Please fetch your location!");

    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(stallData).forEach(([key, val]) => formData.append(key, val));
    formData.append("mainImage", mainImage);
    otherImages.forEach((file) => formData.append("otherImages", file));

    try {
      const res = await axios.post(`${STALL_API_END_POINT}/create`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Stall created successfully! 🎉");
      navigate("/vendor/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating stall");
    } finally {
      setIsSubmitting(false);
    }
  };

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      border: '2px solid #fed7aa',
      borderColor: state.isFocused ? '#fb923c' : '#fed7aa',
      borderRadius: '12px',
      padding: '8px',
      boxShadow: state.isFocused ? '0 0 0 4px rgba(251, 146, 60, 0.1)' : 'none',
      '&:hover': { borderColor: '#fb923c' }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#fb923c' : state.isFocused ? '#fed7aa' : 'white',
      color: state.isSelected ? 'white' : '#374151'
    })
  };

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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const stepVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "🏪 Basic Information";
      case 2: return "⏰ Business Details";
      case 3: return "📍 Location Setup";
      case 4: return "📸 Add Photos";
      case 5: return "✅ Review & Submit";
      default: return "Add Your Stall";
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div variants={stepVariants} className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🏪</div>
              <h3 className="text-2xl font-bold text-gray-900">Let's start with the basics!</h3>
              <p className="text-gray-600">Tell us about your amazing stall</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-gray-700 font-bold flex items-center gap-2 mb-2">
                  <MdStore className="text-orange-500" />
                  Stall Name *
                </Label>
                <Input 
                  name="stallName" 
                  value={stallData.stallName} 
                  onChange={handleChange} 
                  placeholder="e.g., Sharma's Chaat Corner"
                  className="border-2 border-orange-200 focus:border-orange-500 rounded-xl py-3"
                  required 
                />
              </div>

              <div>
                <Label className="text-gray-700 font-bold flex items-center gap-2 mb-2">
                  <MapPin className="text-orange-500" size={16} />
                  Full Address *
                </Label>
                <Textarea 
                  name="address" 
                  value={stallData.address} 
                  onChange={handleChange} 
                  placeholder="Complete address with landmarks"
                  className="border-2 border-orange-200 focus:border-orange-500 rounded-xl"
                  rows={3}
                  required 
                />
              </div>

              <div>
                <Label className="text-gray-700 font-bold flex items-center gap-2 mb-2">
                  🏙️ City *
                </Label>
                {loadingCities ? (
                  <div className="flex items-center gap-2 text-orange-600 p-4 bg-orange-50 rounded-xl">
                    <div className="animate-spin w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                    Loading cities...
                  </div>
                ) : (
                  <Select
                    options={cities}
                    onChange={(selected) => setStallData({ ...stallData, city: selected?.value || "" })}
                    placeholder="Select your city"
                    isClearable
                    styles={customSelectStyles}
                  />
                )}
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div variants={stepVariants} className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">⏰</div>
              <h3 className="text-2xl font-bold text-gray-900">Business Details</h3>
              <p className="text-gray-600">When are you open and what do you serve?</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 font-bold flex items-center gap-2 mb-2">
                  <Clock className="text-orange-500" size={16} />
                  Opening Time *
                </Label>
                <Input 
                  name="openingTime" 
                  value={stallData.openingTime} 
                  onChange={handleChange} 
                  type="time"
                  className="border-2 border-orange-200 focus:border-orange-500 rounded-xl py-3"
                  required 
                />
              </div>

              <div>
                <Label className="text-gray-700 font-bold flex items-center gap-2 mb-2">
                  <Clock className="text-orange-500" size={16} />
                  Closing Time *
                </Label>
                <Input 
                  name="closingTime" 
                  value={stallData.closingTime} 
                  onChange={handleChange} 
                  type="time"
                  className="border-2 border-orange-200 focus:border-orange-500 rounded-xl py-3"
                  required 
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-700 font-bold flex items-center gap-2 mb-2">
                <Phone className="text-orange-500" size={16} />
                Phone Number *
              </Label>
              <Input 
                name="phoneNumber" 
                value={stallData.phoneNumber} 
                onChange={handleChange} 
                placeholder="+91 98765 43210"
                className="border-2 border-orange-200 focus:border-orange-500 rounded-xl py-3"
                required 
              />
            </div>

            <div>
              <Label className="text-gray-700 font-bold flex items-center gap-2 mb-2">
                <MdCategory className="text-orange-500" />
                Food Category *
              </Label>
              <select
                name="category"
                value={stallData.category}
                onChange={handleChange}
                className="w-full border-2 border-orange-200 focus:border-orange-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-orange-200"
                required
              >
                <option value="">Select your specialty</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-gray-700 font-bold flex items-center gap-2 mb-2">
                <MdDescription className="text-orange-500" />
                Description (Optional)
              </Label>
              <Textarea 
                name="description" 
                value={stallData.description} 
                onChange={handleChange} 
                placeholder="Tell customers what makes your food special..."
                className="border-2 border-orange-200 focus:border-orange-500 rounded-xl"
                rows={3}
              />
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div variants={stepVariants} className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">📍</div>
              <h3 className="text-2xl font-bold text-gray-900">Set Your Location</h3>
              <p className="text-gray-600">Help customers find you easily</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl border-2 border-blue-200 text-center">
              <MapPin className="mx-auto mb-4 text-blue-600" size={48} />
              <h4 className="text-xl font-bold text-gray-900 mb-4">Location Required</h4>
              <p className="text-gray-600 mb-6">
                We need your exact location to help customers find your stall on the map.
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button" 
                onClick={getLocation} 
                disabled={locationFetching}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto disabled:opacity-50"
              >
                {locationFetching ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Getting Location...
                  </>
                ) : (
                  <>
                    <MdLocationPin size={20} />
                    Get My Location
                  </>
                )}
              </motion.button>

              {stallData.lat && stallData.lng && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 bg-green-100 text-green-800 p-4 rounded-xl border border-green-200"
                >
                  <CheckCircle className="mx-auto mb-2 text-green-600" size={24} />
                  <p className="font-bold">✅ Location successfully captured!</p>
                  <p className="text-sm mt-1">Lat: {stallData.lat.toFixed(6)}, Lng: {stallData.lng.toFixed(6)}</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div variants={stepVariants} className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-2xl font-bold text-gray-900">Showcase Your Food</h3>
              <p className="text-gray-600">Great photos attract more customers!</p>
            </div>

            <div className="space-y-6">
              {/* Main Image */}
              <div>
                <Label className="text-gray-700 font-bold flex items-center gap-2 mb-4">
                  <Camera className="text-orange-500" size={16} />
                  Main Image * (This will be your cover photo)
                </Label>
                
                <div className="border-2 border-dashed border-orange-300 rounded-2xl p-8 text-center hover:border-orange-500 transition-colors">
                  {mainImagePreview ? (
                    <div className="relative">
                      <img 
                        src={mainImagePreview} 
                        alt="Main preview" 
                        className="w-full h-64 object-cover rounded-xl mb-4"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setMainImage(null);
                          setMainImagePreview(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="mx-auto mb-4 text-orange-500" size={48} />
                      <p className="text-gray-600 mb-4">Click to upload your best food photo</p>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImage}
                    className="hidden"
                    id="mainImage"
                    required
                  />
                  <label 
                    htmlFor="mainImage"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl cursor-pointer transition-colors font-semibold"
                  >
                    Choose Main Image
                  </label>
                </div>
              </div>

              {/* Other Images */}
              <div>
                <Label className="text-gray-700 font-bold flex items-center gap-2 mb-4">
                  <MdImage className="text-orange-500" />
                  Additional Images (Up to 5, Optional)
                </Label>
                
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleOtherImages}
                  className="w-full border-2 border-orange-200 focus:border-orange-500 rounded-xl p-3"
                />
                
                {otherImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                    {otherImages.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`Preview ${idx}`}
                          className="w-full h-24 object-cover rounded-xl shadow-lg border-2 border-white"
                        />
                        <div className="absolute top-1 right-1 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                          {idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div variants={stepVariants} className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-gray-900">Review Your Stall</h3>
              <p className="text-gray-600">Everything looks good? Let's publish your stall!</p>
            </div>

            <div className="bg-gradient-to-br from-white/80 to-orange-50/60 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/50 shadow-xl">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Preview Image */}
                <div>
                  {mainImagePreview && (
                    <img 
                      src={mainImagePreview} 
                      alt="Stall preview" 
                      className="w-full h-48 object-cover rounded-xl shadow-lg"
                    />
                  )}
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <h4 className="text-2xl font-bold text-gray-900">{stallData.stallName}</h4>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>📍 Address:</strong> {stallData.address}</p>
                    <p><strong>🏙️ City:</strong> {stallData.city}</p>
                    <p><strong>⏰ Hours:</strong> {stallData.openingTime} - {stallData.closingTime}</p>
                    <p><strong>📞 Phone:</strong> {stallData.phoneNumber}</p>
                    <p><strong>🍽️ Category:</strong> {stallData.category}</p>
                    {stallData.description && (
                      <p><strong>📝 Description:</strong> {stallData.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 text-6xl opacity-8 animate-bounce">🏪</div>
        <div className="absolute top-1/3 right-32 text-5xl opacity-10 animate-bounce delay-300">📸</div>
        <div className="absolute bottom-1/4 left-40 text-7xl opacity-6 animate-bounce delay-600">🍛</div>
        <div className="absolute bottom-32 right-20 text-4xl opacity-12 animate-bounce delay-900">⭐</div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto p-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-gradient-to-r from-white/80 to-orange-50/60 backdrop-blur-lg rounded-2xl p-8 shadow-xl border-2 border-white/50">
            <div className="flex items-center justify-between mb-6">
              <motion.button
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/vendor/dashboard")}
                className="flex items-center gap-2 text-orange-600 hover:text-orange-800 font-semibold"
              >
                <ArrowLeft size={20} />
                Back to Dashboard
              </motion.button>
              
              <div className="text-center">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">
                  {getStepTitle()}
                </h1>
                <p className="text-gray-600 font-medium">Step {currentStep} of 5</p>
              </div>
              
              <div className="w-32"></div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
              <motion.div 
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Form Content */}
        <motion.div variants={itemVariants}>
          <form onSubmit={handleSubmit}>
            <div className="bg-gradient-to-br from-white/80 to-orange-50/60 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border-2 border-white/50 mb-8">
              <AnimatePresence mode="wait">
                {renderStep()}
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {currentStep > 1 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                >
                  Previous
                </motion.button>
              )}
              
              <div className="ml-auto">
                {currentStep < 5 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={nextStep}
                    disabled={!validateStep(currentStep)}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step →
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        Creating Stall...
                      </>
                    ) : (
                      <>
                        🚀 Publish Stall
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AddStallPage;
