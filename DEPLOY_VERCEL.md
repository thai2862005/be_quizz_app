# Hướng dẫn deploy Backend QuizzApp lên Vercel

Tài liệu này hướng dẫn deploy backend Express + TypeScript hiện tại lên Vercel. Các API giữ nguyên prefix `/api`, ví dụ `https://<domain>/api/quizzes`.

## 1. Chuẩn bị trước khi deploy

Bạn cần:

- Tài khoản Vercel.
- Repository đã được đẩy lên GitHub/GitLab/Bitbucket và tài khoản Vercel có quyền truy cập repository đó.
- Một database MySQL production có thể kết nối từ internet. Database trên máy cá nhân hoặc chỉ mở trong mạng nội bộ sẽ không dùng được.
- Connection string và thông tin xác thực JWT dành riêng cho production.

### Chuẩn bị database

1. Tạo database MySQL production tại nhà cung cấp database của bạn.
2. Lấy connection string theo định dạng nhà cung cấp hướng dẫn, thường có dạng:

   ```text
   mysql://USER:PASSWORD@HOST:3306/DATABASE_NAME
   ```

3. Nếu username hoặc password có ký tự đặc biệt, URL-encode phần đó trước khi tạo connection string.
4. Kiểm tra cấu hình network/firewall của database cho phép ứng dụng Vercel kết nối. Không giới hạn database chỉ cho `localhost` hoặc mạng LAN.
5. Đảm bảo schema và dữ liệu cần dùng đã có trong database.

> **Cảnh báo migration:** repository có ghi nhận lịch sử migration không khớp database hiện tại. Không chạy `prisma migrate deploy`, `prisma migrate dev` hoặc seed trên database production trước khi đối chiếu và đồng bộ lịch sử migration. Việc deploy ứng dụng không tự động tạo hay cập nhật bảng trong database.

### Tạo JWT secret mới

Không dùng secret mẫu hoặc secret local cho production. Có thể tạo secret ngẫu nhiên trên máy bằng Node.js:

```bash
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

Giữ giá trị này riêng tư và chỉ nhập vào Vercel Environment Variables. Nếu secret cũ từng bị chia sẻ, hãy thay bằng secret mới; token được ký bằng secret cũ sẽ không còn hợp lệ sau khi thay.

## 2. Đẩy thay đổi lên Git

Commit và push các thay đổi của ứng dụng lên nhánh bạn muốn deploy. Trong thư mục dự án:

```bash
git add .
git commit -m "Prepare app for Vercel deployment"
git push
```

Không commit `.env` thật. File này đã được `.gitignore` loại trừ; chỉ dùng [`.env.example`](./.env.example) làm mẫu.

## 3. Tạo Vercel Project

1. Đăng nhập [Vercel](https://vercel.com/).
2. Chọn **Add New… → Project**.
3. Chọn **Import** cạnh repository của ứng dụng. Nếu chưa thấy repository, cấp quyền truy cập Git provider cho Vercel.
4. Trong màn hình cấu hình project, đặt **Root Directory** là thư mục chứa `package.json` (thường là thư mục gốc repository).
5. Chọn **Framework Preset: Other** nếu Vercel không tự nhận diện phù hợp.
6. Kiểm tra các lệnh build:
   - **Install Command:** để mặc định hoặc `npm install`.
   - **Build Command:** `npm run build`.
   - **Output Directory:** để trống; đây là backend API, không phải frontend tĩnh.
7. Chưa cần bấm deploy nếu chưa thêm biến môi trường ở bước tiếp theo.

`npm run build` chạy `prisma generate` trước khi biên dịch TypeScript. Các file trong `api/` đưa Express app lên Vercel Functions; không cần đặt `PORT` trên Vercel.

## 4. Thêm Environment Variables

Trong trang project, mở **Settings → Environment Variables** và thêm:

| Tên | Giá trị | Ghi chú |
|---|---|---|
| `DATABASE_URL` | Connection string MySQL production | Dùng đúng URL do nhà cung cấp database cấp |
| `JWT_SECRET` | Secret ngẫu nhiên vừa tạo | Không dùng secret trong ví dụ hoặc mã nguồn |
| `JWT_EXPIRES_IN` | `1h` | Tùy chọn; có thể bỏ qua để dùng mặc định |

Với từng biến:

1. Chọn môi trường áp dụng. Cần cấu hình **Production** cho deployment production.
2. Chỉ bật **Preview** nếu đã quyết định database nào được dùng cho preview. Khuyến nghị dùng database riêng cho Preview để tránh dữ liệu thử nghiệm ghi vào production.
3. Lưu biến môi trường.

Không thêm dấu nháy quanh giá trị trong giao diện Vercel trừ khi dấu nháy thực sự là một phần của giá trị. Không thêm `PORT`.

## 5. Deploy và theo dõi kết quả

1. Mở tab **Deployments** hoặc quay lại bước tạo project và chọn **Deploy**.
2. Mở deployment mới nhất, kiểm tra **Build Logs**. Build cần hoàn tất thành công.
3. Nếu deploy thành công, mở domain Vercel được cung cấp và thử:

   ```text
   https://<domain-cua-ban>/api/
   ```

   Route kiểm tra hiện tại trả về `Hello World!`.

4. Kiểm tra API đọc dữ liệu:

   ```text
   https://<domain-cua-ban>/api/quizzes
   ```

   Endpoint này cần database và dữ liệu quiz đã sẵn sàng.
5. Kiểm tra endpoint đăng nhập bằng `POST https://<domain-cua-ban>/api/login` với JSON body theo API của ứng dụng.
6. Xem **Functions/Runtime Logs** trong deployment nếu endpoint trả lỗi. Build thành công không đồng nghĩa database đã kết nối thành công.

