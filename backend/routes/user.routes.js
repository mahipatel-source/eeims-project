const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

// get all users — admin only
router.get('/', authenticate, authorizeRoles('admin'), userController.getAllUsers);

// get single user — admin sees any, others see own only
router.get('/:id', authenticate, userController.getUserById);

// create user — admin only (manager/technician)
router.post('/', authenticate, authorizeRoles('admin'), userController.createUser);

// update user — admin only
router.put('/:id', authenticate, authorizeRoles('admin'), userController.updateUser);

// delete user — admin only
router.delete('/:id', authenticate, authorizeRoles('admin'), userController.deleteUser);

module.exports = router;