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
  - Đặt ngẫu nhiên các mảnh thư ("I", "LOVE", "U") lệch góc tự nhiên trên mặt bàn gỗ pixel art.
  - Người chơi tự do kéo-thả, xếp khít các mép rách rồi dán cố định bằng các miếng băng keo washi hoa đào, mang lại cảm giác chân thực và xúc động.

### 1.16. Lỗi Hoa Không Hiển Thị Trên GitHub Pages (Missing Flower Assets & Dynamic SVG Fallback)
- **Hiện tượng**: Khi triển khai lên môi trường GitHub Pages, một số bông hoa dọc đường biến mất hoặc hiển thị biểu tượng ảnh lỗi (broken image placeholder).
- **Nguyên nhân cốt lõi**:
  - Máy chủ tĩnh GitHub Pages phục vụ file từ thư mục con hoặc domain tĩnh, một số đường dẫn ảnh tĩnh có thể gặp mã lỗi 404 nếu thiếu cấu hình export hoặc tên file sai khác chữ hoa/thường.
  - Trong `next.config.ts`, trình tối ưu ảnh mặc định của Next.js yêu cầu Node.js server runtime, không tương thích với hosting tĩnh thuần túy nếu không khai báo `images: { unoptimized: true }`.
- **Cách khắc phục chuẩn**:
  - Thêm `images: { unoptimized: true }` vào `next.config.ts` để tương thích 100% với static hosting.
  - Xây dựng bộ renderer hoa 16-bit retro pixel art động bằng inline SVG trong [decorations.tsx](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/src/components/decorations.tsx) với bảng màu chuẩn từng loại hoa theo `level-data.ts` (`#f0abfc`, `#fbbf24`, `#f9a8d4`, `#fde68a`, `#c4b5fd`, `#f43f5e`), độc lập hoàn toàn khỏi file ảnh tĩnh bên ngoài.
  - Sinh sẵn các file ảnh dự phòng `flower-{red,yellow,pink,purple}.png` trong `public/assets/others/`.

### 1.17. Lỗi Biến Mất Ô Thoại Hoa Hồng Khi Giữ Phím Di Chuyển (ThoughtBubble Keydown Collision)
- **Hiện tượng**: Người chơi nhặt hoa hồng nhưng không thấy ô lời thoại xuất hiện, hoặc chỉ lóe lên 1 frame rồi biến mất tăm.
- **Nguyên nhân cốt lõi**:
  - Phím `ArrowRight` (mũi tên phải) vừa là phím di chuyển nhân vật sang phải, vừa bị gán làm phím tắt đóng nhanh ô thoại trong `ThoughtBubble`.
  - Khi người chơi giữ đè `ArrowRight` để chạy về phía trước và chạm vào hoa, ngay khoảnh khắc ô thoại vừa mount, sự kiện `keydown` đóng hộp thoại lập tức được kích hoạt trong 0ms trước khi mắt người kịp nhận diện.
- **Cách khắc phục chuẩn**:
  - Gỡ bỏ hoàn toàn mọi phím điều hướng (`ArrowRight`, `ArrowLeft`, `KeyD`, `KeyA`) khỏi sự kiện đóng thoại.
  - Chỉ cho phép bỏ qua/đóng thoại bằng phím chủ ý: `[Space]`, `[Enter]` hoặc `[Esc]`, đồng thời ghi chú rõ ràng trên giao diện `[Space]`.
  - Cố định thời gian chờ sau hiệu ứng gõ máy typewriter là 4.5 giây để người chơi thưởng thức trọn vẹn từng câu thoại.

### 1.18. Lỗi Giật Ô Thoại FPV & Xung Đột Zombie Typewriter Timer
- **Hiện tượng**: Khi nhấn nút mũi tên phải để chuyển câu thoại FPV hoặc skip nhanh, ô thoại bị nhảy giật vị trí lên xuống dữ dội, chữ bị thụt lùi hoặc giật lùi vài ký tự.
- **Nguyên nhân cốt lõi**:
  - Ô thoại FPV dùng `min-h-[58px]`, khi câu thoại chuyển từ 1 dòng sang 2-3 dòng, chiều cao container giãn nở bất thường đẩy cả nút bấm và viền hộp thoại co giật theo trục Y.
  - Khi người chơi bấm phím tiến câu thoại, mã nguồn gán `displayedText = fullText` nhưng **không hủy bộ đếm `setInterval` typewriter cũ**. Vài mili-giây sau, interval cũ tiếp tục kích hoạt và gõ tiếp từ vị trí ký tự dở dang, tranh chấp bộ nhớ và ghi đè lùi text.
