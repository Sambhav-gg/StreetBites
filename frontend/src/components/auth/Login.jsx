import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { setAuthUser } from '../redux/authSlice';
import { USER_API_END_POINT } from '../utils/constants';
import { useSelector } from 'react-redux';

const Login = () => {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    // Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();

        if (!phone) return toast.error('Phone number is required');

        try {
            const res = await axios.post(`${USER_API_END_POINT}/send-otp`, { phone, type: 'login' }, { withCredentials: true });

            if (res.data.sessionId) {
                setSessionId(res.data.sessionId);
                setIsOtpSent(true);
                toast.success('OTP sent successfully');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error sending OTP');
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
      
        if (!otp) return toast.error("Please enter the OTP");
      
        try {
          const res = await axios.post(
            `${USER_API_END_POINT}/verify-otp`,
            { sessionId, otp },
            { withCredentials: true }
          );
      
         if (res.data?.user?.role) {
  dispatch(setAuthUser(res.data.user));
  toast.success("Logged in successfully");

  const { role } = res.data.user;
  navigate(role === "vendor" ? "/vendor/home" : "/user/home");
}

          }
        } catch (err) {
          toast.error(err.response?.data?.message || "Error verifying OTP");
        }
    };
      
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-50 to-amber-100 relative overflow-hidden flex items-center justify-center p-4">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                {/* Floating Food Emojis */}
                <div className="absolute top-20 left-20 text-6xl opacity-10 animate-bounce">🍛</div>
                <div className="absolute top-32 right-32 text-5xl opacity-15 animate-bounce delay-200">🌮</div>
                <div className="absolute bottom-40 left-40 text-7xl opacity-8 animate-bounce delay-700">🥘</div>
                <div className="absolute bottom-32 right-20 text-4xl opacity-12 animate-bounce delay-1000">🍜</div>
                
                {/* Gradient Blobs */}
                <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-gradient-to-br from-orange-300/20 to-yellow-300/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-amber-300/15 to-orange-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md">
                <div className="bg-gradient-to-br from-white/80 to-orange-50/60 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border-2 border-white/50">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4 animate-bounce">🍛</div>
                        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 mb-2">
                            Welcome Back!
                        </h2>
                        <p className="text-gray-600 font-semibold text-lg">
                            Login to <span className="text-orange-600 font-bold">StreetBites</span>
                        </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center mb-8">
                        <div className={`w-3 h-3 rounded-full ${!isOtpSent ? 'bg-orange-500' : 'bg-green-500'} transition-colors`}></div>
                        <div className={`w-16 h-1 ${isOtpSent ? 'bg-green-500' : 'bg-gray-300'} transition-colors`}></div>
                        <div className={`w-3 h-3 rounded-full ${isOtpSent ? 'bg-orange-500' : 'bg-gray-300'} transition-colors`}></div>
                    </div>

                    <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp} className="space-y-6">
                        {/* Phone Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 block">📱 Phone Number</label>
                            <div className='flex gap-2'>
                                <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold px-4 py-3 rounded-xl border-2 border-orange-400 flex items-center">
                                    +91
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter your phone number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="flex-1 border-2 border-orange-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-500 text-lg font-medium bg-white/70 backdrop-blur-sm transition-all"
                                    required
                                    disabled={isOtpSent}
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
                                    className="w-full border-2 border-orange-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-500 text-lg font-medium bg-white/70 backdrop-blur-sm transition-all text-center tracking-widest"
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
                                        🔓 Verify OTP
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
                                Don't have an account?{' '}
                                <span
                                    className="text-orange-600 font-bold cursor-pointer hover:text-orange-800 transition-colors hover:underline"
                                    onClick={() => navigate('/signup')}
                                >
                                    Join StreetBites FREE! 🚀
                                </span>
                            </p>
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

export default Login;
