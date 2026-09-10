# 💡 Xử Lý Sự Cố & Đúc Kết Kinh Nghiệm (Troubleshooting & Learnings)

Tài liệu này tổng hợp toàn bộ các lỗi kỹ thuật quan trọng đã phát hiện và xử lý triệt để trong dự án, cùng các bài học tư duy nền tảng.

---

## 1. Các Lỗi Kỹ Thuật Đã Xử Lý Triệt Để

### 1.1. Lỗi Khung Hình Giật Sang Trái Rồi Mới Trượt Vào Khi Xuất Hiện
- **Hiện tượng**: Khi nhặt hoa (Thought Bubble) hoặc mở FPV bằng phím `E`, giao diện bị giật lệch 1 khung hình sang sát mép trái trước khi kéo vào giữa.
- **Nguyên nhân cốt lõi**:
  - `@keyframes thought-popup` có khai báo `transform: translate(-50%, 15px) scale(0.95)`.
  - Trong `first-person-view.tsx`, container bao phủ toàn màn hình (`absolute inset-0`). Khi gán animation, `translate(-50%)` đã dịch chuyển toàn bộ màn hình 600px sang bên trái 300px!
  - Trong `thought-bubble.tsx`, class `left-1/2 -translate-x-1/2` xung đột với `transform` thô trong CSS animation ở frame mount đầu tiên.
- **Cách khắc phục chuẩn**:
  - Chuyển sang căn giữa bằng CSS chuẩn: `left-0 right-0 mx-auto w-[92%] max-w-[540px]`. Không dùng `translateX(-50%)`.
  - Thiết kế keyframe mới không chứa bất kỳ dịch chuyển trục X nào:
    - `fpv-fade-in`: Hòa tan mờ dần và scale nhẹ 1.02 $\rightarrow$ 1.0.
    - `thought-fade-in`: Lướt nhẹ từ trên xuống 8px và scale 0.98 $\rightarrow$ 1.0.
    - `subtitle-appear`: Nổi nhẹ từ dưới lên 6px.

---

### 1.2. Lỗi Thought Bubble Bị Nhấp Nháy Chữ & Không Tự Đóng Khi Đi Xa
- **Hiện tượng**: Lời thoại khi nhặt hoa bị glitch chữ, bộ đếm 5s không bao giờ tự đóng, đi xa không tự tắt.
- **Nguyên nhân cốt lõi**:
  - `onDismiss={() => setCurrentStory(null)}` là inline function được tạo mới ở mỗi frame (60 lần/giây khi nhân vật bước đi).
  - `handleDismiss` phụ thuộc `onDismiss`, và `useEffect` lại phụ thuộc `handleDismiss`. Do đó `clearTimeout` và `clearInterval` bị gọi lại 60 lần/giây, khiến timer không bao giờ chạy hết.
- **Cách khắc phục chuẩn**:
  - Dùng `useRef(onDismiss)` để `handleDismiss` giữ nguyên tham chiếu ổn định tuyệt đối.
  - Phân rã dependency thành các giá trị nguyên thủy: `[storyId, storyText, handleDismiss]`.
  - Truyền `heroX` và kiểm tra khoảng cách: Nếu `Math.abs(heroX - currentStory.x) > 100`, kích hoạt fade-out 300ms rồi đóng.

---

### 1.3. Lỗi Trôi Nhân Vật Quá Trớn Khi Nhặt Hoa Hoặc Chuyển Cảnh
- **Hiện tượng**: Người chơi giữ đè phím mũi tên/phím D, khi nhặt hoa hoặc thoát FPV nhân vật tiếp tục chạy tuột đi mất kiểm soát.
- **Nguyên nhân cốt lõi**: Trình duyệt phát sự kiện `keydown` lặp lại (auto-repeat) liên tục khi giữ phím, khiến biến vận tốc `vel.vx` không về 0.
- **Cách khắc phục chuẩn**:
  - Thiết lập mảng `mustReleaseKeys` trong `use-keyboard.ts`. Khi kích hoạt `resetKeys()`, mọi phím đang được ấn bị đánh dấu chờ nhả.
  - Khi nhặt hoa hoặc khi `lockMovement` thay đổi: Gọi `resetKeys()` và gán `velRef.current.vx = 0`.
  - Bắt buộc người chơi phải nhả phím ra (`keyup`) rồi bấm lại mới di chuyển tiếp.

