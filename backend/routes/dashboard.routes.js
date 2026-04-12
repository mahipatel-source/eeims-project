const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

// get dashboard KPI data — admin only
router.get('/', authenticate, authorizeRoles('admin'), dashboardController.getDashboardData);

// get equipment by category — admin only
router.get('/equipment-by-category', authenticate, authorizeRoles('admin'), dashboardController.getEquipmentByCategory);

// get issue trend — admin only
router.get('/issue-trend', authenticate, authorizeRoles('admin'), dashboardController.getIssueTrend);

module.exports = router;
