# 🧠 Backend QuizzApp

Dự án **Backend QuizzApp** được xây dựng bằng **Node.js + TypeScript + Express + Prisma**, cung cấp API cho ứng dụng trắc nghiệm (Quiz App).  
Cấu trúc này giúp dễ mở rộng, dễ bảo trì và tuân thủ mô hình MVC.

---

## 🚀 1. Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt:

- [Node.js](https://nodejs.org/) >= 18.x  
- [npm](https://www.npmjs.com/) hoặc [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) hoặc MySQL (tùy cấu hình Prisma)

---

## 📦 2. Clone dự án & Cài đặt

```bash
# Clone repository
git clone https://github.com/your-username/backendquizzapp.git

# Di chuyển vào thư mục dự án
cd backendquizzapp

# Cài đặt các thư viện
npm install
```

---

## ⚙️ 3. Cấu hình môi trường

Tạo file `.env` trong thư mục gốc dự án (hoặc dùng file mẫu bên dưới):

### 🧾 .env.example
```env
# DATABASE
DATABASE_URL="mysql://user:password@localhost:5432/schemaDatabase"

# JWT
JWT_SECRET="your_secret_key"

# PORT
PORT=3000
```

> 💡 Thay `user`, `password`, và `schemaDatabase` theo thông tin thực tế trong máy bạn.

---

## 🗂 4. Cấu trúc thư mục

```
File Tree: backendQuizzApp

────────────────────────────────────────────────────────────────────────────────

├── 📁 prisma/
│   ├── 📁 migrations/
│   │   ├── 📁 20251022075351_init_db/
│   │   │   └── 📄 migration.sql
│   │   ├── 📁 20251022080210_add_model/
│   │   │   └── 📄 migration.sql
│   │   ├── 📁 20251022112216_fix/
│   │   │   └── 📄 migration.sql
│   │   ├── 📁 20251027114620_add_role_table_data/
│   │   │   └── 📄 migration.sql
│   │   ├── 📁 20251030155034_update_result/
│   │   │   └── 📄 migration.sql
│   │   ├── 📁 20251107110159_uniqu/
│   │   │   └── 📄 migration.sql
│   │   ├── 📁 20251111033403_update_role2/
│   │   │   └── 📄 migration.sql
│   │   └── ⚙️ migration_lock.toml
│   └── 📄 schema.prisma
├── 📁 src/
│   ├── 📁 config/
│   │   ├── 📄 client.ts
│   │   ├── 📄 constant.ts
│   │   └── 📄 seed.ts
│   ├── 📁 controller/
│   │   ├── 📄 auth.controller.ts
│   │   ├── 📄 quizz.controller.ts
│   │   ├── 📄 result.controller.ts
│   │   └── 📄 user.controller.ts
│   ├── 📁 midlewhere/
│   │   ├── 📄 jwt.midlewhere.ts
│   │   └── 📄 role.midlewhere.ts
│   ├── 📁 router/
│   │   └── 📄 api.ts
│   ├── 📁 service/
│   │   ├── 📄 auth.service.ts
│   │   ├── 📄 quizz.service.ts
│   │   ├── 📄 result.service.ts
│   │   └── 📄 user.service.ts
│   ├── 📁 type/
│   │   └── 📄 index.d.ts
│   └── 📄 app.ts
├── ⚙️ .gitignore
├── 📝 README.md
├── ⚙️ package-lock.json
├── ⚙️ package.json
└── ⚙️ tsconfig.json

────────────────────────────────────────────────────────────────────────────────

## 🛠 5. Thiết lập Prisma ORM

```bash
# Khởi tạo Prisma (nếu chưa có)
npx prisma init

# Tạo bảng trong DB từ schema.prisma
npx prisma migrate dev --name init

# Cập nhật Prisma Client
npx prisma generate

# Mở Prisma Studio để xem dữ liệu
npx prisma studio
```

---

## ▶️ 6. Chạy dự án

```bash
# Chạy chế độ dev (tự động reload)
npm run dev

# Hoặc dùng lệnh start (nếu deploy)
npm start
```

> `nodemon` sẽ tự động theo dõi thư mục `src/` và chạy `ts-node ./src/app.ts`.

---

## ✅ 7. Kiểm tra nhanh API

Ví dụ: Test route cơ bản trong `src/app.ts`

```typescript
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🎯 Backend QuizzApp is running!");
});

app.listen(3000, () => {
  console.log("✅ Server is running on http://localhost:3000");
});
```

Chạy:
```bash
npm run dev
```
Rồi mở trình duyệt:  
👉 http://localhost:4000/

---

## 🧩 8. Các lệnh hữu ích khác

| Mục đích | Lệnh |
|-----------|------|
| Tạo migration mới | `npx prisma migrate dev --name your_migration_name` |
| Xem dữ liệu bằng giao diện | `npx prisma studio` |
| Cập nhật client Prisma | `npx prisma generate` |
| Kiểm tra lỗi TypeScript | `npx tsc --noEmit` |
| Xóa node_modules và cài lại | `rm -rf node_modules && npm install` |

---

## 🧠 9. Thông tin thêm

- Framework: **Express.js v5**
- ORM: **Prisma v6**
- Ngôn ngữ: **TypeScript v5**
- Cấu hình chạy: **Nodemon + ts-node**

---

## 📄 Giấy phép

Phát hành theo giấy phép **ISC License**.

---

### 👨‍💻 Tác giả
**backendQuizzApp team**  
📧 Liên hệ: thai2862005@gmail.com 
🌐 GitHub: [thai2862005](https://github.com/thai2862005)
