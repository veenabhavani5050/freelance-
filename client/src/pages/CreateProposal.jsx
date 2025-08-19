import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';
import { FaRupeeSign } from 'react-icons/fa';

export default function CreateProposal() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        coverLetter: '',
        bidAmount: '',
        estimatedTime: '', // Updated field name to match backend
    });

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const { data } = await API.get(`/jobs/${id}`);
                setJob(data);
                setFormData(prev => ({ ...prev, bidAmount: data.budget.min }));
            } catch (err) {
                toast.error('Failed to load job details.');
                navigate('/jobs');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                coverLetter: formData.coverLetter,
                bidAmount: parseFloat(formData.bidAmount),
                estimatedTime: formData.estimatedTime,
                // Milestones are not included as your form doesn't collect them.
                // The backend `submitProposal` handles this correctly as an optional field.
            };

            await API.post(`/jobs/${id}/proposals`, payload);

            toast.success('Proposal submitted successfully!');
            navigate('/freelancer/proposals');
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to submit proposal.';
            toast.error(message);
        }
    };

    if (loading) {
        return <div className="text-center p-8">Loading job details for proposal...</div>;
    }

    if (!job) {
        return <div className="text-center p-8 text-red-500">Job not found.</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
                <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Submit a Proposal</h2>
                <div className="mb-6 pb-4 border-b">
                    <h3 className="text-xl font-semibold text-blue-800">{job.title}</h3>
                    <p className="text-gray-600 mt-2 line-clamp-2">{job.description}</p>
                    <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                        <FaRupeeSign /> Budget: ₹{job.budget.min} - ₹{job.budget.max}
                    </p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Bid Amount (₹)</label>
                        <input
                            type="number"
                            name="bidAmount"
                            value={formData.bidAmount}
                            onChange={handleChange}
                            required
                            className="border p-2 rounded w-full focus:ring focus:ring-blue-200"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Completion Time</label>
                        <input
                            type="text"
                            name="estimatedTime" // Updated name to match backend
                            placeholder="e.g., 2 weeks, 1 month"
                            value={formData.estimatedTime}
                            onChange={handleChange}
                            required
                            className="border p-2 rounded w-full focus:ring focus:ring-blue-200"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
                        <textarea
                            name="coverLetter"
                            rows="6"
                            value={formData.coverLetter}
                            onChange={handleChange}
                            required
                            className="border p-2 rounded w-full focus:ring focus:ring-blue-200"
                            placeholder="Tell the client why you're the best fit for this job."
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg w-full text-lg font-semibold transition-colors duration-300"
                    >
                        Submit Proposal
                    </button>
                </form>
            </div>
        </div>
    );
}