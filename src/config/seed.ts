import { prisma } from "./client";

const initSeedConfig = async () => {
  const roleCount = await prisma.role.count();
  const userCount = await prisma.user.count();
  const quizCount = await prisma.quiz.count();
  const adminRole = await prisma.role.findFirst({ where: { name: "ADMIN" } });
  const userRole = await prisma.role.findFirst({ where: { name: "USER" } });
  // 🧩 1. Tạo user mẫu nếu chưa có
  if (userCount === 0) {
    await prisma.user.createMany({
      data: [
        { name: "Alice", email: "alice@example.com", password: "password123",roleId:adminRole.id },
        { name: "Bob", email: "bob@example.com", password: "password123" ,roleId:adminRole.id},
        { name: "Charlie", email: "charlie@example.com", password: "password123" ,roleId:adminRole.id},
      ],
    });
    console.log("✅ Users seeded!");
  }

  // 🧩 2. Tạo quiz mẫu nếu chưa có
  if (quizCount === 0) {
    // Lấy user đầu tiên làm người tạo quiz
    const firstUser = await prisma.user.findFirst();

    await prisma.quiz.create({
      data: {
        title: "Quiz về Java cơ bản",
        description: "Kiểm tra kiến thức cơ bản về OOP và cú pháp Java.",

        // liên kết quiz với user
        user: {
          connect: { id: firstUser!.id },
        },

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
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    console.log("✅ Quiz + Questions + Answers seeded!");
  } else {
    console.log("⚠️ Data already exists, skipping seed.");
  }

   if (roleCount === 0) {
    await prisma.role.createMany({
      data: [
        { name: "ADMIN", description: "Quản trị viên hệ thống" },
        { name: "USER", description: "Người dùng hệ thống" }
      ]
    });
  }
};

export default initSeedConfig;
