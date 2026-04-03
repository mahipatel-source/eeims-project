const { Category } = require('../models');

// get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']],
    });
    return res.json({ success: true, data: categories });
  } catch (err) {
    console.error('Get all categories error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
};

// get single category by id
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    return res.json({ success: true, data: category });
  } catch (err) {
    console.error('Get category error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch category' });
  }
};

// create new category — admin only
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // validate required fields
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    // check if category already exists
    const existing = await Category.findOne({ where: { name } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Category already exists' });
    }

    const category = await Category.create({
      name,
      description,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (err) {
    console.error('Create category error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create category' });
  }
};

// update category — admin only
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const { name, description } = req.body;

    await category.update({
      name: name || category.name,
      description: description || category.description,
      updatedBy: req.user.id,
    });

    return res.json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (err) {
    console.error('Update category error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update category' });
  }
};

// delete category — admin only
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // soft delete
    await category.update({ deletedBy: req.user.id });
    await category.destroy();

    return res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Delete category error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete category' });
  }
};