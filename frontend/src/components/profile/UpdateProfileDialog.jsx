import React, { useState } from "react";
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
import { Loader2 } from "lucide-react";
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

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
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
      toast.success(res.data.message || "Profile updated!");
      setOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white dark:bg-gray-900 text-white max-w-md sm:max-w-lg rounded-xl px-6 py-8 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Profile
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
            Update your name, email, and profile picture.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={input.name}
              onChange={handleChange}
              required
              placeholder="Your full name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={input.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="profilePhoto">Profile Photo</Label>

            <div className="flex items-center gap-4">
              <input
                id="profilePhoto"
                name="profilePhoto"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
              <label
                htmlFor="profilePhoto"
                className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 text-sm"
              >
                Choose File
              </label>

              <span className="text-sm text-gray-300 dark:text-gray-400 truncate max-w-[200px]">
                {file ? file.name : "No file chosen"}
              </span>
            </div>

            {file && (
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="h-16 w-16 mt-2 rounded-full object-cover border"
              />
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className={`w-full flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-semibold 
              text-white bg-blue-600 hover:bg-blue-700 
              focus:outline-none focus:ring-2 focus:ring-blue-400 
              shadow-md hover:shadow-lg transition duration-200 ${
                loading ? "cursor-not-allowed opacity-70" : ""
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
