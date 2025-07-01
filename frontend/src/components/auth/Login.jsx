import React, {  useEffect, useState } from 'react';
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
      
          if (res.data.token) {
            dispatch(setAuthUser(res.data.user));
            toast.success("Logged in successfully");
      
            if (res.data.user.role === "vendor") {
              navigate("/vendor/home");
            } else {
              navigate("/user/home");
            }
          }
        } catch (err) {
          toast.error(err.response?.data?.message || "Error verifying OTP");
        }
      };
      
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-red-500">StreetBites Login</h2>

                <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp} className="flex flex-col gap-6 w-full">
                    <div className='flex'>
                        <div className="my-auto border p-[6px] rounded-xl border-gray-300">+91</div>
                        <input
                            type="text"
                            placeholder="Enter phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="border border-gray-300 rounded-xl px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-red-400 text-lg"
                            required
                            disabled={isOtpSent}
                        />
                    </div>

                    {isOtpSent && (
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 text-lg"
                            required
                        />
                    )}

                    <button className="w-full bg-red-500 hover:bg-red-600 text-white text-lg py-2 rounded-xl transition-all">
                        {isOtpSent ? 'Verify OTP' : 'Send OTP'}
                    </button>
                </form>

                <p className="mt-4 text-center text-gray-500">
                    Don’t have an account?{' '}
                    <span
                        className="text-blue-500 cursor-pointer hover:underline"
                        onClick={() => navigate('/signup')}
                    >
                        Sign Up
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
