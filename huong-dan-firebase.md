# Hướng dẫn cài Firebase cho Sổ tay chuyến đi (bản có tài khoản)

Bản này có **đăng ký, đăng nhập bằng tên đăng nhập + mật khẩu**, và **mời người đi cùng bằng tên đăng nhập**. Không còn mã `HG-…` nữa.

Thời gian làm: khoảng 15 phút. Chi phí: 0 đồng (gói Spark miễn phí).

> Bạn đã có dự án Firebase "First project By me", Web app, Firestore và đã giới hạn API key. Dự án đó **dùng tiếp được**, chỉ cần làm 3 việc trong mục **"Đã làm bản trước? Chỉ cần làm 3 việc"** ngay dưới đây.

---

## Đã làm bản trước? Chỉ cần làm 3 việc

1. **Bật Email/Password** trong Authentication (mục 3).
2. **Dán Rules mới** rồi bấm Publish (mục 5).
3. **Dán lại `firebaseConfig`** vào `index.html` mới, rồi đẩy lên GitHub (mục 6 và 7).

Sau đó mở trang, đăng ký tài khoản, bấm **"Đưa vào tài khoản"** để chuyển các chuyến đang lưu trên máy vào tài khoản (mục 8.6).

---

## 1. Tạo dự án Firebase (bỏ qua nếu đã có)

1. Vào **https://console.firebase.google.com** và đăng nhập bằng tài khoản Google.
2. **Create a project** → đặt tên → **tắt** Google Analytics → **Create project**.

Gặp lỗi "You've reached the project limit" thì không tạo thêm được nữa. Dùng dự án có sẵn, hoặc **Add Firebase to Google Cloud project**.

---

## 2. Thêm Web app và lấy `firebaseConfig` (bỏ qua nếu đã có)

1. **Project Overview** → biểu tượng **Web** `</>`.
2. Đặt tên app, **không** tick Firebase Hosting → **Register app**.
3. Sao chép phần `{ ... }` của `firebaseConfig`:

   ```js
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "first-project-by-me.firebaseapp.com",
     projectId: "first-project-by-me",
     storageBucket: "first-project-by-me.firebasestorage.app",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abcdef"
   };
   ```

Mất đoạn này thì vào **⚙️ Project settings → General → Your apps → Config** để xem lại.

---

## 3. Bật đăng nhập Email/Password

Trang đổi **tên đăng nhập** thành một email nội bộ dạng `ten@<projectId>.firebaseapp.com` để dùng kiểu đăng nhập Email/Password của Firebase. **Không có email nào được gửi đi**, người dùng chỉ thấy tên đăng nhập.

1. Menu trái → **Authentication** → tab **Sign-in method**.
2. Bấm **Add new provider** → chọn **Email/Password**.
3. Gạt **Email/Password** sang **Enable**. Dòng **Email link (passwordless sign-in)** để **tắt**.
4. **Save**. Danh sách phải có dòng **Email/Password · Enabled**.

**Anonymous** (bật ở bản trước) không còn dùng nữa. Có thể tắt đi: bấm vào dòng **Anonymous** → gạt **Enable** sang tắt → **Save**.

Kiểm tra thêm: tab **Settings → User actions** → ô **Enable create (sign-up)** phải được tick (mặc định là có). Bỏ tick ô này thì không ai đăng ký được.

---

## 4. Tạo Firestore Database (bỏ qua nếu đã có)

1. Menu trái → **Firestore Database** → **Create database**.
2. Edition **Standard**, Database ID để **`(default)`**.
3. Location **`asia-southeast1 (Singapore)`**. Không đổi được sau khi tạo.
4. **Start in production mode** → **Create**.

Không cần tự tạo collection. Trang tự tạo `trips` và `usernames` khi dùng.

---

## 5. Dán Rules mới (bắt buộc)

1. **Firestore Database** → tab **Rules**.
2. Xoá hết nội dung cũ, dán **toàn bộ** file `firestore.rules` mới.
3. Bấm **Publish**, đợi khoảng 1 phút mới có hiệu lực.

Rules mới làm những việc sau:

