const { User, Equipment, Issue, Maintenance, Alert } = require('../models');
const { Op } = require('sequelize');

// get dashboard KPI data — admin only
exports.getDashboardData = async (req, res) => {
  try {
    const { sequelize } = require('../models');

    // total equipment count
    const totalEquipment = await Equipment.count();

    // total users count
    const totalUsers = await User.count();

    // total issued equipment
    const totalIssued = await Issue.count({ where: { status: 'issued' } });

    // low stock equipment count
    const lowStockCount = await Equipment.count({
      where: sequelize.where(
        sequelize.col('quantity'),
        { [Op.lte]: sequelize.col('minimumStock') }
      ),
    });

    // pending maintenance count
    const pendingMaintenance = await Maintenance.count({
      where: { status: 'pending' },
    });

    // unread alerts count
    const unreadAlerts = await Alert.count({ where: { isRead: false } });

    // recent issues — last 5
    const recentIssues = await Issue.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        { model: Equipment, attributes: ['id', 'name'] },
        { model: User, attributes: ['id', 'name'] },
      ],
    });

    // upcoming maintenance — next 5
    const upcomingMaintenance = await Maintenance.findAll({
      where: {
        status: 'pending',
        scheduledDate: { [Op.gte]: new Date() },
      },
      limit: 5,
      order: [['scheduledDate', 'ASC']],
      include: [
        { model: Equipment, attributes: ['id', 'name'] },
      ],
    });

    return res.json({
      success: true,
      data: {
        totalEquipment,
        totalUsers,
        totalIssued,
        lowStockCount,
        pendingMaintenance,
        unreadAlerts,
        recentIssues,
        upcomingMaintenance,
      },
    });
  } catch (err) {
    console.error('Get dashboard data error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' });
  }
};

// get equipment by category for pie chart
exports.getEquipmentByCategory = async (req, res) => {
  try {
    const { sequelize } = require('../models');
    const { Category } = require('../models');

    const data = await Equipment.findAll({
      attributes: [
        'categoryId',
        [sequelize.fn('COUNT', sequelize.col('Equipment.id')), 'count'],
      ],
      include: [{ model: Category, attributes: ['name'] }],
      group: ['categoryId', 'Category.id'],
    });

    return res.json({ success: true, data });
  } catch (err) {
    console.error('Get equipment by category error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch category data' });
  }
};

// get issue trend for last 7 days for line chart
exports.getIssueTrend = async (req, res) => {
  try {
    const { sequelize } = require('../models');

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const data = await Issue.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      where: { createdAt: { [Op.gte]: sevenDaysAgo } },
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
    });

    return res.json({ success: true, data });
  } catch (err) {
    console.error('Get issue trend error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch issue trend' });
  }
};