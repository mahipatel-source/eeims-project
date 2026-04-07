require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

// routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const equipmentRoutes = require('./routes/equipment.routes');
const categoryRoutes = require('./routes/category.routes');
const locationRoutes = require('./routes/location.routes');
const issueRoutes = require('./routes/issue.routes');
const maintenanceRoutes = require('./routes/maintenance.routes');
const alertRoutes = require('./routes/alert.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const reportRoutes = require('./routes/report.routes');
const startLowStockChecker = require('./utils/lowStockChecker');
const startMaintenanceChecker = require('./utils/maintenanceChecker');

// error middleware
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// health check
app.get('/', (req, res) => {
  res.json({ message: 'EEIMS backend is running' });
});

// api routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// global error handler
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

// database connection and server start
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);

    // start cron jobs
    startLowStockChecker();
    startMaintenanceChecker();
    console.log('⏰ Cron jobs started');
  });
})
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
  });