| Ai | Được làm gì |
|---|---|
| Người chưa đăng nhập | Không đọc, không ghi được gì |
| Người tạo chuyến (chủ chuyến) | Sửa, tick, mời, huỷ lời mời, **mời người khác ra**, **xoá chuyến** |
| Thành viên | Sửa lịch trình, tick, mời thêm người, đổi tên hiển thị của mình, **tự rời chuyến** |
| Người đang được mời | Xem tên chuyến, **Nhận** (tự thêm mình vào) hoặc **Từ chối** |
| Người ngoài | Không xem được, không tự thêm mình vào chuyến được |
| Tên đăng nhập | Ai đăng nhập cũng tra được tên → uid để mời, nhưng **không liệt kê** được danh sách người dùng. Mỗi người chỉ đăng ký được đúng tên của mình |

Rules cũ cho các chuyến mã `HG-…` bị thay hẳn. Các tài liệu cũ đó vẫn nằm trong Firestore nhưng không ai mở được nữa. Muốn dọn thì vào tab **Data** xoá các document có id bắt đầu bằng `HG-`.

---

## 6. Dán cấu hình vào `index.html`

1. Mở `index.html`, tìm (Ctrl+F) dòng **`CẤU HÌNH FIREBASE`** (khoảng dòng **365**).
2. Ngay dưới là đoạn đang để trống:

   ```js
   const FIREBASE_CONFIG = {
     apiKey: "",
     authDomain: "",
     projectId: "",
     storageBucket: "",
     messagingSenderId: "",
     appId: ""
   };
   ```

3. Điền giá trị từ bước 2 vào trong dấu ngoặc kép, lưu file.

Lưu ý:
- Giữ tên `FIREBASE_CONFIG`, **không** dán thêm dòng `import` hay `initializeApp`.
- **`projectId` phải điền đúng.** Tên đăng nhập được ghép với `projectId` thành email nội bộ, đổi `projectId` về sau thì tài khoản cũ sẽ không đăng nhập được.
- Để trống `apiKey` thì trang chạy **chế độ dùng thử**: không có màn hình đăng nhập, chỉ lưu trên máy. Bản xem trước trên Claude đang chạy chế độ này.

---

## 7. Đưa lên GitHub Pages

Bản có chế độ mất sóng gồm **7 file**, tất cả để chung thư mục gốc của repo, cạnh nhau:

| File | Dùng để |
|---|---|
| `index.html` | Trang chính (nhớ dán `FIREBASE_CONFIG`) |
| `sw.js` | Lưu sẵn trang để mở được khi mất sóng |
| `manifest.json` | Thông tin app khi thêm vào màn hình chính |
| `icon-180.png` | Biểu tượng cho iPhone, iPad |
| `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | Biểu tượng cho Android |

1. Vào repo `vn-travel-tour` → **Add file → Upload files** → kéo cả 7 file vào (ghi đè `index.html` cũ) → **Commit changes**.
2. Đợi 1–2 phút, mở `https://giangit22.github.io/vn-travel-tour/`. Trên điện thoại thì tải lại mạnh, hoặc tắt hẳn rồi mở lại nếu đã thêm vào màn hình chính.
3. Nếu đã thêm vào màn hình chính từ trước, nên **xoá biểu tượng cũ rồi thêm lại** để có biểu tượng mới.

Lần sau chỉ sửa `index.html` thì chỉ cần tải lại đúng file đó. Trang tự cập nhật bản mới khi có mạng.

---

## 7b. Dùng khi mất sóng

**Chuẩn bị trước khi đi (khi còn mạng, ví dụ ở nhà hoặc trên xe khách):**
1. Mở trang một lần trên **đúng điện thoại sẽ mang đi**, đăng nhập, mở chuyến đi.
2. Kéo xuống mục **Dữ liệu của bạn**: phải thấy dòng **"Đã tải sẵn, mất sóng vẫn mở được trang"** (chấm xanh). Đang hiện "Đang tải sẵn…" thì đợi vài giây.
3. Trong app **Google Maps**: tìm "Hà Giang" → bấm tên địa điểm → **⋯** → **Tải bản đồ ngoại tuyến** → chọn vùng phủ cả Quản Bạ, Yên Minh, Đồng Văn, Mèo Vạc → **Tải xuống**. Mẫu Hà Giang đã có mục này trong Hành trang, nhóm Điện tử.
4. iPhone, iPad: nên dùng bản **Thêm vào MH chính** và mở từ biểu tượng đó.

