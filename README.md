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

## Quiz theo mức độ

Câu hỏi có mức `EASY`, `MEDIUM` hoặc `HARD`. Với database MySQL hiện lưu nội dung trong các bảng `*_translations`, API chọn bản dịch tiếng Việt trước, sau đó tiếng Anh. Mức độ của dữ liệu hiện có được tính theo thứ tự ID câu hỏi, chia thành ba nhóm gần bằng nhau.

Database hiện tại có lịch sử migration khác với các file trong repository. Không chạy `prisma migrate deploy` hoặc seed trên database này cho đến khi lịch sử migration được đối chiếu và đồng bộ.

Để đồng bộ nội dung tiếng Việt và cờ đáp án đúng của bốn bộ quiz từ seed, có thể chạy lệnh sau. Lệnh cập nhật nội dung VI/cờ đáp án theo seed và thêm câu hỏi/đáp án cuối còn thiếu:

```bash
npm run prisma:seed:translations
```

Lấy gói câu hỏi theo quiz và mức độ:

```http
GET /api/quizzes/{quizId}/package?difficulty=HARD&count=10
```

`difficulty` bắt buộc, không phân biệt chữ hoa/thường; `count` mặc định là `10`, giới hạn từ `1` đến `50`. Mỗi lựa chọn có `isCorrect` để client biết đáp án đúng.

## API reference cho Android/Kotlin

Base URL local:

- Android Emulator: `http://10.0.2.2:4000`
- Thiết bị thật: `http://<LAN_IP_máy_chạy_backend>:4000`
- Production: dùng domain HTTPS của backend.

Mọi API dưới đây có prefix `/api`. Request body gửi JSON với header `Content-Type: application/json`. Những endpoint ghi `Bearer token` cần gửi:

```http
Authorization: Bearer <access_token>
```

### Danh sách endpoint

| Method | Path | Auth | Tham số |
|---|---|---|---|
| `GET` | `/` | Không | Không có; health check, trả `Hello World!` |
| `POST` | `/login` | Không | Body: `email`, `password` |
| `POST` | `/register` | Không | Body: `name`, `email`, `password`, `confirmPassword` |
| `GET` | `/account` | Bearer | Không; profile từ token |
| `GET` | `/quizzes` | Không | Không; danh sách quiz kèm câu hỏi và lựa chọn công khai |
| `GET` | `/quizzes/:id` | Không | Path `id`: quiz ID số nguyên dương |
| `GET` | `/quizzes/:id/package` | Không | Path `id`; query `difficulty` bắt buộc, `count` tùy chọn |
| `GET` | `/top-scores` | Không | Không; top users |
| `GET` | `/top-7-10-scores` | Không | Không; vị trí 4–10 (bổ sung user nếu chưa đủ) |
| `GET` | `/users?page=1` | Bearer | Query `page`: số nguyên dương, mặc định `1` |
| `GET` | `/users/:id` | Bearer | Path `id`: user ID số nguyên dương |
| `POST` | `/users` | Hiện không yêu cầu | Body: `name`, `email`, `password` |
| `PUT` | `/users/:id` | Hiện không yêu cầu | Path `id`; body: `name`, `email`, `password` |
| `DELETE` | `/users/:id` | Hiện không yêu cầu | Path `id` |
| `GET` | `/results` | Bearer | Không; chỉ lấy kết quả của user trong token |
| `GET` | `/results/:id` | Bearer | Path `id` phải là user ID của chính token |
| `POST` | `/results` | Bearer | Body: `quizId`, `userId`, `score`; `userId` phải khớp token |
| `POST` | `/Your-results` | Bearer | Body: `quizId`, `score`; user lấy từ token |

> **Lưu ý bảo mật quan trọng:** `POST /users`, `PUT /users/:id` và `DELETE /users/:id` hiện chưa có middleware xác thực/phân quyền. Android client thông thường nên dùng `/register`, không dùng các route này. Cần khóa các route quản trị trước khi đưa backend lên production. Hai endpoint lưu kết quả nhận `score` từ client, chưa tự chấm đáp án; không coi điểm gửi lên là kết quả đáng tin cậy.

### Đăng ký và đăng nhập

Đăng ký:

```http
POST /api/register
Content-Type: application/json

{
  "name": "Nguyen An",
  "email": "an@example.com",
  "password": "example-password",
  "confirmPassword": "example-password"
}
```

Thành công `201`:

```json
{
  "user": { "id": 12, "name": "Nguyen An", "email": "an@example.com" },
  "message": "User registered successfully"
}
```

Đăng nhập:

```http
POST /api/login
Content-Type: application/json

{
  "email": "an@example.com",
  "password": "example-password"
}
```

Thành công `200` trả `{ "access_token": "...", "message": "Login successful" }`. Lưu token bằng phương thức lưu trữ an toàn của Android; không ghi token/mật khẩu vào log. Gửi token ở các request được bảo vệ bằng `Authorization: Bearer <access_token>`. Token hết hạn theo `JWT_EXPIRES_IN` (mặc định `1h`).

Lỗi phổ biến: `400` body/email không hợp lệ hoặc mật khẩu xác nhận không khớp; `401` thông tin đăng nhập sai; `409` email đã đăng ký. Một số route user/kết quả dùng token cần nhận diện user hiện tại.

### Lấy quiz và câu hỏi

Danh sách quiz:

```http
GET /api/quizzes
```

