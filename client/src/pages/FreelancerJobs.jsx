import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { toast } from 'react-toastify';
import { FaRupeeSign, FaRegClock, FaMapMarkerAlt, FaBuilding, FaListAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function FreelancerJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await API.get('/jobs');
        setJobs(data);
      } catch (err) {
        toast.error('Failed to fetch job listings.');
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-purple-50 to-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-purple-700 mb-8 text-center">Available Job Listings</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-gray-500">No open jobs available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobListingCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function JobListingCard({ job }) {
  return (
    <div className="bg-white border rounded-2xl shadow hover:shadow-xl transition-all p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-purple-700">{job.title}</h3>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{job.description}</p>
        
        <div className="text-sm space-y-2">
          {job.companyName && (
            <div className="flex items-center gap-2">
              <FaBuilding className="text-gray-400" />
              <span className="font-medium">Company:</span> {job.companyName}
            </div>
          )}
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

      <div className="flex justify-end mt-4 pt-4 border-t">
        <Link
          to={`/jobs/${job._id}`}
          className="text-purple-600 hover:underline font-semibold text-sm"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
