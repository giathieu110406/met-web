# Đêm Canh Hoa

Nhập mã **1104** → **Đêm Canh Hoa** → **Bắt đầu canh hoa**. Mã **1406** mở cốt truyện gốc. Thoát sinh tồn quay về màn nhập mã.
Chơi trên máy tính hoặc xoay ngang điện thoại. Có thể bỏ qua phần tập 20 giây.

## Cách chơi

- A/D hoặc ←/→: di chuyển. Space hoặc ↑: nhảy.
- Giữ J: combo bằng ô. K: lướt né. L: bão cánh hoa.
- Esc: tạm dừng; dùng nút Tiếp tục để trở lại.
- Giữ cả bạn và hoa còn sức sống qua sáu đợt; hạ boss trước khi hết giờ.
- Kỷ lục và số lần thắng lưu trên trình duyệt hiện tại. Nâng cấp bắt đầu lại mỗi lượt.
- Chuyển tab hoặc xoay dọc tự dừng trận, không tiêu hao thời gian.

## Thêm màn

`src/lib/survival.ts` chứa định nghĩa `SurvivalLevel`, lịch địch, thông số chiến đấu
và mô phỏng không phụ thuộc trình duyệt. Thêm định nghĩa màn với mã riêng, nền,
vị trí hoa, lịch xuất hiện và boss; truyền định nghĩa đó cho các hàm mô phỏng.
Giao diện bản đầu chỉ mở khu vườn; khi bổ sung màn thứ hai, đưa level thành prop
và thêm chọn màn. Không có menu màn chưa hoàn thiện hoặc backend cần cấu hình.

## Kiểm tra

```powershell
node scripts/check-survival.cjs
node scripts/check-survival-passcodes.cjs
npx --no-install tsc --noEmit
node scripts/check-survival-browser.cjs --realtime
node scripts/check-survival-mobile.cjs
node scripts/check-survival-regression.cjs
npm run build
```

Các script trình duyệt dùng Playwright đã có trong runtime máy phát triển.
Có thể đặt `PLAYWRIGHT_MODULE` tới module Playwright của máy khác và `BASE_URL`
đến địa chỉ preview; mặc định localhost:3000. Chrome cần được cài trên máy.
Script real-time chỉ đọc vị trí/telegraph từ DOM và gửi phím; không sửa máu,
địch, tốc độ hay trạng thái mô phỏng. Kết quả nằm ở `.playwright-cli/survival/`.
Kiểm tra mô phỏng nhanh dùng để tìm lỗi, không được dùng làm bằng chứng thời gian thực.

## Hình ảnh

Ảnh được tạo bằng built-in ImageGen, prompt lưu trong `image-prompts.json`.
`target-mockup.png` là bản tham chiếu; tài nguyên chạy thật nằm trong
`public/assets/survival/`. PNG được tối ưu kích thước và cắt lề trong suốt khi
chuẩn bị asset, vẫn giữ alpha. Nhân vật đi bộ, hoa và mèo dùng ảnh gốc của Met.
UI dùng HTML và font tiếng Việt; bố cục runtime đơn giản hơn ảnh tham chiếu
để đọc được ở khung 600×400 và điện thoại nhỏ.
