import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { FaRupeeSign, FaRegClock, FaClipboardList, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaBuilding } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ClientJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data } = await API.get('/jobs/my-jobs');
                setJobs(data);
            } catch (err) {
                toast.error('Error fetching your jobs.');
                console.error('Error fetching jobs:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-white py-10 px-4">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">My Posted Jobs</h2>

                {loading ? (
                    <p className="text-center text-gray-500">Loading jobs...</p>
                ) : jobs.length === 0 ? (
                    <p className="text-center text-gray-500">No jobs posted yet. <Link to="/post-job" className="text-blue-500 hover:underline">Post one now!</Link></p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job) => (
                            <JobCard key={job._id} job={job} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function JobCard({ job }) {
    const statusColors = {
        open: 'bg-green-100 text-green-800',
        'in-progress': 'bg-blue-100 text-blue-800',
        completed: 'bg-teal-100 text-teal-800',
        cancelled: 'bg-red-100 text-red-800',
    };
    return (
        <div className="bg-white border rounded-2xl shadow hover:shadow-xl transition-all p-6 flex flex-col justify-between">
            <div>
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-blue-700">{job.title}</h3>
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[job.status] || 'bg-gray-100 text-gray-800'}`}
                    >
                        {job.status}
                    </span>
                </div>
                
                {job.companyName && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <FaBuilding className="text-gray-400" />
                        {job.companyName}
                    </div>
                )}

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{job.description}</p>

                <div className="text-sm space-y-2">
                    <div className="flex items-center gap-2">
                        <FaRupeeSign className="text-green-600" />
                        <span className="font-medium">Budget:</span> ₹{job.budget?.min} - ₹{job.budget?.max}
                    </div>
                    <div className="flex items-center gap-2">
                        <FaRegClock className="text-yellow-500" />
                        <span className="font-medium">Type:</span> {job.paymentType} / {job.jobType}
                    </div>
                    <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-purple-600" />
                        <span className="font-medium">Location:</span> {job.location || 'N/A'}
                    </div>
                    <div className="flex items-center gap-2">
                        <FaUsers className="text-teal-600" />
                        <span className="font-medium">Proposals:</span> {job.proposals.length}
                    </div>
                    <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-indigo-600" />
                        <span className="font-medium">Posted:</span>{' '}
                        {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                </div>
                
                {job.skillsRequired && job.skillsRequired.length > 0 && (
                    <div className="mt-4 border-t pt-2">
                        <p className="text-xs font-medium text-gray-500 mb-1">Skills:</p>
                        <div className="flex flex-wrap gap-2">
                            {job.skillsRequired.map((skill, index) => (
                                <span key={index} className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-end mt-4 pt-4 border-t">
                <Link
                    to={`/client/jobs/${job._id}`}
                    className="text-blue-600 hover:underline font-semibold text-sm"
                >
                    View Details →
                </Link>
            </div>
        </div>
    );
}