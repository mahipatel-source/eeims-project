const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Maintenance = sequelize.define('Maintenance', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  equipmentId: { type: DataTypes.INTEGER, allowNull: false },
  technicianId: { type: DataTypes.INTEGER, allowNull: true },
  scheduledDate: { type: DataTypes.DATE, allowNull: false },
  completedDate: { type: DataTypes.DATE },
  status: { type: DataTypes.ENUM('pending', 'completed', 'overdue'), defaultValue: 'pending' },
  notes: { type: DataTypes.TEXT },
  createdBy: { type: DataTypes.INTEGER, allowNull: true },
  updatedBy: { type: DataTypes.INTEGER, allowNull: true },
  deletedBy: { type: DataTypes.INTEGER, allowNull: true },
}, { tableName: 'maintenances', timestamps: true, paranoid: true });

module.exports = Maintenance;