import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'in-progress', 'completed', 'cancelled'], default: 'pending' },
    paymentRequested: { type: Boolean, default: false }
}, { timestamps: true });

const proposalSchema = new mongoose.Schema(
    {
        freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        coverLetter: { type: String, required: true },
        bidAmount: { type: Number, required: true },
        estimatedTime: { type: String, required: true },
        milestones: [milestoneSchema],
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

const jobSchema = new mongoose.Schema(
    {
        client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        companyName: { type: String, trim: true },
        skillsRequired: [{ type: String }],
        budget: {
            min: { type: Number },
            max: { type: Number },
        },
        paymentType: { type: String, enum: ['fixed', 'hourly'], required: true },
        jobType: { type: String, enum: ['remote', 'hybrid', 'on-site'], required: true },
        deadline: { type: Date },
        estimatedDuration: { type: String },
        category: { type: String, required: true },
        location: { type: String },
        attachments: [{ type: String }],
        proposals: [proposalSchema],
        proposalsCount: { type: Number, default: 0 }, // ✅ New field to track proposal count
        status: {
            type: String,
            enum: ['open', 'in-progress', 'completed', 'cancelled'],
            default: 'open',
        },
        selectedFreelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review', default: null },
    },
    { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);
export default Job;