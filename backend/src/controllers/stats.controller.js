const prisma = require('../prisma');

// Statistika të përgjithshme për panelin e administratorit (FR-17, US-15)
const getStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      studentCount,
      professorCount,
      adminCount,
      totalAnnouncements,
      totalAssignments,
      totalSubmissions,
      gradedSubmissions,
      totalRooms,
      totalBookings,
      pendingBookings,
      approvedBookings,
      rejectedBookings,
      roomsWithBookings
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'PROFESSOR' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.announcement.count(),
      prisma.assignment.count(),
      prisma.submission.count(),
      prisma.submission.count({ where: { status: 'GRADED' } }),
      prisma.room.count(),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'PENDING' } }),
      prisma.booking.count({ where: { status: 'APPROVED' } }),
      prisma.booking.count({ where: { status: 'REJECTED' } }),
      prisma.room.findMany({
        select: {
          name: true,
          _count: {
            select: { bookings: true }
          }
        }
      })
    ]);

    // Dorëzimet sipas statusit
    const submittedCount = await prisma.submission.count({ where: { status: 'SUBMITTED' } });
    const lateCount = await prisma.submission.count({ where: { status: 'LATE' } });

    return res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          students: studentCount,
          professors: professorCount,
          admins: adminCount
        },
        announcements: {
          total: totalAnnouncements
        },
        assignments: {
          total: totalAssignments,
          submissions: totalSubmissions,
          graded: gradedSubmissions,
          submitted: submittedCount,
          late: lateCount
        },
        rooms: {
          total: totalRooms,
          bookings: {
            total: totalBookings,
            pending: pendingBookings,
            approved: approvedBookings,
            rejected: rejectedBookings
          },
          byRoom: roomsWithBookings.map(r => ({
            name: r.name,
            count: r._count.bookings
          }))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats
};

