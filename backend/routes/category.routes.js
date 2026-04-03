const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

// get all categories — all roles
router.get('/', authenticate, categoryController.getAllCategories);

// get single category — all roles
router.get('/:id', authenticate, categoryController.getCategoryById);

// create category — admin only
router.post('/', authenticate, authorizeRoles('admin'), categoryController.createCategory);

// update category — admin only
router.put('/:id', authenticate, authorizeRoles('admin'), categoryController.updateCategory);

// delete category — admin only
router.delete('/:id', authenticate, authorizeRoles('admin'), categoryController.deleteCategory);

module.exports = router;