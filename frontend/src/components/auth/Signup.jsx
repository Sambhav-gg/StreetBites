import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthUser } from "../redux/authSlice";
import { USER_API_END_POINT } from "../utils/constants";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  // Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!phone || !name || !role) return toast.error("All fields are required");

    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/send-otp`,
        { phone, type: "signup", name, email, role },
        { withCredentials: true }
      );

      if (res.data.sessionId) {
        setSessionId(res.data.sessionId);
        setIsOtpSent(true);
        toast.success("OTP sent successfully");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
    }
  };

  // Verify OTP
  // const handleVerifyOtp = async (e) => {
  //   e.preventDefault();

  //   if (!otp) return toast.error("Please enter the OTP");

  //   try {
  //     const res = await axios.post(
  //       `${USER_API_END_POINT}/verify-otp`,
  //       { sessionId, otp },
  //       { withCredentials: true }
  //     );

  //     if (res.data.token) {
  //       dispatch(setAuthUser(res.data.user));
  //       toast.success("Account created successfully");
  //       navigate("/");
  //     }
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message || "Failed to verify OTP");
  //   }
  // };
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) return toast.error("Please enter the OTP");

    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/verify-otp`,
        { sessionId, otp },
        { withCredentials: true }
      );

      if (res.data.token) {
        dispatch(setAuthUser(res.data.user));
        toast.success("Account created successfully");

        if (res.data.user.role === "vendor") {
          navigate("/vendor/home");
        } else {
          navigate("/user/home");
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to verify OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-red-500">
          StreetBites Sign Up
        </h2>

        <form
          onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            disabled={isOtpSent}
            required
          />

          <input
            type="email"
            placeholder="Enter Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            disabled={isOtpSent}
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            disabled={isOtpSent}
            required
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="user">User</option>
            <option value="vendor">Vendor</option>
          </select>

          <div className="flex">
            <div className="my-auto border p-3 rounded-xl border-gray-300">
              +91
            </div>
            <input
              type="text"
              placeholder="Enter Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-gray-300 rounded-xl flex-1 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              disabled={isOtpSent}
              required
            />
          </div>

          {isOtpSent && (
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          )}

          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
          >
            {isOtpSent ? "Verify OTP" : "Send OTP"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-500">
          Already have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
