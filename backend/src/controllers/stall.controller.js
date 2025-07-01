import Stall from '../models/stall.model.js';
import Person from '../models/person.model.js';
import s3 from '../lib/aws.js';
import { v4 as uuidv4 } from 'uuid';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// @desc    Create or Update a Stall (Only for Vendor)
// @route   POST /api/stalls/create
// @access  Private (Vendor only)
const uploadToS3 = async (fileBuffer, fileName, mimetype, folder = 'stall-images') => {
  const fileKey = `${folder}/${uuidv4()}-${fileName}`;
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileKey,
    Body: fileBuffer,
    ContentType: mimetype,
    // ACL: 'public-read',  // ✅ ADD THIS LINE
  };

  const uploadResult = await s3.upload(params).promise();
  return uploadResult.Location;
};



export const createStall = async (req, res) => {
  const {
    stallName,
    address,
    openingTime,
    closingTime,
    description,
    phoneNumber,
    category,
    city,
  } = req.body;

  const { lat, lng } = req.body;
  const userId = req.user.id;

  try {
    const person = await Person.findById(userId);
    if (!person || person.role !== 'vendor') {
      return res.status(403).json({ message: 'Only vendors can create stalls' });
    }

    // Check if this vendor already has a stall with the same name
    const existingStall = await Stall.findOne({ stallName, owner: userId });
    if (existingStall) {
      return res.status(400).json({ message: 'You already have a stall with this name' });
    }

    // Validate main image
    if (!req.files || !req.files.mainImage) {
      return res.status(400).json({ message: 'Main image is required' });
    }

    // Upload main image to S3
    const mainImageFile = req.files.mainImage[0];
    

    const mainImageUrl = await uploadToS3(
      mainImageFile.buffer,
      mainImageFile.originalname,
      mainImageFile.mimetype
    );
    
    // 2. Handle other images (optional)
    

    // Upload other images (if any)
    let otherImageUrls = [];
    if (req.files.otherImages) {
      const uploads = req.files.otherImages.map(file =>
        uploadToS3(file.buffer, file.originalname, file.mimetype)
      );
      otherImageUrls = await Promise.all(uploads);
    }

    // Create new stall
    const newStall = new Stall({
      stallName,
      address,
      coordinates: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },
      openingTime,
      closingTime,
      description,
      phoneNumber,
      category,
      city,
      mainImage: mainImageUrl,
      otherImages: otherImageUrls,
      owner: userId,
    });

    await newStall.save();
    console.log(newStall.mainImage)
    res.status(201).json({ message: 'Stall created successfully', stall: newStall });
  } catch (err) {
    console.error('[createStall]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// @desc    Get Stall by ID
// @route   GET /api/stalls/:id
// @access  Public
export const getStallById = async (req, res) => {
  try {
    const stall = await Stall.findById(req.params.id).populate('reviews');
    if (!stall) {
      return res.status(404).json({ message: 'Stall not found' });
    }

    res.status(200).json(stall);
  } catch (err) {
    console.error('[getStallById]', err);
    res.status(500).json({ message: 'Error fetching stall details' });
  }
};

// @desc    Update Menu for Stall
// @route   PUT /api/stalls/menu/:id
// @access  Private (Vendor only)
export const updateMenu = async (req, res) => {
  const { menuItems } = req.body;
  const userId = req.user.id;

  try {
    const stall = await Stall.findOne({ owner: userId });
    if (!stall) {
      return res.status(404).json({ message: 'Stall not found' });
    }

    if (!Array.isArray(menuItems) || !menuItems.every(item => item.name && item.price)) {
      return res.status(400).json({ message: "Invalid menu format" });
    }
    
    stall.menu = menuItems.map(item => ({
      name: item.name,
      price: item.price
    }));
    
    await stall.save();

    res.status(200).json({ message: 'Menu updated successfully', menu: stall.menu });
  } catch (err) {
    console.error('[updateMenu]', err);
    res.status(500).json({ message: 'Failed to update menu' });
  }
};

// @desc    Get all stalls
// @route   GET /api/stalls/all
// @access  Public
export const getAllStalls = async (req, res) => {
  try {
    const stalls = await Stall.find().populate('owner', 'name email').populate('reviews');

    res.status(200).json(stalls);
  } catch (err) {
    console.error('[getAllStalls]', err);
    res.status(500).json({ message: 'Error fetching stalls' });
  }
};

// @desc    Get current vendor's stall
// @route   GET /api/stalls/my
// @access  Private (Vendor only)
export const getMyStall = async (req, res) => {
  const userId = req.user.id;

  try {
    const stall = await Stall.findOne({ owner: userId }).populate('reviews');
    if (!stall) {
      return res.status(404).json({ message: 'You do not have a stall yet' });
    }

    res.status(200).json(stall);
  } catch (err) {
    console.error('[getMyStall]', err);
    res.status(500).json({ message: 'Error fetching your stall' });
  }
};

// @desc    Search stalls by dish name
// @route   GET /api/stalls/search?dish=someDish
// @access  Public
export const searchStallsByDish = async (req, res) => {
  const { dish, city } = req.query; // dish is the single search input now

  try {
    const searchConditions = [];

    // ✅ Search in stall name OR dish name
    if (dish && typeof dish === 'string' && dish.trim() !== '') {
      searchConditions.push({
        stallName: { $regex: dish.trim(), $options: 'i' }
      });

      searchConditions.push({
        menu: {
          $elemMatch: {
            name: { $regex: dish.trim(), $options: 'i' }
          }
        }
      });
    }

    const finalQuery = {};

    if (searchConditions.length > 0) {
      finalQuery.$or = searchConditions;
    }

    // ✅ Optional city filter
    if (city && typeof city === 'string' && city.trim() !== '') {
      finalQuery.city = city.trim();
    }

    const stalls = await Stall.find(finalQuery);
    res.status(200).json(stalls);
  } catch (err) {
    console.error('[searchStallsByDish]', err);
    res.status(500).json({ message: 'Search failed' });
  }
};



// export const getTopRatedStalls = async (req, res) => {
//   try {
//     const stalls = await Stall.find().populate('reviews');

//     const stallsWithAvg = stalls.map((stall) => {
//       const reviewCount = stall.reviews.length;

//       const avgRating =
//         reviewCount > 0
//           ? stall.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
//           : null;

//       return {
//         ...stall.toObject(),
//         averageRating: avgRating,
//       };
//     });

//     // Sort: first by averageRating (descending), then move unrated to bottom
//     const sortedStalls = stallsWithAvg.sort((a, b) => {
//       if (b.averageRating === null) return -1;
//       if (a.averageRating === null) return 1;
//       return b.averageRating - a.averageRating;
//     });

//     res.status(200).json(sortedStalls);
//   } catch (err) {
//     console.error('[getTopRatedStalls]', err);
//     res.status(500).json({ message: 'Failed to fetch top-rated stalls' });
//   }
// };
export const getTopRatedStalls = async (req, res) => {
  try {
    const stalls = await Stall.find()
      .sort({ averageRating: -1 })
      .populate('reviews');

    res.status(200).json(stalls);
  } catch (err) {
    console.error('[getTopRatedStalls]', err);
    res.status(500).json({ message: 'Failed to fetch top-rated stalls' });
  }
};


// GET /api/stalls/nearby?lat=26.91&lng=75.78
export const getNearbyStallsByLocation = async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: 'Latitude and longitude required' });
  }

  try {
    const stalls = await Stall.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          distanceField: "distance",
          spherical: true,
          distanceMultiplier: 0.001,
          maxDistance: 5000, // within 5 km
        },
      },
    ]);

    res.status(200).json(stalls);
  } catch (err) {
    console.error('[getNearbyStallsByLocation]', err);
    res.status(500).json({ message: 'Failed to fetch nearby stalls' });
  }
};

