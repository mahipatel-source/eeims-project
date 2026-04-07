const { Maintenance, Equipment, User } = require('../models');

// get all maintenance records
exports.getAllMaintenance = async (req, res) => {
  try {
    const records = await Maintenance.findAll({
      include: [
        { model: Equipment, attributes: ['id', 'name'] },
        { model: User, as: 'technician', attributes: ['id', 'name', 'email'] },
      ],
      order: [['scheduledDate', 'ASC']],
    });
    return res.json({ success: true, data: records });
  } catch (err) {
    console.error('Get all maintenance error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch maintenance records' });
  }
};

// get single maintenance record
exports.getMaintenanceById = async (req, res) => {
  try {
    const record = await Maintenance.findByPk(req.params.id, {
      include: [
        { model: Equipment, attributes: ['id', 'name'] },
        { model: User, as: 'technician', attributes: ['id', 'name', 'email'] },
      ],
    });

    if (!record) {
      return res.status(404).json({ success: false, message: 'Maintenance record not found' });
    }

    return res.json({ success: true, data: record });
  } catch (err) {
    console.error('Get maintenance error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch maintenance record' });
  }
};

// create maintenance schedule — admin only
exports.createMaintenance = async (req, res) => {
  try {
    const { equipmentId, technicianId, scheduledDate, notes } = req.body;

    // validate required fields
    if (!equipmentId || !technicianId || !scheduledDate) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // check if equipment exists
    const equipment = await Equipment.findByPk(equipmentId);
    if (!equipment) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }

    // check if technician exists
    const technician = await User.findByPk(technicianId);
    if (!technician || technician.role !== 'technician') {
      return res.status(404).json({ success: false, message: 'Technician not found' });
    }

    const record = await Maintenance.create({
      equipmentId,
      technicianId,
      scheduledDate,
      notes,
      status: 'pending',
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });

    // create maintenance due alert (check for duplicates first)
    const { Alert } = require('../models');
    const existingAlert = await Alert.findOne({
      where: {
        equipmentId,
        type: 'maintenance_due',
        isRead: false,
      },
    });

    if (!existingAlert) {
      await Alert.create({
        type: 'maintenance_due',
        message: `Maintenance scheduled for ${equipment.name} on ${new Date(scheduledDate).toLocaleDateString()}`,
        equipmentId,
        createdBy: req.user.id,
        updatedBy: req.user.id,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Maintenance scheduled successfully',
      data: record,
    });
  } catch (err) {
    console.error('Create maintenance error:', err);
    return res.status(500).json({ success: false, message: 'Failed to schedule maintenance' });
  }
};

// complete maintenance — technician
exports.completeMaintenance = async (req, res) => {
  try {
    const record = await Maintenance.findByPk(req.params.id);

    if (!record) {
      return res.status(404).json({ success: false, message: 'Maintenance record not found' });
    }

    // check if already completed
    if (record.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Maintenance already completed' });
    }

    const { notes } = req.body;

    await record.update({
      status: 'completed',
      completedDate: new Date(),
      notes: notes || record.notes,
      updatedBy: req.user.id,
    });

    return res.json({
      success: true,
      message: 'Maintenance completed successfully',
      data: record,
    });
  } catch (err) {
    console.error('Complete maintenance error:', err);
    return res.status(500).json({ success: false, message: 'Failed to complete maintenance' });
  }
};

// get maintenance by technician
exports.getMaintenanceByTechnician = async (req, res) => {
  try {
    const records = await Maintenance.findAll({
      where: { technicianId: req.params.technicianId },
      include: [
        { model: Equipment, attributes: ['id', 'name'] },
      ],
      order: [['scheduledDate', 'ASC']],
    });

    return res.json({ success: true, data: records });
  } catch (err) {
    console.error('Get technician maintenance error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch maintenance records' });
  }
};

// delete maintenance — admin only
exports.deleteMaintenance = async (req, res) => {
  try {
    const record = await Maintenance.findByPk(req.params.id);

    if (!record) {
      return res.status(404).json({ success: false, message: 'Maintenance record not found' });
    }

    // hard delete — permanently removes from database
    await record.destroy({ force: true });

    return res.json({ success: true, message: 'Maintenance record deleted successfully' });
  } catch (err) {
    console.error('Delete maintenance error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete maintenance record' });
  }
};