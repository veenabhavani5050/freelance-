import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
        unique: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    // Allows freelancer to respond to the review
    response: {
        type: String
    }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;