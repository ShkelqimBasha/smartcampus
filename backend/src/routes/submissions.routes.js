const express = require('express');
const router = express.Router();
const submissionsController = require('../controllers/submissions.controller');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');
const upload = require('../utils/upload');

// Marrja e dorëzimeve të studentit aktual
router.get('/my', authenticate, authorizeRoles('STUDENT'), submissionsController.getMySubmissions);

// Dorëzimi i detyrës me opsion për ngarkim file (STUDENT)
router.post(
  '/:assignmentId',
  authenticate,
  authorizeRoles('STUDENT'),
  upload.single('file'),
  submissionsController.submitAssignment
);

// Vlerësimi i detyrës (PROFESSOR / ADMIN)
router.put('/:id/grade', authenticate, authorizeRoles('PROFESSOR', 'ADMIN'), submissionsController.gradeSubmission);

module.exports = router;

