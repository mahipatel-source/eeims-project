const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

// get all locations — all roles
router.get('/', authenticate, locationController.getAllLocations);

// get single location — all roles
router.get('/:id', authenticate, locationController.getLocationById);

// create location — admin only
router.post('/', authenticate, authorizeRoles('admin'), locationController.createLocation);

// update location — admin only
router.put('/:id', authenticate, authorizeRoles('admin'), locationController.updateLocation);

// delete location — admin only
router.delete('/:id', authenticate, authorizeRoles('admin'), locationController.deleteLocation);

module.exports = router;