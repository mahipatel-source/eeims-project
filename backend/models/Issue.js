const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Issue = sequelize.define('Issue', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  equipmentId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: true },
  issueDate: { type: DataTypes.DATE, allowNull: true },
  returnDate: { type: DataTypes.DATE },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'issued', 'returned'),
    allowNull: false,
    defaultValue: 'pending',
  },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  requestedReturnDate: { type: DataTypes.DATE },
  remarks: { type: DataTypes.TEXT },
  createdBy: { type: DataTypes.INTEGER, allowNull: true },
  updatedBy: { type: DataTypes.INTEGER, allowNull: true },
  deletedBy: { type: DataTypes.INTEGER, allowNull: true },
}, { tableName: 'issues', timestamps: true, paranoid: true });

module.exports = Issue;