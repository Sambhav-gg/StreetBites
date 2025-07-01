import mongoose from 'mongoose';

const stallSchema = new mongoose.Schema({
  stallName: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true },
  address: { type: String, required: true },
  
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },

  openingTime: { type: String, required: true },
  closingTime: { type: String, required: true },
  description: { type: String },
  phoneNumber: { type: String },

  category: {
  type: String,
  enum: [
    'snacks',
    'juice',
    'chaat',
    'south indian',
    'others',
    'North Indian',
    'Chinese',
    'Street Food',
    'Fast Food',
    'Snacks & Chaat',
    'Beverages',
    'Tea & Coffee',
    'Juices & Shakes',
    'Bakery',
    'Sweets & Desserts',
    'Fusion Food',
    'Tandoori Items',
    'Breakfast Special',
    'Healthy / Diet Food',
    'Thali',
    'Rolls & Wraps',
    'Rice & Biryani',
    'Paratha / Roti Items'
  ],
  required: true
}
,

  city: { type: String, required: true },

  impressions: {
    type: [Date],
    default: []
  },

  // ✅ Clean image fields
  mainImage: { type: String },               // Main image (mandatory on create)
  otherImages: [{ type: String }],           // Optional images

  menu: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true }
    }
  ],

  averageRating: {
    type: Number,
    default: null
  },

  numReviews: {
    type: Number,
    default: 0
  },

  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
}, {
  timestamps: true
});

// 🧭 Index for geo queries
stallSchema.index({ coordinates: '2dsphere' });

// 🔧 To include virtuals (if needed in future)
stallSchema.set('toJSON', { virtuals: true });
stallSchema.set('toObject', { virtuals: true });

const Stall = mongoose.model('Stall', stallSchema);

export default Stall;
