const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issue.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

// get all issues — admin and manager
router.get('/', authenticate, authorizeRoles('admin', 'manager'), issueController.getAllIssues);

// get issues by user — admin and manager
router.get('/user/:userId', authenticate, authorizeRoles('admin', 'manager'), issueController.getIssuesByUser);

// get single issue
router.get('/:id', authenticate, authorizeRoles('admin', 'manager'), issueController.getIssueById);

// create issue — admin and manager
router.post('/', authenticate, authorizeRoles('admin', 'manager'), issueController.createIssue);

// return equipment — admin and manager
router.put('/:id/return', authenticate, authorizeRoles('admin', 'manager'), issueController.returnIssue);

module.exports = router;