# 🧠 Hệ Thống Tri Thức Dự Án (Project Knowledge Items - KI)
## Met — A Tiny Love Story (Web Edition)

Thư mục `knowledge/` là trung tâm lưu trữ tri thức, kiến trúc, quy chuẩn kỹ thuật và nhật ký ký ức (Session Memory) của dự án. Mọi thông tin cốt lõi được cấu trúc hóa để người lập trình và AI Agent có thể tra cứu nhanh chóng, nắm bắt toàn diện bối cảnh và phát triển tiếp mà không làm đứt gãy trải nghiệm.

---

## 📚 Mục Lục Tài Liệu Tri Thức (Sitemap)

| Tài liệu | Mô tả nội dung |
| :--- | :--- |
| 🗺️ **[architecture.md](./architecture.md)** | Kiến trúc tổng quan, luồng dữ liệu, hệ thống State, Hooks (`useGameLoop`, `useKeyboard`), âm thanh (`SFX`, `BGMController`). |
| 📖 **[storyline-and-atmosphere.md](./storyline-and-atmosphere.md)** | **Kịch bản gốc**: Toàn bộ cốt truyện, lời thoại nhân vật, hiệu ứng âm thanh, ánh sáng bầu trời, góc nhìn camera, FPV và tấm thiệp "I LOVE U". Bắt buộc cập nhật khi sửa cốt truyện. |
| 🎮 **[gameplay-mechanics.md](./gameplay-mechanics.md)** | Cơ chế vật lý, 7 cơ chế nhặt hoa, hộp thoại chỉ dẫn đáy khung hình, tương tác xem lại FPV, cơ chế ngắt đà di chuyển `resetKeys`. |
| 🎨 **[visual-assets.md](./visual-assets.md)** | Bảng màu DawnBringer DB32, quy chuẩn kích thước, script sinh pixel art (`generate-hd-fpv-all.js`), hiệu ứng mưa `FpvRainEffect`. |
| 💡 **[troubleshooting-and-learnings.md](./troubleshooting-and-learnings.md)** | Tổng hợp các lỗi kỹ thuật đã giải quyết triệt để (lỗi frame lệch trái, re-render 60fps), bài học và kinh nghiệm đúc kết. |
| 📝 **[session-memory.md](./session-memory.md)** | **Nhật ký ký ức các phiên làm việc**: Tóm tắt chi tiết những gì đã làm, đã thay đổi, trạng thái hiện tại và hướng đi tiếp theo. |

---

## ⚡ Hướng Dẫn Dành Cho AI Agent Khi Bắt Đầu Phiên Mới
1. **Bước 1**: Đọc [session-memory.md](./session-memory.md) để biết phiên trước đã hoàn thành đến đâu và yêu cầu đang xử lý là gì.
2. **Bước 2**: Tra cứu tài liệu liên quan trong bảng trên tương ứng với tác vụ (ví dụ: làm đồ họa thì xem `visual-assets.md`, làm logic chuyển cảnh thì xem `gameplay-mechanics.md`).
3. **Bước 3**: Sau khi hoàn thành công việc của phiên, **bắt buộc cập nhật [session-memory.md](./session-memory.md)** trước khi kết thúc câu trả lời.
