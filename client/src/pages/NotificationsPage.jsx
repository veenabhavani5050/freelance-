import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { FaBell, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const { data } = await API.get('/notifications');
                setNotifications(data);
            } catch (err) {
                toast.error('Failed to fetch notifications.');
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            await API.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            toast.error('Failed to mark notification as read.');
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Your Notifications</h1>
            {notifications.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                    <FaBell className="mx-auto text-4xl mb-2" />
                    <p>You don't have any notifications yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map(notification => (
                        <div
                            key={notification._id}
                            className={`p-4 rounded-lg flex items-start space-x-4 transition-colors duration-200 ${notification.isRead ? 'bg-gray-100 text-gray-500' : 'bg-blue-50 text-gray-800 shadow-sm'}`}
                        >
                            <div className={`p-2 rounded-full ${notification.isRead ? 'bg-gray-200' : 'bg-blue-200'}`}>
                                <FaExclamationCircle className="text-xl text-blue-600" />
                            </div>
                            <div className="flex-grow">
                                <p className="text-sm font-semibold">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(notification.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                {notification.link && (
                                    <Link to={notification.link} className={`text-sm font-medium ${notification.isRead ? 'text-gray-500 hover:text-gray-700' : 'text-blue-600 hover:underline'}`}>
                                        View Details
                                    </Link>
                                )}
                                {!notification.isRead && (
                                    <button
                                        onClick={() => markAsRead(notification._id)}
                                        className="p-1 rounded-full text-gray-400 hover:text-green-500 transition-colors duration-200"
                                        title="Mark as read"
                                    >
                                        <FaCheckCircle className="text-lg" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}