Khi cập nhật Environment Variables, cần tạo deployment mới (chọn **Redeploy** hoặc push commit mới) để deployment nhận giá trị mới.

## 6. Gắn domain riêng (tùy chọn)

1. Mở project trên Vercel, vào **Settings → Domains**.
2. Thêm domain/subdomain mong muốn.
3. Cập nhật DNS theo hướng dẫn mà Vercel hiển thị.
4. Chờ Vercel xác nhận domain và chứng chỉ HTTPS.
5. Dùng URL HTTPS mới làm base URL cho client, ví dụ `https://api.example.com/api`.

## 7. Xử lý lỗi thường gặp

- **Build lỗi không tìm thấy Prisma Client:** kiểm tra Build Command là `npm run build` và Build Logs có chạy `prisma generate`.
- **API hoạt động nhưng truy vấn database lỗi:** kiểm tra `DATABASE_URL`, quyền truy cập network, trạng thái database và schema; xem Runtime Logs. Không đưa connection string vào mã nguồn hoặc gửi trong log công khai.
- **Lỗi xác thực/JWT:** kiểm tra `JWT_SECRET` đã được cấu hình cho đúng môi trường và deployment đã được redeploy sau khi cập nhật biến.
- **Preview bị lỗi nhưng Production hoạt động:** kiểm tra Environment Variables cho Preview; đặt database preview riêng hoặc không dùng preview để ghi dữ liệu production.
- **Thay đổi biến môi trường không có hiệu lực:** redeploy project sau khi lưu biến.
- **Migration thất bại hoặc database thiếu bảng:** dừng thao tác thay đổi schema và đối chiếu lịch sử migration trước; không thử chạy migration/seed production một cách tùy tiện.

## 8. URL API sau deploy

Mọi route hiện có đều nằm dưới `/api`, ví dụ:

- `GET /api/`
- `GET /api/quizzes`
- `GET /api/quizzes/:id`
- `GET /api/quizzes/:id/package`
- `POST /api/login`
- `POST /api/register`

Đặt base URL production của client thành `https://<domain-cua-ban>/api` và nối các route tương ứng vào sau base URL.
