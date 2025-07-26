// controllers/jobController.js
import Job from '../models/Job.js';

export const createJob = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    const job = new Job({
      title,
      description,
      budget,
      client: req.user._id,
    });

    const savedJob = await job.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Job creation failed' });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('client', 'name email');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ NEW: Get only jobs posted by logged-in user (client)
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ client: req.user._id });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
