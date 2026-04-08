const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipment.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

// get all equipment — all roles can view
router.get('/', authenticate, equipmentController.getAllEquipment);

// get low stock equipment — admin and manager
router.get('/low-stock', authenticate, authorizeRoles('admin', 'manager'), equipmentController.getLowStockEquipment);

// get single equipment — all roles
router.get('/:id', authenticate, equipmentController.getEquipmentById);

// create equipment — admin and manager
router.post('/', authenticate, authorizeRoles('admin', 'manager'), equipmentController.createEquipment);

// update equipment — admin and manager
router.put('/:id', authenticate, authorizeRoles('admin', 'manager'), equipmentController.updateEquipment);

// delete equipment — admin and manager
router.delete('/:id', authenticate, authorizeRoles('admin', 'manager'), equipmentController.deleteEquipment);

module.exports = router;