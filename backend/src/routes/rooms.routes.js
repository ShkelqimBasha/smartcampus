const express = require('express');
const router = express.Router();
const roomsController = require('../controllers/rooms.controller');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

router.get('/', authenticate, roomsController.getRooms);
router.post('/', authenticate, authorizeRoles('ADMIN'), roomsController.createRoom);

module.exports = router;

