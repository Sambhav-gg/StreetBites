import Person from "../models/person.model.js";
import { generateToken } from "../lib/utils.js";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const otpSessions = {};

// 1. Send OTP
export const sendOtp = async (req, res) => {
    const { phone, type, name, email, role } = req.body;

    try {
        const response = await axios.get(`https://2factor.in/API/V1/${process.env.OTP_API_KEY}/SMS/${phone}/AUTOGEN`);

        if (response.data.Status === 'Success') {
            const sessionId = response.data.Details;

            // Store full signup/login session details
            otpSessions[sessionId] = { phone, type, name, email, role };

            res.status(200).json({
                message: 'OTP Sent Successfully',
                sessionId
            });
        } else {
            res.status(500).json({ message: 'Failed to Send OTP' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error Sending OTP' });
    }
};

// 2. Verify OTP
export const verifyOtp = async (req, res) => {
    const { sessionId, otp } = req.body;
    console.log("Verifying OTP for:", sessionId, otp);


    try {
        const response = await axios.get(`https://2factor.in/API/V1/${process.env.OTP_API_KEY}/SMS/VERIFY/${sessionId}/${otp}`);
        console.log("2Factor Verify Response:", response.data);

        if (response.data.Status === 'Success') {
            const session = otpSessions[sessionId];

            if (!session) {
                return res.status(400).json({ message: 'Session expired or invalid' });
            }

            const { phone, type, name, email, role } = session;

            let user = await Person.findOne({ phoneNumber: phone });

            if (type === 'signup') {
                if (user) {
                    return res.status(400).json({ message: 'User already exists, please login.' });
                }

                if (!name || !role) {
                    return res.status(400).json({ message: 'Name and Role are required for signup.' });
                }

                user = await Person.create({
                    name,
                    phoneNumber: phone,
                    email: email || '',
                    role,
                });
            }

            if (type === 'login') {
                if (!user) {
                    return res.status(400).json({ message: 'User not found, please sign up first.' });
                }
            }

            // Generate JWT and set cookie
            const token = generateToken(user._id, res);

            // Clean up session
            delete otpSessions[sessionId];

            res.status(200).json({
                message: 'OTP Verified Successfully',
                token,
                user: {
                  _id: user._id,
                  name: user.name || 'Vendor',
                  email: user.email || '',
                  phoneNumber: user.phoneNumber,
                  role: user.role,
                  profilePhoto: user.profilePhoto || '',
                  likedStalls: user.likedStalls
                },
              });
              

        } else {
            res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('Verify OTP Error:', error.message);
        res.status(500).json({ message: 'Error Verifying OTP' });
    }
};

// 3. Logout
export const logout = (req, res) => {
    res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
    });

    res.status(200).json({ message: "Logged out successfully" });
};