**Khi mất sóng:**
- Đầu trang hiện thanh vàng **"Đang mất sóng · thay đổi vẫn lưu trên máy, có mạng sẽ tự gửi"**.
- **Vẫn làm được:** mở trang (kể cả tắt hẳn rồi mở lại), xem lịch trình, tick, sửa lịch trình, thêm quán, thêm đồ, chuyển chuyến.
- **Cần mạng:** đăng nhập lần đầu hoặc đăng ký, mời người, nhận hoặc từ chối lời mời, mời ra, đổi tên hoặc mật khẩu, đăng xuất, xem bản đồ nhúng. Trang sẽ báo nếu bạn bấm khi đang mất sóng.
- Nút **Chỉ đường** vẫn mở app Google Maps, app dùng được bản đồ đã tải ở bước 3.

**Khi có sóng lại:**
- Trang báo **"Có mạng lại, đang gửi thay đổi…"**, rồi tự gửi mọi tick và chỉnh sửa lúc mất sóng. Người đi cùng thấy sau vài giây.
- Thay đổi chưa gửi vẫn được giữ kể cả khi bạn tắt trang, tắt máy. Lần mở sau có mạng sẽ gửi tiếp.
- Hai người cùng **tick** lúc mất sóng thì không sao, các tick được gộp lại. Hai người cùng **sửa lịch trình** lúc mất sóng thì bản gửi sau cùng được giữ. Lúc mất sóng nên để một người sửa lịch trình thôi.

---

## 8. Cách dùng

### 8.1 Đăng ký, đăng nhập

- Mở trang sẽ gặp màn hình **Đăng nhập / Đăng ký**.
- **Đăng ký:** chọn tab **Đăng ký**, điền:
  - **Tên đăng nhập:** 3–20 ký tự, chữ không dấu, số, `.` `-` `_`. Gõ có dấu hay chữ hoa, trang tự đổi (ví dụ "Minh Nguyễn" thành `minhnguyen`).
  - **Tên hiển thị:** tên người đi cùng nhìn thấy, ví dụ "Minh".
  - **Mật khẩu:** tối thiểu 6 ký tự, nhập 2 lần.
- **Đăng nhập** ở máy khác bằng cùng tên và mật khẩu là thấy đủ các chuyến.
- Đã đăng nhập thì lần sau mở trang vào thẳng, kể cả khi mất mạng.

⚠️ Không có email nên **quên mật khẩu không tự lấy lại được**. Xem mục 12 nếu lỡ quên.

### 8.2 Tạo chuyến

- Chưa có chuyến nào: bấm **Tạo từ mẫu Hà Giang** hoặc **Chuyến trống**.
- Đã có chuyến: bấm **＋ Mới** ở đầu trang.
- Người tạo là **chủ chuyến**.

### 8.3 Mời người đi cùng

1. Người đi cùng **đăng ký tài khoản trước** rồi gửi bạn tên đăng nhập của họ (ví dụ `lan`).
2. Bấm nút **"Mời người đi cùng · đã đồng bộ"** dưới đồng hồ đếm ngược (hoặc kéo xuống mục **Người đi cùng**).
3. Gõ tên đăng nhập của họ → **Mời**. Danh sách hiện họ với trạng thái "Đang chờ nhận lời", bấm **Huỷ mời** nếu mời nhầm.
4. Người được mời mở trang sẽ thấy khung hồng **"Minh mời bạn vào chuyến …"** → **Nhận** để vào chuyến, hoặc **Từ chối**.

Sau khi nhận, mọi người trong chuyến cùng sửa lịch trình và tick. Bên này đổi gì, bên kia thấy sau 1–2 giây. Ô chọn chuyến hiện thêm "· 2 người".

### 8.4 Rời chuyến, mời ra, xoá chuyến

- **Thành viên rời chuyến:** **Sửa** → **Tên, ngày đi** → **Rời chuyến này** (bấm 2 lần).
- **Chủ chuyến mời ai đó ra:** mục **Người đi cùng** → **Mời ra** cạnh tên người đó (bấm 2 lần). Máy của họ sẽ báo "Bạn không còn trong chuyến…".
- **Chủ chuyến xoá chuyến:** **Sửa** → **Tên, ngày đi** → **Xoá chuyến cho mọi người** (bấm 2 lần). Chuyến mất với tất cả mọi người, **không khôi phục được**. Nên bấm **Sao lưu chuyến này** trước.

