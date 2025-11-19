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

  // 4️⃣ Seed Quiz + Questions
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
              content: "Tập tin nguồn Java có phần mở rộng là gì?",
              answers: {
                create: [
                  { content: ".class", isCorrect: false },
                  { content: ".java", isCorrect: true },
                  { content: ".jar", isCorrect: false },
                  { content: ".txt", isCorrect: false }
                ]
              }
            },
            {
              content: "Phương thức nào là điểm bắt đầu của một chương trình Java?",
              answers: {
                create: [
                  { content: "start()", isCorrect: false },
                  { content: "run()", isCorrect: false },
                  { content: "main()", isCorrect: true },
                  { content: "init()", isCorrect: false }
                ]
              }
            },
            {
              content: "Câu nào sau đây khai báo đúng phương thức main trong Java?",
              answers: {
                create: [
                  { content: "public static void main(String[] args)", isCorrect: true },
                  { content: "public void main(String args)", isCorrect: false },
                  { content: "static public main(String[] args)", isCorrect: false },
                  { content: "void main(String[] args)", isCorrect: false }
                ]
              }
            },
            {
              content: "Lệnh nào dùng để in ra màn hình và xuống dòng trong Java?",
              answers: {
                create: [
                  { content: "System.print()", isCorrect: false },
                  { content: "System.out.println()", isCorrect: true },
                  { content: "Console.write()", isCorrect: false },
                  { content: "System.out.printline()", isCorrect: false }
                ]
              }
            },
            {
              content: "Kiểu dữ liệu nào dùng để lưu một số nguyên trong Java?",
              answers: {
                create: [
                  { content: "boolean", isCorrect: false },
                  { content: "double", isCorrect: false },
                  { content: "int", isCorrect: true },
                  { content: "char", isCorrect: false }
                ]
              }
            },
            {
              content: "Kiểu dữ liệu nào dùng để lưu giá trị đúng/sai?",
              answers: {
                create: [
                  { content: "int", isCorrect: false },
                  { content: "boolean", isCorrect: true },
                  { content: "String", isCorrect: false },
                  { content: "float", isCorrect: false }
                ]
              }
            },
            {
              content: "Để khai báo một biến số nguyên tên x có giá trị ban đầu là 10, câu lệnh nào đúng?",
              answers: {
                create: [
                  { content: "int x = 10;", isCorrect: true },
                  { content: "integer x = 10;", isCorrect: false },
                  { content: "num x = 10;", isCorrect: false },
                  { content: "x int = 10;", isCorrect: false }
                ]
              }
            },
            {
              content: "Toán tử nào dùng để so sánh bằng trong Java?",
              answers: {
                create: [
                  { content: "=", isCorrect: false },
                  { content: "==", isCorrect: true },
                  { content: "===", isCorrect: false },
                  { content: ":=", isCorrect: false }
                ]
              }
            },
            {
              content: "Câu lệnh điều kiện nào sau đây đúng cú pháp trong Java?",
              answers: {
                create: [
                  { content: "if (x > 0) x++;", isCorrect: true },
                  { content: "if x > 0 then x++;", isCorrect: false },
                  { content: "if x > 0: x++;", isCorrect: false },
                  { content: "if (x > 0) then x++;", isCorrect: false }
                ]
              }
            },
            {
              content: "Vòng lặp nào dùng khi biết trước số lần lặp?",
              answers: {
                create: [
                  { content: "while", isCorrect: false },
                  { content: "do-while", isCorrect: false },
                  { content: "for", isCorrect: true },
                  { content: "switch", isCorrect: false }
                ]
              }
            },
            {
              content: "Câu lệnh nào dùng để thoát khỏi vòng lặp ngay lập tức?",
              answers: {
                create: [
                  { content: "exit;", isCorrect: false },
                  { content: "stop;", isCorrect: false },
                  { content: "break;", isCorrect: true },
                  { content: "return;", isCorrect: false }
                ]
              }
            },
            {
              content: "Lớp (class) trong Java được khai báo bắt đầu bằng từ khoá nào?",
              answers: {
                create: [
                  { content: "object", isCorrect: false },
                  { content: "class", isCorrect: true },
                  { content: "struct", isCorrect: false },
                  { content: "interface", isCorrect: false }
                ]
              }
            },
            {
              content: "Từ khoá nào dùng để kế thừa từ một lớp khác trong Java?",
              answers: {
                create: [
                  { content: "implements", isCorrect: false },
                  { content: "inherit", isCorrect: false },
                  { content: "extends", isCorrect: true },
                  { content: "override", isCorrect: false }
                ]
              }
            },
            {
              content: "Từ khoá nào dùng để tạo một đối tượng mới trong Java?",
              answers: {
                create: [
                  { content: "class", isCorrect: false },
                  { content: "new", isCorrect: true },
                  { content: "create", isCorrect: false },
                  { content: "object", isCorrect: false }
                ]
              }
            },
            {
              content: "Lệnh nào sau đây tạo đối tượng Scanner để đọc từ bàn phím?",
              answers: {
                create: [
                  { content: "Scanner sc = new Scanner();", isCorrect: false },
                  { content: "Scanner sc = Scanner(System.in);", isCorrect: false },
                  { content: "Scanner sc = new Scanner(System.in);", isCorrect: true },
                  { content: "new Scanner sc = (System.in);", isCorrect: false }
                ]
              }
            },
            {
              content: "Gói chuẩn chứa lớp System và String là gói nào?",
              answers: {
                create: [
                  { content: "java.io", isCorrect: false },
                  { content: "java.util", isCorrect: false },
                  { content: "java.lang", isCorrect: true },
                  { content: "java.system", isCorrect: false }
                ]
              }
            },
            {
              content: "Trong Java, chuỗi ký tự được biểu diễn bởi kiểu dữ liệu nào?",
              answers: {
                create: [
                  { content: "string", isCorrect: false },
                  { content: "String", isCorrect: true },
                  { content: "char[]", isCorrect: false },
                  { content: "text", isCorrect: false }
                ]
              }
            },
            {
              content: "Từ khoá nào dùng để ngăn không cho lớp bị kế thừa?",
              answers: {
                create: [
                  { content: "static", isCorrect: false },
                  { content: "private", isCorrect: false },
                  { content: "final", isCorrect: true },
                  { content: "sealed", isCorrect: false }
                ]
              }
            },
            {
              content: "Khối lệnh nào dùng để bắt ngoại lệ trong Java?",
              answers: {
                create: [
                  { content: "try - catch", isCorrect: true },
                  { content: "if - else", isCorrect: false },
                  { content: "switch - case", isCorrect: false },
                  { content: "for - catch", isCorrect: false }
                ]
              }
            },
            {
              content: "Câu lệnh import nào đúng để sử dụng tất cả lớp trong gói java.util?",
              answers: {
                create: [
                  { content: "import java.util;", isCorrect: false },
                  { content: "import java.util.*;", isCorrect: true },
                  { content: "using java.util.*;", isCorrect: false },
                  { content: "include java.util.*;", isCorrect: false }
                ]
              }
            }
          ]
        }
      },
    });

    console.log("✅ Quiz + Questions + Answers seeded!");
  } else {
    console.log("⚠️ Quiz exists, skipping.");
  }
};

export default initSeedConfig;
