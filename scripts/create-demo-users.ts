#!/usr/bin/env tsx

import bcrypt from "bcryptjs";
import prisma from "../lib/db";

const demoUsers = [
  {
    name: "Admin User",
    email: "admin@demo.com",
    password: "admin123",
    role: "admin"
  },
  {
    name: "Moderator User", 
    email: "moderator@demo.com",
    password: "moderator123",
    role: "moderator"
  },
  {
    name: "Viewer User",
    email: "viewer@demo.com", 
    password: "viewer123",
    role: "viewer"
  }
];

async function createDemoUsers() {
  console.log("🚀 Creating demo users...");

  try {
    for (const userData of demoUsers) {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        console.log(`✅ User ${userData.email} already exists`);
        continue;
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Create the user
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: userData.role
        }
      });

      console.log(`✅ Created ${userData.role} user: ${userData.email}`);
    }

    console.log("🎉 Demo users created successfully!");
    console.log("\n📋 Demo User Credentials:");
    console.log("==========================");
    for (const user of demoUsers) {
      console.log(`👑 ${user.role.toUpperCase()}: ${user.email} / ${user.password}`);
    }

  } catch (error) {
    console.error("❌ Error creating demo users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createDemoUsers();