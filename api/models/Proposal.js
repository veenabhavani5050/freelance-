// api/models/Proposal.js (No changes needed, included for completeness)

import mongoose from 'mongoose';

const ProposalSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  coverLetter: {
    type: String,
    required: [true, 'Please provide a cover letter'],
    trim: true,
  },
  bidAmount: {
    type: Number,
    required: [true, 'Please provide a bid amount'],
  },
  estimatedCompletionTime: {
    type: String,
    required: [true, 'Please provide an estimated completion time'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

export default mongoose.model('Proposal', ProposalSchema);