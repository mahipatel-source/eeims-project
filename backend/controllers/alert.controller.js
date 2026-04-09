const { Alert, Equipment } = require('../models');

// get all alerts — admin only
exports.getAllAlerts = async (req, res) => {
  try {
    const alerts = await Alert.findAll({
      include: [
        { model: Equipment, attributes: ['id', 'name'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    return res.json({ success: true, data: alerts });
  } catch (err) {
    console.error('Get all alerts error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch alerts' });
  }
};

// get unread alerts count — admin only
exports.getUnreadAlertsCount = async (req, res) => {
  try {
    const count = await Alert.count({ where: { isRead: false } });
    return res.json({ success: true, data: { count } });
  } catch (err) {
    console.error('Get unread alerts count error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch alerts count' });
  }
};

// mark alert as read — admin only
exports.markAsRead = async (req, res) => {
  try {
    const alert = await Alert.findByPk(req.params.id);

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    await alert.update({ isRead: true, updatedBy: req.user.id });

    return res.json({ success: true, message: 'Alert marked as read', data: alert });
  } catch (err) {
    console.error('Mark alert as read error:', err);
    return res.status(500).json({ success: false, message: 'Failed to mark alert as read' });
  }
};

// mark all alerts as read — admin only
exports.markAllAsRead = async (req, res) => {
  try {
    await Alert.update(
      { isRead: true, updatedBy: req.user.id },
      { where: { isRead: false } }
    );

    return res.json({ success: true, message: 'All alerts marked as read' });
  } catch (err) {
    console.error('Mark all alerts as read error:', err);
    return res.status(500).json({ success: false, message: 'Failed to mark all alerts as read' });
  }
};

// delete alert — admin only
exports.deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findByPk(req.params.id);

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    // hard delete — permanently removes from database
    await alert.destroy({ force: true });

    return res.json({ success: true, message: 'Alert deleted successfully' });
  } catch (err) {
    console.error('Delete alert error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete alert' });
  }
};

// report damage — admin and technician
exports.reportDamage = async (req, res) => {
  try {
    const { equipmentId, message } = req.body;

    if (!equipmentId || !message) {
      return res.status(400).json({ success: false, message: 'Equipment and description are required' });
    }

    const equipment = await Equipment.findByPk(equipmentId);
    if (!equipment) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }

    const alert = await Alert.create({
      type: 'general',
      message: `Damage reported: ${message}`,
      equipmentId,
      isRead: false,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: 'Damage reported successfully',
      data: alert,
    });
  } catch (err) {
    console.error('Report damage error:', err);
    return res.status(500).json({ success: false, message: 'Failed to report damage' });
  }
};