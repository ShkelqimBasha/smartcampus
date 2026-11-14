const express = require('express');
const router = express.Router();
const schedulesController = require('../controllers/schedules.controller');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

// Të gjithë përdoruesit e autentikuar mund të konsultojnë oraret
router.get('/', authenticate, schedulesController.getSchedules);

// Krijimi i orarit nga PROFESSOR ose ADMIN
router.post('/', authenticate, authorizeRoles('PROFESSOR', 'ADMIN'), schedulesController.createSchedule);

// Përditësimi i orarit
router.put('/:id', authenticate, authorizeRoles('PROFESSOR', 'ADMIN'), schedulesController.updateSchedule);

// Fshirja e orarit
router.delete('/:id', authenticate, authorizeRoles('PROFESSOR', 'ADMIN'), schedulesController.deleteSchedule);

module.exports = router;

