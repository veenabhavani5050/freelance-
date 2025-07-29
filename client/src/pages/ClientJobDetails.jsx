// ✅ src/pages/ClientJobDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function ClientJobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;

        const { data } = await API.get(`/jobs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setJob(data);
      } catch (err) {
        toast.error('Failed to load job details');
        navigate('/client/jobs');
      }
    };
    fetchJob();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;

        await API.delete(`/jobs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('Job deleted successfully');
        navigate('/client/jobs');
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  if (!job) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-xl mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700">{job.title}</h2>
        <div className="space-x-2">
          <Link
            to={`/client/jobs/${job._id}/edit`}
            className="inline-flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
          >
            <FaEdit /> Edit
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>
      <p className="text-gray-700 mb-4">{job.description}</p>
      <div className="text-sm text-gray-600 space-y-1">
        <p><strong>Budget:</strong> ₹{job.budget}</p>
        <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
        <p><strong>Category:</strong> {job.category}</p>
        {job.location && <p><strong>Location:</strong> {job.location}</p>}
        <p><strong>Status:</strong> {job.status}</p>
      </div>
    </div>
  );
}