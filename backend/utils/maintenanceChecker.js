const cron = require('node-cron');
const { Maintenance, Equipment, User } = require('../models');
const { Op } = require('sequelize');
const sendEmail = require('./sendEmail');

// run every day at 9:00 AM
const startMaintenanceChecker = () => {
  cron.schedule('0 9 * * *', async () => {
    console.log('🔍 Running maintenance checker...');

    try {
      const today = new Date();
      const threeDaysLater = new Date();
      threeDaysLater.setDate(today.getDate() + 3);

      // find maintenance due in next 3 days
      const dueMaintenance = await Maintenance.findAll({
        where: {
          status: 'pending',
          scheduledDate: { [Op.between]: [today, threeDaysLater] },
        },
        include: [
          { model: Equipment, attributes: ['id', 'name'] },
          { model: User, as: 'technician', attributes: ['id', 'name', 'email'] },
        ],
      });

      for (const record of dueMaintenance) {
        // send email to technician
        await sendEmail(
          record.technician.email,
          'Maintenance Due Soon — EEIMS',
          `You have a maintenance scheduled for <strong>${record.Equipment.name}</strong> on <strong>${record.scheduledDate}</strong>. Please make sure to complete it on time.`
        );

        // send email to admin
        await sendEmail(
          process.env.ADMIN_EMAIL,
          'Maintenance Due Soon — EEIMS',
          `Maintenance for <strong>${record.Equipment.name}</strong> is due on <strong>${record.scheduledDate}</strong>. Assigned to ${record.technician.name}.`
        );
      }

      // mark overdue maintenance
      await Maintenance.update(
        { status: 'overdue' },
        {
          where: {
            status: 'pending',
            scheduledDate: { [Op.lt]: today },
          },
        }
      );

      console.log(`✅ Maintenance check completed — ${dueMaintenance.length} upcoming records found`);
    } catch (err) {
      console.error('❌ Maintenance checker error:', err);
    }
  });
};

module.exports = startMaintenanceChecker;