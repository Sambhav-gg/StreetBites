import React, { useState } from "react";
import {
  FaEdit,
  FaStar,
  FaChartBar,
  FaTrashAlt,
  FaUtensils,
  FaPlus,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "react-hot-toast";

const VendorStallCard = ({ stall }) => {
  const navigate = useNavigate();

  const [confirmDelete, setConfirmDelete] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState(stall.menu || []);
  const [showReviews, setShowReviews] = useState(false);

  const handleDelete = async () => {
    if (confirmDelete.trim().toLowerCase() !== "delete") {
      toast.error('You must type "delete" to confirm');
      return;
    }

    try {
      await axios.delete(`/api/stalls/delete/${stall._id}`, {
        withCredentials: true,
      });

      toast.success("Stall deleted");
      window.location.reload(); // or trigger parent state refresh
    } catch (err) {
      toast.error("Failed to delete stall");
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

  const saveUpdatedMenu = async () => {
    try {
      await axios.put(
        `/api/stalls/menu/${stall._id}`,
        { menuItems },
        { withCredentials: true }
      );
      toast.success("Menu updated");
      setMenuOpen(false);
    } catch {
      toast.error("Failed to update menu");
    }
  };

  return (
    <div className="bg-white border rounded-xl shadow hover:shadow-lg transition duration-300 overflow-hidden">
      <img
        src={stall.mainImage || "/placeholder.jpg"}
        alt={stall.stallName}
        className="w-full h-48 object-cover"
      />

      <div className="p-4 space-y-2">
        {/* Header: Name + Edit */}
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">{stall.stallName}</h3>
          <button
            onClick={() => navigate(`/vendor/edit-stall/${stall._id}`)}
            className="text-blue-600 hover:text-blue-800"
          >
            <FaEdit size={18} />
          </button>
        </div>

        {/* Address + Rating */}
        <p className="text-sm text-gray-600">{stall.address}</p>
        <div
          className="flex items-center text-yellow-500 gap-1 cursor-pointer"
          onClick={() => setShowReviews(true)} // Open review modal
        >
          <FaStar />
          <span className="font-medium">
            {stall.averageRating ?? "N/A"} ({stall.numReviews} reviews)
          </span>
        </div>

        {/* Impressions */}
        <div className="mt-2 flex justify-between text-sm ">
          <div className="flex items-center gap-1 p-1 text-base">
            <FaChartBar />
            <span>Views: {stall.impressions.length}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {/* View & Edit Menu */}
          <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-1 w-full justify-center"
              >
                <FaUtensils /> View Menu
              </Button>
            </DialogTrigger>

            <DialogContent className="space-y-4 bg-white">
              <h2 className="text-lg font-semibold">Edit Menu</h2>

              {/* Add Menu Item Button */}
              <div className="flex justify-end bg-white border-2 rounded-md border-gray-500">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    setMenuItems([...menuItems, { name: "", price: "" }])
                  }
                  className="text-sm text-blue-600 flex items-center gap-1 hover:underline"
                >
                  <FaPlus size={14} /> Add Item
                </Button>
              </div>

              {menuItems.length === 0 && (
                <p className="text-gray-500 text-sm">No items in menu</p>
              )}

              {menuItems.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={item.name}
                    onChange={(e) =>
                      handleMenuChange(index, "name", e.target.value)
                    }
                    placeholder="Dish Name"
                  />
                  <Input
                    type="number"
                    value={item.price}
                    onChange={(e) =>
                      handleMenuChange(index, "price", e.target.value)
                    }
                    placeholder="Price"
                  />
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <Button onClick={saveUpdatedMenu} className="w-full">
                Save Menu
              </Button>
            </DialogContent>
          </Dialog>

          {/* Delete Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full flex items-center gap-1 justify-center text-red-600 hover:text-red-800"
              >
                <FaTrashAlt className="inline-block" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent className="space-y-4 bg-white">
              <h2 className="text-lg font-semibold text-red-600">
                Confirm Deletion
              </h2>
              <p>
                Type <strong className="text-red-500">delete</strong> to
                permanently delete your stall.
              </p>
              <Input
                className="bg-white border-2 border-gray-400"
                value={confirmDelete}
                onChange={(e) => setConfirmDelete(e.target.value)}
                placeholder='Type "delete"'
              />
              <Button
                onClick={handleDelete}
                className="w-full bg-red-500 hover:bg-red-600"
              >
                Confirm Delete
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Review Modal */}
      {showReviews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-96 max-h-[70vh] overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Reviews</h2>
              <button
                onClick={() => setShowReviews(false)}
                className="text-red-500 text-xl"
              >
                &times;
              </button>
            </div>

            {stall.reviews && stall.reviews.length > 0 ? (
              stall.reviews.map((review, index) => (
                <div key={index} className="mb-3 border-b pb-2">
                  <p className="font-medium">⭐ {review.rating}</p>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorStallCard;
