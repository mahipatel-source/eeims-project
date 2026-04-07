const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

// inventory report — admin only
router.get('/inventory', authenticate, authorizeRoles('admin'), reportController.getInventoryReport);

// issue report — admin and manager
router.get('/issues', authenticate, authorizeRoles('admin', 'manager'), reportController.getIssueReport);

// maintenance report — admin only
router.get('/maintenance', authenticate, authorizeRoles('admin'), reportController.getMaintenanceReport);

// low stock report — admin only
router.get('/low-stock', authenticate, authorizeRoles('admin'), reportController.getLowStockReport);

module.exports = router;