---

### 1.4. Lỗi Compiler React 19: `Existing memoization could not be preserved`
- **Hiện tượng**: Lỗi build khi dùng `useCallback` trong `hero.tsx`.
- **Nguyên nhân**: Hàm `resetKeys` được gọi bên trong `gameLoop` nhưng không được liệt kê trong dependency array của `useCallback`.
- **Cách khắc phục chuẩn**: Luôn đồng bộ đầy đủ các hàm phụ thuộc vào dependency array của `useCallback`.

---

### 1.5. Lỗi Ô Dù Bay Lơ Lửng Trên Đầu Nhân Vật (Detached Umbrella Overlay)
- **Hiện tượng**: Trong vùng mưa, tán ô màu đỏ bị render trôi nổi lơ lửng trên đỉnh đầu nhân vật, không gắn liền với bàn tay cầm ô, đặc biệt khi đổi hướng bước đi.
- **Nguyên nhân cốt lõi**: Dùng 2 thẻ `<img>` tách biệt (1 ảnh người $48 \times 48\text{ px}$ và 1 ảnh ô $32 \times 32\text{ px}$ ghép bằng CSS absolute). Vì animation bước chân thay đổi chiều cao chân và căn lề từng frame, lớp ô không theo kịp chuyển động thân thể.
- **Cách khắc phục chuẩn**:
  - Thiết kế bộ 6 sprite tích hợp toàn thân (Integrated Full-Body Sprites) $64 \times 84\text{ px}$ vẽ sẵn nhân vật nắm chắc cán ô trong tay.
  - Tự động hoán đổi sprite nguồn trong `hero.tsx` khi `hasUmbrella = true` kèm bù trừ tọa độ `top: pos.y - 36px` để chân nhân vật luôn chạm đất đúng chuẩn $y = 320$.

---

### 1.6. Lỗi Xích Đu Treo Lơ Lửng Giữa Không Trung (Floating Swing Prop)
- **Hiện tượng**: Chiếc xích đu xuất hiện như đang lơ lửng giữa trời, không có dây nối lên cây hay khung đỡ chạm đất.
- **Nguyên nhân cốt lõi**: Thiếu khung chịu lực và tọa độ hiển thị bị lệch khỏi mặt sàn vật lý $y_{\text{ground}} = 320$.
- **Cách khắc phục chuẩn**:
  - Tạo khung gỗ chữ A tiếp đất hai bên (`wooden-swing.png`, $64 \times 80\text{ px}$).
  - Cố định tọa độ đỉnh $y = 320 - 80 = 240$ để hai chân trụ chạm sát mặt cỏ.
  - Tích hợp sprite ngồi đung đưa `hero-sit-swing.png` ($48 \times 48\text{ px}$) lắc lư theo hàm điều hòa con lắc $A \cdot \sin(\omega t)$.

---

### 1.7. Lỗi Trải Nghiệm Không Tìm Thấy Mảnh Thư #3 (Quest Item Usability & Friction)
- **Hiện tượng**: Người chơi đi qua khu vực mỏm đá bìa rừng ($x \approx 1800$) nhưng không thấy và không nhặt được mảnh thư thứ 3.
- **Nguyên nhân cốt lõi**:
  - Mảnh thư màu giấy kraft trầm lẫn vào cảnh đêm bìa rừng thiếu điểm nhấn thị giác.
  - Điều kiện nhặt bị ràng buộc ẩn: Yêu cầu nhân vật phải ngồi xuống (`isSitting`) trước khi bấm `[E]`, mà không có thông báo hướng dẫn rõ ràng.
  - Hitbox phát hiện tương tác quá hẹp ($20\text{ px}$).
- **Cách khắc phục chuẩn**:
  - Bổ sung hào quang vàng óng tỏa sáng (glowing pulse filter) và huy hiệu nổi `✨ Mảnh Thư #3 [E]`.
  - Mở rộng vùng tương tác lên $120\text{ px}$ ($x \in [1740, 1860]$).
  - Loại bỏ điều kiện `isSitting`: Cho phép bấm `[E]` nhặt ngay.
  - Trang bị cơ chế bảo hiểm: Tự động nhặt khi bàn chân nhân vật bước qua $x \approx 1800$.
  - Thêm gợi ý suy nghĩ dẫn đường khi vừa đến $x \ge 1710$.

---

### 1.8. Lỗi Phong Cách Minh Họa FPV Quá Chân Thực Hoặc Quá Pixel
- **Hiện tượng**: Các ảnh FPV vẽ trước đây có xu hướng hoặc là quá chân thực (tả thực da tay, gân móng tay, sợi lông mèo như tranh chì vẽ giải phẫu), hoặc quá vỡ hạt điểm ảnh (pixelated thô). Cả hai đều xung đột với cảm xúc hoài niệm, nhẹ nhàng của tựa game.
- **Nguyên nhân cốt lõi**: Thiếu một bộ tiêu chuẩn mỹ thuật cụ thể đối chiếu theo tác phẩm gốc `message.png`.
- **Cách khắc phục chuẩn**:
  - Định chuẩn phong cách **Retro Storybook Cel-Shaded ("Không quá pixel cũng không quá chân thực")**:
    1. Nét viền contour mực đen/nâu sẫm 2-3px rõ ràng, mộc mạc như vẽ sổ tay.
    2. Mảng màu phẳng (flat cel shading) tông ấm (kem da `#f0c2a2`, giấy kraft `#c99b66`, đỏ nhung `#e11d48`), loại bỏ tô bóng 3D rườm rà.
    3. Nền trong suốt (Alpha Transparency) 100% bằng thuật toán flood-fill, loại bỏ hoàn toàn viền khung hộp trắng cứng nhắc.
  - Áp dụng thành công cho: `fpv-cat-storybook.png` và `fpv-lamp-hands-storybook.png`.

---

### 1.9. Lỗi Trôi Lời Thoại Khi Giữ Phím Mũi Tên Phải (Dialogue Skip Bleed-Through)
- **Hiện tượng**: Người chơi giữ phím `ArrowRight` để chạy về phía trước, khi bước vào vùng kích hoạt FPV hoặc đối thoại, toàn bộ câu thoại bị tua qua (skip) sạch sẽ trong tích tắc do hệ điều hành phát `keydown` lặp lại 30-60 lần/giây.
- **Cách khắc phục chuẩn**:
  - Loại bỏ OS auto-repeat bằng `if (e.repeat) return;`.
  - Áp dụng cơ chế **One-Shot Latch**: Nhấn 1 lần chỉ skip 1 câu, sau đó khóa chốt (`isRightKeyHeldRef = true`).
  - Bắt buộc nhả phím vật lý (`keyup`) mới mở khóa chốt để skip tiếp.
  - Cài đặt thời gian đệm an toàn khi mount (Mount Grace Period 350ms).

---

### 1.10. Lỗi Tiêu Đề "Met" Bị Tách Đôi Ký Tự Do Kerning Monospace
- **Hiện tượng**: Chữ "Met" trên màn hình tiêu đề hiển thị như "Me  t", khoảng cách giữa `e` và `t` rộng gấp nhiều lần giữa `M` và `e`.
- **Nguyên nhân cốt lõi**: Font pixel `Press Start 2P` là font đơn cách (monospaced), ký tự `t` hẹp để thừa nhiều khoảng trống hai bên. Khi áp dụng cỡ chữ `text-6xl` kèm `tracking-wider`, khoảng trống bị nhân lên tới ~35px.
- **Cách khắc phục chuẩn**: Bỏ `tracking-wider`, tách riêng chữ `t` và kéo lại gần bằng negative margin `marginLeft: '-14px'`, tạo khoảng cách ký tự hoàn hảo, liền mạch.

---

### 1.11. Lỗi Bất Nhất Không Gian Đạo Cụ Thế Giới Khi Xảy Ra Sự Kiện Kịch Bản
- **Hiện tượng**: Sau khi mèo cào rách bức thư và bỏ chạy, người chơi bước ra ngoài thế giới thì thấy chú mèo vẫn nằm ngủ nguyên vẹn trên ghế đá.
- **Cách khắc phục chuẩn**:
  - Đồng bộ state thế giới `hasLostLetter` vào `PropsLayer`.
---

### 1.12. Lỗi Tỉ Lệ Chiều Cao Địa Hình (Screen Space Terrain Ratio Trap)
- **Hiện tượng**: Khi thiết kế đỉnh đồi ở Map 2, nếu đặt đỉnh dốc tại $y = 200$ (ngay chính giữa màn hình 400px), toàn bộ nhân vật, cô gái và cây hoa anh đào bị ép chặt vào 50% phía trên trần màn hình. Tán cây cổ thụ bị cắt ngọn, không gian vòm trời bị bóp nghẹt, gây cảm giác ngột ngạt và nặng nề.
- **Nguyên nhân cốt lõi**: Chưa tính toán tỉ lệ vàng (Rule of Thirds) cho khung hình side-scroller có cây cao và hạt rơi.
- **Cách khắc phục chuẩn**:
  - Hạ độ cao đỉnh đồi xuống $y = 265$ (chiếm ~1/3 màn hình từ đáy: $135/400\text{px} \approx 34\%$).
  - Dành trọn $2/3$ không gian phía trên ($265\text{px}$) cho bầu trời xanh trong, vòm tán cây cổ thụ $192\text{px}$ và dòng cánh hoa đào bay phấp phới.

---

### 1.13. Lỗi Lặp Hình & Trùng Mặt Phẳng Khi Trồng Rừng Cây Cảnh Quan (Forest Density & Depth)
- **Hiện tượng**: Khi muốn tạo cảm giác cả một rừng hoa anh đào bạt ngàn, nếu chỉ nhân bản 1-2 sprite và đặt cùng kích thước, cùng độ nét thì khung cảnh sẽ trở nên giả tạo, rối mắt và che lấp nhân vật chính.
- **Cách khắc phục chuẩn**:
  - **Phân tách 2 tầng thị giác (Layered Depth)**:
    - *Tầng xa (Background - 7 cây)*: Thu nhỏ tỉ lệ ($96\text{px} - 118\text{px}$), độ mờ nhẹ ($0.78 - 0.85$), mờ biên nhẹ $0.3\text{px}$.
    - *Tầng gần (Foreground - 7 cây)*: Kích thước thật ($120\text{px} - 135\text{px}$), sắc nét 100%, đón ánh sáng ban mai trực tiếp.
  - **Kỹ thuật Micro-transforms**: Kết hợp co giãn tỉ lệ ngẫu nhiên có kiểm soát và lật nhánh đối xứng (`transform: scaleX(-1)`) xen kẽ giữa các cây lân cận. Chỉ với 1 sprite nhỏ, tạo ra hơn chục cây có thế dáng khác biệt hoàn toàn.

---

### 1.14. Lỗi Đạo Cụ Lơ Lửng Hoặc Lún Gốc Trên Địa Hình Dốc Biến Thiên
- **Hiện tượng**: Trên Map 2 có sườn dốc nghiêng từ $x = 0$ đến $x = 750$, nếu dùng công thức cố định $y = 320$ hoặc $y = 265$ thì cây cối và ghế đá sẽ bị lơ lửng trên không trung hoặc chìm nghỉm dưới sườn dốc.
- **Cách khắc phục chuẩn**:
  - Xây dựng hàm giải tích mặt đất nội suy:
    $$y_{\text{ground}}(x) = \begin{cases} 320 - \frac{x}{750} \times 55 & \text{khi } x \le 750 \\ 265 & \text{khi } x > 750 \end{cases}$$
  - Đặt tọa độ đỉnh của mọi thực thể cao $H$ tại vị trí $x$: $\text{top} = y_{\text{ground}}(x) - H$. Đảm bảo chân mọi thực thể cắm rễ chuẩn xác từng pixel.

---

### 1.15. Thiết Kế Bàn Dán Thư Tự Do FPV (Free-Form Crafting vs Rigid Slots)
- **Hiện tượng trước đây**: Bàn ghép thư có các ô rập khuôn sẵn khiến tương tác trở nên cứng nhắc và máy móc, giống như làm bài trắc nghiệm hơn là tự tay hàn gắn kỷ vật tình yêu.
- **Cách khắc phục chuẩn**:
  - Xóa bỏ hoàn toàn các slot cố định.
  - Đặt ngẫu nhiên các mảnh thư ("I", "LIKE", "U") lệch góc tự nhiên trên mặt bàn gỗ pixel art.
  - Người chơi tự do kéo-thả, xếp khít các mép rách rồi dán cố định bằng các miếng băng keo washi hoa đào, mang lại cảm giác chân thực và xúc động.

---

## 2. 🎓 Bài Học & Kinh Nghiệm Đúc Kết (Study Experience Extractor)

