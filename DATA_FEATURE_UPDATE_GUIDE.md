# Hướng dẫn cập nhật data và chức năng Quiz App

Tài liệu này chuyển các nhu cầu trong [`Update_data.md`](./Update_data.md) thành kế hoạch triển khai cho **backend hiện tại**. Mục tiêu là bổ sung chức năng theo từng lát dọc (data → API → nghiệp vụ → kiểm thử), không viết lại toàn bộ ứng dụng và không nhầm contract Android dự kiến với API backend đã có.

## 1. Kết luận sau khi đối chiếu

`Update_data.md` mô tả một Android client dùng Retrofit, Room, Repository và ViewModel. Repository này là backend Node.js/TypeScript dùng Express và Prisma; source Android không nằm trong workspace hiện tại. Vì vậy:

- Tài liệu Android là **nguồn yêu cầu và contract tham khảo**, không phải bằng chứng rằng các endpoint đã hoạt động.
- Backend hiện có các model `User`, `role`, `Quiz`, `Question`, `Answer`, `Result` trong [`prisma/schema.prisma`](./prisma/schema.prisma).
- Các route được gắn dưới `/api` trong [`src/router/api.ts`](./src/router/api.ts). Những route chính hiện có gồm `/login`, `/register`, `/account`, `/users`, `/quizzes`, `/results`, `/top-scores` và `/top-7-10-scores`.
- Backend chưa có các entity/API riêng cho category/topic, quiz attempt, achievements, tùy chọn ngôn ngữ hoặc leaderboard theo tuần/tháng/tất cả thời gian.
- `Quiz` hiện không có `topicId`, giới hạn thời gian hoặc cờ xáo trộn. `Question` có mức `EASY`, `MEDIUM`, `HARD`; backend hỗ trợ lấy gói câu hỏi theo quiz và mức độ qua `GET /api/quizzes/:id/package`.
- Các API đọc quiz hiện trả `isCorrect` theo yêu cầu của luồng luyện tập; điều này làm lộ đáp án cho client và không phù hợp với bài thi cần chống gian lận.
- Contract đăng nhập trong tài liệu Android (`/auth/login`, `accessToken`, `/me`) không trùng contract backend (`/api/login`, `access_token`, `/api/account`). Cần chốt một contract chung trước khi tích hợp client.
- Cấu hình hiện tại dùng MySQL (`DATABASE_URL` có scheme `mysql://`). Database được kiểm tra có các bảng dịch `quiz_translations`, `question_translations`, `answer_translations`; hai migration đã áp dụng có tên khác với migration trong repository. Không chạy migrate/seed cho đến khi đồng bộ lịch sử migration; không reset hoặc tạo baseline một cách tùy tiện.

## 2. Nguyên tắc thiết kế

1. **Database là nguồn sự thật cho dữ liệu bền vững.** Không đưa mock hoặc dữ liệu UI vào service/API như thể đó là dữ liệu thật.
2. **Tách lớp theo trách nhiệm:** Router xác định endpoint/middleware; Controller đọc HTTP và trả response; Service xử lý quy tắc nghiệp vụ; Prisma/repository truy cập database. Không đặt logic tính điểm trong controller.
3. **Tách model lưu trữ, DTO API và model UI.** Không trả thẳng Prisma record hoặc dùng model Android làm schema database.
4. **Validate ở biên hệ thống.** Kiểm tra params, query và body trước khi gọi service; lỗi đầu vào trả 400 có cấu trúc thống nhất.
5. **Không phá API hiện hữu trong một lần cập nhật.** Giữ contract cũ hoặc tạo `/api/v1` làm contract mới; có thời gian chuyển tiếp cho client trước khi bỏ route cũ.
6. **Migration phải tiến về phía trước và có thể triển khai lặp lại.** Mỗi thay đổi schema đi cùng migration đã review, không sửa migration đã deploy.
7. **Server quyết định quyền và kết quả.** Không tin `userId`, đáp án đúng, tổng điểm hay role do client tự khai.

## 3. Kiến trúc đích, triển khai tăng dần

Giữ cấu trúc hiện tại để tránh refactor diện rộng:

```text
src/
  router/       # mount endpoint, middleware
  controller/   # HTTP parsing, status code, response DTO
  service/      # nghiệp vụ, authorization theo use case
  repository/   # truy vấn Prisma (tách dần khi cần/test)
  validation/   # kiểm tra params/query/body
  type/         # type mở rộng cho Express và type dùng chung
prisma/
  schema.prisma
  migrations/
```

Hiện một số service gọi Prisma trực tiếp; có thể tiếp tục với feature nhỏ. Khi thêm một feature mới, gom các truy vấn của feature vào service rõ ràng và chỉ thêm repository riêng nếu cần tái sử dụng, transaction phức tạp hoặc test độc lập. Không tạo abstraction chỉ để đổi tên các lệnh Prisma.

