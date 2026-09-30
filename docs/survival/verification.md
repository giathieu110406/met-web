# Báo cáo kiểm tra — Đêm Canh Hoa

Ngày kiểm tra: 30/09/2026. Bản chạy local, chưa triển khai lên website công khai.

## Cập nhật lối vào riêng

Mã **1104** mở trực tiếp Đêm Canh Hoa; mã **1406** mở cốt truyện gốc.
Đã bỏ nút sinh tồn khỏi tiêu đề cốt truyện. Thoát sinh tồn từ màn chào,
tạm dừng hoặc kết quả đều dùng cùng callback khóa lại màn nhập mã.
Trong hiệu ứng mở khóa, bàn phím và nút số bị khóa để không đổi nhầm chế độ.

Đã chạy `check-survival-passcodes.cjs`: mã sai, nhập 1104 bằng nút số/bàn phím,
nhập thêm trong hiệu ứng, thoát từ màn chào/tạm dừng, vào cốt truyện bằng 1406
và tải lại trang đều đúng. Kiểm tra mobile 844/667, TypeScript, ESLint các file
liên quan và diff check đều đạt. Kết quả lượt chiến đấu đầy đủ bên dưới thuộc
bản trước khi đổi lối vào; hệ chiến đấu không thay đổi trong lần cập nhật này.

## Kết quả

| Kiểm tra | Kết quả |
|---|---|
| TypeScript (`tsc --noEmit`) | Đạt |
| Production build (`npm run build`) | Đạt; lần đầu sandbox không tải được Google Fonts, chạy lại với quyền mạng đã thành công |
| ESLint phần mới và các component tích hợp nhỏ | Đạt |
| ESLint toàn bộ src | 12 lỗi có sẵn trong HEAD, bản hiện tại vẫn 12 lỗi; không thêm lỗi |
| `git diff --check` | Đạt; Git chỉ thông báo chuẩn hóa LF/CRLF |
| Mô phỏng chiến đấu | Đạt combo, một hit/mục tiêu/đòn, hồi chiêu, miễn sát thương, spawn cap, giới hạn nâng cấp, ưu tiên thua khi đồng thời hạ boss |
| Tần số khung hình | Cùng đầu vào ở 30/60/120Hz cho vị trí/thời gian tương đương |
| Lượt browser thời gian thực | Thắng, 334,998 giây đo ngoài; HUD 5:36, 67 địch, 6/6 đợt, 1.960 điểm |
| Lỗi JavaScript trong lượt đầy đủ | Không có |
| Thua sớm và chơi lại | Đạt; lượt không điều khiển thua sau khoảng 24 giây, chơi lại về 100 máu/100 hoa/0 điểm |
| Desktop | 1440×900: mở chế độ, hướng dẫn, di chuyển/nhảy, pause/resume và kết quả |
| Mobile Chromium giả lập | 844×390, 667×375: nhiều ngón, hủy pointer, nút ít nhất 44px, nằm ngoài đấu trường, không tràn ngang |
| Xoay dọc | 390×844: hiện hướng dẫn xoay, đồng hồ dừng; xoay ngang cần bấm Tiếp tục |
| Cốt truyện | Mở khóa, thoát sinh tồn về tiêu đề, vào câu chuyện, di chuyển; sách mở/lật/đóng được |

Lượt thời gian thực sử dụng bộ điều khiển thử nghiệm đọc DOM và gửi phím,
không sửa máu, độ bền hoa, địch hay tốc độ. Bỏ qua phần tập và đọc nâng cấp
khoảng bốn giây mỗi lần nên lượt kiểm tra ngắn hơn mục tiêu thông thường
6–8 phút, nhưng nằm trong khoảng yêu cầu 5–10 phút. Đợi đủ phần tập và
thời gian tự chọn nâng cấp sẽ kéo dài lượt thêm khoảng một phút.

## Bằng chứng và giới hạn

- Nhật ký JSON và ảnh chụp chi tiết nằm trong `.playwright-cli/survival/`.
- `realtime.json`: thời gian ngoài, nội dung kết quả và danh sách lỗi JavaScript.
- `lint-comparison.json`: ESLint trên nội dung HEAD và mã hiện tại, chạy bằng cùng cấu hình.
- Ảnh kiểm tra: desktop-welcome, desktop-battle, desktop-result, early-defeat,
  mobile-844x390, mobile-667x375, mobile-portrait, mobile-pause và story-book.
- Tạo hình qua built-in ImageGen; giữ bố cục màu tối/hoa ở giữa. HUD đơn giản
  hơn ảnh tham chiếu để đọc được trong khung 600×400. Dùng nhân vật gốc và
  tư thế đánh/lướt riêng, thay vì toàn bộ sprite animation nhiều khung.
- Chưa thử trên iPhone vật lý: không xác nhận Safari native, fullscreen,
  âm thanh khi khóa màn hình hoặc cảm giác điều khiển trên phần cứng thật.
- Màn mở rộng chưa được sản xuất; cấu hình màn và mô phỏng đã tách riêng.

Các lỗi ESLint cũ thuộc sách, ending-cutscene, Hero, weather-effects,
kiểu PageFlip và một chỗ đọc ref trong Game. Chúng không thuộc hệ sinh tồn.
