const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

// Rrugët publike
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rrugët e mbrojtura
router.get('/me', authenticate, authController.getMe);

// Rrugët administrative për përdoruesit
router.get('/users', authenticate, authorizeRoles('ADMIN'), authController.getAllUsers);
router.put('/users/:id/role', authenticate, authorizeRoles('ADMIN'), authController.updateUserRole);
router.put('/users/:id/status', authenticate, authorizeRoles('ADMIN'), authController.toggleUserStatus);

module.exports = router;

