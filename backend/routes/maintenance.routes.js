const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenance.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

// get all maintenance — admin and manager
router.get('/', authenticate, authorizeRoles('admin', 'manager'), maintenanceController.getAllMaintenance);

// get maintenance by technician
router.get('/technician/:technicianId', authenticate, maintenanceController.getMaintenanceByTechnician);

// get single maintenance record
router.get('/:id', authenticate, maintenanceController.getMaintenanceById);

// create maintenance schedule — admin only
router.post('/', authenticate, authorizeRoles('admin'), maintenanceController.createMaintenance);

// complete maintenance — technician
router.put('/:id/complete', authenticate, authorizeRoles('admin', 'technician'), maintenanceController.completeMaintenance);

// delete maintenance — admin only
router.delete('/:id', authenticate, authorizeRoles('admin'), maintenanceController.deleteMaintenance);

module.exports = router;