Luồng request nên là:

```text
Router → auth/role middleware → validate request → Controller → Service → Prisma
                                                        ↓
                                                response DTO ổn định
```

## 4. Contract hiện tại và contract cần thống nhất

Base path hiện tại là `/api`. Bảng này phản ánh source code, không cam kết các endpoint đã được test với client:

| Chức năng | Backend hiện tại | Yêu cầu/contract trong `Update_data.md` | Việc cần làm |
|---|---|---|---|
| Đăng nhập | `POST /api/login`, trả `access_token` | `POST /auth/login`, ví dụ trả `accessToken` và user | Chốt một response; adapter/alias chuyển tiếp nếu cần tương thích client cũ |
| Đăng ký | `POST /api/register` | Chưa có contract cụ thể trong tài liệu Android | Xác định validation và response công khai |
| Hồ sơ hiện tại | `GET /api/account` | `GET /me` | Map sang profile DTO; không trả Prisma record trực tiếp |
| Danh sách quiz | `GET /api/quizzes` | Tải gói theo topic, độ khó, số câu | Đã có mức độ và package theo quiz; topic/category vẫn cần thiết kế |
| Quiz theo ID | `GET /api/quizzes/:id` | Quiz package/questions | Trả lựa chọn kèm `isCorrect` cho luồng luyện tập |
| Gửi kết quả | `POST /api/Your-results`, `POST /api/results` | Submit attempt và nhận điểm do server chấm | Thiết kế attempt/answer submission; không tin score từ client |
| Leaderboard | `/api/top-scores`, `/api/top-7-10-scores` | Period `WEEKLY`, `MONTHLY`, `ALL_TIME` | Làm rõ cách tính điểm và khoảng thời gian; thêm query period |
| Category, achievement, language | Chưa có route/model tương ứng | Có model/UI mock phía Android | Thêm từng feature theo ưu tiên, không gom vào user/quiz record |

### Quyết định tương thích API

- Với ứng dụng đã phát hành, chọn một trong hai cách: giữ nguyên route cũ và bổ sung route mới; hoặc version hóa contract mới dưới `/api/v1`. Không đổi tên field/route hiện tại mà không có kế hoạch chuyển đổi client.
- Response mới nên dùng một envelope nhất quán, ví dụ `{ "data": ..., "message": "..." }`; lỗi có `code` ổn định và message không chứa stack trace hoặc dữ liệu nhạy cảm.
- Chốt kiểu ID (`Int` hiện tại hay chuỗi như `quizId` trong Android), tên field, nullable, enum, pagination và quy tắc lỗi với đội client trước khi phát triển.

## 5. Thiết kế dữ liệu theo feature

Không cần triển khai toàn bộ schema dưới đây ngay. Đây là các quan hệ cần cân nhắc khi backend và client thống nhất nghiệp vụ.

### Quiz, topic và câu hỏi

Schema hiện tại gắn `Question` trực tiếp với `Quiz`, và `Quiz` thuộc một user. Để hỗ trợ tìm quiz theo chủ đề/độ khó, cần quyết định trước:

- Topic/category là danh mục dùng chung hay mỗi user tự tạo?
- Quiz là nội dung do admin tạo, do user tạo hay cả hai?
- Một quiz thuộc một hay nhiều topic?
- `difficulty`, `timeLimitSeconds`, trạng thái publish và chính sách shuffle thuộc quiz hay từng lần attempt?
- Danh sách quiz-package có cần phân trang/phiên bản nội dung không?

Một phương án tối thiểu là thêm model `Category` (id, name, description, status), quan hệ `Quiz`–`Category`, cùng các metadata cần cho việc chọn quiz. Không dùng trường `description` để nhét category hoặc độ khó. Tên model/quan hệ chỉ chốt sau khi xác nhận quy tắc sản phẩm.

### Attempt và chấm điểm

`Result` hiện lưu `score`, `sum`, `userId`, `quizId`; chưa thể hiện câu trả lời từng câu, trạng thái đang làm hay thời gian hoàn thành. Với luồng thi thật, cân nhắc:

- `QuizAttempt`: user, quiz, trạng thái, thời điểm bắt đầu/kết thúc, điểm server tính.
- `AttemptAnswer`: attempt, question, selected answer(s), thời gian trả lời.
- Ràng buộc unique phù hợp và transaction để lưu kết quả/đáp án nhất quán.

Chỉ tạo các bảng này nếu cần resume attempt, lịch sử chi tiết, chống gửi lặp hoặc thống kê theo câu. Nếu chỉ cần tổng kết, có thể mở rộng `Result` trước nhưng vẫn phải tính điểm trên server.

