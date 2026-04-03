const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Issue = sequelize.define('Issue', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  equipmentId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  issueDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  returnDate: { type: DataTypes.DATE },
  status: { type: DataTypes.ENUM('issued', 'returned'), allowNull: false, defaultValue: 'issued' },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  remarks: { type: DataTypes.STRING },
}, { tableName: 'issues', timestamps: true });

module.exports = Issue;
