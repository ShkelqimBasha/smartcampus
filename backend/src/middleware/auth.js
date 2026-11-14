const { verifyToken } = require('../utils/jwt');
const prisma = require('../prisma');

// Middleware për verifikimin e JWT token dhe përdoruesit aktiv
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Akses i paautorizuar! Ju lutem kyçuni për të vazhduar.'
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Sesioni ka skaduar ose token-i është i pavlefshëm. Ju lutem kyçuni përsëri.'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Përdoruesi nuk ekziston ose llogaria është çaktivizuar.'
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      faculty: user.faculty,
      group: user.group
    };

    next();
  } catch (error) {
    console.error('Gabim në autentikim:', error);
    return res.status(500).json({
      success: false,
      message: 'Ndodhi një gabim gjatë autentikimit të kërkesës.'
    });
  }
};

module.exports = { authenticate };

