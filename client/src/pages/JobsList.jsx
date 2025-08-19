import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { FaRupeeSign, FaClipboardList, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await API.get('/jobs?status=open');
        setJobs(data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <p className="text-center p-4">Loading job listings...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Browse Job Listings</h2>

        {jobs.length === 0 ? (
          <p className="text-center text-gray-500">No open jobs available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white border rounded-2xl shadow hover:shadow-xl transition-all p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-blue-700 flex items-center gap-2 mb-2">
                    <FaClipboardList className="text-blue-600" /> {job.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{job.description}</p>
                  <div className="text-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <FaRupeeSign className="text-green-600" /> <span className="font-medium">Budget:</span> ₹{job.budget.min} - ₹{job.budget.max}
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-gray-500" /> <span className="font-medium">Location:</span> {job.location || 'Remote'}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4 pt-4 border-t">
                  <Link to={`/jobs/${job._id}`} className="text-blue-600 hover:underline font-semibold text-sm">
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}