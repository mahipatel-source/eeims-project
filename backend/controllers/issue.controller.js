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

// get pending requests — admin and manager
exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await Issue.findAll({
      where: { status: 'pending' },
      include: [
        { model: Equipment, attributes: ['id', 'name', 'quantity'] },
        { model: User, attributes: ['id', 'name', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    return res.json({ success: true, data: requests });
  } catch (err) {
    console.error('Get pending requests error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch pending requests' });
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

// user requests equipment
exports.requestEquipment = async (req, res) => {
  try {
    const { equipmentId, quantity, remarks, requestedReturnDate } = req.body;

    // validate required fields
    if (!equipmentId || !quantity) {
      return res.status(400).json({ success: false, message: 'Equipment and quantity are required' });
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

    // create request with pending status
    const issue = await Issue.create({
      equipmentId,
      userId: req.user.id,
      quantity,
      remarks,
      requestedReturnDate: requestedReturnDate || null,
      status: 'pending',
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: 'Equipment request submitted successfully',
      data: issue,
    });
  } catch (err) {
    console.error('Request equipment error:', err);
    return res.status(500).json({ success: false, message: 'Failed to submit request' });
  }
};

// approve request — admin and manager
exports.approveRequest = async (req, res) => {
  try {
    const issue = await Issue.findByPk(req.params.id);

    if (!issue) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (issue.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Request is not pending' });
    }

    // check stock again before approving
    const equipment = await Equipment.findByPk(issue.equipmentId);
    if (equipment.quantity < issue.quantity) {
      return res.status(400).json({
        success: false,
        message: `Not enough stock — only ${equipment.quantity} units available`,
      });
    }

    // approve and issue equipment
    await issue.update({
      status: 'issued',
      issueDate: new Date(),
      updatedBy: req.user.id,
    });

    // reduce equipment quantity
    await equipment.update({
      quantity: equipment.quantity - issue.quantity,
      updatedBy: req.user.id,
    });

    // create low stock alert if needed
    if (equipment.quantity - issue.quantity <= equipment.minimumStock) {
      const { Alert } = require('../models');
      const existingAlert = await Alert.findOne({
        where: { equipmentId: equipment.id, type: 'low_stock', isRead: false },
      });

      if (!existingAlert) {
        await Alert.create({
          type: 'low_stock',
          message: `Low stock alert: ${equipment.name} has only ${equipment.quantity - issue.quantity} units remaining`,
          equipmentId: equipment.id,
          createdBy: req.user.id,
          updatedBy: req.user.id,
        });
      }
    }

    return res.json({
      success: true,
      message: 'Request approved successfully',
      data: issue,
    });
  } catch (err) {
    console.error('Approve request error:', err);
    return res.status(500).json({ success: false, message: 'Failed to approve request' });
  }
};

// reject request — admin and manager
exports.rejectRequest = async (req, res) => {
  try {
    const issue = await Issue.findByPk(req.params.id);

    if (!issue) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (issue.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Request is not pending' });
    }

    const { rejectionReason } = req.body;

    await issue.update({
      status: 'rejected',
      rejectionReason: rejectionReason || 'No reason provided',
      updatedBy: req.user.id,
    });

    return res.json({
      success: true,
      message: 'Request rejected',
      data: issue,
    });
  } catch (err) {
    console.error('Reject request error:', err);
    return res.status(500).json({ success: false, message: 'Failed to reject request' });
  }
};

// return issued equipment — user
exports.returnIssue = async (req, res) => {
  try {
    const issue = await Issue.findByPk(req.params.id);

    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    if (issue.status !== 'issued') {
      return res.status(400).json({ success: false, message: 'Equipment is not currently issued' });
    }

    // only the user who requested can return
    if (issue.userId !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

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

    return res.json({
      success: true,
      message: 'Equipment returned successfully',
      data: issue,
    });
  } catch (err) {
    console.error('Return issue error:', err);
    return res.status(500).json({ success: false, message: 'Failed to return equipment' });
  }
};

// get my requests — logged in user
exports.getMyRequests = async (req, res) => {
  try {
    const issues = await Issue.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Equipment, attributes: ['id', 'name', 'condition'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.json({ success: true, data: issues });
  } catch (err) {
    console.error('Get my requests error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch requests' });
  }
};

// get issues by user id — admin and manager
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