### User, profile và auth

`User` hiện có `name`, `email`, `password`, role; chưa tương đương profile Android gồm avatar, XP, streak, rank và thống kê. Tách profile/statistics thành field/model phù hợp nghiệp vụ thay vì trả giá trị giả cho client. Rank và thống kê có thể là giá trị tính từ kết quả, không nhất thiết lưu trùng dữ liệu.

Không trả `password`/hash hoặc record Prisma đầy đủ trong response. Trước khi đồng bộ auth, cần chốt cơ chế hash mật khẩu, payload JWT, tên biến secret và hành vi logout/refresh. Các xử lý auth hiện có trong [`src/service/auth.service.ts`](./src/service/auth.service.ts) và [`src/midlewhere/jwt.midlewhere.ts`](./src/midlewhere/jwt.midlewhere.ts) cần được kiểm tra, thống nhất với nhau trước khi coi contract là production-ready.

### Leaderboard, achievements và language

- **Leaderboard:** xác định metric (tổng điểm, điểm cao nhất hay điểm trong kỳ), timezone/ranh giới kỳ, quy tắc hòa điểm, số item và cách phân trang. Không suy diễn `WEEKLY`/`MONTHLY` từ các endpoint top-score hiện tại.
- **Achievement:** lưu định nghĩa achievement tách khỏi trạng thái user đạt được; tiến độ cần xác định được nguồn tính. Nếu có thể tính lại từ kết quả thì tránh lưu nhiều nguồn sự thật.
- **Language:** danh sách locale có thể là cấu hình tĩnh của app; chỉ lưu locale user đã chọn nếu cần đồng bộ giữa thiết bị. Không cần API/database chỉ để tải một danh sách hằng số không đổi.

## 6. API quiz-package và submit đề xuất

Contract Android hiện tham khảo:

```http
GET /topics/{topicId}/quiz-package?difficulty=hard&count=10
```

Đây **chưa phải endpoint backend hiện hành**. Sau khi bổ sung topic/category và thống nhất ID, có thể giữ route tương thích hoặc đưa vào `/api/v1`. Response cho client chỉ chứa nội dung câu hỏi và lựa chọn:

```json
{
  "data": {
    "quizId": "quiz-123",
    "attemptId": "attempt-456",
    "timeLimitSeconds": 15,
    "questions": [
      {
        "id": "question-1",
        "questionText": "Nội dung câu hỏi?",
        "timeLimitSeconds": 20,
        "options": [
          { "id": "option-a", "text": "Đáp án A" },
          { "id": "option-b", "text": "Đáp án B" }
        ]
      }
    ]
  }
}
```

Không thêm `isCorrect` vào payload thi thật. Submit nên gửi `attemptId` và các `questionId`/`optionId` người dùng chọn; server kiểm tra attempt thuộc user đã xác thực, câu hỏi thuộc quiz, dữ liệu chưa bị submit trước đó, rồi tự chấm điểm. Endpoint submit/attempt chưa được triển khai.

## 7. Quy trình triển khai từng thay đổi

### Bước 0 — Chốt contract và kiểm tra trạng thái database

1. Xác nhận client cần hỗ trợ, route/field cần giữ tương thích và hành vi sản phẩm còn chưa rõ.
2. Kiểm tra `DATABASE_URL`, provider đang dùng và migration đã áp dụng trên từng môi trường.
3. Xem `git status` và lịch sử migration. Migration hiện trong repository dùng cú pháp MySQL; xác minh chúng tương ứng với trạng thái thực tế của database trước khi deploy.
4. Không chạy `prisma migrate reset`, không xóa dữ liệu thật và không dùng `db push` thay migration cho môi trường production.

### Bước 1 — Cập nhật schema

1. Thêm model/field cần cho đúng một feature; khai báo relation, index, unique và hành vi xóa rõ ràng.
2. Kiểm tra nullable/default và tác động với dữ liệu hiện có. Thêm field bắt buộc cho bảng đã có dữ liệu phải có chiến lược backfill.
3. Với môi trường development đã có migration baseline hợp lệ, tạo migration có tên mô tả thay đổi:

   ```bash
   npx prisma migrate dev --name add_quiz_categories
   npx prisma generate
   ```

4. Review SQL migration và test trên database development có dữ liệu tương tự. Không sửa migration đã deploy; tạo migration mới để điều chỉnh.
5. Trong deploy, chạy `npx prisma migrate deploy` sau khi backup/đảm bảo rollback plan theo quy trình vận hành.

### Bước 2 — Bổ sung API theo lát dọc

Với mỗi endpoint:

