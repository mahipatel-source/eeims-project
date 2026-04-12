const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alert.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

// get all alerts — all staff roles
router.get('/', authenticate, authorizeRoles('admin', 'manager', 'technician'), alertController.getAllAlerts);

// get unread alerts count — all staff roles
router.get('/unread/count', authenticate, authorizeRoles('admin', 'manager', 'technician'), alertController.getUnreadAlertsCount);

// mark all alerts as read — admin only
router.put('/mark-all-read', authenticate, authorizeRoles('admin'), alertController.markAllAsRead);

// mark single alert as read — admin and manager
router.put('/:id/read', authenticate, authorizeRoles('admin', 'manager'), alertController.markAsRead);

// delete alert — admin only
router.delete('/:id', authenticate, authorizeRoles('admin'), alertController.deleteAlert);

// report damage — admin and technician
router.post('/report-damage', authenticate, authorizeRoles('admin', 'technician'), alertController.reportDamage);

module.exports = router;
