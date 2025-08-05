import bcrypt from "bcryptjs";
import prisma from "../lib/db";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function createAdmin() {
  try {
    const email = "admin@plp.org";
    const password = "admin123";
    const name = "Admin User";

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log("Admin user already exists!");
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(password, 12);
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "admin",
      },
    });

    console.log("Admin user created successfully!");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Please change the password after first login.");
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

createAdmin();