1. Khai báo route và middleware cần thiết trong [`src/router/api.ts`](./src/router/api.ts).
2. Validate params/query/body trước khi gọi service; phân biệt 400 (dữ liệu sai), 401 (chưa xác thực), 403 (không đủ quyền), 404 và lỗi server.
3. Controller gọi một use case trong service, chuyển kết quả thành DTO công khai và đặt HTTP status rõ ràng.
4. Service kiểm tra quyền sở hữu/role và thực hiện nghiệp vụ; dùng transaction khi nhiều thao tác cần commit cùng nhau.
5. Truy vấn chỉ lấy field cần trả về; tuyệt đối không serialize nguyên user/password. Chỉ trả `isCorrect` nếu sản phẩm chấp nhận lộ đáp án và không dùng cho bài thi bảo mật.
6. Thêm test cho đường thành công, dữ liệu không hợp lệ, không tìm thấy, không đủ quyền và lỗi database.

### Bước 3 — Kết nối client

1. Đồng bộ OpenAPI/schema JSON, enum, quy tắc ID, pagination và error response với Android.
2. Thêm DTO/mapper ở client; giữ domain/UI model tách khỏi JSON response và Room entity.
3. Chuyển từng màn mock sang Repository/API; giữ mock chỉ trong test/demo, không trộn fallback giả vào luồng production.
4. Xác định cache/offline và nguồn sự thật cho từng loại dữ liệu trước khi thêm Room persistence hoặc đồng bộ nền.
5. Xóa mock cho một feature sau khi API, loading/error/empty state và kiểm thử tích hợp đã hoạt động.

## 8. Thứ tự ưu tiên đề xuất

1. **Ổn định contract và nền dữ liệu:** xác minh migrations/provider, chuẩn hóa DTO/error và auth; tránh mở rộng schema khi lịch sử migration chưa rõ.
2. **Quiz đọc:** category/topic → truy vấn quiz theo filter → quyết định rõ endpoint luyện tập nào được phép trả `isCorrect`.
3. **Attempt và kết quả:** server-side grading, ràng buộc quyền sở hữu, lịch sử của user hiện tại.
4. **Profile và leaderboard:** thống nhất metric/rank/period, chỉ trả dữ liệu cần cho UI.
5. **Achievements:** xác định rule và cách tính tiến độ rồi mới tạo persistence/API.
6. **Language:** giữ danh mục locale tĩnh ở client nếu không có yêu cầu quản trị/dynamic; chỉ đồng bộ lựa chọn user khi cần.

Mỗi mục nên được phát hành độc lập sau khi có migration, API contract, test và kiểm thử client tương ứng.

## 9. Checklist hoàn tất cho một feature

- [ ] Yêu cầu và API contract được thống nhất với client.
- [ ] Schema giữ đúng nguồn sự thật, có quan hệ/index/ràng buộc phù hợp.
- [ ] Migration mới được review, chạy được trên database rỗng và database có dữ liệu.
- [ ] Request được validate; quyền truy cập dựa trên identity đã xác thực.
- [ ] Response DTO không làm lộ field nội bộ hoặc password/hash; việc trả đáp án đúng được giới hạn theo mục đích sản phẩm.
- [ ] Lỗi và status code nhất quán; không trả thành công giả khi thao tác thất bại.
- [ ] Có test service/API cho happy path và các trường hợp lỗi chính.
- [ ] Client xử lý loading, empty, retry/error và mapping DTO → domain model.
- [ ] Seed chỉ chứa dữ liệu cần cho development/test; không tự seed dữ liệu nghiệp vụ mỗi lần server khởi động.
- [ ] README/API docs được cập nhật cùng thay đổi.

## 10. Các lệnh kiểm tra trong repository

```bash
# Kiểm tra TypeScript
npm run build

# Kiểm tra Prisma schema/client
npx prisma validate
npx prisma generate

# Sau khi đã xác minh migration history và DATABASE_URL
npx prisma migrate dev --name <descriptive_name>
```

`npm test` hiện chưa chạy suite kiểm thử thực tế; script trong `package.json` chỉ in thông báo lỗi. Thêm test runner và test API/service là một công việc riêng cần thống nhất trước khi xem lệnh đó là validation.

## 11. Tham chiếu code hiện tại

- Schema: [`prisma/schema.prisma`](./prisma/schema.prisma)
- Khởi tạo Express và seed: [`src/app.ts`](./src/app.ts), [`src/config/seed.ts`](./src/config/seed.ts)
- Routes: [`src/router/api.ts`](./src/router/api.ts)
- Controllers: [`src/controller/`](./src/controller/)
- Services: [`src/service/`](./src/service/)
- JWT middleware: [`src/midlewhere/jwt.midlewhere.ts`](./src/midlewhere/jwt.midlewhere.ts)
- Tài liệu model/API phía Android được dùng làm yêu cầu: [`Update_data.md`](./Update_data.md)
