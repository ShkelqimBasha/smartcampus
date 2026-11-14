const prisma = require('../prisma');

// Marrja e orareve (FR-09, US-09)
const getSchedules = async (req, res, next) => {
  try {
    const { faculty, group, dayOfWeek, professorId } = req.query;
    const user = req.user;

    let where = {};

    // Nëse specifikohen query parametra
    if (faculty) where.faculty = faculty;
    if (group) where.group = group;
    if (dayOfWeek) where.dayOfWeek = parseInt(dayOfWeek);
    if (professorId) where.professorId = professorId;

    // Nëse studenti nuk jep parametra, i shfaqim automatikisht orarin e grupit/fakultetit të tij nëse ekziston
    if (user.role === 'STUDENT' && !group && user.group) {
      where.group = user.group;
    }

    const schedules = await prisma.schedule.findMany({
      where,
      include: {
        professor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    });

    return res.json({
      success: true,
      schedules
    });
  } catch (error) {
    next(error);
  }
};

// Krijimi i një orari të ri (FR-08, US-08)
const createSchedule = async (req, res, next) => {
  try {
    const { subject, faculty, group, dayOfWeek, startTime, endTime, room, professorId } = req.body;

    if (!subject || !faculty || !group || dayOfWeek === undefined || !startTime || !endTime || !room) {
      return res.status(400).json({
        success: false,
        message: 'Të gjitha fushat janë të detyrueshme (lënda, fakulteti, grupi, dita, orët, salla).'
      });
    }

    const assignedProfessorId = (req.user.role === 'ADMIN' && professorId) ? professorId : req.user.id;

    const newSchedule = await prisma.schedule.create({
      data: {
        subject,
        faculty,
        group,
        dayOfWeek: parseInt(dayOfWeek),
        startTime,
        endTime,
        room,
        professorId: assignedProfessorId
      },
      include: {
        professor: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Orari u shtua me sukses!',
      schedule: newSchedule
    });
  } catch (error) {
    next(error);
  }
};

// Përditësimi i një orari
const updateSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { subject, faculty, group, dayOfWeek, startTime, endTime, room, professorId } = req.body;

    const schedule = await prisma.schedule.findUnique({ where: { id } });
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Orari nuk u gjet.'
      });
    }

    // Vetëm admini ose profesori që e ka krijuar
    if (req.user.role !== 'ADMIN' && schedule.professorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Nuk keni të drejtë të modifikoni këtë orar.'
      });
    }

    const updated = await prisma.schedule.update({
      where: { id },
      data: {
        subject: subject !== undefined ? subject : schedule.subject,
        faculty: faculty !== undefined ? faculty : schedule.faculty,
        group: group !== undefined ? group : schedule.group,
        dayOfWeek: dayOfWeek !== undefined ? parseInt(dayOfWeek) : schedule.dayOfWeek,
        startTime: startTime !== undefined ? startTime : schedule.startTime,
        endTime: endTime !== undefined ? endTime : schedule.endTime,
        room: room !== undefined ? room : schedule.room,
        professorId: (req.user.role === 'ADMIN' && professorId) ? professorId : schedule.professorId
      },
      include: {
        professor: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    return res.json({
      success: true,
      message: 'Orari u përditësua me sukses.',
      schedule: updated
    });
  } catch (error) {
    next(error);
  }
};

// Fshirja e një orari
const deleteSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;

    const schedule = await prisma.schedule.findUnique({ where: { id } });
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Orari nuk u gjet.'
      });
    }

    if (req.user.role !== 'ADMIN' && schedule.professorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Nuk keni të drejtë të fshini këtë orar.'
      });
    }

    await prisma.schedule.delete({ where: { id } });

    return res.json({
      success: true,
      message: 'Orari u fshi me sukses.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule
};

