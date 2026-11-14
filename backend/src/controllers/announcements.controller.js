const prisma = require('../prisma');

// Marrja e njoftimeve sipas rolit dhe targetimit (FR-05, FR-06, US-06)
const getAnnouncements = async (req, res, next) => {
  try {
    const user = req.user;
    let whereCondition = {};

    // Nëse është student, filtrohen vetëm ato që i përkasin (ALL, FACULTY e tij, ose GROUP i tij)
    if (user.role === 'STUDENT') {
      const orConditions = [{ target: 'ALL' }];

      if (user.faculty) {
        orConditions.push({
          target: 'FACULTY',
          faculty: user.faculty
        });
      }

      if (user.group) {
        orConditions.push({
          target: 'GROUP',
          group: user.group
        });
      }

      whereCondition = { OR: orConditions };
    }

    const announcements = await prisma.announcement.findMany({
      where: whereCondition,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true
          }
        },
        readStatuses: {
          where: { userId: user.id }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Shto flamurin `isRead` për secilin njoftim
    const formatted = announcements.map((item) => ({
      ...item,
      isRead: item.readStatuses && item.readStatuses.length > 0
    }));

    return res.json({
      success: true,
      announcements: formatted
    });
  } catch (error) {
    next(error);
  }
};

// Krijimi i një njoftimi të ri (FR-04, US-04, US-05 - PROFESSOR/ADMIN)
const createAnnouncement = async (req, res, next) => {
  try {
    const { title, content, target, faculty, group } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Titulli dhe përmbajtja e njoftimit janë të detyrueshme.'
      });
    }

    const validTargets = ['ALL', 'FACULTY', 'GROUP'];
    const chosenTarget = validTargets.includes(target) ? target : 'ALL';

    const newAnnouncement = await prisma.announcement.create({
      data: {
        title,
        content,
        target: chosenTarget,
        faculty: chosenTarget === 'FACULTY' ? faculty : null,
        group: chosenTarget === 'GROUP' ? group : null,
        authorId: req.user.id
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true
          }
        }
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Njoftimi u publikua me sukses!',
      announcement: newAnnouncement
    });
  } catch (error) {
    next(error);
  }
};

// Shënimi i njoftimit si i lexuar (FR-07, US-07)
const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const announcement = await prisma.announcement.findUnique({
      where: { id }
    });

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Njoftimi nuk u gjet.'
      });
    }

    await prisma.announcementRead.upsert({
      where: {
        userId_announcementId: {
          userId,
          announcementId: id
        }
      },
      update: {
        readAt: new Date()
      },
      create: {
        userId,
        announcementId: id
      }
    });

    return res.json({
      success: true,
      message: 'Njoftimi u shënua si i lexuar.'
    });
  } catch (error) {
    next(error);
  }
};

// Fshirja e një njoftimi (ADMIN)
const deleteAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Fshi fillimisht statuset e leximit lidhur me këtë njoftim
    await prisma.announcementRead.deleteMany({
      where: { announcementId: id }
    });

    await prisma.announcement.delete({
      where: { id }
    });

    return res.json({
      success: true,
      message: 'Njoftimi u fshi me sukses.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnnouncements,
  createAnnouncement,
  markAsRead,
  deleteAnnouncement
};

