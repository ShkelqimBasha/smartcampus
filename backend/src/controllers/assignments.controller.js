const prisma = require('../prisma');

// Marrja e listës së detyrave (FR-10)
const getAssignments = async (req, res, next) => {
  try {
    const user = req.user;
    let where = {};

    if (user.role === 'STUDENT') {
      const orConditions = [];
      if (user.faculty && user.group) {
        orConditions.push({
          faculty: user.faculty,
          group: user.group
        });
      }
      if (user.faculty && !user.group) {
        orConditions.push({ faculty: user.faculty });
      }
      if (orConditions.length > 0) {
        where = { OR: orConditions };
      }
    } else if (user.role === 'PROFESSOR') {
      // Pedagogu sheh detyrat e krijuara prej tij ose të gjitha
      const { all } = req.query;
      if (all !== 'true') {
        where.professorId = user.id;
      }
    }

    const assignments = await prisma.assignment.findMany({
      where,
      include: {
        professor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        submissions: user.role === 'STUDENT'
          ? {
              where: { studentId: user.id },
              select: {
                id: true,
                status: true,
                grade: true,
                feedback: true,
                submittedAt: true,
                fileUrl: true
              }
            }
          : {
              select: {
                id: true,
                status: true,
                grade: true,
                submittedAt: true
              }
            }
      },
      orderBy: { deadline: 'asc' }
    });

    const formatted = assignments.map(a => ({
      ...a,
      mySubmission: user.role === 'STUDENT' && a.submissions.length > 0 ? a.submissions[0] : null,
      submissionsCount: a.submissions.length
    }));

    return res.json({
      success: true,
      assignments: formatted
    });
  } catch (error) {
    next(error);
  }
};

// Marrja e detajeve të një detyre (FR-10, FR-13)
const getAssignmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        professor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        submissions: {
          where: user.role === 'STUDENT' ? { studentId: user.id } : undefined,
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                faculty: true,
                group: true
              }
            }
          },
          orderBy: { submittedAt: 'desc' }
        }
      }
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Detyra nuk u gjet.'
      });
    }

    return res.json({
      success: true,
      assignment
    });
  } catch (error) {
    next(error);
  }
};

// Krijimi i një detyre të re (FR-10, US-10)
const createAssignment = async (req, res, next) => {
  try {
    const { title, description, deadline, faculty, group } = req.body;

    if (!title || !description || !deadline || !faculty || !group) {
      return res.status(400).json({
        success: false,
        message: 'Të gjitha fushat janë të detyrueshme (titulli, përshkrimi, afati, fakulteti, grupi).'
      });
    }

    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Formati i datës së afatit është i pavlefshëm.'
      });
    }

    const newAssignment = await prisma.assignment.create({
      data: {
        title,
        description,
        deadline: deadlineDate,
        faculty,
        group,
        professorId: req.user.id
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
      message: 'Detyra u krijua me sukses!',
      assignment: newAssignment
    });
  } catch (error) {
    next(error);
  }
};

// Fshirja e një detyre
const deleteAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const assignment = await prisma.assignment.findUnique({ where: { id } });
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Detyra nuk u gjet.'
      });
    }

    if (req.user.role !== 'ADMIN' && assignment.professorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Nuk keni të drejtë të fshini këtë detyrë.'
      });
    }

    // Fshi dorëzimet e lidhura
    await prisma.submission.deleteMany({
      where: { assignmentId: id }
    });

    await prisma.assignment.delete({
      where: { id }
    });

    return res.json({
      success: true,
      message: 'Detyra dhe të gjitha dorëzimet e saj u fshinë me sukses.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssignments,
  getAssignmentById,
  createAssignment,
  deleteAssignment
};

