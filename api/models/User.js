import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Made optional for Google users
    role: { type: String, enum: ['freelancer', 'client'], required: true },
    bio: { type: String, default: '' },

    // New fields for freelancer profile
    profilePic: { type: String }, // URL or file path to profile image
    skills: [{ type: String }], // Array of skills
    location: { type: String }, // Location string
    portfolioLinks: [{ type: String }], // Links to portfolio work
    availability: {
      type: String,
      enum: ['available', 'busy', 'offline'],
      default: 'available',
    },

    // Fields for Google OAuth
    googleId: { type: String, default: null },
    provider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
  },
  { timestamps: true }
);

// Hash password before saving (only if local and password exists)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.provider === 'google') return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user password (only for local accounts)
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (this.provider === 'google') return false; // No password to compare
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
