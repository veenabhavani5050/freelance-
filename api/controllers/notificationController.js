import asyncHandler from 'express-async-handler';
import Notification from '../models/Notification.js';

// @desc    Get all notifications for the logged-in user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ recipient: req.user._id })
        .sort({ createdAt: -1 });

    res.json(notifications);
});

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, recipient: req.user._id },
        { isRead: true },
        { new: true }
    );

    if (!notification) {
        res.status(404);
        throw new Error('Notification not found or not authorized');
    }

    res.json({ message: 'Notification marked as read', notification });
});