- **Cách khắc phục chuẩn**:
  - Khóa cứng kích thước khung hội thoại `h-[68px]` và khung văn bản `h-[50px] overflow-hidden`, căn chỉnh nút ở phía trên (`items-start pt-0.5`). Khung thoại cố định 100% vị trí, triệt tiêu hoàn toàn layout shift.
  - Khai báo `typewriterTimerRef` và gọi `clearInterval(typewriterTimerRef.current)` ngay lập tức khi người chơi ấn tiến thoại hoặc skip.
  - Hạ thời gian debounce bàn phím xuống 75ms để phản hồi nhấn phím đạt độ nhạy cực cao và không bị nuốt phím.

### 1.19. Lỗi Chớp Màn Trắng & Trễ Khung Hình Khi Chuyển Cảnh FPV (DOM Cross-Fade & Asset Pre-decoding)
- **Hiện tượng**: Khi chuyển cảnh giữa các khung tranh FPV (đặc biệt là cảnh mèo xé thư), màn hình đôi khi bị chớp trắng 1-2 frame rồi mới hiện ảnh, gây đứt gãy mạch cảm xúc.
- **Nguyên nhân cốt lõi**:
  - Màu nền container FPV để mặc định hoặc trong suốt, khi ảnh mới chưa kịp giải mã (decode), nền trình duyệt hiển thị màu trắng.
  - Trình duyệt chỉ bắt đầu tải và giải mã tranh vẽ khi component FPV được mount lên DOM, tạo độ trễ vài trăm mili-giây.
- **Cách khắc phục chuẩn**:
  - Đổi màu nền cố định của container FPV thành `#140e1b` (tông tím than tối đồng bộ với sắc độ tranh minh họa).
  - Sử dụng 2 lớp ảnh tĩnh độc lập gắn sẵn trong DOM, chuyển đổi mượt mà bằng `opacity-100` / `opacity-0` cùng `transition-opacity duration-300`, triệt tiêu 100% hiện tượng chớp trắng.
  - Xây dựng module [preload-assets.ts](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/src/lib/preload-assets.ts) sử dụng `new Image()` và `img.decode()` để làm nóng (warm-up) toàn bộ 12 tranh minh họa FPV và sprite ngay từ Title Screen.

### 1.20. Tăng Tốc Render 60/120FPS Bằng Multi-layer GPU Opacity & Module-Level Path Hoisting
- **Hiện tượng**: Khi nhân vật chạy liên tục, game có cảm giác hơi giật vi mô (micro-stutter), đặc biệt là trên màn hình tần số quét cao 120Hz/144Hz.
- **Nguyên nhân cốt lõi**:
  - [DynamicSky](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/src/components/dynamic-sky.tsx) cập nhật chuỗi `background: linear-gradient(...)` mỗi frame theo tọa độ camera, buộc trình duyệt phải chạy layout & style recalculation liên tục trên CPU.
  - Bản đồ 2 Đồi Hoa Anh Đào tính toán lại hàng trăm tọa độ đường cong SVG trong hàm render mỗi frame.
- **Cách khắc phục chuẩn**:
  - Tách bầu trời thành 5 tầng gradient cố định (Hoàng hôn, Chiều tà mưa rơi, Đêm sao, Bình minh, Vườn hoa đào) và dùng GPU điều khiển độ mờ qua `opacity` (`transition-opacity duration-700 ease-in-out`).
  - Đưa toàn bộ việc tính toán chuỗi SVG path (`HILL_SURFACE_PATH`, `HILL_FILL_PATH`, `HILL_DECOR_POINTS`) và mảng cây hoa đào (`BG_SAKURA_TREES`, `FG_SAKURA_TREES`) ra ngoài phạm vi hàm (module-level hoisting).
  - Bọc tất cả các component nền tảng ([DynamicSky](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/src/components/dynamic-sky.tsx), [Ground](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/src/components/ground.tsx), [Decorations](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/src/components/decorations.tsx), [PetalRain](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/src/components/petal-rain.tsx), [PropsLayer](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/src/components/props-layer.tsx)) bằng `React.memo`.

---

## 2. 🎓 Bài Học & Kinh Nghiệm Đúc Kết (Study Experience Extractor)

