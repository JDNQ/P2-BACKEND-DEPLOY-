import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const existing = await (prisma as any).user.findUnique({
    where: { username: "admin" },
  });

  if (!existing) {
    const password = await bcrypt.hash("Admin@123456", 10);
    await (prisma as any).user.create({
      data: {
        username: "adminuser",
        email: "admin@admin.com",
        password,
        role: "ADMIN",
      },
    });
    console.log("✅ Admin created");
  } else {
    console.log("ℹ️ Admin already exists");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
