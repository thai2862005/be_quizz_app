import 'dotenv/config'
import { prisma } from "./client";

const runSeed = async () => {
  try {
    const roleCount = await prisma.role.count();
    if (roleCount === 0) {
      console.log("Starting seed...");
      await prisma.role.createMany({
        data: [
          { name: "ADMIN", description: "Quản trị viên hệ thống" },
          { name: "USER", description: "Người dùng hệ thống" }
        ],
      });
    }
    console.log("✅ Seed check completed!");
  } catch (e) {
    console.error("Seed error:", e);
  }
};

export default runSeed;
