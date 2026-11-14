const express = require('express');
const router = express.Router();
const assignmentsController = require('../controllers/assignments.controller');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

router.get('/', authenticate, assignmentsController.getAssignments);
router.get('/:id', authenticate, assignmentsController.getAssignmentById);
router.post('/', authenticate, authorizeRoles('PROFESSOR', 'ADMIN'), assignmentsController.createAssignment);
router.delete('/:id', authenticate, authorizeRoles('PROFESSOR', 'ADMIN'), assignmentsController.deleteAssignment);

module.exports = router;

