// Middleware për kontroll aksesi sipas rolit (RBAC - FR-03, NFR-05)
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Nuk keni leje të mjaftueshme për të kryer këtë veprim.'
      });
    }
    next();
  };
};

module.exports = { authorizeRoles };

