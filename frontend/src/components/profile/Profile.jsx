import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pen, ArrowLeft } from "lucide-react";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useSelector((store) => store.auth);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const avatarSrc =
    user.profilePhoto ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || "User")}`;

  return (
    <div className="min-h-screen bg-[#0B1120] flex flex-col items-center justify-center px-4 py-10">
      {/* Back Button */}
      <div className="w-full max-w-xl flex justify-start mb-6">
        <button
          onClick={() => navigate("/user/home")}
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-[#1C2536]/90 backdrop-blur-xl border border-white/10 w-full max-w-xl rounded-2xl px-8 py-6 shadow-2xl flex items-center justify-between transition-transform hover:scale-[1.01]">
        <div className="flex items-center gap-5">
          <Avatar className="w-20 h-20 ring-4 ring-red-500 shadow-xl">
            <AvatarImage src={avatarSrc} alt={user.name || "User"} />
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{user.name}</h2>
            <p className="text-sm text-gray-400 mt-1">{user.email || "No email provided"}</p>
          </div>
        </div>

        <Button
          onClick={() => setOpen(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-md transition-all hover:scale-105"
        >
          <Pen size={16} />
          Edit
        </Button>
      </div>

      {/* Dialog */}
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
