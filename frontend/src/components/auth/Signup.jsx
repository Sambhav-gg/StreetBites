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
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-50 to-amber-100 relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Floating Food Emojis */}
        <div className="absolute top-16 left-16 text-7xl opacity-8 animate-bounce">🏪</div>
        <div className="absolute top-40 right-20 text-6xl opacity-12 animate-bounce delay-300">🍛</div>
        <div className="absolute bottom-32 left-32 text-8xl opacity-6 animate-bounce delay-600">🌮</div>
        <div className="absolute bottom-20 right-40 text-5xl opacity-15 animate-bounce delay-900">🥘</div>
        <div className="absolute top-1/2 left-10 text-4xl opacity-20 animate-bounce delay-1200">🍜</div>
        
        {/* Gradient Blobs */}
        <div className="absolute top-1/3 right-1/5 w-80 h-80 bg-gradient-to-br from-yellow-300/20 to-amber-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/5 w-96 h-96 bg-gradient-to-br from-orange-300/15 to-red-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* SignUp Card */}
      <div className="relative z-10 w-full max-w-lg">
        <div className="bg-gradient-to-br from-white/85 to-yellow-50/60 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border-2 border-white/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-bounce">🚀</div>
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 mb-2">
              Join StreetBites!
            </h2>
            <p className="text-gray-600 font-semibold text-lg">
              Create your <span className="text-orange-600 font-bold">FREE</span> account
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className={`w-3 h-3 rounded-full ${!isOtpSent ? 'bg-orange-500' : 'bg-green-500'} transition-colors`}></div>
            <div className={`w-16 h-1 ${isOtpSent ? 'bg-green-500' : 'bg-gray-300'} transition-colors`}></div>
            <div className={`w-3 h-3 rounded-full ${isOtpSent ? 'bg-orange-500' : 'bg-gray-300'} transition-colors`}></div>
          </div>

          <form
            onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp}
            className="space-y-5"
          >
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block">👤 Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-2 border-orange-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-500 font-medium bg-white/70 backdrop-blur-sm transition-all"
                disabled={isOtpSent}
                required
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block">
                📧 Email <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-orange-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-500 font-medium bg-white/70 backdrop-blur-sm transition-all"
                disabled={isOtpSent}
              />
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block">🎯 I am a...</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border-2 border-orange-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-500 font-medium bg-white/70 backdrop-blur-sm transition-all"
                disabled={isOtpSent}
                required
              >
                <option value="" disabled>
                  Choose your role
                </option>
                <option value="user">🍽️ Food Lover (Customer)</option>
                <option value="vendor">🏪 Vendor (Sell Food)</option>
              </select>
            </div>

            {/* Phone Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block">📱 Phone Number</label>
              <div className="flex gap-2">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold px-4 py-3 rounded-xl border-2 border-orange-400 flex items-center">
                  +91
                </div>
                <input
                  type="text"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 border-2 border-orange-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-500 font-medium bg-white/70 backdrop-blur-sm transition-all"
                  disabled={isOtpSent}
                  required
                />
              </div>
            </div>

            {/* OTP Input */}
            {isOtpSent && (
              <div className="space-y-2 animate-fadeIn">
                <label className="text-sm font-bold text-gray-700 block">🔐 Enter OTP</label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border-2 border-orange-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-500 font-medium bg-white/70 backdrop-blur-sm transition-all text-center tracking-widest text-lg"
                  required
                  maxLength="6"
                />
                <p className="text-sm text-gray-600 text-center">
                  📱 OTP sent to +91{phone}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xl font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 border-2 border-orange-400"
            >
              <span className="flex items-center justify-center gap-3">
                {isOtpSent ? (
                  <>
                    🎉 Create Account
                    <span className="animate-pulse">→</span>
                  </>
                ) : (
                  <>
                    📲 Send OTP
                    <span className="animate-pulse">→</span>
                  </>
                )}
              </span>
            </button>

            {/* Resend OTP */}
            {isOtpSent && (
              <button
                type="button"
                onClick={() => {
                  setIsOtpSent(false);
                  setOtp('');
                  setSessionId('');
                }}
                className="w-full text-orange-600 font-semibold py-2 hover:text-orange-800 transition-colors"
              >
                🔄 Resend OTP
              </button>
            )}
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-xl border border-orange-200">
              <p className="text-gray-600 font-medium">
                Already have an account?{" "}
                <span
                  className="text-orange-600 font-bold cursor-pointer hover:text-orange-800 transition-colors hover:underline"
                  onClick={() => navigate("/login")}
                >
                  Login here! 🔑
                </span>
              </p>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mt-6 space-y-3">
            <h4 className="font-bold text-gray-700 text-center">✨ Why Join StreetBites?</h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              {role === "vendor" ? (
                <>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-green-500">✅</span>
                    <span>List your stall 100% FREE forever</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-green-500">✅</span>
                    <span>Reach thousands of hungry customers</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-green-500">✅</span>
                    <span>No commissions or hidden fees</span>
                  </div>
                </>
              ) : role === "user" ? (
                <>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-green-500">✅</span>
                    <span>Discover amazing local street food</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-green-500">✅</span>
                    <span>Support local vendors in your area</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-green-500">✅</span>
                    <span>Find authentic flavors near you</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-green-500">✅</span>
                    <span>100% free to use forever</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-green-500">✅</span>
                    <span>Connect with local food community</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-green-500">✅</span>
                    <span>Secure and trusted platform</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-6 flex justify-center items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              🛡️ Secure
            </span>
            <span className="flex items-center gap-1">
              ⚡ Fast
            </span>
            <span className="flex items-center gap-1">
              🎯 Free
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;