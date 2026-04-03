const { Location } = require('../models');

// get all locations
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.findAll({
      order: [['name', 'ASC']],
    });
    return res.json({ success: true, data: locations });
  } catch (err) {
    console.error('Get all locations error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch locations' });
  }
};

// get single location by id
exports.getLocationById = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);

    if (!location) {
      return res.status(404).json({ success: false, message: 'Location not found' });
    }

    return res.json({ success: true, data: location });
  } catch (err) {
    console.error('Get location error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch location' });
  }
};

// create new location — admin only
exports.createLocation = async (req, res) => {
  try {
    const { name, description } = req.body;

    // validate required fields
    if (!name) {
      return res.status(400).json({ success: false, message: 'Location name is required' });
    }

    // check if location already exists
    const existing = await Location.findOne({ where: { name } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Location already exists' });
    }

    const location = await Location.create({
      name,
      description,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: 'Location created successfully',
      data: location,
    });
  } catch (err) {
    console.error('Create location error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create location' });
  }
};

// update location — admin only
exports.updateLocation = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);

    if (!location) {
      return res.status(404).json({ success: false, message: 'Location not found' });
    }

    const { name, description } = req.body;

    await location.update({
      name: name || location.name,
      description: description || location.description,
      updatedBy: req.user.id,
    });

    return res.json({
      success: true,
      message: 'Location updated successfully',
      data: location,
    });
  } catch (err) {
    console.error('Update location error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update location' });
  }
};

// delete location — admin only
exports.deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);

    if (!location) {
      return res.status(404).json({ success: false, message: 'Location not found' });
    }

    // soft delete
    await location.update({ deletedBy: req.user.id });
    await location.destroy();

    return res.json({ success: true, message: 'Location deleted successfully' });
  } catch (err) {
    console.error('Delete location error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete location' });
  }
};