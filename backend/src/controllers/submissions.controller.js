const prisma = require('../prisma');

// Dorëzimi i një detyre nga studenti (FR-11, FR-12, US-11)
const submitAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const { content } = req.body;
    const studentId = req.user.id;

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId }
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Detyra nuk u gjet.'
      });
    }

    let fileUrl = null;
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    }

    if (!fileUrl && (!content || content.trim() === '')) {
      return res.status(400).json({
        success: false,
        message: 'Ju lutem ngarkoni një skedar ose shkruani përmbajtjen e detyrës.'
      });
    }

    // Përcaktimi i statusit nëse është në kohë apo i vonuar (FR-12)
    const isLate = new Date() > new Date(assignment.deadline);
    const initialStatus = isLate ? 'LATE' : 'SUBMITTED';

    // Upsert: nëse studenti ridorëzon detyrën
    const submission = await prisma.submission.upsert({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId
        }
      },
      update: {
        fileUrl: fileUrl || undefined,
        content: content || undefined,
        status: initialStatus,
        submittedAt: new Date()
      },
      create: {
        assignmentId,
        studentId,
        fileUrl,
        content,
        status: initialStatus,
        submittedAt: new Date()
      }
    });

    return res.status(201).json({
      success: true,
      message: isLate ? 'Detyra u dorëzua me vonesë.' : 'Detyra u dorëzua me sukses në kohë!',
      submission
    });
  } catch (error) {
    next(error);
  }
};

// Vlerësimi i dorëzimit nga profesori (FR-12, FR-13, US-12)
const gradeSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { grade, feedback } = req.body;

    if (grade === undefined || grade === null) {
      return res.status(400).json({
        success: false,
        message: 'Nota është e detyrueshme.'
      });
    }

    const numericGrade = parseFloat(grade);
    if (isNaN(numericGrade) || numericGrade < 0 || numericGrade > 100) {
      return res.status(400).json({
        success: false,
        message: 'Nota duhet të jetë një numër i vlefshëm midis 0 dhe 100.'
      });
    }

    const submission = await prisma.submission.findUnique({
      where: { id },
      include: { assignment: true }
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Dorëzimi nuk u gjet.'
      });
    }

    // Vetëm admini ose profesori i lëndës
    if (req.user.role !== 'ADMIN' && submission.assignment.professorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Nuk keni të drejtë të vlerësoni këtë dorëzim.'
      });
    }

    const updated = await prisma.submission.update({
      where: { id },
      data: {
        grade: numericGrade,
        feedback: feedback || null,
        status: 'GRADED'
      }
    });

    return res.json({
      success: true,
      message: 'Vlerësimi u ruajt me sukses!',
      submission: updated
    });
  } catch (error) {
    next(error);
  }
};

// Marrja e dorëzimeve personale të studentit
const getMySubmissions = async (req, res, next) => {
  try {
    const submissions = await prisma.submission.findMany({
      where: { studentId: req.user.id },
      include: {
        assignment: {
          include: {
            professor: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: { submittedAt: 'desc' }
    });

    return res.json({
      success: true,
      submissions
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitAssignment,
  gradeSubmission,
  getMySubmissions
};

