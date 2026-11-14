const prisma = require('../prisma');

// Marrja e rezervimeve (FR-14)
const getBookings = async (req, res, next) => {
  try {
    const user = req.user;
    const { status, roomId, myOnly } = req.query;

    let where = {};

    if (myOnly === 'true' || user.role === 'STUDENT') {
      // Nëse kërkohen vetëm rezervimet e mia ose është student dhe dëshiron t'i menaxhojë
      if (myOnly === 'true') {
        where.userId = user.id;
      }
    }

    if (status) where.status = status;
    if (roomId) where.roomId = roomId;

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        room: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    return res.json({
      success: true,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

// Krijimi i një rezervimi me kontroll konflikti orari (FR-14, FR-15, US-13)
const createBooking = async (req, res, next) => {
  try {
    const { roomId, date, startTime, endTime, purpose } = req.body;

    if (!roomId || !date || !startTime || !endTime || !purpose) {
      return res.status(400).json({
        success: false,
        message: 'Të gjitha fushat janë të detyrueshme (salla, data, ora e fillimit, ora e mbarimit, qëllimi).'
      });
    }

    // Validim i orarit: startTime duhet të jetë para endTime
    if (startTime >= endTime) {
      return res.status(400).json({
        success: false,
        message: 'Ora e fillimit duhet të jetë më e hershme se ora e mbarimit.'
      });
    }

    // Normalizimi i datës (fillimi i ditës deri në fund të ditës)
    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Data e rezervimit është e pasaktë.'
      });
    }

    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Kërko rezervimet ekzistuese aktive (PENDING ose APPROVED) për këtë sallë dhe këtë datë
    const existingBookings = await prisma.booking.findMany({
      where: {
        roomId,
        date: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: { in: ['PENDING', 'APPROVED'] }
      }
    });

    // Kontrolli i mbivendosjes së orarit (FR-15)
    // Mbivendosja ndodh nëse: (startTime < existing.endTime && endTime > existing.startTime)
    const conflict = existingBookings.find(existing => {
      return startTime < existing.endTime && endTime > existing.startTime;
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: `Konflikt orari! Salla është tashmë e zënë ose në shqyrtim (${conflict.startTime} - ${conflict.endTime}) për këtë datë.`
      });
    }

    const newBooking = await prisma.booking.create({
      data: {
        roomId,
        userId: req.user.id,
        date: bookingDate,
        startTime,
        endTime,
        purpose,
        status: 'PENDING'
      },
      include: {
        room: true,
        user: {
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
      message: 'Kërkesa për rezervim u dërgua me sukses dhe është në pritje të miratimit!',
      booking: newBooking
    });
  } catch (error) {
    next(error);
  }
};

// Miratimi i një rezervimi nga Admini (FR-16, US-14)
const approveBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Rezervimi nuk u gjet.'
      });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: 'APPROVED' },
      include: {
        room: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    return res.json({
      success: true,
      message: 'Rezervimi u miratua me sukses.',
      booking: updated
    });
  } catch (error) {
    next(error);
  }
};

// Refuzimi i një rezervimi nga Admini (FR-16, US-14)
const rejectBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Rezervimi nuk u gjet.'
      });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: 'REJECTED' },
      include: {
        room: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    return res.json({
      success: true,
      message: 'Rezervimi u refuzua.',
      booking: updated
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBookings,
  createBooking,
  approveBooking,
  rejectBooking
};

