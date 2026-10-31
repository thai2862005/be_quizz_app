# Models, dữ liệu và API

Tài liệu này mô tả các model, nguồn dữ liệu và API hiện có trong ứng dụng Quiz Master. Những phần ghi **Đề xuất** là contract để tích hợp backend trong tương lai, chưa được triển khai trong ứng dụng.

## 1. Kiến trúc dữ liệu hiện tại

```text
UI / Fragment
    ↓
ViewModel (StateFlow)
    ↓
Repository
    ├── Retrofit ApiService (dữ liệu từ server)
    └── Room DAO (dữ liệu local)

MockDataProvider → một số màn hình giao diện hiện tại
```

- Model trong package `model` là model dùng cho giao diện/nghiệp vụ; không nên dùng trực tiếp làm request/response JSON hoặc entity Room.
- Model trong `data.remote.model` là DTO ánh xạ JSON của API.
- `UserEntity` là entity lưu user trong Room.
- `MockDataProvider` cung cấp dữ liệu mẫu cho các màn hình. Phần lớn category, hồ sơ, bảng xếp hạng, achievements, ngôn ngữ và kết quả mẫu chưa tải từ API.
- Cấu hình Retrofit hiện dùng `https://jsonplaceholder.typicode.com/`. Đây là API mẫu, không phải backend Quiz Master. Endpoint tải gói quiz đã khai báo trong app nhưng sẽ không hoạt động với base URL này nếu chưa thay bằng backend thật.

## 2. Domain models (`model`)

### User và thống kê

Trong [`User.kt`](app/src/main/java/com/example/myapplication/model/User.kt):

| Model | Mục đích | Trường chính |
|---|---|---|
| `User` | Hồ sơ người dùng trong UI/domain | `id`, `displayName`, `username`, avatar, level/XP, streak, win rate, số trận, rank, `stats` |
| `UserStats` | Tổng hợp thống kê học tập/thi đấu | tổng điểm, số câu đúng/đã trả lời, số điểm tuyệt đối, streak dài nhất |
| `UserBadge` | Huy hiệu của user | id, tiêu đề, mô tả, icon, ngày mở khóa, trạng thái mở khóa |

`User` là hồ sơ ứng dụng, khác với `UserDto`/`UserEntity` hiện tại vốn chỉ có `id`, `name`, `email`. Chưa có mapper hoặc API chuyển đổi giữa hai nhóm model.

### Quiz và kết quả

Trong [`Quiz.kt`](app/src/main/java/com/example/myapplication/model/Quiz.kt):

| Model / enum | Mục đích |
|---|---|
| `DifficultyLevel` | Độ khó `EASY`, `MEDIUM`, `HARD`; có nhãn tiếng Việt dùng trong UI |
| `QuizCategory` | Chủ đề có thể chọn: id, tiêu đề, mô tả, số câu, độ khó, tiến độ, tag, màu |
| `OngoingQuiz` | Tóm tắt một bài thi đang làm để hiển thị tiến độ/thời gian còn lại |
| `QuizOption` | Một lựa chọn trả lời; hiện chứa cả cờ `isCorrect` và trạng thái hiển thị |
| `OptionSelectionState` | Trạng thái UI: `NORMAL`, `SELECTED`, `CORRECT`, `WRONG` |
| `QuizQuestion` | Câu hỏi, category, danh sách lựa chọn, giải thích, thời gian trả lời |
| `QuizPackage` | Gói câu hỏi nhận từ repository, gồm `quizId` và danh sách câu hỏi |
| `QuizResult` | Kết quả tổng kết: điểm, số câu đúng, thời gian, XP, độ chính xác, sao và thông điệp |

`QuizPlayViewModel` giữ state khi thay đổi cấu hình màn hình và điều khiển timer/câu hỏi. `QuizResult` hiện được tạo từ logic phía app; chưa có API submit kết quả.

> **Bảo mật:** `QuizOption.isCorrect` đang tồn tại trong model domain và trường tương ứng có trong DTO quiz. Không gửi đáp án đúng xuống client trong sản phẩm thi thật nếu cần bảo đảm chống gian lận; server nên giữ đáp án, nhận câu trả lời/attempt ID và chấm điểm.

### Bảng xếp hạng

Trong [`LeaderboardEntry.kt`](app/src/main/java/com/example/myapplication/model/LeaderboardEntry.kt):

- `LeaderboardPeriod`: kỳ xếp hạng `WEEKLY`, `MONTHLY`, `ALL_TIME`.
- `LeaderboardEntry`: hạng, user, điểm, level, cờ user hiện tại và thay đổi thứ hạng.
- `PodiumEntry`: thông tin 3 vị trí đầu, gồm tên, avatar, điểm, level và danh hiệu.

Hiện dữ liệu leaderboard được lấy từ `MockDataProvider`, chưa có endpoint tương ứng.

### Achievement

Trong [`Achievement.kt`](app/src/main/java/com/example/myapplication/model/Achievement.kt):

