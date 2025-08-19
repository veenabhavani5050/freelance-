import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider === 'local';
      },
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: ['freelancer', 'client', 'admin'],
      default: 'freelancer',
    },
    bio: String,
    profilePic: String,
    skills: [String],
    location: String,
    portfolioLinks: [String],
    availability: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'available', 'unavailable', 'busy'],
      default: 'available',
    },
    googleId: String,
    provider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    passwordChangedAt: Date,
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Hash password if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

// Check if password was changed after JWT was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);
export default User;