### 2.1. Tổng hợp các lỗi sai phổ biến
1. **Lỗi Xung Đột Phím Điều Khiển Với Phím Giao Diện (Input Collisions Trap)**:
   - Trong game 2D side-scroller, tuyệt đối không dùng phím di chuyển (`ArrowRight`, `D`) để kiêm nhiệm việc đóng hoặc bỏ qua hộp thoại, vì người chơi thường xuyên giữ đè phím di chuyển khi nhặt vật phẩm.
2. **Lỗi Typewriter Zombie Interval (Uncancelled Timers)**:
   - Khi hiện thực hiệu ứng gõ máy typewriter có tính năng bấm để hiện hết câu (fast-forward / skip), nếu chỉ gán `text = fullText` mà quên `clearInterval()`, timer cũ sẽ tiếp tục chạy ngầm và làm hỏng hiển thị.
3. **Lỗi Bố Cục Co Giãn Theo Độ Dài Văn Bản (Unstable Typography Layout)**:
   - Hộp thoại game luôn phải có chiều cao khóa cứng (`fixed height`) và xử lý tràn văn bản (`overflow-hidden`), tránh việc hộp thoại rung lắc khi số lượng dòng chữ thay đổi.
4. **Lỗi GPU Thất Thoát Khi Thay Đổi Gradient Thuộc Tính Động**:
   - Trình duyệt không thể tăng tốc phần cứng khi nội suy giữa 2 chuỗi CSS gradient. Muốn chuyển màu bầu trời mượt mà, giải pháp tối ưu là xếp chồng các lớp gradient tĩnh và điều khiển bằng `opacity`.

### 2.2. Các lưu ý về mặt tư duy thiết kế
1. **Nguyên Tắc "Zero-White-Flash" Trong Điện Ảnh Game**:
   - Mọi container chuyển cảnh toàn màn hình phải luôn mang màu nền tối nhất của chủ đề mỹ thuật thay vì màu trắng mặc định, ngăn chặn hoàn toàn hiện tượng chói lóa mắt người chơi khi tài nguyên đang tải.
2. **Tối Ưu Trước Trải Nghiệm (Optimistic Pre-loading)**:
   - Các tài nguyên FPV và cutscene nặng cần được giải mã sẵn trong bộ nhớ RAM của trình duyệt ngay tại màn hình chờ để khi chuyển cảnh, khung hình xuất hiện tức thì trong 0ms.
3. **Phân Định Rõ Ràng Trọng Tâm Khung Hình (Visual Anchor)**:
   - Khi nhân vật leo dốc trên Map 2 dài 2200px, việc duy trì một cội đại thụ anh đào kiêu hãnh trên đỉnh núi cao làm đích ngắm thị giác giúp người chơi luôn cảm nhận được mục tiêu phấn đấu rõ ràng qua từng bước chân.

### 2.3. Mẹo tính toán & Kỹ thuật lập trình
1. **Công thức Typewriter Clean Latch**:
   ```typescript
   if (typewriterTimerRef.current) {
     clearInterval(typewriterTimerRef.current);
     typewriterTimerRef.current = null;
   }
   setDisplayedText(fullText);
   setIsTyping(false);
   ```
2. **Kỹ thuật Module-Level SVG Hoisting**:
   - Tránh tính toán `Math.sin()`, tọa độ `getHillGroundY(x)` trong component body 60 lần/giây; hãy tính trước 1 lần duy nhất khi file JavaScript được nạp vào trình duyệt.

### 2.4. Chuẩn bị nền tảng cho phần tiếp theo
- Hệ thống FPV đa tầng với cơ chế cross-fade 2 lớp và quản lý typewriter ổn định này là mẫu kiến trúc chuẩn (gold standard) sẵn sàng để mở rộng cho các chương tiếp theo, các màn thoại phân nhánh (branching dialogue) hoặc các mini-game tương tác chạm mới.

---

## 3. 📖 Chuyên Đề: Cuốn Sách Kỷ Niệm 3D (Easter Egg Storybook)

### 3.1. Sự cố: Sách không xuất hiện ở màn hình nhỏ (Bị trống trơn)
- **Triệu chứng**:
  - Sau đoạn kết thúc "I LOVE U", khi nhấn phím `[E]` để mở sách ở cửa sổ mặc định (chưa bật toàn màn hình), cuốn sách chỉ hiện khung vỏ da màu đỏ mận, toàn bộ trang giấy trắng tinh/trống trơn không có nội dung.
  - Phải bấm chuyển sang chế độ "Toàn màn hình" thì các trang sách mới bất ngờ xuất hiện.
