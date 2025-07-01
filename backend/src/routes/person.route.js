import express from "express";
import { getProfile, updateProfile  ,likeStall,
    unlikeStall,
    getLikedStalls,} from "../controllers/person.controller.js";
import { protect } from "../middlewares/auth.middleware.js"; // JWT middleware
import upload from "../middlewares/multer.js";
const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/update-profile", protect, upload.single("profilePhoto"), updateProfile);

router.post("/like/:stallId", protect, likeStall);
router.delete("/unlike/:stallId", protect, unlikeStall);
router.get("/liked-stalls", protect, getLikedStalls);
export default router;
