import { prisma } from "./client";

const initSeedConfig = async () => {
  // 1️⃣ Seed ROLE
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

  // 2️⃣ Lấy lại role
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

  const firstUser = await prisma.user.findFirst();

  // ================= Quiz Java =================
  await prisma.quiz.create({
    data: {
      title: " Java",
      description: "20 câu trắc nghiệm cơ bản về Java",
      userId: firstUser!.id,
      questions: {
        create: [
          {
            content: "Tập tin nguồn Java có phần mở rộng là gì?",
            answers: { create: [
              { content: ".class", isCorrect: false },
              { content: ".java", isCorrect: true },
              { content: ".jar", isCorrect: false },
              { content: ".txt", isCorrect: false },
            ] }
          },
          {
            content: "Phương thức nào là điểm bắt đầu của một chương trình Java?",
            answers: { create: [
              { content: "start()", isCorrect: false },
              { content: "run()", isCorrect: false },
              { content: "main()", isCorrect: true },
              { content: "init()", isCorrect: false },
            ] }
          },
          {
            content: "Câu nào khai báo đúng phương thức main trong Java?",
            answers: { create: [
              { content: "public static void main(String[] args)", isCorrect: true },
              { content: "public void main(String args)", isCorrect: false },
              { content: "static public main(String[] args)", isCorrect: false },
              { content: "void main(String[] args)", isCorrect: false },
            ] }
          },
          {
            content: "Lệnh nào dùng để in ra màn hình và xuống dòng trong Java?",
            answers: { create: [
              { content: "System.print()", isCorrect: false },
              { content: "System.out.println()", isCorrect: true },
              { content: "Console.write()", isCorrect: false },
              { content: "System.out.printline()", isCorrect: false },
            ] }
          },
          {
            content: "Kiểu dữ liệu nào dùng để lưu một số nguyên trong Java?",
            answers: { create: [
              { content: "boolean", isCorrect: false },
              { content: "double", isCorrect: false },
              { content: "int", isCorrect: true },
              { content: "char", isCorrect: false },
            ] }
          },
          {
            content: "Kiểu dữ liệu nào dùng để lưu giá trị đúng/sai?",
            answers: { create: [
              { content: "int", isCorrect: false },
              { content: "boolean", isCorrect: true },
              { content: "String", isCorrect: false },
              { content: "float", isCorrect: false },
            ] }
          },
          {
            content: "Để khai báo biến số nguyên x=10, câu lệnh nào đúng?",
            answers: { create: [
              { content: "int x = 10;", isCorrect: true },
              { content: "integer x = 10;", isCorrect: false },
              { content: "num x = 10;", isCorrect: false },
              { content: "x int = 10;", isCorrect: false },
            ] }
          },
          {
            content: "Toán tử nào dùng để so sánh bằng trong Java?",
            answers: { create: [
              { content: "=", isCorrect: false },
              { content: "==", isCorrect: true },
              { content: "===", isCorrect: false },
              { content: ":=", isCorrect: false },
            ] }
          },
          {
            content: "Câu lệnh điều kiện đúng cú pháp Java?",
            answers: { create: [
              { content: "if (x > 0) x++;", isCorrect: true },
              { content: "if x > 0 then x++;", isCorrect: false },
              { content: "if x > 0: x++;", isCorrect: false },
              { content: "if (x > 0) then x++;", isCorrect: false },
            ] }
          },
          {
            content: "Vòng lặp dùng khi biết trước số lần lặp?",
            answers: { create: [
              { content: "while", isCorrect: false },
              { content: "do-while", isCorrect: false },
              { content: "for", isCorrect: true },
              { content: "switch", isCorrect: false },
            ] }
          },
          {
            content: "Câu lệnh thoát vòng lặp ngay lập tức?",
            answers: { create: [
              { content: "exit;", isCorrect: false },
              { content: "stop;", isCorrect: false },
              { content: "break;", isCorrect: true },
              { content: "return;", isCorrect: false },
            ] }
          },
          {
            content: "Lớp trong Java khai báo bắt đầu bằng từ khóa?",
            answers: { create: [
              { content: "object", isCorrect: false },
              { content: "class", isCorrect: true },
              { content: "struct", isCorrect: false },
              { content: "interface", isCorrect: false },
            ] }
          },
          {
            content: "Từ khóa kế thừa lớp khác trong Java?",
            answers: { create: [
              { content: "implements", isCorrect: false },
              { content: "inherit", isCorrect: false },
              { content: "extends", isCorrect: true },
              { content: "override", isCorrect: false },
            ] }
          },
          {
            content: "Từ khóa tạo đối tượng mới trong Java?",
            answers: { create: [
              { content: "class", isCorrect: false },
              { content: "new", isCorrect: true },
              { content: "create", isCorrect: false },
              { content: "object", isCorrect: false },
            ] }
          },
          {
            content: "Tạo đối tượng Scanner đọc bàn phím?",
            answers: { create: [
              { content: "Scanner sc = new Scanner();", isCorrect: false },
              { content: "Scanner sc = Scanner(System.in);", isCorrect: false },
              { content: "Scanner sc = new Scanner(System.in);", isCorrect: true },
              { content: "new Scanner sc = (System.in);", isCorrect: false },
            ] }
          },
          {
            content: "Gói chuẩn chứa lớp System và String?",
            answers: { create: [
              { content: "java.io", isCorrect: false },
              { content: "java.util", isCorrect: false },
              { content: "java.lang", isCorrect: true },
              { content: "java.system", isCorrect: false },
            ] }
          },
          {
            content: "Chuỗi ký tự biểu diễn kiểu dữ liệu nào?",
            answers: { create: [
              { content: "string", isCorrect: false },
              { content: "String", isCorrect: true },
              { content: "char[]", isCorrect: false },
              { content: "text", isCorrect: false },
            ] }
          },
          {
            content: "Từ khóa ngăn lớp bị kế thừa?",
            answers: { create: [
              { content: "static", isCorrect: false },
              { content: "private", isCorrect: false },
              { content: "final", isCorrect: true },
              { content: "sealed", isCorrect: false },
            ] }
          },
          {
            content: "Khối lệnh bắt ngoại lệ trong Java?",
            answers: { create: [
              { content: "try - catch", isCorrect: true },
              { content: "if - else", isCorrect: false },
              { content: "switch - case", isCorrect: false },
              { content: "for - catch", isCorrect: false },
            ] }
          },
          {
            content: "Import tất cả lớp trong java.util?",
            answers: { create: [
              { content: "import java.util;", isCorrect: false },
              { content: "import java.util.*;", isCorrect: true },
              { content: "using java.util.*;", isCorrect: false },
              { content: "include java.util.*;", isCorrect: false },
            ] }
          }
        ]
      }
    }
  });

  // ================= Quiz JavaScript =================
  await prisma.quiz.create({
    data: {
      title: "JavaScript",
      description: "20 câu trắc nghiệm cơ bản về JavaScript",
      userId: firstUser!.id,
      questions: {
        create: [
          {
            content: "Để khai báo biến trong JavaScript dùng từ khóa nào?",
            answers: { create: [
              { content: "var", isCorrect: true },
              { content: "int", isCorrect: false },
              { content: "letx", isCorrect: false },
              { content: "integer", isCorrect: false },
            ] }
          },
          {
            content: "Câu nào in ra console trong JavaScript?",
            answers: { create: [
              { content: "console.log('Hello')", isCorrect: true },
              { content: "print('Hello')", isCorrect: false },
              { content: "System.out.println('Hello')", isCorrect: false },
              { content: "echo('Hello')", isCorrect: false },
            ] }
          },
          {
            content: "Toán tử so sánh bằng trong JavaScript?",
            answers: { create: [
              { content: "=", isCorrect: false },
              { content: "==", isCorrect: true },
              { content: "===", isCorrect: false },
              { content: ":=", isCorrect: false },
            ] }
          },
          {
            content: "Khai báo hàm trong JavaScript đúng?",
            answers: { create: [
              { content: "function foo() {}", isCorrect: true },
              { content: "def foo():", isCorrect: false },
              { content: "func foo() {}", isCorrect: false },
              { content: "void foo() {}", isCorrect: false },
            ] }
          },
          {
            content: "Để tạo đối tượng trong JavaScript?",
            answers: { create: [
              { content: "new Object()", isCorrect: true },
              { content: "new object{}", isCorrect: false },
              { content: "Object()", isCorrect: false },
              { content: "object.new()", isCorrect: false },
            ] }
          },
          {
            content: "Khai báo mảng trong JavaScript đúng?",
            answers: { create: [
              { content: "let arr = [1,2,3];", isCorrect: true },
              { content: "let arr = {1,2,3};", isCorrect: false },
              { content: "array arr = [1,2,3];", isCorrect: false },
              { content: "let arr = (1,2,3);", isCorrect: false },
            ] }
          },
          {
            content: "Vòng lặp lặp ít nhất 1 lần?",
            answers: { create: [
              { content: "do...while", isCorrect: true },
              { content: "while", isCorrect: false },
              { content: "for", isCorrect: false },
              { content: "loop", isCorrect: false },
            ] }
          },
          {
            content: "Cú pháp if đúng trong JS?",
            answers: { create: [
              { content: "if(x>0){...}", isCorrect: true },
              { content: "if x>0 then {...}", isCorrect: false },
              { content: "if x>0: {...}", isCorrect: false },
              { content: "if(x>0) then {...}", isCorrect: false },
            ] }
          },
          {
            content: "Toán tử gán trong JS?",
            answers: { create: [
              { content: "=", isCorrect: true },
              { content: "==", isCorrect: false },
              { content: ":=", isCorrect: false },
              { content: "===", isCorrect: false },
            ] }
          },
          {
            content: "Kiểu dữ liệu boolean trong JS?",
            answers: { create: [
              { content: "true/false", isCorrect: true },
              { content: "1/0", isCorrect: false },
              { content: "yes/no", isCorrect: false },
              { content: "on/off", isCorrect: false },
            ] }
          },
          {
            content: "Hàm parseInt dùng để làm gì?",
            answers: { create: [
              { content: "Chuyển chuỗi sang số nguyên", isCorrect: true },
              { content: "Chuyển số sang chuỗi", isCorrect: false },
              { content: "Chuyển số sang float", isCorrect: false },
              { content: "Chuyển boolean sang int", isCorrect: false },
            ] }
          },
          {
            content: "Khi nào dùng let thay vì var?",
            answers: { create: [
              { content: "Khi muốn block scope", isCorrect: true },
              { content: "Khi muốn global scope", isCorrect: false },
              { content: "Không khác gì var", isCorrect: false },
              { content: "Dùng để tạo hàm", isCorrect: false },
            ] }
          },
          {
            content: "Khai báo hằng số trong JS?",
            answers: { create: [
              { content: "const PI = 3.14;", isCorrect: true },
              { content: "let PI = 3.14;", isCorrect: false },
              { content: "var PI = 3.14;", isCorrect: false },
              { content: "constant PI = 3.14;", isCorrect: false },
            ] }
          },
          {
            content: "Toán tử !== nghĩa là gì?",
            answers: { create: [
              { content: "Không bằng và khác kiểu", isCorrect: true },
              { content: "Không bằng", isCorrect: false },
              { content: "Bằng và cùng kiểu", isCorrect: false },
              { content: "Bằng kiểu khác", isCorrect: false },
            ] }
          },
          {
            content: "Để nối chuỗi trong JS dùng gì?",
            answers: { create: [
              { content: "+", isCorrect: true },
              { content: "&", isCorrect: false },
              { content: ".", isCorrect: false },
              { content: "concat()", isCorrect: false },
            ] }
          },
          {
            content: "Kiểu dữ liệu lưu nhiều giá trị không liên tiếp?",
            answers: { create: [
              { content: "Object", isCorrect: true },
              { content: "Array", isCorrect: false },
              { content: "String", isCorrect: false },
              { content: "Set", isCorrect: false },
            ] }
          },
          {
            content: "Hàm alert dùng làm gì?",
            answers: { create: [
              { content: "Hiển thị hộp thoại cảnh báo", isCorrect: true },
              { content: "In ra console", isCorrect: false },
              { content: "Nhập dữ liệu", isCorrect: false },
              { content: "Tạo biến", isCorrect: false },
            ] }
          },
          {
            content: "Để kiểm tra typeof 123?",
            answers: { create: [
              { content: "number", isCorrect: true },
              { content: "string", isCorrect: false },
              { content: "integer", isCorrect: false },
              { content: "float", isCorrect: false },
            ] }
          },
          {
            content: "Sự khác nhau giữa == và ===?",
            answers: { create: [
              { content: "== so sánh giá trị, === so sánh giá trị + kiểu", isCorrect: true },
              { content: "== so sánh kiểu, === so sánh giá trị", isCorrect: false },
              { content: "== và === giống nhau", isCorrect: false },
              { content: "== so sánh địa chỉ, === so sánh giá trị", isCorrect: false },
            ] }
          }
        ]
      }
    }
  });

  // ================= Quiz C++ =================
  await prisma.quiz.create({
    data: {
      title: "C++",
      description: "20 câu trắc nghiệm cơ bản về C++",
      userId: firstUser!.id,
      questions: {
        create: [
          {
            content: "Tập tin nguồn C++ có phần mở rộng là gì?",
            answers: { create: [
              { content: ".cpp", isCorrect: true },
              { content: ".c", isCorrect: false },
              { content: ".java", isCorrect: false },
              { content: ".exe", isCorrect: false },
            ] }
          },
          {
            content: "Khai báo biến số nguyên đúng trong C++?",
            answers: { create: [
              { content: "int x = 10;", isCorrect: true },
              { content: "integer x = 10;", isCorrect: false },
              { content: "num x = 10;", isCorrect: false },
              { content: "x int = 10;", isCorrect: false },
            ] }
          },
          {
            content: "Câu nào in ra màn hình trong C++?",
            answers: { create: [
              { content: "cout << 'Hello';", isCorrect: true },
              { content: "System.out.println('Hello');", isCorrect: false },
              { content: "console.log('Hello');", isCorrect: false },
              { content: "print('Hello');", isCorrect: false },
            ] }
          },
          {
            content: "Toán tử so sánh bằng trong C++?",
            answers: { create: [
              { content: "=", isCorrect: false },
              { content: "==", isCorrect: true },
              { content: "===", isCorrect: false },
              { content: ":=", isCorrect: false },
            ] }
          },
          {
            content: "Hàm main trả về kiểu gì trong C++?",
            answers: { create: [
              { content: "int", isCorrect: true },
              { content: "void", isCorrect: false },
              { content: "main", isCorrect: false },
              { content: "bool", isCorrect: false },
            ] }
          },
          // ... Thêm 15 câu C++ còn lại ...
        ]
      }
    }
  });

  // ================= Quiz Python =================
  await prisma.quiz.create({
    data: {
      title: "Python",
      description: "20 câu trắc nghiệm cơ bản về Python",
      userId: firstUser!.id,
      questions: {
        create: [
  {
    content: "Câu nào dùng để khai báo biến trong Python?",
    answers: {
      create: [
        { content: "x = 10", isCorrect: true },
        { content: "var x = 10", isCorrect: false },
        { content: "int x = 10", isCorrect: false },
        { content: "let x = 10", isCorrect: false }
      ]
    }
  },
  {
    content: "Câu nào dùng để in ra màn hình trong Python?",
    answers: {
      create: [
        { content: "print('Hello')", isCorrect: true },
        { content: "System.out.println('Hello')", isCorrect: false },
        { content: "console.log('Hello')", isCorrect: false },
        { content: "echo('Hello')", isCorrect: false }
      ]
    }
  },
  {
    content: "Kiểu dữ liệu nào dùng để lưu giá trị đúng/sai trong Python?",
    answers: {
      create: [
        { content: "bool", isCorrect: true },
        { content: "int", isCorrect: false },
        { content: "str", isCorrect: false },
        { content: "float", isCorrect: false }
      ]
    }
  },
  {
    content: "Câu nào đúng để khai báo hàm trong Python?",
    answers: {
      create: [
        { content: "def myFunc():", isCorrect: true },
        { content: "function myFunc() {}", isCorrect: false },
        { content: "void myFunc():", isCorrect: false },
        { content: "func myFunc():", isCorrect: false }
      ]
    }
  },
  {
    content: "Câu nào đúng để tạo list trong Python?",
    answers: {
      create: [
        { content: "arr = [1,2,3]", isCorrect: true },
        { content: "arr = (1,2,3)", isCorrect: false },
        { content: "arr = {1,2,3}", isCorrect: false },
        { content: "arr = array(1,2,3)", isCorrect: false }
      ]
    }
  },
  {
    content: "Câu nào dùng để lấy độ dài list trong Python?",
    answers: {
      create: [
        { content: "len(arr)", isCorrect: true },
        { content: "arr.length", isCorrect: false },
        { content: "arr.size()", isCorrect: false },
        { content: "size(arr)", isCorrect: false }
      ]
    }
  },
  {
    content: "Vòng lặp nào dùng để lặp qua list trong Python?",
    answers: {
      create: [
        { content: "for x in arr:", isCorrect: true },
        { content: "while condition:", isCorrect: true },
        { content: "do-while", isCorrect: false },
        { content: "foreach", isCorrect: false }
      ]
    }
  },
  {
    content: "Câu nào dùng để kiểm tra điều kiện trong Python?",
    answers: {
      create: [
        { content: "if x > 0:", isCorrect: true },
        { content: "elif x == 0:", isCorrect: true },
        { content: "else:", isCorrect: true },
        { content: "switch x:", isCorrect: false }
      ]
    }
  },
  {
    content: "Câu nào dùng để thoát vòng lặp trong Python?",
    answers: {
      create: [
        { content: "break", isCorrect: true },
        { content: "continue", isCorrect: false },
        { content: "exit", isCorrect: false },
        { content: "stop", isCorrect: false }
      ]
    }
  },
  {
    content: "Câu nào dùng để bỏ qua một lượt lặp trong Python?",
    answers: {
      create: [
        { content: "continue", isCorrect: true },
        { content: "break", isCorrect: false },
        { content: "skip", isCorrect: false },
        { content: "next", isCorrect: false }
      ]
    }
  },
  {
    content: "Câu nào khai báo hằng số đúng trong Python?",
    answers: {
      create: [
        { content: "PI = 3.14  # convention: uppercase", isCorrect: true },
        { content: "const PI = 3.14", isCorrect: false },
        { content: "let PI = 3.14", isCorrect: false },
        { content: "var PI = 3.14", isCorrect: false }
      ]
    }
  },
  {
    content: "Câu nào dùng để nhập dữ liệu từ bàn phím trong Python?",
    answers: {
      create: [
        { content: "input('Enter value: ')", isCorrect: true },
        { content: "cin >> x", isCorrect: false },
        { content: "scanf('%d', &x)", isCorrect: false },
        { content: "read(x)", isCorrect: false }
      ]
    }
  },
  {
    content: "Câu nào chuyển chuỗi sang số nguyên trong Python?",
    answers: {
      create: [
        { content: "int('123')", isCorrect: true },
        { content: "float('123')", isCorrect: false },
        { content: "str('123')", isCorrect: false },
        { content: "Number('123')", isCorrect: false }
      ]
    }
  },
  {
    content: "Câu nào kiểm tra biến có giá trị None trong Python?",
    answers: {
      create: [
        { content: "if x is None:", isCorrect: true },
        { content: "if x == None:", isCorrect: true },
        { content: "if x = None:", isCorrect: false },
        { content: "if x != None:", isCorrect: false }
      ]
    }
  },
  {
    content: "Câu nào khai báo tuple đúng trong Python?",
    answers: {
      create: [
        { content: "t = (1,2,3)", isCorrect: true },
        { content: "t = [1,2,3]", isCorrect: false },
        { content: "t = {1,2,3}", isCorrect: false },
        { content: "tuple t = (1,2,3)", isCorrect: false }
      ]
    }
  },
  {
    content: "Câu nào khai báo dictionary đúng trong Python?",
    answers: {
      create: [
        { content: "d = {'a':1, 'b':2}", isCorrect: true },
        { content: "d = ['a':1, 'b':2]", isCorrect: false },
        { content: "d = ('a':1, 'b':2)", isCorrect: false },
        { content: "d = {'a','b'}", isCorrect: false }
      ]
    }
  },
  {
    content: "Câu nào dùng để xóa phần tử cuối cùng của list trong Python?",
    answers: {
      create: [
        { content: "arr.pop()", isCorrect: true },
        { content: "arr.remove()", isCorrect: false },
        { content: "del arr[-1]", isCorrect: true },
        { content: "arr.delete()", isCorrect: false }
      ]
    }
  },
  {
    content: "Câu nào dùng để thêm phần tử vào list trong Python?",
    answers: {
      create: [
        { content: "arr.append(10)", isCorrect: true },
        { content: "arr.insert(0,10)", isCorrect: true },
        { content: "arr.add(10)", isCorrect: false },
        { content: "arr.push(10)", isCorrect: false }
      ]
    }
  },
  {
    content: "Câu nào dùng để lặp qua dictionary trong Python?",
    answers: {
      create: [
        { content: "for key, value in d.items():", isCorrect: true },
        { content: "for key in d:", isCorrect: true },
        { content: "for item in d:", isCorrect: false },
        { content: "for (key,value) in d:", isCorrect: false }
      ]
    }
  }
]
      }
    }
  });

  console.log("✅ All 4 quizzes (Java, JavaScript, C++, Python) + questions + answers seeded!");
};

export default initSeedConfig;
