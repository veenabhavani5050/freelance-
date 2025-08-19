import Service from '../models/Service.js';

export const createService = async (req, res) => {
  try {
    const images = req.files?.map((file) => `/uploads/services/${file.filename}`) || [];
    const tags = req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [];

    const service = new Service({
      ...req.body,
      images,
      tags,
      user: req.user._id,
    });

    const createdService = await service.save();
    res.status(201).json(createdService);
  } catch (error) {
    res.status(500).json({ message: 'Error creating service', error: error.message });
  }
};

export const getAllServices = async (req, res) => {
  try {
    const { category, priceMin, priceMax, available } = req.query;

    const query = {};
    if (category) query.category = category;
    if (available !== undefined) query.available = available === 'true';
    if (priceMin || priceMax) query.price = {};
    if (priceMin) query.price.$gte = Number(priceMin);
    if (priceMax) query.price.$lte = Number(priceMax);

    const services = await Service.find(query).populate('user', 'name email');
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
};

export const getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ user: req.user._id }).populate('user', 'name email');
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your services', error: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('user', 'name email');
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service', error: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    if (service.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    if (req.files?.length) {
      service.images = req.files.map((file) => `/uploads/services/${file.filename}`);
    }
    
    // Add logic to handle tags
    const tags = req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [];
    
    Object.assign(service, { ...req.body, tags });
    const updated = await service.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating service', error: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    if (service.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    await service.deleteOne();
    res.status(200).json({ message: 'Service removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
};