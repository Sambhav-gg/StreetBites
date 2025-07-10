
// export default router;
import express from "express";
import multer from "multer";
import {
  createStall,
  getStallById,
  updateMenu,
  getAllStalls,
  getMyStall,
  searchStallsByDish,
  getTopRatedStalls,
  getVendorStalls,updateStall,deleteStall,getVendorAnalytics,addImpression,
  getNearbyStallsByLocation,
  getNearbyStallsByCity
} from "../controllers/stall.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { onlyVendor } from "../middlewares/role.middleware.js";

const router = express.Router();

// Multer setup for memory storage (for uploading to S3)
const storage = multer.memoryStorage();
const upload = multer({ storage });

const multipleUpload = upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'otherImages', maxCount: 5 },
]);

// ✅ IMPORTANT: Place /create BEFORE any dynamic route like /:id
router.post("/create", protect, onlyVendor, multipleUpload, createStall);
router.delete('/delete/:id', protect, deleteStall);
// Public and Vendor routes
router.get('/:id', getStallById);
router.get("/all", getAllStalls); 
router.get("/my", protect, onlyVendor, getMyStall); 
router.put("/menu/:id", protect, onlyVendor, updateMenu); 
router.get("/search", searchStallsByDish); 
router.get("/top-rated", getTopRatedStalls);
router.get('/nearby', getNearbyStallsByLocation); // /api/stalls/nearby?lat=..&lng=..
router.get('/by-city', getNearbyStallsByCity);
router.get('/vendor', protect,onlyVendor, getVendorStalls);
router.put("/update/:id", protect, onlyVendor, multipleUpload, updateStall);
router.put("/menu/:id", protect, onlyVendor, updateMenu);
router.get('/vendor/analytics', protect, onlyVendor, getVendorAnalytics);

router.put('/impression/:id', addImpression);
// Example in Express.js
router.get('/vendor/analytics/impressions', async (req, res) => {
  const impressions = await Stall.getWeeklyImpressions(); // your logic
  res.json({ weeklyStats: impressions });
});




// ✅ Dynamic route should always come LAST
router.get("/:id", getStallById);

export default router;
