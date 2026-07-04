require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const db = require('./db/database'); // Ensure db is initialized

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend connection
app.use(cors({
  origin: '*', // For demo simplicity; in production restrict to frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Main router
app.use('/api', apiRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '서버 내부 오류가 발생했습니다.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
