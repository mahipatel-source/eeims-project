const { Equipment, Issue, Maintenance, User, Category, Location } = require('../models');
const { Op } = require('sequelize');

// get inventory report
exports.getInventoryReport = async (req, res) => {
  try {
    const equipment = await Equipment.findAll({
      include: [
        { model: Category, attributes: ['name'] },
        { model: Location, attributes: ['name'] },
      ],
      order: [['name', 'ASC']],
    });

    return res.json({
      success: true,
      message: 'Inventory report generated successfully',
      data: equipment,
      generatedAt: new Date(),
    });
  } catch (err) {
    console.error('Inventory report error:', err);
    return res.status(500).json({ success: false, message: 'Failed to generate inventory report' });
  }
};

// get issue report by date range
exports.getIssueReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};

    // filter by date range if provided
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const issues = await Issue.findAll({
      where,
      include: [
        { model: Equipment, attributes: ['name'] },
        { model: User, attributes: ['name', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.json({
      success: true,
      message: 'Issue report generated successfully',
      data: issues,
      generatedAt: new Date(),
    });
  } catch (err) {
    console.error('Issue report error:', err);
    return res.status(500).json({ success: false, message: 'Failed to generate issue report' });
  }
};

// get maintenance report
exports.getMaintenanceReport = async (req, res) => {
  try {
    const { status } = req.query;

    const where = {};
    if (status) where.status = status;

    const records = await Maintenance.findAll({
      where,
      include: [
        { model: Equipment, attributes: ['name'] },
        { model: User, as: 'technician', attributes: ['name', 'email'] },
      ],
      order: [['scheduledDate', 'DESC']],
    });

    return res.json({
      success: true,
      message: 'Maintenance report generated successfully',
      data: records,
      generatedAt: new Date(),
    });
  } catch (err) {
    console.error('Maintenance report error:', err);
    return res.status(500).json({ success: false, message: 'Failed to generate maintenance report' });
  }
};

// get low stock report
exports.getLowStockReport = async (req, res) => {
  try {
    const { sequelize } = require('../models');

    const lowStock = await Equipment.findAll({
      where: sequelize.where(
        sequelize.col('quantity'),
        { [Op.lt]: sequelize.col('minimumStock') }
      ),
      include: [
        { model: Category, attributes: ['name'] },
        { model: Location, attributes: ['name'] },
      ],
      order: [['quantity', 'ASC']],
    });

    return res.json({
      success: true,
      message: 'Low stock report generated successfully',
      data: lowStock,
      generatedAt: new Date(),
    });
  } catch (err) {
    console.error('Low stock report error:', err);
    return res.status(500).json({ success: false, message: 'Failed to generate low stock report' });
  }
};