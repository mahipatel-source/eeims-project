const axios = require('axios');

async function testAPI() {
  try {
    console.log('🔐 Logging in...');
    
    // Login first to get token
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@example.com',
      password: 'password123'
    });

    const token = loginRes.data.data.token;
    console.log('✅ Logged in, token:', token.substring(0, 20) + '...');

    // Test alerts endpoint
    console.log('\n📋 Testing /api/alerts...');
    const alertsRes = await axios.get('http://localhost:5000/api/alerts', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Alerts Response:', JSON.stringify(alertsRes.data, null, 2));

    // Test maintenance endpoint
    console.log('\n🔧 Testing /api/maintenance...');
    const maintenanceRes = await axios.get('http://localhost:5000/api/maintenance', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Maintenance Response:', JSON.stringify(maintenanceRes.data, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

testAPI();