### 8.5 Tài khoản

Bấm vòng tròn chữ cái đầu tên ở góc trên bên phải:
- **Đổi tên hiển thị:** sửa rồi **Lưu**, tên mới hiện ở các chuyến bạn đang tham gia.
- **Đổi mật khẩu:** điền mật khẩu hiện tại, mật khẩu mới 2 lần → **Lưu**.
- **Đăng xuất:** bấm 2 lần. Đăng xuất sẽ **xoá bản lưu trên máy đó** (an toàn khi mượn máy người khác); đăng nhập lại là tải về đủ. Nếu còn thay đổi chưa gửi được do mất mạng, trang sẽ cảnh báo trước.

### 8.6 Chuyển các chuyến cũ (lưu trên máy) vào tài khoản

Lần đầu đăng nhập trên máy đã dùng bản trước, trang hiện khung **"Máy này còn N chuyến từ bản trước"**:
- **Đưa vào tài khoản:** mỗi chuyến cũ (kể cả dấu tick) trở thành một chuyến mới trong tài khoản, bạn là chủ.
- **Bỏ qua:** không hỏi lại trên máy này nữa.

Nếu bạn và người đi cùng **đều** có chuyến Hà Giang cũ trên máy, chỉ **một người** nên bấm "Đưa vào tài khoản" rồi mời người kia vào. Người kia bấm "Bỏ qua" để tránh có 2 chuyến trùng.

---

## 9. Bảo mật API key

Bạn đã làm phần này, kiểm tra lại cho đúng:
- **API restrictions:** đúng 3 API: **Identity Toolkit API**, **Token Service API**, **Cloud Firestore API**. Đăng nhập Email/Password vẫn dùng 2 API đầu, không cần thêm gì.
- **Website restrictions:** `https://giangit22.github.io/*` (có `/*`, không ghi `/vn-travel-tour/`).

Gói Spark không gắn thẻ nên không phát sinh phí. Tệ nhất là hết hạn mức miễn phí trong ngày thì đồng bộ tạm ngừng.

---

## 10. Dữ liệu được lưu thế nào

**`usernames/{tên đăng nhập}`**: để tra tên khi mời.

| Trường | Nội dung |
|---|---|
| `uid` | Mã tài khoản Firebase |
| `name` | Tên hiển thị |
| `createdAt` | Thời điểm đăng ký |

**`trips/{id ngẫu nhiên}`**: mỗi chuyến một document.

| Trường | Nội dung |
|---|---|
| `name` | Tên chuyến |
| `plan` | Toàn bộ lịch trình, quán, món, đồ cần mang (chuỗi JSON) |
| `stops`, `food`, `dishes`, `pack` | Các dấu tick, mỗi tick một trường nên tick cùng lúc không đè nhau |
| `owner` | uid chủ chuyến |
| `memberIds`, `members` | Danh sách thành viên và tên của họ |
| `invitedIds`, `invited` | Người đang được mời, ai mời |
| `v`, `createdAt`, `updatedAt` | Phiên bản dữ liệu, thời điểm tạo và sửa |

Tài khoản (tên đăng nhập, mật khẩu đã mã hoá) nằm ở **Authentication → Users**, cột Identifier hiện dạng `minh@first-project-by-me.firebaseapp.com`. Firebase không lưu mật khẩu dạng chữ, chính bạn cũng không xem được.

Trên máy, trang lưu bản sao các chuyến trong `localStorage` (khoá `hgPlanner.v3`) và bộ nhớ đệm của Firestore để dùng khi mất mạng.

Hạn mức miễn phí mỗi ngày: 50.000 lượt đọc, 20.000 lượt ghi, 1 GiB lưu trữ. Mỗi tick là 1 lượt ghi, thừa sức cho vài nhóm cùng dùng.

---

## 11. Gặp lỗi thì xem ở đây

