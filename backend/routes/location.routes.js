const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

// get all locations — all roles
router.get('/', authenticate, locationController.getAllLocations);

// get single location — all roles
router.get('/:id', authenticate, locationController.getLocationById);

// create location — admin and manager
router.post('/', authenticate, authorizeRoles('admin', 'manager'), locationController.createLocation);

// update location — admin and manager
router.put('/:id', authenticate, authorizeRoles('admin', 'manager'), locationController.updateLocation);

// delete location — admin and manager
router.delete('/:id', authenticate, authorizeRoles('admin', 'manager'), locationController.deleteLocation);

module.exports = router;