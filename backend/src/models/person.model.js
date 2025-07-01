import mongoose from 'mongoose';

const personSchema = new mongoose.Schema({
  name: { type: String },
  phoneNumber: { type: String, required: true, unique: true },
  email: { type: String },
  profilePhoto: { type: String },
  likedStalls: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stall",
  },
],

  role: { type: String, enum: ['user', 'vendor'], required: true },
}, { timestamps: true });  // Optional: adds createdAt and updatedAt

const Person = mongoose.model('Person', personSchema);

export default Person;
