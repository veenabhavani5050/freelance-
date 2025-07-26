// ✅ controllers/serviceController.js
import Service from '../models/Service.js';

export const createService = async (req, res) => {
  try {
    const service = new Service({ ...req.body, user: req.user._id });
    const createdService = await service.save();
    res.status(201).json(createdService);
  } catch (error) {
    res.status(500).json({ message: 'Error creating service', error });
  }
};

export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate('user', 'name email');
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('user', 'name email');
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service', error });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    if (service.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    Object.assign(service, req.body);
    const updated = await service.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating service', error });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    if (service.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    await service.deleteOne();
    res.status(200).json({ message: 'Service removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service', error });
  }
};