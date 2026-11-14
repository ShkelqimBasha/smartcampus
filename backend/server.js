require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 SMARTCAMPUS Backend po ekzekutohet në portën ${PORT}`);
  console.log(`📡 URL e API: http://localhost:${PORT}/api`);
  console.log(`🌍 Mjedisi: ${process.env.NODE_ENV || 'development'}`);
  console.log(`===============================================`);
});

