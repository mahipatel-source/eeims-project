const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

// get all users — admin only
router.get('/', authenticate, authorizeRoles('admin'), userController.getAllUsers);

// get employees only — admin and manager can access
// used in manager issue equipment dropdown
router.get('/employees', authenticate, authorizeRoles('admin', 'manager'), userController.getEmployees);

// get technicians only — admin can access
// used in admin maintenance scheduling dropdown
router.get('/technicians', authenticate, authorizeRoles('admin'), userController.getTechnicians);

// get single user
router.get('/:id', authenticate, userController.getUserById);

// create user — admin only
router.post('/', authenticate, authorizeRoles('admin'), userController.createUser);

// update user — admin only
router.put('/:id', authenticate, authorizeRoles('admin'), userController.updateUser);

// delete user — admin only
router.delete('/:id', authenticate, authorizeRoles('admin'), userController.deleteUser);

module.exports = router;