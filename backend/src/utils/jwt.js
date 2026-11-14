const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_change_in_production_12345';

// Gjeneron JWT token me afat skadence 24 orë (NFR-04)
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      faculty: user.faculty,
      group: user.group
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Verifikon JWT token
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken
};