// /api/stalls/by-city?city=Agra
export const getNearbyStallsByCity = async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ message: 'City is required' });
  }

  try {
    const stalls = await Stall.find({ city: { $regex: new RegExp(city, "i") } }); // case-insensitive
    res.status(200).json(stalls);
  } catch (err) {
    console.error('[getNearbyStallsByCity]', err);
    res.status(500).json({ message: 'Failed to fetch stalls by city' });
  }
};
//@desc    Get all stalls of the logged-in vendor
// @route   GET /api/stalls/vendor
// @access  Private (Vendor only)
export const getVendorStalls = async (req, res) => {
  try {
    const stalls = await Stall.find({ owner: req.user.id }).populate('reviews');
    res.status(200).json(stalls);
  } catch (err) {
    console.error('[getVendorStalls]', err);
    res.status(500).json({ message: 'Failed to fetch vendor stalls' });
  }
};
export const updateStall = async (req, res) => {
  const stallId = req.params.id;
  const {
    stallName,
    address,
    openingTime,
    closingTime,
    description,
    phoneNumber,
    category,
    lat,
    lng,
  } = req.body;

  try {
    const stall = await Stall.findById(stallId);
    if (!stall) return res.status(404).json({ message: "Stall not found" });

    stall.stallName = stallName;
    stall.address = address;
    stall.openingTime = openingTime;
    stall.closingTime = closingTime;
    stall.description = description;
    stall.phoneNumber = phoneNumber;
    stall.category = category;
    
    stall.coordinates = {
      type: "Point",
      coordinates: [parseFloat(lng), parseFloat(lat)],
    };

    // Update images if new files uploaded
    if (req.files?.mainImage?.[0]) {
      const mainImageFile = req.files.mainImage[0];
      const mainImageUrl = await uploadToS3(
        mainImageFile.buffer,
        mainImageFile.originalname,
        mainImageFile.mimetype
      );
      stall.mainImage = mainImageUrl;
    }

    if (req.files?.otherImages?.length) {
      const uploads = req.files.otherImages.map(file =>
        uploadToS3(file.buffer, file.originalname, file.mimetype)
      );
      stall.otherImages = await Promise.all(uploads);
    }

    await stall.save();
    res.status(200).json({ message: "Stall updated successfully", stall });
  } catch (err) {
    console.error("[updateStall]", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
// @desc    Delete a stall
// @route   DELETE /api/stalls/delete/:id
// @access  Private (Vendor only)
export const deleteStall = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const stall = await Stall.findById(id);

    if (!stall) {
      return res.status(404).json({ message: 'Stall not found' });
    }

    // Check if current user is the owner
    if (stall.owner.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this stall' });
    }

    await stall.deleteOne();

    res.status(200).json({ message: 'Stall deleted successfully' });
  } catch (err) {
    console.error('[deleteStall]', err);
    res.status(500).json({ message: 'Failed to delete stall' });
  }
};

const generateInsightsPrompt = (stallReports, summary) => {
  let reportText = `Namaste! Here is your stall performance report in simple words:\n\n`;

  reportText += `📊 Overall Details:\n`;
  reportText += `- Total Stalls: ${summary.totalStalls}\n`;
  reportText += `- Total Impressions (people who saw your stall): ${summary.totalImpressions}\n`;
  reportText += `- Total Reviews (people who shared their opinion): ${summary.totalReviews}\n`;
  reportText += `- Average Rating: ${summary.averageRating}\n\n`;

  reportText += `🛒 Stall-wise Details:\n`;
  stallReports.forEach(stall => {
    reportText += `- Stall Name: ${stall.name}\n`;
    reportText += `  👀 Seen by: ${stall.impressions} people\n`;
    reportText += `  ✍️ Reviews: ${stall.reviews}\n`;
    reportText += `  ⭐ Average Rating: ${stall.avgRating}\n`;
    reportText += `  🍽️ Category: ${stall.category}\n\n`;
  });

  reportText += `🙏 Please give simple, easy-to-understand tips (in bullet points) to help each stall owner get more customers and improve. 
  The tips should use common words, like you are explaining to a local street vendor who does not know much about online business. Mention each stall name while giving suggestions.
  
  The suggestions should be practical, like:
  - How to bring more people to see their stall
  - How to ask customers to give reviews
  - How to make their stall look better
  - Simple things they can do today to improve

  Please keep the suggestions friendly, short, and in simple Hindi-English mixed style if possible.
  Also please look that it all goes around the website i mean give some tips regarding what to improve on website such as images and stuff
  so that user must click on the stall card
  `;

  return reportText;
};


export const getVendorAnalytics = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const stalls = await Stall.find({ owner: vendorId }).populate('reviews');

    if (!stalls.length) return res.status(200).json({ stalls: [], summary: {}, insights: [] });

    let totalImpressions = 0;
    let totalReviews = 0;
    let totalRatingSum = 0;
    let totalRatedStalls = 0;

    const stallReports = stalls.map(stall => {
      const impressions = stall.impressions?.length || 0;
      const reviews = stall.reviews || [];
      const avgRating = reviews.length
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : null;

      totalImpressions += impressions;
      totalReviews += reviews.length;

      if (avgRating !== null) {
        totalRatedStalls++;
        totalRatingSum += avgRating;
      }

      return {
        id: stall._id,
        name: stall.stallName,
        impressions,
        reviews: reviews.length,
        avgRating: avgRating ? parseFloat(avgRating.toFixed(2)) : null,
        city: stall.city,
        category: stall.category,
        createdAt: stall.createdAt
      };
    });

    const summary = {
      totalStalls: stalls.length,
      totalImpressions,
      totalReviews,
      averageRating:
        totalRatedStalls > 0
          ? parseFloat((totalRatingSum / totalRatedStalls).toFixed(2))
          : null,
    };

    // ========================
    // 🔗 Call Gemini API
    // ========================
    const prompt = generateInsightsPrompt(stallReports, summary);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const insightsText = result.response.text();

    res.status(200).json({ summary, stalls: stallReports, insights: insightsText });

  } catch (error) {
    console.error('[getVendorAnalytics]', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
};



// @desc Add an impression to a stall
// @route PUT /api/stalls/impression/:id
// @access Public
export const addImpression = async (req, res) => {
  try {
    const stall = await Stall.findById(req.params.id);
    if (!stall) return res.status(404).json({ message: 'Stall not found' });

    stall.impressions.push(new Date());
    await stall.save();

    res.status(200).json({ message: 'Impression added' });
  } catch (err) {
    console.error('[addImpression]', err);
    res.status(500).json({ message: 'Failed to add impression' });
  }
};
