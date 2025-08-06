#!/usr/bin/env node

import fetch from 'node-fetch';

// Test the dashboard API endpoint
async function testDashboardAPI() {
  console.log('🔍 Testing Dashboard API Authentication');
  console.log('=====================================\n');

  try {
    // Test without authentication
    console.log('1. Testing API without authentication:');
    const response1 = await fetch('https://telebot.openplp.com/api/dashboard/stats');
    console.log(`   Status: ${response1.status} ${response1.statusText}`);
    
    if (response1.status === 401) {
      console.log('   ✅ API correctly requires authentication');
    } else {
      const data = await response1.text();
      console.log(`   Response: ${data.substring(0, 200)}...`);
    }

    // Test the health endpoint
    console.log('\n2. Testing health endpoint:');
    const response2 = await fetch('https://telebot.openplp.com/api/health');
    console.log(`   Status: ${response2.status} ${response2.statusText}`);
    
    if (response2.ok) {
      const healthData = await response2.text();
      console.log(`   Response: ${healthData}`);
    }

    // Test login page
    console.log('\n3. Testing login page:');
    const response3 = await fetch('https://telebot.openplp.com/login');
    console.log(`   Status: ${response3.status} ${response3.statusText}`);

  } catch (error) {
    console.error('❌ Error testing API:', error);
  }
}

testDashboardAPI();