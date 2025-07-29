// ✅ src/pages/ClientJobs.jsx
import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { FaRupeeSign, FaRegClock, FaClipboardList, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function ClientJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await API.get('/jobs/my-jobs');
        setJobs(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">My Posted Jobs</h2>

        {jobs.length === 0 ? (
          <p className="text-center text-gray-500">No jobs posted yet.</p>
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
  return (
    <div className="bg-white border rounded-2xl shadow hover:shadow-xl transition-all p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-semibold text-blue-700 mb-3 flex items-center gap-2">
          <FaClipboardList className="text-blue-600" />
          {job.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{job.description}</p>

        <div className="text-sm space-y-2">
          <div className="flex items-center gap-2">
            <FaRupeeSign className="text-green-600" />
            <span className="font-medium">Budget:</span> ₹{job.budget}
          </div>
          <div className="flex items-center gap-2">
            <FaRegClock className="text-yellow-500" />
            <span className="font-medium">Duration:</span> {job.duration || 'Not specified'}
          </div>
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-purple-600" />
            <span className="font-medium">Posted:</span> {new Date(job.createdAt).toLocaleDateString()}
          </div>
        </div>
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
