import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import axios from "axios";
import LanguageSelector from "../LanguageSelector";

// UI + Icons
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User2 } from "lucide-react";
import { setAuthUser } from "../redux/authSlice";
import { USER_API_END_POINT } from "../utils/constants";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const logOutHandler = async () => {
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/logout`,
        {},
        { withCredentials: true }
      );

      if (res.data.message) {
        dispatch(setAuthUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Logout failed. Try again."
      );
    }
  };

  return (
    <header className="bg-red-500 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div>
          <Link
            to="/"
            className="text-3xl font-extrabold tracking-tight text-white hover:text-yellow-300 transition"
          >
            Street<span className="text-black">Bites</span>
          </Link>
        </div>

        {/* Language Selector */}
        <LanguageSelector />

        {/* Navigation Links */}
        <div className="flex gap-4 items-center">
          {!user ? (
            <>
              <Link
                to="/login"
                className="bg-white text-red-500 px-4 py-2 rounded-xl font-semibold hover:bg-red-100 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-yellow-300 text-black px-4 py-2 rounded-xl font-semibold hover:bg-yellow-400 transition"
              >
                SignUp
              </Link>
            </>
          ) : (
            <div className="flex gap-4 items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={
                        user.profilePhoto ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
                      }
                      alt={user.name}
                    />
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="bg-white w-64 mt-2 p-3 rounded-lg shadow-lg border">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                      />
                    </Avatar>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      if (user.role === "vendor") {
                        navigate("/vendor/profile");
                      } else {
                        navigate("/profile");
                      }
                    }}
                    variant="outline"
                    className="w-full mb-2 flex gap-2 items-center justify-center"
                  >
                    <User2 size={18} />
                    View Profile
                  </Button>

                  <Button
                    onClick={logOutHandler}
                    className="w-full flex gap-2 items-center justify-center bg-red-100 text-black hover:bg-red-200"
                  >
                    <LogOut size={18} />
                    Logout
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