- **Phân tích 3 nguyên nhân gốc rễ**:
  1. **Lỗi Vòng đời React (React Lifecycle Hook Dependency Bug)**:
     - Component [EasterEggBook](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/src/components/easter-egg-book.tsx) sử dụng cờ `isMounted` để chỉ render portal sau khi client hydrate (`if (!isMounted) return null;`).
     - Ở lần render đầu tiên, `isMounted === false` nên DOM refs (`bookContainerRef`, `templatesRef`) mang giá trị `null`.
     - Tuy nhiên, trong `useEffect` khởi tạo `PageFlip`, dependency array chỉ chứa `[pageWidth, pageHeight, isExpanded, allPages]` mà **thiếu `isMounted`**.
     - Khi `isMounted` chuyển thành `true` và kích hoạt re-render, effect khởi tạo `PageFlip` **không hề chạy lại**. `PageFlip` hoàn toàn không được khởi tạo, container rỗng không. Khi người dùng bấm "Toàn màn hình", `isExpanded` đổi từ `false` sang `true` mới kích hoạt effect chạy.
  2. **Thiếu CSS cấu trúc cốt lõi của thư viện StPageFlip**:
     - Thư viện `page-flip` yêu cầu các lớp CSS `.stf__block { position: absolute; width: 100%; height: 100%; perspective: 2000px; }` và `.stf__wrapper { width: 100%; height: 100%; }`.
     - Do CSS không được import, `.stf__block` có `offsetHeight = 0`. Hàm tính tọa độ của `page-flip` tính ra `top = -184px`, đẩy toàn bộ các trang sách lên tọa độ âm phía trên khung nhìn.
  3. **Giới hạn khung nhìn Canvas $600 \times 400\text{px}$ & `overflow: hidden`**:
     - Trước đây ở chế độ thu nhỏ, modal sách được render trực tiếp trong [Canvas](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/src/components/canvas.tsx), bị giới hạn kích thước $600 \times 400\text{px}$ và bị `overflow: hidden` cắt cụt khi có bất kỳ lệch tọa độ nào.
- **Giải pháp dứt điểm**:
  1. Thêm `isMounted` vào dependency array của `useEffect` trong [EasterEggBook](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/src/components/easter-egg-book.tsx) để engine luôn nạp trang ngay khi DOM sẵn sàng.
  2. Luôn neo modal bằng `createPortal(bookDOM, document.body)` bất kể ở chế độ cửa sổ hay toàn màn hình.
  3. Bổ sung các luật CSS chuẩn mực của `stPageFlip` vào [globals.css](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/src/app/globals.css).
  4. Thêm lệnh ép layout cập nhật `pageFlip.update()` sau 50ms mount.

### 3.2. Chuẩn mực thẩm mỹ: Nghệ thuật Vector Cổ Điển vs. Icon/Emoji
- **Vấn đề**: Các emoji unicode như `🌸`, `✦`, `📖`, `🕊️` và đặc biệt là ngôi sao Gemini `✦` mang nét hiện đại, công nghiệp, làm giảm giá trị cổ kính và cảm xúc chân thành của cuốn sách tình yêu.
- **Quy tắc thiết kế mới**:
  1. Tuyệt đối không dùng emoji/icon đồ họa hệ thống trong sách và hộp thoại cutscene.
  2. Sử dụng 100% SVG vector pixel-art chuyên biệt:
     - `BrassCorner`: 4 miếng bọc góc đồng vàng chạm khắc phong cách Baroque/Victorian ở 4 góc bìa ngoài.
     - `CherryBranchCorner`: Nhánh cành đào uốn lượn mềm mại với hoa đào 5 cánh và lá non ở 4 góc của từng trang giấy ngà.
     - `CherryCrest`: Huy hiệu hoa anh đào nở rộ ở đầu trang giữa hai nhánh chỉ vàng đối xứng.
     - `SmallFlowerDivider` & `QuoteBox`: Hộp trích dẫn tình yêu với các hạt kim cương hình học `◇` sang trọng.
  3. **Logic ruy băng đánh dấu trang vật lý**:
     - Khi sách đóng (ở Bìa trước hoặc Bìa sau), dải ruy băng nhung đỏ và rãnh gáy phải được **ẩn hoàn toàn** (`!isOuterCover`). Ruy băng chỉ thả xuống khi sách được lật mở vào các trang ruột bên trong.



