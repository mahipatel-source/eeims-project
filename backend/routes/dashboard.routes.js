const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

// get dashboard KPI data — admin and manager
router.get('/', authenticate, authorizeRoles('admin', 'manager'), dashboardController.getDashboardData);

// get equipment by category — admin and manager
router.get('/equipment-by-category', authenticate, authorizeRoles('admin', 'manager'), dashboardController.getEquipmentByCategory);

// get issue trend — admin and manager
router.get('/issue-trend', authenticate, authorizeRoles('admin', 'manager'), dashboardController.getIssueTrend);

module.exports = router;