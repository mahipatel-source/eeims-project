const cron = require('node-cron');
const { Equipment, Alert } = require('../models');
const { Op } = require('sequelize');
const sendEmail = require('./sendEmail');

// run every day at 8:00 AM
const startLowStockChecker = () => {
  cron.schedule('0 8 * * *', async () => {
    console.log('🔍 Running low stock checker...');

    try {
      const { sequelize } = require('../models');

      // find all equipment below minimum stock
      const lowStockItems = await Equipment.findAll({
        where: sequelize.where(
          sequelize.col('quantity'),
          { [Op.lte]: sequelize.col('minimumStock') }
        ),
      });

      for (const item of lowStockItems) {
        // check if unread alert already exists
        const existingAlert = await Alert.findOne({
          where: { equipmentId: item.id, type: 'low_stock', isRead: false },
        });

        if (!existingAlert) {
          // create new alert
          await Alert.create({
            type: 'low_stock',
            message: `Low stock alert: ${item.name} has only ${item.quantity} units remaining (minimum: ${item.minimumStock})`,
            equipmentId: item.id,
          });

          // send email to admin
          await sendEmail(
            process.env.ADMIN_EMAIL,
            'Low Stock Alert — EEIMS',
            `Equipment <strong>${item.name}</strong> has only <strong>${item.quantity}</strong> units remaining. Minimum stock level is ${item.minimumStock}.`
          );
        }
      }

      // mark alerts as resolved for equipment that now has sufficient stock
      const sufficientStockItems = await Equipment.findAll({
        where: sequelize.where(
          sequelize.col('quantity'),
          { [Op.gt]: sequelize.col('minimumStock') }
        ),
      });

      for (const item of sufficientStockItems) {
        await Alert.update(
          { isRead: true },
          {
            where: {
              equipmentId: item.id,
              type: 'low_stock',
              isRead: false,
            },
          }
        );
      }

      console.log(`✅ Low stock check completed — ${lowStockItems.length} items below minimum, ${sufficientStockItems.length} items resolved`);
    } catch (err) {
      console.error('❌ Low stock checker error:', err);
    }
  });
};

module.exports = startLowStockChecker;