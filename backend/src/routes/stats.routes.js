const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

// Vetëm ADMIN mund të shohë statistikat e plota
router.get('/', authenticate, authorizeRoles('ADMIN'), statsController.getStats);

module.exports = router;

