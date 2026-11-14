const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookings.controller');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

// Të gjithë përdoruesit e autentikuar mund të listojnë dhe kërkojnë rezervim
router.get('/', authenticate, bookingsController.getBookings);
router.post('/', authenticate, bookingsController.createBooking);

// Vetëm ADMIN mund të miratojë ose refuzojë rezervime
router.put('/:id/approve', authenticate, authorizeRoles('ADMIN'), bookingsController.approveBooking);
router.put('/:id/reject', authenticate, authorizeRoles('ADMIN'), bookingsController.rejectBooking);

module.exports = router;

