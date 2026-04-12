const { Equipment, Category, Location } = require('../models');
const { Op } = require('sequelize');

// get all equipment with search and filter
exports.getAllEquipment = async (req, res) => {
  try {
    const { search, categoryId, locationId, condition } = req.query;

    // build filter conditions
    const where = {};

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    if (categoryId) where.categoryId = categoryId;
    if (locationId) where.locationId = locationId;
    if (condition) where.condition = condition;

    const equipment = await Equipment.findAll({
      where,
      include: [
        { model: Category, attributes: ['id', 'name'] },
        { model: Location, attributes: ['id', 'name'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.json({ success: true, data: equipment });
  } catch (err) {
    console.error('Get all equipment error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch equipment' });
  }
};

// get single equipment by id
exports.getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findByPk(req.params.id, {
      include: [
        { model: Category, attributes: ['id', 'name'] },
        { model: Location, attributes: ['id', 'name'] },
      ],
    });

    if (!equipment) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }

    return res.json({ success: true, data: equipment });
  } catch (err) {
    console.error('Get equipment error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch equipment' });
  }
};

// create new equipment — admin only
exports.createEquipment = async (req, res) => {
  try {
    const { name, description, categoryId, locationId, quantity, condition, minimumStock } = req.body;

    // validate required fields
    if (!name) {
      return res.status(400).json({ success: false, message: 'Equipment name is required' });
    }

    const equipment = await Equipment.create({
      name,
      description,
      categoryId: categoryId || null,
      locationId: locationId || null,
      quantity: quantity || 0,
      condition: condition || 'good',
      minimumStock: minimumStock || 5,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });

    // check if stock is already low on creation
    if (equipment.quantity <= equipment.minimumStock) {
      const { Alert } = require('../models');
      await Alert.create({
        type: 'low_stock',
        message: `Low stock alert: ${equipment.name} has only ${equipment.quantity} units`,
        equipmentId: equipment.id,
        createdBy: req.user.id,
        updatedBy: req.user.id,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Equipment created successfully',
      data: equipment,
    });
  } catch (err) {
    console.error('Create equipment error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create equipment' });
  }
};

// update equipment — admin only
exports.updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByPk(req.params.id);

    if (!equipment) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }

    const { name, description, categoryId, locationId, quantity, condition, minimumStock } = req.body;

    await equipment.update({
      name: name !== undefined ? name : equipment.name,
      description: description !== undefined ? description : equipment.description,
      categoryId: categoryId !== undefined ? categoryId : equipment.categoryId,
      locationId: locationId !== undefined ? locationId : equipment.locationId,
      quantity: quantity !== undefined ? quantity : equipment.quantity,
      condition: condition !== undefined ? condition : equipment.condition,
      minimumStock: minimumStock !== undefined ? minimumStock : equipment.minimumStock,
      updatedBy: req.user.id,
    });

    const { Alert } = require('../models');

    // if stock is now above minimum, clear old low-stock alerts
    if (equipment.quantity > equipment.minimumStock) {
      await Alert.update(
        { isRead: true, updatedBy: req.user.id },
        { 
          where: { 
            equipmentId: equipment.id, 
            type: 'low_stock', 
            isRead: false 
          } 
        }
      );
    } else {
      // check if stock is below minimum
      // avoid duplicate alerts — check if alert already exists
      const existingAlert = await Alert.findOne({
        where: { equipmentId: equipment.id, type: 'low_stock', isRead: false },
      });

      if (!existingAlert) {
        await Alert.create({
          type: 'low_stock',
          message: `Low stock alert: ${equipment.name} has only ${equipment.quantity} units`,
          equipmentId: equipment.id,
          createdBy: req.user.id,
          updatedBy: req.user.id,
        });
      }
    }

    return res.json({
      success: true,
      message: 'Equipment updated successfully',
      data: equipment,
    });
  } catch (err) {
    console.error('Update equipment error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update equipment' });
  }
};

// delete equipment — admin only
exports.deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByPk(req.params.id);

    if (!equipment) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }

    // hard delete — permanently removes from database
    await equipment.destroy({ force: true });

    return res.json({ success: true, message: 'Equipment deleted successfully' });
  } catch (err) {
    console.error('Delete equipment error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete equipment' });
  }
};

// get low stock equipment
exports.getLowStockEquipment = async (req, res) => {
  try {
    const { sequelize } = require('../models');

    const lowStock = await Equipment.findAll({
      where: sequelize.where(
        sequelize.col('quantity'),
        { [Op.lte]: sequelize.col('minimumStock') }
      ),
      include: [
        { model: Category, attributes: ['id', 'name'] },
        { model: Location, attributes: ['id', 'name'] },
      ],
    });

    return res.json({ success: true, data: lowStock });
  } catch (err) {
    console.error('Get low stock error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch low stock equipment' });
  }
};
