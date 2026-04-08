const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

// get all categories — all roles
router.get('/', authenticate, categoryController.getAllCategories);

// get single category — all roles
router.get('/:id', authenticate, categoryController.getCategoryById);

// create category — admin and manager
router.post('/', authenticate, authorizeRoles('admin', 'manager'), categoryController.createCategory);

// update category — admin and manager
router.put('/:id', authenticate, authorizeRoles('admin', 'manager'), categoryController.updateCategory);

// delete category — admin and manager
router.delete('/:id', authenticate, authorizeRoles('admin', 'manager'), categoryController.deleteCategory);

module.exports = router;