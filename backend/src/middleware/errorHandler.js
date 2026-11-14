// Middleware për menaxhimin e të gjitha gabimeve të aplikacionit (NFR-09)
const errorHandler = (err, req, res, next) => {
  console.error('Gabim i kapur nga errorHandler:', err);

  // Gabime nga Multer për madhësinë e file-ve
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'Madhësia e skedarit tejkalon limitin maksimal të lejuar (15MB).'
    });
  }

  // Gabime nga Prisma për çelësa unikë
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: 'Ky regjistrim tashmë ekziston me këto të dhëna unike.'
    });
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Ndodhi një gabim i papritur në server.'
  });
};

module.exports = errorHandler;

