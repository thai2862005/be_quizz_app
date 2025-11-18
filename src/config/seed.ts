import { prisma } from "./client";

const initSeedConfig = async () => {
  // 1️⃣ Seed ROLE trước
  const roleCount = await prisma.role.count();
  if (roleCount === 0) {
    await prisma.role.createMany({
      data: [
        { name: "ADMIN", description: "Quản trị viên hệ thống" },
        { name: "USER", description: "Người dùng hệ thống" }
      ],
    });
    console.log("✅ Roles seeded!");
  }

  // 2️⃣ Lấy lại role sau khi đã tạo
  const adminRole = await prisma.role.findFirst({ where: { name: "ADMIN" } });
  const userRole = await prisma.role.findFirst({ where: { name: "USER" } });

  // 3️⃣ Seed USER
  const userCount = await prisma.user.count();
  if (userCount === 0) {
    await prisma.user.createMany({
      data: [
        { name: "Alice", email: "alice@example.com", password: "password123", roleId: adminRole!.id },
        { name: "Bob", email: "bob@example.com", password: "password123", roleId: adminRole!.id },
        { name: "Charlie", email: "charlie@example.com", password: "password123", roleId: userRole!.id },
      ],
    });
    console.log("✅ Users seeded!");
  }

  // 4️⃣ Seed Quiz + Questions nếu chưa có
  const quizCount = await prisma.quiz.count();
  if (quizCount === 0) {
    const firstUser = await prisma.user.findFirst();

    await prisma.quiz.create({
      data: {
        title: "Quiz về Java cơ bản",
        description: "Kiểm tra kiến thức cơ bản về OOP và cú pháp Java.",
        user: { connect: { id: firstUser!.id } },

        questions: {
          create: [
            {
              content: "Từ khóa nào dùng để kế thừa một lớp trong Java?",
              answers: {
                create: [
                  { content: "inherit", isCorrect: false },
                  { content: "extends", isCorrect: true },
                  { content: "super", isCorrect: false },
                  { content: "implements", isCorrect: false },
                ],
              },
            },
            {
              content: "Phương thức khởi tạo trong Java là gì?",
              answers: {
                create: [
                  { content: "init()", isCorrect: false },
                  { content: "ClassName()", isCorrect: true },
                  { content: "new()", isCorrect: false },
                  { content: "create()", isCorrect: false },
                ],
              },
            },
          ],
        },
      },
    });

    console.log("✅ Quiz + Questions + Answers seeded!");
  } else {
    console.log("⚠️ Quiz exists, skipping.");
  }
};

export default initSeedConfig