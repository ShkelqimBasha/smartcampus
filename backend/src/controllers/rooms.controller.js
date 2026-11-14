const prisma = require('../prisma');

// Marrja e listës së sallave
const getRooms = async (req, res, next) => {
  try {
    const rooms = await prisma.room.findMany({
      where: { isActive: true },
      include: {
        bookings: {
          where: {
            status: { in: ['APPROVED', 'PENDING'] }
          },
          select: {
            id: true,
            date: true,
            startTime: true,
            endTime: true,
            status: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    return res.json({
      success: true,
      rooms
    });
  } catch (error) {
    next(error);
  }
};

// Krijimi i një salle të re (ADMIN)
const createRoom = async (req, res, next) => {
  try {
    const { name, capacity, building, equipment } = req.body;

    if (!name || !capacity || !building) {
      return res.status(400).json({
        success: false,
        message: 'Emri, kapaciteti dhe ndërtesa janë të detyrueshme.'
      });
    }

    const existingRoom = await prisma.room.findUnique({
      where: { name: name.trim() }
    });

    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: 'Ekziston tashmë një sallë me këtë emër.'
      });
    }

    const newRoom = await prisma.room.create({
      data: {
        name: name.trim(),
        capacity: parseInt(capacity),
        building: building.trim(),
        equipment: equipment ? equipment.trim() : null,
        isActive: true
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Salla u shtua me sukses!',
      room: newRoom
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRooms,
  createRoom
};

