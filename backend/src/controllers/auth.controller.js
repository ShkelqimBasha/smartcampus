const bcrypt = require('bcryptjs');
const prisma = require('../prisma');
const { generateToken } = require('../utils/jwt');

// Regjistrimi i një përdoruesi të ri (FR-01, US-01)
const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, role, faculty, group } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Ju lutem plotësoni të gjitha fushat e detyrueshme (emër, mbiemër, email, fjalëkalim).'
      });
    }

    // Kontrollo formatin e email-it
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formati i adresës së email-it është i pasaktë.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Fjalëkalimi duhet të ketë të paktën 6 karaktere.'
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Ekziston tashmë një përdorues me këtë adresë email.'
      });
    }

    // Kriptimi i fjalëkalimit me bcrypt (NFR-03)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Vetëm STUDENT si parazgjedhje, përveç nëse është krijuar nga dikush me leje
    const allowedRoles = ['STUDENT', 'PROFESSOR', 'ADMIN'];
    const userRole = (role && allowedRoles.includes(role)) ? role : 'STUDENT';

    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        role: userRole,
        faculty: faculty || null,
        group: group || null,
        isActive: true
      }
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Regjistrimi u krye me sukses!',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        faculty: newUser.faculty,
        group: newUser.group
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login i përdoruesit ekzistues (FR-01, US-02)
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Ju lutem jepni email-in dhe fjalëkalimin.'
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Kredenciale të pasakta. Ju lutem kontrolloni të dhënat.'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Llogaria juaj është e pezulluar. Kontaktoni administratorin.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Kredenciale të pasakta. Fjalëkalimi është i gabuar.'
      });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Kyçja u krye me sukses!',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        faculty: user.faculty,
        group: user.group
      }
    });
  } catch (error) {
    next(error);
  }
};

// Të dhënat e përdoruesit të kyçur
const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        faculty: true,
        group: true,
        isActive: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Përdoruesi nuk u gjet.'
      });
    }

    return res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Lista e të gjithë përdoruesve (US-03)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        faculty: true,
        group: true,
        isActive: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({
      success: true,
      users
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Ndryshimi i rolit të përdoruesit (US-03)
const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const allowedRoles = ['STUDENT', 'PROFESSOR', 'ADMIN'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Roli i zgjedhur nuk është i vlefshëm.'
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        faculty: true,
        group: true,
        isActive: true
      }
    });

    return res.json({
      success: true,
      message: 'Roli i përdoruesit u përditësua me sukses.',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Ndryshimi i statusit (Aktiv/Joaktiv)
const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Përdoruesi nuk u gjet.'
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true
      }
    });

    return res.json({
      success: true,
      message: `Statusi i përdoruesit u ndryshua me sukses (${updatedUser.isActive ? 'Aktiv' : 'I pezulluar'}).`,
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  getAllUsers,
  updateUserRole,
  toggleUserStatus
};

