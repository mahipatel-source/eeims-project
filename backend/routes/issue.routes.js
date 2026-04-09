const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issue.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

// get all issues — admin and manager
router.get('/', authenticate, authorizeRoles('admin', 'manager'), issueController.getAllIssues);

// get pending requests — admin and manager
router.get('/pending', authenticate, authorizeRoles('admin', 'manager'), issueController.getPendingRequests);

// get my requests — logged in user
router.get('/my-requests', authenticate, issueController.getMyRequests);

// get issues by user — admin and manager
router.get('/user/:userId', authenticate, authorizeRoles('admin', 'manager'), issueController.getIssuesByUser);

// get single issue
router.get('/:id', authenticate, issueController.getIssueById);

// user requests equipment
router.post('/request', authenticate, issueController.requestEquipment);

// manager directly issues equipment without approval
router.post('/direct', authenticate, authorizeRoles('admin', 'manager'), issueController.directIssue);

// approve request — admin and manager
router.put('/:id/approve', authenticate, authorizeRoles('admin', 'manager'), issueController.approveRequest);

// reject request — admin and manager
router.put('/:id/reject', authenticate, authorizeRoles('admin', 'manager'), issueController.rejectRequest);

// return equipment
router.put('/:id/return', authenticate, issueController.returnIssue);

module.exports = router;