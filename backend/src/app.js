const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

// Importimi i rrugëve (routes)
const authRoutes = require('./routes/auth.routes');
const announcementsRoutes = require('./routes/announcements.routes');
const schedulesRoutes = require('./routes/schedules.routes');
const assignmentsRoutes = require('./routes/assignments.routes');
const submissionsRoutes = require('./routes/submissions.routes');
const roomsRoutes = require('./routes/rooms.routes');
const bookingsRoutes = require('./routes/bookings.routes');
const statsRoutes = require('./routes/stats.routes');

const app = express();

// Konfigurimi i Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Shërbimi i file-ve të ngarkuar (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rruga kryesore (Healthcheck / Welcome për Render)
app.get('/', (req, res) => {
  res.json({ message: 'SMARTCAMPUS API v1.0' });
});

app.get('/api', (req, res) => {
  res.json({ message: 'SMARTCAMPUS API v1.0' });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'SMARTCAMPUS API v1.0'
  });
});

// Lidhja e rrugëve të API-së
app.use('/api/auth', authRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/schedules', schedulesRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/submissions', submissionsRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/stats', statsRoutes);

// Menaxhimi i rrugëve të panjohura (404)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Rruga '${req.originalUrl}' nuk u gjet në këtë server.`
  });
});

// Middleware qendror për trajtimin e gabimeve
app.use(errorHandler);

module.exports = app;

