import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
    axios.get(`/api/stalls/${id}`)
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
      const res = await axios.put(`/api/stalls/update/${id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Save menu separately
      await axios.put(`/api/stalls/menu/${id}`, { menuItems }, {
        withCredentials: true,
      });

      toast.success("Stall updated!");
      navigate("/vendor/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const addMenuItem = () => {
    if (!newMenuItem.name || !newMenuItem.price) return;
    setMenuItems([...menuItems, newMenuItem]);
    setNewMenuItem({ name: "", price: "" });
  };

  const removeMenuItem = (index) => {
    const updated = [...menuItems];
    updated.splice(index, 1);
    setMenuItems(updated);
  };

  if (!stallData) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 space-y-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-semibold text-gray-800">Edit Stall</h1>

      <div className="grid gap-4">
        <div>
          <Label>Stall Name</Label>
          <Input name="stallName" value={stallData.stallName} onChange={handleChange} required />
        </div>
        <div>
          <Label>Address</Label>
          <Input name="address" value={stallData.address} onChange={handleChange} required />
        </div>
        <div>
          <Label>Description</Label>
          <Input name="description" value={stallData.description || ""} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Opening Time</Label>
            <Input name="openingTime" value={stallData.openingTime} onChange={handleChange} required />
          </div>
          <div>
            <Label>Closing Time</Label>
            <Input name="closingTime" value={stallData.closingTime} onChange={handleChange} required />
          </div>
        </div>
        <div>
          <Label>Category</Label>
          <Input name="category" value={stallData.category} onChange={handleChange} required />
        </div>
        <div>
          <Label>Main Image</Label>
          <Input type="file" accept="image/*" onChange={(e) => setMainImage(e.target.files[0])} />
        </div>
        <div>
          <Label>Other Images (Max 5)</Label>
          <Input type="file" accept="image/*" multiple onChange={(e) => setOtherImages([...e.target.files])} />
        </div>
        <div>
          <Label>Menu</Label>
          <Dialog open={menuDialogOpen} onOpenChange={setMenuDialogOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="outline">Edit Menu</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Menu</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                {menuItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      className="flex-1"
                      value={item.name}
                      onChange={(e) => {
                        const updated = [...menuItems];
                        updated[index].name = e.target.value;
                        setMenuItems(updated);
                      }}
                      placeholder="Dish Name"
                    />
                    <Input
                      type="number"
                      className="w-24"
                      value={item.price}
                      onChange={(e) => {
                        const updated = [...menuItems];
                        updated[index].price = e.target.value;
                        setMenuItems(updated);
                      }}
                      placeholder="₹"
                    />
                    <Button variant="destructive" size="sm" onClick={() => removeMenuItem(index)}>X</Button>
                  </div>
                ))}
                <div className="flex gap-2 mt-4">
                  <Input
                    className="flex-1"
                    placeholder="New Dish Name"
                    value={newMenuItem.name}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                  />
                  <Input
                    type="number"
                    className="w-24"
                    placeholder="₹"
                    value={newMenuItem.price}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
                  />
                  <Button type="button" onClick={addMenuItem}>Add</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Stall"}
        </Button>
      </div>
    </form>
  );
};

export default EditStallPage;
