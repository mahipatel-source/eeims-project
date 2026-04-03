const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipment.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

// get all equipment — all roles can view
router.get('/', authenticate, equipmentController.getAllEquipment);

// get low stock equipment — admin only
router.get('/low-stock', authenticate, authorizeRoles('admin'), equipmentController.getLowStockEquipment);

// get single equipment — all roles
router.get('/:id', authenticate, equipmentController.getEquipmentById);

// create equipment — admin only
router.post('/', authenticate, authorizeRoles('admin'), equipmentController.createEquipment);

// update equipment — admin only
router.put('/:id', authenticate, authorizeRoles('admin'), equipmentController.updateEquipment);

// delete equipment — admin only
router.delete('/:id', authenticate, authorizeRoles('admin'), equipmentController.deleteEquipment);

module.exports = router;