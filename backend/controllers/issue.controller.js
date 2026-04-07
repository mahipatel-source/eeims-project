const { Issue, Equipment, User } = require('../models');

// get all issues — admin and manager
exports.getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.findAll({
      include: [
        { model: Equipment, attributes: ['id', 'name'] },
        { model: User, attributes: ['id', 'name', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    return res.json({ success: true, data: issues });
  } catch (err) {
    console.error('Get all issues error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch issues' });
  }
};

// get single issue by id
exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findByPk(req.params.id, {
      include: [
        { model: Equipment, attributes: ['id', 'name'] },
        { model: User, attributes: ['id', 'name', 'email'] },
      ],
    });

    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    return res.json({ success: true, data: issue });
  } catch (err) {
    console.error('Get issue error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch issue' });
  }
};

// create new issue — admin and manager
exports.createIssue = async (req, res) => {
  try {
    const { equipmentId, userId, quantity, remarks, returnDate } = req.body;

    // validate required fields
    if (!equipmentId || !userId || !quantity) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // check if equipment exists
    const equipment = await Equipment.findByPk(equipmentId);
    if (!equipment) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }

    // check if enough stock available
    if (equipment.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Not enough stock — only ${equipment.quantity} units available`,
      });
    }

    // create issue record
    const issue = await Issue.create({
      equipmentId,
      userId,
      quantity,
      remarks,
      returnDate: returnDate || null,
      issueDate: new Date(),
      status: 'issued',
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });

    // reduce equipment quantity
    await equipment.update({
      quantity: equipment.quantity - quantity,
      updatedBy: req.user.id,
    });

    // create low stock alert if quantity dropped below minimum
    if (equipment.quantity - quantity <= equipment.minimumStock) {
      const { Alert } = require('../models');
      const existingAlert = await Alert.findOne({
        where: { equipmentId, type: 'low_stock', isRead: false },
      });

      if (!existingAlert) {
        await Alert.create({
          type: 'low_stock',
          message: `Low stock alert: ${equipment.name} has only ${equipment.quantity - quantity} units remaining`,
          equipmentId,
          createdBy: req.user.id,
          updatedBy: req.user.id,
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Issue created successfully',
      data: issue,
    });
  } catch (err) {
    console.error('Create issue error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create issue' });
  }
};

// return issued equipment
exports.returnIssue = async (req, res) => {
  try {
    const issue = await Issue.findByPk(req.params.id);

    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    // check if already returned
    if (issue.status === 'returned') {
      return res.status(400).json({ success: false, message: 'Equipment already returned' });
    }

    // update issue status
    await issue.update({
      status: 'returned',
      returnDate: new Date(),
      updatedBy: req.user.id,
    });

    // increase equipment quantity back
    const equipment = await Equipment.findByPk(issue.equipmentId);
    await equipment.update({
      quantity: equipment.quantity + issue.quantity,
      updatedBy: req.user.id,
    });

    return res.json({ success: true, message: 'Equipment returned successfully', data: issue });
  } catch (err) {
    console.error('Return issue error:', err);
    return res.status(500).json({ success: false, message: 'Failed to return equipment' });
  }
};

// get issues by user id
exports.getIssuesByUser = async (req, res) => {
  try {
    const issues = await Issue.findAll({
      where: { userId: req.params.userId },
      include: [
        { model: Equipment, attributes: ['id', 'name'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.json({ success: true, data: issues });
  } catch (err) {
    console.error('Get user issues error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch user issues' });
  }
};