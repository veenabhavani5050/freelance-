// models/Contract.js
import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  amount: { type: Number, required: true },
  dueDate: { type: Date },
  isCompleted: { type: Boolean, default: false },
  isPaid: { type: Boolean, default: false },
  paymentDate: { type: Date },
  escrowed: { type: Boolean, default: false },
  paymentRef: { type: String, default: null } // store payment provider reference
}, { _id: false });

const contractSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', default: null },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', default: null },
  title: { type: String, required: true },
  description: { type: String },
  milestones: { type: [milestoneSchema], default: [] },
  totalAmount: { type: Number, default: 0 },
  deadline: { type: Date },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  cancelReason: { type: String },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Recalculate total amount before saving (defensive)
contractSchema.pre('save', function (next) {
  try {
    this.totalAmount = this.milestones.reduce((sum, m) => sum + Number(m.amount || 0), 0);
    this.updatedAt = Date.now();
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model('Contract', contractSchema);
