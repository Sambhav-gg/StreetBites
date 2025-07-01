// src/middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import Person from "../models/person.model.js";

export const protect = async (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Person.findById(decoded.userId).select("-__v");
    next();
  } catch (err) {
    console.error("JWT error:", err);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
