import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import personRoutes from "./routes/person.route.js";
import stallRoutes from "./routes/stall.routes.js";
import reviewRoutes from "./routes/review.route.js";
import uploadRoutes from "./routes/upload.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/person", personRoutes);
app.use("/api/stalls", stallRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/upload", uploadRoutes); // ✅ Now this is correct

// Root
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
  connectDB();
});