Response có dạng `{ "quizzes": [...], "message": "..." }`. Mỗi quiz có `id`, `title`, `description`, `questions`; mỗi câu hỏi có `id`, `content`, `difficulty`, `answers`. Mỗi answer có `id`, `content`, `isCorrect`.

Chi tiết quiz:

```http
GET /api/quizzes/1
```

Response có dạng `{ "quiz": { "id": 1, "title": "Java", "description": "...", "questions": [...] }, "message": "..." }`.

Gói câu hỏi theo độ khó:

```http
GET /api/quizzes/1/package?difficulty=EASY&count=10
```

- `id`: ID quiz số nguyên dương.
- `difficulty`: bắt buộc, `EASY`, `MEDIUM` hoặc `HARD`; không phân biệt chữ hoa/thường.
- `count`: tùy chọn, số nguyên từ `1` đến `50`, mặc định `10`.

Response:

```json
{
  "data": {
    "quizId": "1",
    "difficulty": "easy",
    "questions": [
      {
        "id": "1",
        "questionText": "Tập tin nguồn Java có phần mở rộng là gì?",
        "options": [
          { "id": "1", "text": ".class", "isCorrect": false },
          { "id": "2", "text": ".java", "isCorrect": true }
        ]
      }
    ]
  },
  "message": "Quiz package retrieved successfully"
}
```

`count` là số câu tối đa trả về, nên nếu mức độ đó có ít câu hơn thì response có thể ít hơn `count`. Các câu hỏi được chia mức theo thứ tự ID; mức độ hiện tại chưa được đánh giá thủ công về độ khó. Mỗi option có `isCorrect: true/false`.

> **Cảnh báo:** API quiz hiện trả đáp án đúng xuống client. Chỉ dùng cho học tập/luyện tập hoặc ứng dụng chấp nhận lộ đáp án; không dùng như luồng thi chống gian lận.

Mã lỗi: `400 INVALID_QUIZ_ID` nếu ID sai; `400 INVALID_QUIZ_PACKAGE_QUERY` nếu thiếu/sai `difficulty` hoặc `count`; `404` nếu quiz không tồn tại; `500` nếu backend/database lỗi.

### User, leaderboard và kết quả

- `GET /api/users?page=1`: cần token; trả `users`, `currentPage`, `countTotalUser`, `message`. Mỗi trang có 5 users; `countTotalUser` hiện là **tổng số trang** (tên field cũ có thể gây hiểu nhầm). Password không được trả.
- `GET /api/users/12`: cần token; trả `{ "user": { "id", "name", "email" }, "message": "..." }`. `400` nếu ID sai, `404` nếu không tìm thấy.
- `GET /api/top-scores`: public; trả `{ "users": [...], "message": "..." }`.
- `GET /api/top-7-10-scores`: public; trả `{ "users": [...], "message": "..." }`.
- `GET /api/results`: cần token; trả `{ "data": [...], "message": "..." }` cho user hiện tại.
- `GET /api/results/12`: cần token và `12` phải là ID của user hiện tại; user khác nhận `403`.
- `POST /api/results`: cần token. Body ví dụ `{"quizId":1,"userId":12,"score":8}`. `userId` phải khớp user trong token; response là record user/kết quả cập nhật.
- `POST /api/Your-results`: cần token. Body ví dụ `{"quizId":1,"score":8}`. Response có `{ "result": {...}, "message": "Lưu kết quả thành công" }`.

`score` hiện là điểm client gửi lên; server chưa chấm câu trả lời. Với tích hợp thi thật, không dùng endpoint này làm nguồn điểm đã xác thực.

Lỗi xác thực thường gặp: `401` thiếu token/token sai; `403` truy cập hoặc gửi kết quả cho user khác; `400` dữ liệu sai; `404` ID không tồn tại; `409` email trùng; `500` lỗi server. Error JSON có thể chứa `message`, và một số trường hợp có `code`.

### Retrofit mẫu

Thêm Retrofit và converter Gson/Moshi vào Android app nếu chưa có:

```kotlin
data class ApiEnvelope<T>(
    val data: T? = null,
    val message: String? = null,
)

data class QuizPackageDto(
    val quizId: String,
    val difficulty: String,
    val questions: List<QuizQuestionDto>,
)

data class QuizQuestionDto(
    val id: String,
    val questionText: String,
    val options: List<QuizOptionDto>,
)

data class QuizOptionDto(
    val id: String,
    val text: String,
    val isCorrect: Boolean,
)

interface QuizApi {
    @GET("api/quizzes/{id}/package")
    suspend fun getQuizPackage(
        @Path("id") quizId: Int,
        @Query("difficulty") difficulty: String,
        @Query("count") count: Int = 10,
    ): ApiEnvelope<QuizPackageDto>
}
```

Khởi tạo Retrofit với base URL kết thúc bằng `/`, ví dụ emulator `http://10.0.2.2:4000/`. Thêm OkHttp interceptor gắn `Authorization` cho endpoint cần token; quiz/package và leaderboard hiện là public. Trên thiết bị thật, thay `10.0.2.2` bằng IP LAN của máy chạy backend. Không dùng `localhost` trong Android Emulator vì địa chỉ đó trỏ về emulator.

---

## 📄 Giấy phép

Phát hành theo giấy phép **ISC License**.

---

### 👨‍💻 Tác giả
**backendQuizzApp team**  
📧 Liên hệ: thai2862005@gmail.com 
🌐 GitHub: [thai2862005](https://github.com/thai2862005)
