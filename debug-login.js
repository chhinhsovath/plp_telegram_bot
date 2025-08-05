#!/usr/bin/env tsx

import bcrypt from "bcryptjs";
import prisma from "./lib/db";

async function debugLogin() {
  console.log('🔍 Debugging Login Issues');
  console.log('========================\n');

  try {
    // Check if demo users exist
    console.log('1️⃣  Checking demo users in database...');
    const demoEmails = ['admin@demo.com', 'moderator@demo.com', 'viewer@demo.com'];
    
    for (const email of demoEmails) {
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          password: true,
          createdAt: true
        }
      });

      if (user) {
        console.log(`✅ Found user: ${email}`);
        console.log(`   - ID: ${user.id}`);
        console.log(`   - Name: ${user.name}`);
        console.log(`   - Role: ${user.role}`);
        console.log(`   - Has Password: ${user.password ? 'Yes' : 'No'}`);
        console.log(`   - Created: ${user.createdAt}`);

        // Test password verification
        if (user.password) {
          const testPasswords = {
            'admin@demo.com': 'admin123',
            'moderator@demo.com': 'moderator123',
            'viewer@demo.com': 'viewer123'
          };
          
          const expectedPassword = testPasswords[email];
          const isValid = await bcrypt.compare(expectedPassword, user.password);
          console.log(`   - Password Check (${expectedPassword}): ${isValid ? '✅ Valid' : '❌ Invalid'}`);
        }
        console.log('');
      } else {
        console.log(`❌ User not found: ${email}`);
      }
    }

    // Check database connection
    console.log('2️⃣  Testing database connection...');
    const userCount = await prisma.user.count();
    console.log(`✅ Database connected. Total users: ${userCount}`);

    // Check all users
    console.log('\n3️⃣  All users in database:');
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    if (allUsers.length === 0) {
      console.log('❌ No users found in database!');
    } else {
      allUsers.forEach(user => {
        console.log(`   - ${user.email} (${user.role}) - ${user.name}`);
      });
    }

  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugLogin();