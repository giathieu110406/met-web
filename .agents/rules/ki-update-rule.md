# Workspace Rule: Quy Định Cập Nhật KI (Knowledge Items) & Memory Sau Mỗi Phiên Làm Việc

## 1. Mục Đích
Dự án "Met — A Tiny Love Story" có một thư mục lưu trữ tri thức chuyên biệt mang tên `knowledge/` ở thư mục gốc của dự án.
Mục tiêu là lưu trữ toàn diện kiến trúc, các quyết định thiết kế, quy chuẩn mỹ thuật pixel art, các lỗi kỹ thuật đã giải quyết và lịch sử các phiên làm việc (Session Memory), giúp việc tiếp tục công việc trong các phiên trò chuyện sau diễn ra tức thì, liền mạch và không bị mất ngữ cảnh.

## 2. Quy Tắc Bắt Buộc Đối Với AI Agent
1. **Trước khi bắt đầu bất kỳ tác vụ nào**:
   - Luôn đọc `knowledge/README.md` và `knowledge/session-memory.md` để nắm rõ tiến độ hiện tại, các cơ chế đã thống nhất và lưu ý quan trọng.
2. **Ở cuối mỗi phiên trò chuyện (hoặc khi hoàn thành một yêu cầu lớn của người dùng)**:
   - **Bắt buộc** cập nhật `knowledge/session-memory.md`: Ghi rõ thời điểm, tóm tắt các yêu cầu của người dùng, danh sách các tệp đã tạo/chỉnh sửa, các quyết định kỹ thuật mới, và trạng thái hiện tại của dự án.
   - Nếu có cơ chế gameplay mới hoặc thay đổi kiến trúc: Cập nhật `knowledge/gameplay-mechanics.md` hoặc `knowledge/architecture.md`.
   - **Khi người dùng yêu cầu sửa cốt truyện, lời thoại, âm thanh, ánh sáng, góc nhìn hay ngữ cảnh nghệ thuật**: **BẮT BUỘC** cập nhật tệp `knowledge/storyline-and-atmosphere.md` tương ứng với toàn bộ các thay đổi đó.
   - Nếu có tài nguyên đồ họa mới hoặc chỉnh sửa hình ảnh/hiệu ứng: Cập nhật `knowledge/visual-assets.md`.
   - Nếu phát hiện và khắc phục một lỗi kỹ thuật (bug / gotcha): Cập nhật `knowledge/troubleshooting-and-learnings.md`.
3. **Tuân thủ quy tắc đúc kết kinh nghiệm**:
   - Luôn đúc kết kinh nghiệm tư duy, các lưu ý về mặt kỹ thuật, và liên hệ với các phần tiếp theo của dự án.
