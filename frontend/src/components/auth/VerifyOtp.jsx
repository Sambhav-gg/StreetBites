// src/pages/VerifyOtp.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { USER_API_END_POINT } from '../utils/constants';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId } = location.state || {};

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/verify-otp`,
        { sessionId, otp },
        { withCredentials: true }
      );
      alert(res.data.message);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Error verifying OTP');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-semibold mb-6">Verify OTP</h1>
      <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
        <InputOTP maxLength={6} value={otp} onChange={(v) => setOtp(v)}>
          <InputOTPGroup>
            {Array.from({ length: 6 }).map((_, i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <Button type="submit" className="bg-green-500 text-white">
          Verify OTP
        </Button>
      </form>
    </div>
  );
};

export default VerifyOtp;
