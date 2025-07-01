import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import axios from "axios";
import { motion } from "framer-motion";
import { MdStore, MdLocationPin } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const categories = [
  "North Indian", "South Indian", "Chinese", "Street Food", "Fast Food", "Snacks & Chaat",
  "Beverages", "Tea & Coffee", "Juices & Shakes", "Bakery", "Sweets & Desserts", "Fusion Food",
  "Tandoori Items", "Breakfast Special", "Healthy / Diet Food", "Thali", "Rolls & Wraps",
  "Rice & Biryani", "Paratha / Roti Items", "Others"
];

const AddStallPage = () => {
  const navigate = useNavigate();
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
  const [otherImages, setOtherImages] = useState([]);

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
    setMainImage(e.target.files[0]);
  };

  const handleOtherImages = (e) => {
    setOtherImages(Array.from(e.target.files));
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStallData({
            ...stallData,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast.success("Location fetched successfully!");
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Failed to fetch location.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mainImage) return toast.error("Main image is required!");
    if (!stallData.lat || !stallData.lng) return toast.error("Please fetch your location!");

    const formData = new FormData();
    Object.entries(stallData).forEach(([key, val]) => formData.append(key, val));
    formData.append("mainImage", mainImage);
    otherImages.forEach((file) => formData.append("otherImages", file));

    try {
      const res = await axios.post("/api/stalls/create", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Stall created successfully!");
      navigate("/vendor/dashboard");
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error submitting form");
    }
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-xl border border-red-200"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-8 text-red-600 flex items-center gap-2">
        <MdStore size={28} /> Add New Stall
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Stall Name</Label>
          <Input name="stallName" value={stallData.stallName} onChange={handleChange} required />
        </div>

        <div>
          <Label>Address</Label>
          <Input name="address" value={stallData.address} onChange={handleChange} required />
        </div>

        <div className="md:col-span-2 flex items-center gap-4">
          <Button type="button" onClick={getLocation} className="bg-green-500 hover:bg-green-600 text-white">
            <MdLocationPin className="mr-2" /> Get My Location
          </Button>
          {stallData.lat && stallData.lng && (
            <span className="text-gray-600">📍 Location fetched</span>
          )}
        </div>

        <div>
          <Label>Opening Time</Label>
          <Input name="openingTime" value={stallData.openingTime} onChange={handleChange} required type="time" />
        </div>

        <div>
          <Label>Closing Time</Label>
          <Input name="closingTime" value={stallData.closingTime} onChange={handleChange} required type="time" />
        </div>

        <div className="md:col-span-2">
          <Label>Description</Label>
          <Textarea name="description" value={stallData.description} onChange={handleChange} rows={3} />
        </div>

        <div>
          <Label>Phone Number</Label>
          <Input name="phoneNumber" value={stallData.phoneNumber} onChange={handleChange} required />
        </div>

        <div>
          <Label>Category</Label>
          <select
            name="category"
            value={stallData.category}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <Label>City</Label>
          {loadingCities ? (
            <p className="text-sm text-gray-500">Loading cities...</p>
          ) : (
            <Select
              options={cities}
              onChange={(selected) => setStallData({ ...stallData, city: selected?.value || "" })}
              placeholder="Select city"
              isClearable
            />
          )}
        </div>

        <div>
          <Label>Main Image *</Label>
          <Input type="file" accept="image/*" onChange={handleMainImage} required />
        </div>

        <div className="md:col-span-2">
          <Label>Other Images (up to 5)</Label>
          <Input type="file" accept="image/*" multiple onChange={handleOtherImages} />
          {otherImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
              {otherImages.map((img, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(img)}
                  alt={`Preview ${idx}`}
                  className="w-full h-24 object-cover rounded-md shadow-sm border"
                />
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-2 text-right">
          <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-xl">
            Submit Stall
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddStallPage;
