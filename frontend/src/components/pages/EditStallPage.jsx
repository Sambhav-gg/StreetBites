import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Store, 
  MapPin, 
  Clock, 
  Camera, 
  Menu, 
  Plus, 
  Trash2, 
  Edit3,
  Save,
  ArrowLeft,
  Upload
} from "lucide-react";
import { STALL_API_END_POINT } from "../utils/constants";

const EditStallPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [stallData, setStallData] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [otherImages, setOtherImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [menuDialogOpen, setMenuDialogOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [newMenuItem, setNewMenuItem] = useState({ name: "", price: "" });

  useEffect(() => {
    axios.get(`${STALL_API_END_POINT}/${id}`)
      .then(res => {
        setStallData(res.data);
        setMenuItems(res.data.menu || []);
      })
      .catch(() => toast.error("Failed to load stall"));
  }, [id]);

  const handleChange = (e) => {
    setStallData({ ...stallData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    for (const key in stallData) {
      if (key !== "coordinates" && typeof stallData[key] === "string") {
        formData.append(key, stallData[key]);
      }
    }
    formData.append("lat", stallData.coordinates.coordinates[1]);
    formData.append("lng", stallData.coordinates.coordinates[0]);

    if (mainImage) formData.append("mainImage", mainImage);
    otherImages.forEach(file => formData.append("otherImages", file));

    try {
      const res = await axios.put(`${STALL_API_END_POINT}/update/${id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Save menu separately
      await axios.put(`${STALL_API_END_POINT}/menu/${id}`, { menuItems }, {
        withCredentials: true,
      });

      toast.success("Stall updated successfully! 🎉");
      navigate("/vendor/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const addMenuItem = () => {
    if (!newMenuItem.name || !newMenuItem.price) {
      toast.error("Please fill in both dish name and price");
      return;
    }
    setMenuItems([...menuItems, newMenuItem]);
    setNewMenuItem({ name: "", price: "" });
    toast.success("Menu item added! 🍽️");
  };

  const removeMenuItem = (index) => {
    const updated = [...menuItems];
    updated.splice(index, 1);
    setMenuItems(updated);
    toast.success("Menu item removed");
  };

  if (!stallData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-50 to-amber-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border-2 border-white/50">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">🍛</div>
            <div className="text-xl font-bold text-orange-600">Loading stall details...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-50 to-amber-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Floating Food Emojis */}
        <div className="absolute top-20 left-20 text-6xl opacity-10 animate-bounce">🏪</div>
        <div className="absolute top-32 right-32 text-5xl opacity-15 animate-bounce delay-200">🍛</div>
        <div className="absolute bottom-40 left-40 text-7xl opacity-8 animate-bounce delay-700">🥘</div>
        <div className="absolute bottom-32 right-20 text-4xl opacity-12 animate-bounce delay-1000">📋</div>
        
        {/* Gradient Blobs */}
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-gradient-to-br from-orange-300/20 to-yellow-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-amber-300/15 to-orange-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/vendor/dashboard")}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-800 font-semibold mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          
          <div className="bg-gradient-to-r from-white/80 to-orange-50/60 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border-2 border-white/50">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🏪</div>
              <div>
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">
                  Edit Your Stall
                </h1>
                <p className="text-gray-600 font-semibold">
                  Update your stall information and menu
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-gradient-to-br from-white/80 to-orange-50/60 backdrop-blur-lg border-2 border-white/50 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-xl">
              <CardTitle className="flex items-center gap-3">
                <Store size={24} />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    🏪 Stall Name
                  </Label>
                  <Input
                    name="stallName"
                    value={stallData.stallName}
                    onChange={handleChange}
                    className="border-2 border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 bg-white/70 backdrop-blur-sm"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    🏷️ Category
                  </Label>
                  <Input
                    name="category"
                    value={stallData.category}
                    onChange={handleChange}
                    className="border-2 border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 bg-white/70 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <MapPin size={16} />
                  Address
                </Label>
                <Input
                  name="address"
                  value={stallData.address}
                  onChange={handleChange}
                  className="border-2 border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 bg-white/70 backdrop-blur-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  📝 Description
                </Label>
                <Textarea
                  name="description"
                  value={stallData.description || ""}
                  onChange={handleChange}
                  className="border-2 border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 bg-white/70 backdrop-blur-sm min-h-[100px]"
                  placeholder="Tell customers about your amazing food..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Clock size={16} />
                    Opening Time
                  </Label>
                  <Input
                    name="openingTime"
                    type="time"
                    value={stallData.openingTime}
                    onChange={handleChange}
                    className="border-2 border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 bg-white/70 backdrop-blur-sm"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Clock size={16} />
                    Closing Time
                  </Label>
                  <Input
                    name="closingTime"
                    type="time"
                    value={stallData.closingTime}
                    onChange={handleChange}
                    className="border-2 border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 bg-white/70 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images Section */}
          <Card className="bg-gradient-to-br from-white/80 to-orange-50/60 backdrop-blur-lg border-2 border-white/50 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-xl">
              <CardTitle className="flex items-center gap-3">
                <Camera size={24} />
                Images
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  📸 Main Image
                </Label>
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setMainImage(e.target.files[0])}
                    className="border-2 border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 bg-white/70 backdrop-blur-sm"
                  />
                  <Upload className="absolute right-3 top-3 text-orange-400" size={20} />
                </div>
                <p className="text-xs text-gray-500">Upload your best stall photo as the main image</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  🖼️ Additional Images
                </Label>
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setOtherImages([...e.target.files])}
                    className="border-2 border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 bg-white/70 backdrop-blur-sm"
                  />
                  <Upload className="absolute right-3 top-3 text-orange-400" size={20} />
                </div>
                <p className="text-xs text-gray-500">Upload up to 5 additional photos (food, ambiance, etc.)</p>
              </div>
            </CardContent>
          </Card>

          {/* Menu Section */}
          <Card className="bg-gradient-to-br from-white/80 to-orange-50/60 backdrop-blur-lg border-2 border-white/50 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-xl">
              <CardTitle className="flex items-center gap-3">
                <Menu size={24} />
                Menu Management
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-700 font-semibold">Current Menu Items: {menuItems.length}</p>
                  <p className="text-sm text-gray-500">Click to edit your menu</p>
                </div>
                <Dialog open={menuDialogOpen} onOpenChange={setMenuDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl">
                      <Edit3 size={16} className="mr-2" />
                      Edit Menu
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-white/90 to-orange-50/60 backdrop-blur-lg border-2 border-white/50">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 flex items-center gap-2">
                        🍽️ Edit Menu
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {menuItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-orange-200">
                          <div className="text-2xl">🍽️</div>
                          <Input
                            className="flex-1 border-orange-200 focus:border-orange-500"
                            value={item.name}
                            onChange={(e) => {
                              const updated = [...menuItems];
                              updated[index].name = e.target.value;
                              setMenuItems(updated);
                            }}
                            placeholder="Dish Name"
                          />
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-bold text-orange-600">₹</span>
                            <Input
                              type="number"
                              className="w-20 border-orange-200 focus:border-orange-500"
                              value={item.price}
                              onChange={(e) => {
                                const updated = [...menuItems];
                                updated[index].price = e.target.value;
                                setMenuItems(updated);
                              }}
                              placeholder="Price"
                            />
                          </div>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => removeMenuItem(index)}
                            className="rounded-lg"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}
                      
                      <div className="border-t border-orange-200 pt-4">
                        <div className="flex gap-3 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border-2 border-orange-200">
                          <div className="text-2xl">🆕</div>
                          <Input
                            className="flex-1 border-orange-200 focus:border-orange-500"
                            placeholder="New Dish Name"
                            value={newMenuItem.name}
                            onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                          />
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-bold text-orange-600">₹</span>
                            <Input
                              type="number"
                              className="w-20 border-orange-200 focus:border-orange-500"
                              placeholder="Price"
                              value={newMenuItem.price}
                              onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
                            />
                          </div>
                          <Button 
                            type="button" 
                            onClick={addMenuItem}
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg"
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              {menuItems.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {menuItems.slice(0, 4).map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-orange-200">
                      <span className="font-medium text-gray-700">{item.name}</span>
                      <span className="font-bold text-orange-600">₹{item.price}</span>
                    </div>
                  ))}
                  {menuItems.length > 4 && (
                    <div className="col-span-full text-center text-gray-500 text-sm">
                      ... and {menuItems.length - 4} more items
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xl font-bold py-4 px-12 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 border-2 border-orange-400 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Updating Stall...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Save size={20} />
                  Update Stall
                  <span className="animate-pulse">✨</span>
                </div>
              )}
            </Button>
          </div>
        </form>

        {/* Trust Badges */}
        <div className="mt-8 flex justify-center items-center gap-6 text-sm text-gray-500">
          <span className="flex items-center gap-2 bg-white/50 px-3 py-2 rounded-lg">
            🛡️ Secure Updates
          </span>
          <span className="flex items-center gap-2 bg-white/50 px-3 py-2 rounded-lg">
            ⚡ Instant Save
          </span>
          <span className="flex items-center gap-2 bg-white/50 px-3 py-2 rounded-lg">
            🎯 Easy Management
          </span>
        </div>
      </div>
    </div>
  );
};

export default EditStallPage;
