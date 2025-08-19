import React, { useState } from 'react';
import API from '../api/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function PostJob() {
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    description: '',
    skillsRequired: [],
    budgetMin: '',
    budgetMax: '',
    paymentType: 'fixed',
    jobType: 'remote',
    deadline: '',
    estimatedDuration: '',
    category: '',
    location: '',
  });
  const [skillInput, setSkillInput] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillAdd = (e) => {
    if (e.key === 'Enter' && skillInput.trim() !== '') {
      e.preventDefault();
      setFormData({
        ...formData,
        skillsRequired: [...formData.skillsRequired, skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setFormData({
      ...formData,
      skillsRequired: formData.skillsRequired.filter(
        (skill) => skill !== skillToRemove
      ),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;

      if (!token) {
        toast.error('You must be logged in to post a job.');
        return;
      }

      const payload = {
        ...formData,
        budget: { min: parseFloat(formData.budgetMin), max: parseFloat(formData.budgetMax) },
      };
      delete payload.budgetMin;
      delete payload.budgetMax;

      await API.post('/jobs', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Job posted successfully!');
      navigate('/client/jobs');
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Something went wrong';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 py-10">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Post a Job</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Job Title</label>
            <input type="text" name="title" placeholder="e.g. Senior React Developer" value={formData.title} onChange={handleChange} required className="border p-2 rounded w-full mb-4 focus:ring focus:ring-blue-200" />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Company Name</label>
            <input type="text" name="companyName" placeholder="e.g. Acme Inc." value={formData.companyName} onChange={handleChange} className="border p-2 rounded w-full mb-4 focus:ring focus:ring-blue-200" />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Description</label>
            <textarea name="description" placeholder="Describe the job in detail" value={formData.description} onChange={handleChange} required className="border p-2 rounded w-full h-32 mb-4 focus:ring focus:ring-blue-200" />
          </div>

          <div>
            <label className="text-sm font-medium">Skills Required</label>
            <div className="border rounded p-2 mb-4 flex flex-wrap gap-2">
              {formData.skillsRequired.map((skill, index) => (
                <span key={index} className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                  {skill}
                  <button type="button" onClick={() => handleSkillRemove(skill)} className="ml-1 text-blue-800 hover:text-red-500">
                    &times;
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillAdd}
                placeholder="Type skill and press Enter"
                className="flex-grow outline-none border-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} required className="border p-2 rounded w-full mb-4 focus:ring focus:ring-blue-200">
              <option value="">Select category</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="Design">Design</option>
              <option value="Writing & Translation">Writing & Translation</option>
              <option value="Marketing">Marketing</option>
              <option value="Data Science">Data Science</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Payment Type</label>
            <select name="paymentType" value={formData.paymentType} onChange={handleChange} required className="border p-2 rounded w-full mb-4 focus:ring focus:ring-blue-200">
              <option value="fixed">Fixed Price</option>
              <option value="hourly">Hourly Rate</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Job Type</label>
            <select name="jobType" value={formData.jobType} onChange={handleChange} required className="border p-2 rounded w-full mb-4 focus:ring focus:ring-blue-200">
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="on-site">On-site</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Min Budget (₹)</label>
            <input type="number" name="budgetMin" placeholder="1000" value={formData.budgetMin} onChange={handleChange} required className="border p-2 rounded w-full mb-4 focus:ring focus:ring-blue-200" />
          </div>
          <div>
            <label className="text-sm font-medium">Max Budget (₹)</label>
            <input type="number" name="budgetMax" placeholder="50000" value={formData.budgetMax} onChange={handleChange} required className="border p-2 rounded w-full mb-4 focus:ring focus:ring-blue-200" />
          </div>

          <div>
            <label className="text-sm font-medium">Deadline</label>
            <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} required className="border p-2 rounded w-full mb-4 focus:ring focus:ring-blue-200" />
          </div>

          <div>
            <label className="text-sm font-medium">Estimated Duration</label>
            <input type="text" name="estimatedDuration" placeholder="e.g. 1-3 months" value={formData.estimatedDuration} onChange={handleChange} className="border p-2 rounded w-full mb-4 focus:ring focus:ring-blue-200" />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Location (for On-site/Hybrid)</label>
            <input type="text" name="location" placeholder="City, State" value={formData.location} onChange={handleChange} className="border p-2 rounded w-full mb-6 focus:ring focus:ring-blue-200" />
          </div>
        </div>

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg w-full text-lg font-semibold transition-colors duration-300">
          Post Job
        </button>
      </form>
    </div>
  );
}