| Trang báo | Nguyên nhân | Cách sửa |
|---|---|---|
| Không có màn hình đăng nhập, mục "Người đi cùng" ghi chế độ dùng thử | `apiKey` trong `FIREBASE_CONFIG` đang trống | Làm lại mục 6, đẩy lên GitHub |
| **Chưa bật kiểu đăng nhập Email/Password…** | Bỏ sót mục 3 | Bật Email/Password |
| **Sai tên đăng nhập hoặc mật khẩu.** | Gõ sai, hoặc chưa đăng ký | Kiểm tra lại, hoặc sang tab Đăng ký |
| **Tên đăng nhập này đã có người dùng…** | Tên đã bị lấy | Chọn tên khác |
| **Thử sai nhiều lần quá…** | Firebase tạm khoá vì sai nhiều lần | Đợi vài phút |
| **Firebase từ chối quyền: kiểm tra lại Rules…** | Rules còn bản cũ hoặc chưa Publish | Dán lại Rules ở mục 5, **Publish**, đợi 1 phút |
| **Chưa có ai dùng tên đăng nhập "…"** | Người kia chưa đăng ký hoặc gõ sai tên | Nhờ họ đăng ký trước, gửi đúng tên |
| **apiKey không đúng…** hoặc lỗi có chữ `referer` | Sai config, hoặc website restriction chưa có domain của trang | Kiểm tra mục 6 và mục 9 |
| **Không tải được Firebase…** | Mất mạng, hoặc trình chặn quảng cáo chặn `gstatic.com` | Kiểm tra mạng, tắt chặn quảng cáo cho trang |
| **Đang offline, sẽ gửi khi có sóng** | Mất mạng (bình thường khi lên đèo) | Không cần làm gì |
| Người được mời không thấy lời mời | Họ đăng nhập tài khoản khác, hoặc trang cũ trong bộ nhớ đệm | Kiểm tra đúng tên đăng nhập, tải lại trang |

Trên máy tính: F12 → tab **Console** sẽ thấy mã lỗi chi tiết.

---

## 12. Lỡ quên mật khẩu

Không có email nên chỉ bạn (người quản lý Firebase) xử lý được:

1. **Authentication → Users** → tìm dòng `tendangnhap@…firebaseapp.com` → menu ⋮ → **Delete account**.
2. **Firestore Database → Data → `usernames`** → xoá document trùng tên đăng nhập đó. Thiếu bước này thì tên cũ vẫn trỏ vào tài khoản đã xoá, mời sẽ không tới.
3. Người đó **đăng ký lại** cùng tên đăng nhập.
4. Chuyến họ đang tham gia: người khác trong chuyến **mời lại** họ. Nếu họ là **thành viên duy nhất** của một chuyến, chuyến đó không ai mở được nữa. Chỉ sửa tay được trong tab **Data**: thay uid cũ bằng uid mới trong `owner`, `memberIds`, `members`.

Vì vậy hãy ghi mật khẩu vào chỗ an toàn. Chuyến quan trọng nên có ít nhất 2 người trong chuyến, và thỉnh thoảng bấm **Sao lưu chuyến này**.

---

## 13. Chỗ cần biết trong code

| Muốn đổi | Tìm trong `index.html` |
|---|---|
| Cấu hình Firebase | `CẤU HÌNH FIREBASE` / `const FIREBASE_CONFIG` (≈ dòng 365–378) |
| Lịch trình mẫu Hà Giang | `function tplHaGiang()` (≈ dòng 392) |
| Danh sách mẫu khi tạo chuyến | `const TEMPLATES` (≈ dòng 473) |
| Phiên bản thư viện Firebase | `const SDK =` trong `index.html`, giữ `13.2.0`. Đổi phiên bản thì phải đổi cả `const SDK` trong `sw.js` và tăng `VERSION` |
| Danh sách file lưu sẵn khi mất sóng | `sw.js`: `SHELL` và `VERSION` (đổi danh sách thì tăng `VERSION`, ví dụ `so-tay-v2`) |

Số dòng có thể lệch, dùng Ctrl+F để tìm.

---

## Tóm tắt nhanh

1. Authentication → **Email/Password: Enabled** (Anonymous tắt được).
2. Firestore → Rules → dán `firestore.rules` mới → **Publish**.
3. `index.html` → điền `FIREBASE_CONFIG` → đẩy lên GitHub.
4. Mỗi người **đăng ký** tài khoản trên trang.
5. Chủ chuyến: **Người đi cùng** → gõ tên đăng nhập → **Mời**. Người kia: **Nhận**.
