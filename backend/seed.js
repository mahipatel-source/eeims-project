const bcrypt = require('bcryptjs');
const db = require('./models');
const { User, Equipment, Category, Location, Maintenance, Alert, Issue } = require('./models');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');

    // Check if admin already exists (seed from .env)
    const adminExists = await User.findOne({ where: { email: 'admin@eeims.com' } });
    if (adminExists) {
      console.log('✅ Database already seeded. Exiting...');
      process.exit(0);
    }

    // Create categories
    const categories = await Category.bulkCreate([
      { name: 'Computer Hardware', description: 'Desktop and laptop equipment' },
      { name: 'Networking', description: 'Network equipment and devices' },
      { name: 'Peripherals', description: 'Input/Output devices' },
      { name: 'Power Equipment', description: 'UPS and power distribution' }
    ]);
    console.log('✅ Created 4 categories');

    // Create locations
    const locations = await Location.bulkCreate([
      { name: 'Server Room A', description: 'Main server room' },
      { name: 'Office Floor 1', description: 'First floor office area' },
      { name: 'Office Floor 2', description: 'Second floor office area' },
      { name: 'Warehouse', description: 'Equipment storage warehouse' }
    ]);
    console.log('✅ Created 4 locations');

    // Get admin user (seeded from .env: admin@eeims.com / Admin@123)
    let admin = await User.findOne({ where: { email: 'admin@eeims.com' } });
    if (!admin) {
      admin = await User.create({
        name: 'System Admin',
        email: 'admin@eeims.com',
        password: await bcrypt.hash('Admin@123', 10),
        role: 'admin'
      });
    }

    // Get manager user (manager@eeims.com / Manager@123)
    let manager = await User.findOne({ where: { email: 'manager@eeims.com' } });
    if (!manager) {
      manager = await User.create({
        name: 'Manager User',
        email: 'manager@eeims.com',
        password: await bcrypt.hash('Manager@123', 10),
        role: 'manager'
      });
    }

    // Get technician user (tech@eeims.com / Tech@123)
    let technician = await User.findOne({ where: { email: 'tech@eeims.com' } });
    if (!technician) {
      technician = await User.create({
        name: 'John Technician',
        email: 'tech@eeims.com',
        password: await bcrypt.hash('Tech@123', 10),
        role: 'technician'
      });
    }

    // Create equipment
    const equipment = await Equipment.bulkCreate([
      {
        name: 'Dell Desktop PC',
        categoryId: categories[0].id,
        locationId: locations[0].id,
        serialNumber: 'DELL-001',
        purchaseDate: new Date('2023-01-15'),
        currentStock: 3,
        minimumStock: 2,
        condition: 'good',
        notes: 'Main office desktop computer'
      },
      {
        name: 'Cisco Router',
        categoryId: categories[1].id,
        locationId: locations[1].id,
        serialNumber: 'CISCO-001',
        purchaseDate: new Date('2022-06-20'),
        currentStock: 1,
        minimumStock: 1,
        condition: 'good',
        notes: 'Network router for office'
      },
      {
        name: 'HP Printer',
        categoryId: categories[2].id,
        locationId: locations[1].id,
        serialNumber: 'HP-001',
        purchaseDate: new Date('2023-03-10'),
        currentStock: 1,
        minimumStock: 2,
        condition: 'fair',
        notes: 'Office laser printer - low on stock'
      },
      {
        name: 'UPS Battery System',
        categoryId: categories[3].id,
        locationId: locations[0].id,
        serialNumber: 'UPS-001',
        purchaseDate: new Date('2022-11-01'),
        currentStock: 2,
        minimumStock: 2,
        condition: 'good',
        notes: 'Power backup system'
      },
      {
        name: 'Logitech Keyboard',
        categoryId: categories[2].id,
        locationId: locations[3].id,
        serialNumber: 'LOG-001',
        purchaseDate: new Date('2023-02-14'),
        currentStock: 0,
        minimumStock: 5,
        condition: 'good',
        notes: 'Wireless keyboard - critically low'
      }
    ]);
    console.log('✅ Created 5 equipment items');

    // Create maintenance records
    const maintenance = await Maintenance.bulkCreate([
      {
        equipmentId: equipment[0].id,
        technicianId: technician.id,
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: 'pending',
        notes: 'Regular maintenance check',
        createdBy: 1
      },
      {
        equipmentId: equipment[1].id,
        technicianId: technician.id,
        scheduledDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        completedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        status: 'completed',
        notes: 'Firmware update completed',
        createdBy: 1
      },
      {
        equipmentId: equipment[2].id,
        technicianId: technician.id,
        scheduledDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        status: 'overdue',
        notes: 'Toner replacement needed',
        createdBy: 1
      },
      {
        equipmentId: equipment[3].id,
        technicianId: technician.id,
        scheduledDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        status: 'pending',
        notes: 'Battery health check',
        createdBy: 1
      }
    ]);
    console.log('✅ Created 4 maintenance records');

    // Create alerts
    const alerts = await Alert.bulkCreate([
      {
        type: 'low_stock',
        message: 'HP Printer stock is below minimum (1/2)',
        equipmentId: equipment[2].id,
        isRead: false,
        createdBy: 1
      },
      {
        type: 'low_stock',
        message: 'Logitech Keyboard stock critically low (0/5)',
        equipmentId: equipment[4].id,
        isRead: false,
        createdBy: 1
      },
      {
        type: 'maintenance_due',
        message: 'Maintenance overdue for Cisco Router',
        equipmentId: equipment[1].id,
        isRead: false,
        createdBy: 1
      },
      {
        type: 'maintenance_due',
        message: 'Scheduled maintenance coming up for Dell Desktop PC',
        equipmentId: equipment[0].id,
        isRead: true,
        createdBy: 1
      },
      {
        type: 'general',
        message: 'System backup completed successfully',
        isRead: true,
        createdBy: 1
      }
    ]);
    console.log('✅ Created 5 alerts');

    // Create issues
    const issues = await Issue.bulkCreate([
      {
        equipmentId: equipment[0].id,
        description: 'Monitor not turning on - possible hardware issue',
        severity: 'high',
        status: 'open',
        reportedDate: new Date(),
        createdBy: 1
      },
      {
        equipmentId: equipment[2].id,
        description: 'Printer paper jam in tray 2',
        severity: 'medium',
        status: 'resolved',
        reportedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        createdBy: 1
      },
      {
        equipmentId: equipment[1].id,
        description: 'Network connectivity intermittent',
        severity: 'high',
        status: 'open',
        reportedDate: new Date(),
        createdBy: 1
      }
    ]);
    console.log('✅ Created 3 issues');

    console.log('\n✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

// Run seed
seedDatabase();
