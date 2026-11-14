const express = require('express');
const router = express.Router();
const announcementsController = require('../controllers/announcements.controller');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

// Të gjithë përdoruesit e autentikuar mund të shohin njoftimet e tyre
router.get('/', authenticate, announcementsController.getAnnouncements);

// Vetëm PROFESSOR dhe ADMIN mund të krijojnë njoftime
router.post('/', authenticate, authorizeRoles('PROFESSOR', 'ADMIN'), announcementsController.createAnnouncement);

// Shënimi si i lexuar (studentët/çdo përdorues)
router.put('/:id/read', authenticate, announcementsController.markAsRead);

// Fshirja e njoftimit (vetëm ADMIN)
router.delete('/:id', authenticate, authorizeRoles('ADMIN'), announcementsController.deleteAnnouncement);

module.exports = router;