- `AchievementTier`: cấp huy hiệu `BRONZE`, `SILVER`, `GOLD`, `EMERALD`.
- `AchievementItem`: nội dung, icon, cấp, tiến độ hiện tại/tối đa và trạng thái đã mở khóa.

UI hiện nhận danh sách từ mock; chưa có API/Repository achievements.

### Ngôn ngữ

Trong [`Language.kt`](app/src/main/java/com/example/myapplication/model/Language.kt), `LanguageItem` chứa mã locale, tên bản địa, tên hiển thị, cờ và trạng thái được chọn. Danh sách hiện lấy từ mock; chưa có API lưu tùy chọn ngôn ngữ.

## 3. DTO và Room entity

### Quiz DTO

Trong [`QuizPackageDto.kt`](app/src/main/java/com/example/myapplication/data/remote/model/QuizPackageDto.kt):

- `QuizPackageDto`: `quizId`, thời gian mặc định, cờ xáo trộn câu hỏi/lựa chọn, danh sách câu hỏi.
- `QuizQuestionDto`: id, nội dung, giải thích, thời gian riêng của câu và lựa chọn.
- `QuizOptionDto`: id, nội dung và cờ đáp án đúng.

Các trường nullable để nhận diện payload thiếu và trả lỗi dữ liệu không hợp lệ thay vì dùng dữ liệu thiếu như một câu hỏi hoàn chỉnh. [`QuizRepositoryImpl.kt`](app/src/main/java/com/example/myapplication/data/repository/QuizRepositoryImpl.kt) mapping DTO sang domain và kiểm tra:

- gói có ID và danh sách câu hỏi;
- câu hỏi có ID/nội dung, thời gian dương;
- mỗi câu có 2–4 lựa chọn, ID duy nhất và chính xác một đáp án đúng;
- nếu server trả nhiều câu hơn số yêu cầu, app chỉ lấy số câu đã yêu cầu.

### User DTO và Room

- [`UserDto.kt`](app/src/main/java/com/example/myapplication/data/remote/model/UserDto.kt): DTO của JSONPlaceholder (`id`, `name`, `email`).
- [`UserEntity.kt`](app/src/main/java/com/example/myapplication/data/local/entity/UserEntity.kt): entity Room trong bảng `users`, cùng ba trường.
- [`UserDao.kt`](app/src/main/java/com/example/myapplication/data/local/dao/UserDao.kt): đọc danh sách dạng `Flow`, đọc theo ID, insert/replace và xóa toàn bộ.
- [`AppDatabase.kt`](app/src/main/java/com/example/myapplication/data/local/AppDatabase.kt): Room database `app_database.db`, version 1.

## 4. API hiện có và cách lấy dữ liệu

### API user mẫu

[`ApiService.kt`](app/src/main/java/com/example/myapplication/data/remote/api/ApiService.kt) khai báo:

| Method | Path | Mục đích |
|---|---|---|
| `GET` | `/users` | Lấy danh sách user mẫu |
| `GET` | `/users/{id}` | Lấy một user mẫu theo ID |

Base URL hiện là `https://jsonplaceholder.typicode.com/`. `UserRepositoryImpl.refreshUsers()` gọi `GET /users`, map `UserDto` sang `UserEntity` rồi lưu Room. `MainViewModel.users` quan sát dữ liệu local bằng `Flow`; `fetchUsers()` yêu cầu repository refresh.

`getUserById()` trong repository hiện chỉ đọc Room, không gọi endpoint `GET /users/{id}`.

### API lấy gói quiz

API được khai báo trong cùng `ApiService`:

```http
GET /topics/{topicId}/quiz-package?difficulty={easy|medium|hard}&count={number}
```

Mục đích: tải gói câu hỏi theo chủ đề, độ khó và số lượng người dùng chọn. Ví dụ request:

```http
GET /topics/cat_tech/quiz-package?difficulty=hard&count=10
```

Response dự kiến theo DTO:

```json
{
  "quizId": "quiz-123",
  "timeLimitSeconds": 15,
  "shuffleQuestions": false,
  "shuffleOptions": true,
  "questions": [
    {
      "id": "question-1",
      "questionText": "Nội dung câu hỏi?",
      "explanation": "Giải thích đáp án.",
      "timeLimitSeconds": 20,
      "options": [
        { "id": "option-a", "text": "Đáp án A", "isCorrect": true },
        { "id": "option-b", "text": "Đáp án B", "isCorrect": false }
      ]
    }
  ]
}
```

Luồng gọi: chọn chủ đề → cấu hình độ khó/số câu → `QuizPlayViewModel` phát Loading → `QuizRepository` gọi Retrofit → validate/map response → state Playing hoặc Error. Coroutine được gắn với `viewModelScope`; timeout, lỗi kết nối, lỗi server, HTTP và payload sai được phân loại để UI hiển thị thông báo/retry.

**Lưu ý:** endpoint và JSON trên chỉ là contract phía client dự kiến. Cần thay base URL trong [`NetworkModule.kt`](app/src/main/java/com/example/myapplication/di/NetworkModule.kt), đồng thời đồng bộ path, query và schema với backend thật. JSONPlaceholder không có route quiz này.

