// 📁 src/pages/ClientJobs.jsx
import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { FaRupeeSign, FaRegClock, FaClipboardList } from 'react-icons/fa';
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
        <h3 className="text-xl font-semibold text-blue-700 mb-2 flex items-center gap-2">
          <FaClipboardList className="text-blue-600" />
          {job.title}
        </h3>
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">{job.description}</p>
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t text-sm text-gray-600">
        <span className="flex items-center gap-1 text-blue-600 font-semibold">
          <FaRupeeSign /> {job.budget}
        </span>
        <Link
          to={`/client/job/${job._id}`}
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
