import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';
import { FaRupeeSign, FaRegClock, FaCalendarAlt, FaMapMarkerAlt, FaBuilding, FaDollarSign } from 'react-icons/fa';

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await API.get(`/jobs/${id}`);
        setJob(data);
      } catch (err) {
        toast.error('Failed to fetch job details.');
        setError('Job not found or an error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return <div className="text-center p-8">Loading job details...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <div className="flex justify-between items-start mb-6 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-800">{job.title}</h1>
            {job.companyName && (
              <p className="text-gray-600 mt-2 flex items-center gap-2">
                <FaBuilding /> {job.companyName}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-1">Posted on {new Date(job.createdAt).toLocaleDateString()}</p>
          </div>
          <span
            className={`px-4 py-1 rounded-full text-sm font-semibold capitalize ${job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
          >
            {job.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-gray-700 mb-8">
          <div className="flex items-center gap-2">
            <FaRupeeSign className="text-green-600" />
            <span className="font-medium">Budget:</span> ₹{job.budget.min} - ₹{job.budget.max}
          </div>
          <div className="flex items-center gap-2">
            <FaDollarSign className="text-purple-600" />
            <span className="font-medium">Payment Type:</span> {job.paymentType}
          </div>
          <div className="flex items-center gap-2">
            <FaRegClock className="text-yellow-600" />
            <span className="font-medium">Job Type:</span> {job.jobType}
          </div>
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-red-500" />
            <span className="font-medium">Location:</span> {job.location || 'N/A'}
          </div>
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-blue-500" />
            <span className="font-medium">Deadline:</span> {new Date(job.deadline).toLocaleDateString()}
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Description</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">{job.description}</p>
        
        {job.skillsRequired?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Skills Required</h2>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired.map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {job.status === 'open' && (
          <div className="flex justify-center mt-8">
            <Link
              to={`/proposals/submit/${job._id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 shadow-lg"
            >
              Apply for this Job
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}