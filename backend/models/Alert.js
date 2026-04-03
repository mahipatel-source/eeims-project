const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Alert = sequelize.define('Alert', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  type: { type: DataTypes.ENUM('low_stock', 'maintenance_due', 'general'), defaultValue: 'general' },
  message: { type: DataTypes.STRING, allowNull: false },
  relatedId: { type: DataTypes.INTEGER },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'alerts', timestamps: true });

module.exports = Alert;