### 2.1. Tổng hợp các lỗi sai phổ biến
1. **Lỗi Phụ Kiện Tách Rời (Detached Component Traps)**:
   - Trong 2D side-scrolling, ghép nối các phụ kiện lớn (ô dù, khiên, vũ khí dài) bằng các thẻ DOM riêng biệt lồng nhau thường xuyên phát sinh lỗi lệch tâm và lơ lửng khi nhân vật chuyển trạng thái hoạt ảnh.
2. **Lỗi Đặt Điều Kiện Tiên Quyết Ẩn (Hidden Gating Conditions)**:
   - Ép người chơi phải thực hiện chuỗi thao tác phức tạp để tương tác với vật phẩm bắt buộc của màn chơi mà không có gợi ý trực quan sẽ biến trải nghiệm thư giãn thành sự ức chế (friction).
3. **Lỗi Gãy Khúc Cảm Xúc Tự Sự (Narrative Disconnect Trap)**:
   - Khi một sự kiện lớn xảy ra (như bức thư bị xé), nếu chỉ dùng một pop-up chữ thông báo đơn thuần mà không có chuyển động thị giác đi kèm (mảnh giấy bay, đạo cụ thay đổi, nhân vật chới với), người chơi sẽ cảm thấy sự việc gượng gạo và thiếu thuyết phục.
4. **Lỗi Quá Tải Giao Diện (HUD Cluttering)**:
   - Đặt các nút điều khiển ảo quá to hoặc nổi bồng bềnh trên màn hình sẽ phá vỡ không gian nghệ thuật pixel hoài niệm. Gợi ý phím bấm nên được đặt phẳng chìm sát mặt đất, tối giản và tự động ẩn khi không cần thiết.

### 2.2. Các lưu ý về mặt tư duy thiết kế
1. **Nguyên Tắc "Show, Don't Tell" Trong Tự Sự Tương Tác**:
   - Mọi biến cố cốt truyện cần được biểu đạt thông qua chuỗi hành động nhân quả trực quan: Thấy phong bì đặt trên ghế $\rightarrow$ thấy móng vuốt cào $\rightarrow$ thấy mảnh giấy bay trong gió $\rightarrow$ thấy nhành hoa kiên cường nở bên chân xích đu làm đòn bẩy tâm lý.
2. **Chuỗi Chuyển Biến Cảm Xúc (Emotional Arc Pacing)**:
   - Một câu chuyện hay luôn cần "điểm trũng cảm xúc" (Emotional Valley) trước khi bật lên cao trào. Khoảng lặng trên chiếc xích đu dưới mưa chính là khoảng nghỉ cần thiết để người chơi đồng cảm sâu sắc với quyết tâm của nhân vật.
3. **Tương Phản Không Gian & Ánh Sáng (Spatial Catharsis)**:
   - Sự ngột ngạt và lạnh lẽo của khu phố mưa đêm (Map 1) được giải tỏa trọn vẹn khi bước chân sang khu vườn hoa anh đào ngập tràn ánh nắng xuân (Map 2). Tỉ lệ địa hình 1/3 mở toang không gian bao la cho cảm xúc vỡ òa khi đôi lứa gặp lại nhau.

### 2.3. Mẹo tính toán & Kỹ thuật lập trình
1. **Kỹ thuật Chuyển Pha Lời Thoại Tuần Tự (Sequential Thought Chaining)**:
   - Sử dụng timer ref phối hợp cleanup chặt chẽ khi component unmount hoặc state đổi (`clearTimeout` trong cleanup effect) để xâu chuỗi 2 câu thoại có độ trễ tâm lý tự nhiên mà không bị rò rỉ bộ nhớ.
2. **Công thức định vị tiếp đất chuẩn trên địa hình dốc**:
   $$\text{top} = y_{\text{ground}}(x) - H_{\text{prop}}$$
3. **Kỹ thuật Micro-transforms tạo chiều sâu với 1 asset**:
   - Kết hợp `scale()` và `scaleX(-1)` cùng thay đổi opacity để tạo ra cả một rừng cây phong phú từ một sprite duy nhất mà không tốn dung lượng tải trang.

### 2.4. Chuẩn bị nền tảng cho phần tiếp theo
- Cơ chế triền dốc biến thiên và hệ thống hạt đa tầng (`PetalRain`) ở Map 2 tạo nền tảng vững chắc cho bất kỳ màn chơi đồi núi, thung lũng hay các hiệu ứng thời tiết (tuyết rơi, lá thu bay) trong các bản cập nhật mở rộng sau này.


