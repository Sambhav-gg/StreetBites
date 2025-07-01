// src/controllers/person.controller.js
import s3 from '../lib/aws.js'; // ✅ default import matches default export

import Person from "../models/person.model.js";
import { v4 as uuidv4 } from "uuid";

// Middleware to get profile (uses req.user from JWT)
export const getProfile = async (req, res) => {
  try {
    const person = await Person.findById(req.user._id).select("-__v");

    if (!person) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: person });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update profile (name, maybe role later)
// PATCH or PUT /profile/update
export const updateProfile = async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      email: req.body.email,
    };

    if (req.file) {
      const fileName = `profilePhotos/${uuidv4()}-${req.file.originalname}`;
      const uploadParams = {
        Bucket: process.env.S3_BUCKET,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        // Don't add ACL if it's blocked in your bucket policy
      };

      const uploadResult = await s3.upload(uploadParams).promise();
      updates.profilePhoto = uploadResult.Location;
    }

    const user = await Person.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-__v");

    res.status(200).json({ message: "Profile updated", user });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Update failed" });
  }
};

// Like a stall
export const likeStall = async (req, res) => {
    const userId = req.user.id;
    const { stallId } = req.params;
  
    try {
      const person = await Person.findById(userId);
      if (!person) return res.status(404).json({ message: "User not found" });
  
      if (!person.likedStalls.includes(stallId)) {
        person.likedStalls.push(stallId);
        await person.save();
      }
  
      res.status(200).json({ message: "Stall liked" });
    } catch (err) {
      console.error("[likeStall]", err);
      res.status(500).json({ message: "Failed to like stall" });
    }
  };
  
  // Unlike a stall
  export const unlikeStall = async (req, res) => {
    const userId = req.user.id;
    const { stallId } = req.params;
  
    try {
      const person = await Person.findById(userId);
      if (!person) return res.status(404).json({ message: "User not found" });
  
      person.likedStalls = person.likedStalls.filter(
        (id) => id.toString() !== stallId
      );
      await person.save();
  
      res.status(200).json({ message: "Stall unliked" });
    } catch (err) {
      console.error("[unlikeStall]", err);
      res.status(500).json({ message: "Failed to unlike stall" });
    }
  };
  
  // Get all liked stalls
  export const getLikedStalls = async (req, res) => {
    const userId = req.user.id;
  
    try {
      const person = await Person.findById(userId).populate("likedStalls");
      res.status(200).json(person.likedStalls || []);
    } catch (err) {
      console.error("[getLikedStalls]", err);
      res.status(500).json({ message: "Failed to fetch liked stalls" });
    }
  };
  