### Backend trong repository này

Backend hiện cung cấp endpoint theo ID quiz (chưa có topic/category):

```http
GET /api/quizzes/{quizId}/package?difficulty=EASY&count=10
```

`difficulty` nhận `EASY`, `MEDIUM` hoặc `HARD`; `count` mặc định là 10 và tối đa 50. Response hiện trả `isCorrect` trên từng lựa chọn cho cả quiz package và endpoint quiz cũ để hỗ trợ luồng luyện tập. Điều này làm lộ đáp án chuẩn cho client; không dùng API này cho kỳ thi cần bảo mật đáp án.

```json
{
  "data": {
    "quizId": "1",
    "difficulty": "easy",
    "questions": [
      {
        "id": "12",
        "questionText": "Nội dung câu hỏi?",
        "options": [
          { "id": "45", "text": "Đáp án A" },
          { "id": "46", "text": "Đáp án B" }
        ]
      }
    ]
  },
  "message": "Quiz package retrieved successfully"
}
```

## 5. Đăng nhập và đăng xuất

### Trạng thái hiện tại

Trong source hiện tại chưa có:

- model request/response đăng nhập, API login/logout hoặc auth repository;
- màn hình đăng nhập, token/access-token, refresh-token hay interceptor gắn token;
- lưu phiên đăng nhập an toàn hoặc logic thu hồi phiên khi logout.

`User` chỉ là domain model hồ sơ. `UserDto` là DTO dữ liệu demo của JSONPlaceholder, **không phải** kết quả đăng nhập. Không được coi `GET /users` là xác thực người dùng.

### Contract backend đề xuất (chưa được triển khai)

Backend có thể cung cấp các endpoint sau; cần điều chỉnh theo chuẩn xác thực thực tế:

| Method | Path đề xuất | Mục đích |
|---|---|---|
| `POST` | `/auth/login` | Xác minh thông tin đăng nhập và cấp phiên/token |
| `POST` | `/auth/refresh` | Đổi access token khi hết hạn (nếu backend dùng refresh token) |
| `POST` | `/auth/logout` | Thu hồi refresh token/phiên phía server |
| `GET` | `/me` | Tải hồ sơ user đã xác thực |

Request login minh họa:

```json
{
  "email": "user@example.com",
  "password": "••••••••"
}
```

Response minh họa, không phải schema đã có trong code:

```json
{
  "accessToken": "<short-lived-token>",
  "refreshToken": "<rotating-refresh-token>",
  "expiresIn": 900,
  "user": {
    "id": "user-123",
    "displayName": "Quiz User",
    "username": "quiz_user"
  }
}
```

Luồng dự kiến:

1. Login gửi HTTPS request qua AuthRepository; không ghi mật khẩu vào log hoặc lưu lâu dài.
2. Token chỉ được lưu bằng kho bảo mật phù hợp (ví dụ Android Keystore-backed storage), không dùng Room thường hoặc preferences không mã hóa để lưu refresh token.
3. Network interceptor đính access token vào request cần xác thực; không đính token cho host không tin cậy.
4. Khi logout, gọi API revoke token nếu backend hỗ trợ, xóa token local và làm sạch state/cache user. UI phải về trạng thái chưa đăng nhập dù request logout thất bại; báo lỗi server riêng nếu không revoke được phiên server.
5. Backend phải xác thực, giới hạn tần suất login và không tin dữ liệu hồ sơ/điểm số do client tự khai.

Các bước này chỉ là hướng thiết kế để bổ sung sau; chưa có code để gọi hoặc kiểm chứng các endpoint auth.

## 6. Phần dữ liệu hiện vẫn là mock

[`MockDataProvider.kt`](app/src/main/java/com/example/myapplication/model/MockDataProvider.kt) cung cấp user hiện tại, daily challenge, categories, quiz đang làm, achievements, kết quả, leaderboard, ngôn ngữ và câu hỏi mẫu. Các màn Home, Category, Profile, Leaderboard, Language, Result vẫn đang tiêu thụ dữ liệu mock ở một số luồng. Gói quiz trong luồng tải mới sử dụng Repository/API đã khai báo; cần cấu hình backend thật trước khi gọi thành công.

## 7. Khi bổ sung API model mới

1. Định nghĩa DTO trong `data/remote/model`; tránh dùng DTO làm UI state.
2. Thêm Retrofit method trong `ApiService` và thống nhất schema với backend.
3. Thêm repository interface/implementation; map DTO sang domain model và xử lý lỗi rõ ràng.
4. Đăng ký Repository/ViewModel trong Koin.
5. Cho ViewModel phát UI state qua `StateFlow`; Fragment thu thập theo lifecycle.
6. Thêm unit test cho mapping, payload lỗi, HTTP error, timeout và cancellation.
7. Không trả đáp án đúng, thông tin phân quyền hay secret xuống app nếu backend cần giữ kín.
