const sequelize = require('../config/db');
const User = require('./User');
const Category = require('./Category');
const Location = require('./Location');
const Equipment = require('./Equipment');
const Issue = require('./Issue');
const Maintenance = require('./Maintenance');
const Alert = require('./Alert');

// Category → Equipment
Category.hasMany(Equipment, { foreignKey: 'categoryId', onDelete: 'SET NULL' });
Equipment.belongsTo(Category, { foreignKey: 'categoryId' });

// Location → Equipment
Location.hasMany(Equipment, { foreignKey: 'locationId', onDelete: 'SET NULL' });
Equipment.belongsTo(Location, { foreignKey: 'locationId' });

// Equipment → Issue
Equipment.hasMany(Issue, { foreignKey: 'equipmentId' });
Issue.belongsTo(Equipment, { foreignKey: 'equipmentId' });

// User → Issue
User.hasMany(Issue, { foreignKey: 'userId' });
Issue.belongsTo(User, { foreignKey: 'userId' });

// Equipment → Maintenance
Equipment.hasMany(Maintenance, { foreignKey: 'equipmentId' });
Maintenance.belongsTo(Equipment, { foreignKey: 'equipmentId' });

// User → Maintenance
User.hasMany(Maintenance, { foreignKey: 'technicianId', as: 'technician' });
Maintenance.belongsTo(User, { foreignKey: 'technicianId', as: 'technician' });

// Equipment → Alert
Equipment.hasMany(Alert, { foreignKey: 'equipmentId' });
Alert.belongsTo(Equipment, { foreignKey: 'equipmentId' });

module.exports = {
  sequelize,
  User,
  Category,
  Location,
  Equipment,
  Issue,
  Maintenance,
  Alert,
};