const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

// all user routes require authentication
router.get('/', authenticate, authorizeRoles('admin'), userController.getAllUsers);
router.get('/:id', authenticate, authorizeRoles('admin'), userController.getUserById);
router.post('/', authenticate, authorizeRoles('admin'), userController.createUser);
router.put('/:id', authenticate, authorizeRoles('admin'), userController.updateUser);
router.delete('/:id', authenticate, authorizeRoles('admin'), userController.deleteUser);

module.exports = router;