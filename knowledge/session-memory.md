# 📝 Nhật Ký Ký Ức Phiên Làm Việc (Session Memory)

Tài liệu này lưu trữ lịch sử phát triển, các yêu cầu của người dùng, toàn bộ thay đổi mã nguồn và ký ức ngữ cảnh của dự án **"Met — A Tiny Love Story" (Web Edition)** qua từng phiên làm việc.

---

## 📌 Phiên Hiện Tại: Đợt 22 — Hoàn Thiện 8 Yêu Cầu Tinh Chỉnh Sâu (Xóa Pill Rỗng Hòm Thư, Tự Nhặt Hoa 2 Không Teleport, Xích Đu Cắm Đất y=322, Tán Ô Vòm Pixel, Sao Mảnh Tinh Tế, Bỏ Qua Hộp Thoại Bằng Phím [➔], Đồi Hoa Đào Dài 2200px Gian Nan)
- **Thời gian ghi nhận**: 10/09/2026
- **Nội dung thực hiện theo yêu cầu người dùng (/goal)**:
  1. **Task 1 (Xóa hộp thoại nhỏ dưới đất sau khi đọc thư)**: Điều chỉnh điều kiện outer container ở [game.tsx](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/src/components/game.tsx) thành `(isNearMailbox && !hasOpenedMailbox)`. Khi đã đọc thư, hoàn toàn không render pill rỗng có viền tím/hồng dưới mặt đất.
  2. **Task 2 (Tự nhặt hoa 2, xóa bỏ teleport)**: Xóa bỏ hoàn toàn logic `pos.x <= 448` và `isAutoWalkingBack` ở vùng $x \ge 380$. Người chơi tự do di chuyển đến bông hoa thứ 2 ở ghế đá ($x = 450$) và chạm để tự nhặt hoa tự nhiên. Rào chắn tự nhiên `gateBarrierX = 485` giữ chân người chơi nếu chưa mở thư/chưa qua biến cố mèo cào thư mà không có bất kỳ hiện tượng teleport nào.
  3. **Task 3 (Xích đu tiếp đất hoàn toàn)**: Kéo dài hai chân trụ của `wooden-swing-frame.png` xuống hàng pixel 111, hạ tọa độ hiển thị xuống `top: 211px` để hai chân trụ cắm ngập 2px vào thảm cỏ đất $y = 322$ và đặt contact shadow đậm nét ngay dưới chân đế, triệt tiêu 100% cảm giác lơ lửng.
  4. **Task 4 (Tán dù pixel che mép trên & hai bên)**: Tạo hình tán dù 16-bit retro pixel vòm rộng 640px (`fpv-umbrella-canopy-pixel.png`), chỉ che dải nhỏ ở mép trên (đỉnh vòm tại $y=48$) và uốn cong rủ xuống hai bên trái/phải ($y=220$), mang lại góc nhìn thứ nhất chân thực như đang cầm ô tròn che mưa.
  5. **Task 5 (Sao mỏng tinh tế & sao băng dải nhỏ)**: Thay thế ký tự `✦` dày bằng các ngôi sao SVG chữ thập thanh mảnh (stroke 0.85px) lấp lánh nhẹ nhàng. Sao băng được rút gọn thành một sợi tơ ánh sáng siêu mảnh (`h: 1.5px`, `w: 24px`) lướt ngang êm đềm qua bầu trời đêm.
  6. **Task 6 (Phím mũi tên phải [➔] bỏ qua hộp thoại sau khi ghép thư)**: Bắt sự kiện `ArrowRight` trong [fpv-letter-crafting.tsx](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/src/components/fpv-letter-crafting.tsx) để hoàn tất ghép thư và trong [thought-bubble.tsx](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/src/components/thought-bubble.tsx) để bỏ qua hộp thoại tức thì; cập nhật giao diện thành `➔ [Mũi tên phải]`.
  7. **Task 7 (Đồi hoa anh đào 2200px dài & uốn lượn gian nan)**: Mở rộng `HILL_LEVEL.mapWidth` từ 1000px lên 2200px. Xây dựng hàm sóng đa tầng $y(x) = 320 - t \cdot 55 + (-18\sin(7\pi t) - 6\sin(14\pi t))\sin(\pi t)$ với 7 nhịp đồi nhấp nhô uốn lượn; phân bổ 26 cây hoa đào và ghế đá giữa sườn núi; dời cội đại thụ và cô gái lên đỉnh đồi tại $x = 1940..2050$.
  8. **Task 8 (Khắc phục vệt gạch xanh & vũng nước dưới lòng đất)**:
     - **Nguyên nhân**: `<WeatherEffects />` (chứa hiệu ứng mưa rơi và vũng nước của Valley Map) không được bọc điều kiện bản đồ, nên khi nhân vật đi vào khoảng $x = 250..1080$ trên Map 2 (hoa đào), hiệu ứng mưa rơi xuyên qua mặt đồi xuống tận $y=420$ trong lòng đất kèm các vệt gạch xiên xanh `#93c5fd` và vũng nước xanh `#60a5fa`.
     - **Đã xử lý**: Giới hạn `<WeatherEffects />` chỉ render khi `currentMap === 'valley'`, bổ sung prop bảo vệ `isHillMap` chặn đứng việc render mưa trên Map 2, đồng thời tinh chỉnh `@keyframes rain-fall` trong [globals.css](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/src/app/globals.css) tự động fade out hoàn toàn ở mức $y = 322\text{px}$ để mưa không bao giờ lọt xuống dưới mặt đất ở bất kỳ đâu.
  9. **Kiểm thử & đồng bộ toàn diện**: Xác minh luồng chơi liên tục, `tsc --noEmit` đạt 0 lỗi.

---

## 📌 Phiên Trước: Đợt 21 — Hoàn Thành Toàn Diện 8 Task Theo Bản Ghi Âm Của Người Dùng
- **Thời gian ghi nhận**: 10/09/2026
- **Nội dung thực hiện theo yêu cầu người dùng (/goal)**:
  1. **Task 1 (Hòm Thư Single-Use & Mailbox Gate)**: Chỉ mở hòm thư 1 lần duy nhất (`hasOpenedMailbox`). Nếu chưa mở hòm thư, chặn vuốt ve mèo ở ghế đá (hiển thị nhắc nhở), chặn vượt qua $x \ge 380$ (tự động bước lùi về). Cho phép ngồi nghỉ ngơi trên ghế bằng phím `[S]`.
  2. **Task 2 (Khóa Nút Tiếp Tục Đến Khi Cào Rách Thư)**: Ẩn nút `[Tiếp ➔]` trong phân cảnh FPV vuốt mèo dòng thoại 0. Bắt buộc người chơi click vuốt mèo đạt 100%, mèo bật móng cào rách thư thành 3 mảnh (`paperRip` SFX) chuyển sang dòng thoại 1, nút `[Tiếp ➔]` mới xuất hiện.
  3. **Task 3 (Xích Đu Tiếp Đất Chuẩn Xác & Phóng To)**: Cắt bỏ viền trong suốt của `wooden-swing-frame.png`, tăng kích thước lên $96 \times 112\text{px}$, hạ xuống `top: 208px` để chân khung gỗ tiếp đất chuẩn xác tại $y = 320$. Đồng bộ dây treo, ván ngồi và tư thế nhân vật ngồi đung đưa.
  4. **Task 4 (Tán Dù Che Mưa Retro Pixel 16-Bit)**: Thay thế tán dù bằng tranh pixel art 16-bit nguyên bản (`fpv-umbrella-canopy-pixel.png`), nan dù kim loại, viền lượn sóng và các giọt nước đọng dạng pixel.
  5. **Task 5 (Cầu Ngắm Sao - Sao Băng Lướt Ngang & Sao Lóe Sáng)**: Chỉnh sửa quỹ đạo sao băng từ rơi chéo chúc đầu xuống đất thành lướt ngang nhẹ nhàng qua chân trời xa (`translate(-560px, 18px)` over 2.2s). Chùm sao lóe sáng rực rỡ với chùm tia chữ thập 4 cánh xoay nhẹ và hào quang vàng - ngọc lam.
  6. **Task 6 (Đồi Hoa Anh Đào Tự Động Kích Hoạt)**: Xóa nút tương tác `[E]` ở cổng vườn đào; khi chàng trai bước đi vào khu vườn ($x \ge 130$), hoạt cảnh FPV vườn hoa anh đào tự động kích hoạt.
  7. **Task 7 (FPV Gặp Mặt & Trao Thư Hoa Đỉnh Đồi Pixel Art)**: Tạo tác phẩm minh họa pixel art 16:9 hoàn toàn mới (`fpv-cherry-summit-reunion.jpg`) tái hiện khoảnh khắc chàng trai trao hoa và bức thư "I LIKE U" cho cô gái dưới bóng đại thụ anh đào.
  8. **Task 8 (Đường Đi Uốn Lượn Vòng Cung Map Hoa Đào)**: Xây dựng hàm địa hình lượn sóng $y(x) = 320 - t \cdot 55 - 16\sin(2\pi t) - 6\sin(4\pi t)$ trên Map 2. Vẽ đường dốc bằng SVG `<path>` uốn lượn; đồng bộ độ cao toàn bộ 14 cây hoa đào, ghế đá và xử lý bám dốc (slope-adhesion) cho nhân vật di chuyển êm ái.

---

## 📌 Phiên Trước: Đợt 20 — Hoàn Thiện 6 Hoạt Cảnh & Chuẩn Hóa HUD (Hòm Thư, Vuốt Mèo, Xích Đu Hợp Nhất, Cầu Ngắm Sao Băng, Vườn Đào Mới & Hội Ngộ Đỉnh Đồi)
- **Thời gian ghi nhận**: 10/09/2026
- **Nội dung thực hiện theo yêu cầu người dùng (/goal)**:
  1. **Hòm thư**: Xóa nút `[E] Xem bưu kiện` trong FPV hòm thư. Xóa thông báo thoại ThoughtBubble sau khi đóng FPV hòm thư.
  2. **Vuốt ve mèo**: Xóa bỏ toàn bộ hiệu ứng nhấp nhô kéo dãn (`cat-breathe` scale 1.025 / 0.985 và `active:scale-98`). Giữ nguyên hình ảnh chú mèo sắc nét, ổn định 100%.
  3. **Xích đu**: Xóa nút điều khiển `A / D Đu đưa` trên HUD. Hợp nhất khung A-frame cố định tại $y=240..320$ với cụm dây treo, ván ngồi và chàng trai; cả cụm đung đưa đồng điệu theo hàm dao động điều hòa $\theta(t) = 24^\circ \cdot \sin(2.4 t)$.
  4. **Cầu ngắm sao**: Tái tạo toàn cảnh FPV cầu đêm sao theo chuẩn Retro 16-Bit Pixel Art (sao pixel đa tầng, trăng khuyết vàng óng, suối đêm lấp lánh phản chiếu sóng nước). Khi bấm `[E]`, chùm sao lóe sáng (`.animate-star-burst`), vệt sao chổi nhỏ lướt ngang qua chân trời xa (`.animate-shooting-star`), chuông ngân kỳ ảo (`SFX.harpChime`) và nhân vật ước một điều ước bé nhỏ.
  5. **Vườn hoa anh đào**: Bổ sung hoạt cảnh FPV mới `cherry-entrance` kích hoạt khi bước chân lên Map 2, mở ra triền đồi ngập tràn hoa anh đào phấp phới cùng lời thoại choáng ngợp xúc động.
  6. **Cảnh gặp gỡ đỉnh đồi**: Tái tạo toàn diện FPV chàng trai gặp cô gái (`cherry-summit`) với cội đại thụ anh đào che chở, ánh dương xuyên hoa, cô gái mỉm cười dịu dàng và đôi tay chàng trai nâng niu cả bó hoa 7 đóa hồng lẫn bức thư tình "I LIKE U" đã được dán phẳng phiu.

---

## 📌 Phiên Trước: Đợt 19 — Trau Chuốt Chi Tiết Tự Sự & Chiều Sâu Điện Ảnh Kịch Bản
- **Thời gian ghi nhận**: 09/09/2026
- **Nội dung thảo luận & Thống nhất cùng người dùng**:
  1. Thảo luận cơ chế sinh ảnh FPV (sử dụng AI Diffusion Model dẫn đến việc ảnh mang tính minh họa mịn / khử răng cưa chứ không phải lưới điểm ảnh pixel thuần túy).
  2. Nâng cấp kịch bản mang tính tự sự chi tiết (Narrative Cause & Effect).
  3. Đồng bộ toàn bộ các tình tiết này vào `knowledge/storyline-and-atmosphere.md`.

---

## 📋 Lịch Sử Các Yêu Cầu Của Người Dùng (User Requests Chronology)

1. **Đợt 1 -> 13**:
   - Xây dựng 7 cơ chế hoa hồng, 4 tầng nhạc nền Lo-Fi thích ứng Web Audio API.
   - Hoàn thiện các góc nhìn FPV (Mèo, Mưa, Đèn đường, Cầu gỗ đêm).
   - Tối giản hóa giao diện HUD, gom toàn bộ chỉ dẫn xuống đáy màn hình (`Bottom Instruction Dialog`).
   - Thiết lập cuốn kịch bản gốc `knowledge/storyline-and-atmosphere.md` và quy tắc workspace bắt buộc cập nhật.
2. **Đợt 14 (Đề xuất & Chọn cốt truyện)**:
   - Người dùng yêu cầu đề xuất các phương án tình tiết mới có thử thách.
   - AI đề xuất 4 phương án, người dùng chọn Phương án 3: "Bức Thư Bị Rách & Kỷ Vật Thất Lạc".
   - Người dùng yêu cầu viết sâu, viết kỹ chi tiết kịch bản văn học.
3. **Đợt 15 (/grill-me & Thống nhất phong cách message.png)**:
   - Người dùng yêu cầu tham khảo phong cách thiết kế của ảnh `message.png` và kích hoạt lệnh `/grill-me`.
   - AI phỏng vấn từng nhánh thiết kế:
     - Nhánh 1: Mỹ thuật 3 mảnh thư là chất giấy kraft nâu, viền vẽ tay doodle matching ảnh `message.png`.
     - Nhánh 2: 3 thử thách đa dạng (nhảy cành cây cột đèn, canh nhịp thuyền giấy trôi dưới suối, dỗ mèo bìa rừng).
     - Nhánh 3: FPV xếp hình kéo-thả / click trực quan, dán băng keo hoa đào.
     - Nhánh 4: Giữ nguyên 100% vẻ đẹp nguyên bản của ảnh kết thúc `message.png` ("I LIKE U").
     - Nhánh 5: Hard Gate bắt buộc tìm đủ 3 mảnh mới mở màn gặp gỡ.
4. **Đợt 16 (Hiện thực hóa hệ thống mảnh thư & FPV Crafting)**:
   - Triển khai `src/components/letter-fragment.tsx` và `src/components/fpv-letter-crafting.tsx`.
   - Nâng cấp `src/lib/level-data.ts`, `src/lib/sound.ts`, `src/components/props-layer.tsx`, `src/components/hud.tsx`, `src/components/game.tsx`.
5. **Đợt 17 (/goal: Khắc phục 4 vấn đề mỹ thuật & trải nghiệm người chơi)**:
   - Yêu cầu 1: Vẽ lại cảnh FPV vuốt ve con mèo theo phong cách vẽ tay doodle của `message.png`.
   - Yêu cầu 2: Tạo lại tất cả ảnh nhân vật cầm ô (sửa lỗi ô lơ lửng trên đầu).
   - Yêu cầu 3: Tạo lại ghế đá có mèo nằm trên ghế + hoạt cảnh ngồi; tạo lại xích đu mới (không lơ lửng, bấm `[E]` nhân vật ngồi lên đu đưa).
   - Yêu cầu 4: Khắc phục lỗi người chơi không tìm thấy Mảnh thư #3.
   - Yêu cầu 5: Lưu và chuẩn hóa hệ thống Knowledge Items (KI) của dự án.

---

## 🛠️ Chi Tiết Những Gì Đã Làm & Đã Thay Đổi Trong Đợt 17 (Implementation Details)

### 1. Phân Cảnh FPV Vuốt Mèo Phong Cách Doodle Crayon (`first-person-view.tsx`)
- **Tài nguyên**: Tạo tác phẩm nghệ thuật tranh vẽ sáp màu doodle ấm cúng [public/assets/others/fpv-cat-doodle.png](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/public/assets/others/fpv-cat-doodle.png) đồng điệu với nét vẽ của `message.png`.
- **Cơ chế tương tác**:
  - Tích hợp chu kỳ hô hấp tự nhiên: Hình ảnh mèo phập phồng nhẹ theo nhịp thở `sin(t)` ($\pm 1.5\%$).
  - Tương tác vuốt chạm: Người chơi click chuột hoặc bấm `[Space]` để vuốt ve. Mỗi lần vuốt chuẩn xác sinh ra các hạt tim hồng `♥` bay lơ lửng kèm độ trôi ngẫu nhiên.
  - Hiệu ứng rung gừ gừ (purr rumble) mô phỏng cảm giác xúc giác chân thực qua CSS keyframe.
  - Phụ đề đối thoại đáy màn hình chạy typewriter mượt mà.

### 2. Bộ Sprite Tích Hợp Toàn Thân Cầm Ô (`src/components/hero.tsx`)
- **Vấn đề trước đây**: Ô được render như một lớp overlay tách biệt phía trên đầu nhân vật, dẫn đến việc ô bị trôi lơ lửng khi nhân vật nhảy, quay đầu hoặc chuyển frame bước đi.
- **Giải pháp triệt để**:
  - Tạo bộ 6 sprite tích hợp toàn thân vẽ nhân vật cầm cán ô vững chãi trong tay:
    - [hero-umbrella-idle.png](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/public/assets/character/hero-umbrella-idle.png) (Đứng yên hướng phải)
    - [hero-umbrella-left-idle.png](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/public/assets/character/hero-umbrella-left-idle.png) (Đứng yên hướng trái)
    - [hero-umbrella-right-lf.png](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/public/assets/character/hero-umbrella-right-lf.png) (Bước chân trái hướng phải)
    - [hero-umbrella-right-rf.png](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/public/assets/character/hero-umbrella-right-rf.png) (Bước chân phải hướng phải)
    - [hero-umbrella-left-lf.png](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/public/assets/character/hero-umbrella-left-lf.png) (Bước chân trái hướng trái)
    - [hero-umbrella-left-rf.png](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/public/assets/character/hero-umbrella-left-rf.png) (Bước chân phải hướng trái)
  - Quy chuẩn kích thước: Kích thước sprite mở rộng lên $64 \times 84\text{ px}$ (để chứa trọn vẹn tán ô phía trên), điều chỉnh vị trí hiển thị `pos.y - 36` trong `hero.tsx` để bàn chân nhân vật luôn chạm chính xác mặt đất $y = 320$.

### 3. Đạo Cụ Ghế Đá Mèo Nằm & Xích Đu Chữ A Tiếp Đất (`props-layer.tsx`, `game.tsx`)
- **Ghế đá công viên & Mèo ngủ**:
  - Tạo [public/assets/others/park-bench.png](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/public/assets/others/park-bench.png) ($80 \times 36\text{ px}$) đặt tại $x = 450, y = 284$ (chân ghế cắm vững chãi trên mặt đất $y = 320$).
  - Mèo tam thể được vẽ nằm ngủ ngoan ngoãn ở nửa bên phải ghế.
  - Khi người chơi bấm `[S] / [Down]`, nhân vật ngồi xuống nửa bên trái ghế ($x = 426, y = 274$) kề bên chú mèo.
  - Bấm `[E]` vẫn kích hoạt mượt mà phân cảnh FPV vuốt ve mèo.
- **Xích đu chữ A tiếp đất**:
  - Tạo [public/assets/others/wooden-swing.png](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/public/assets/others/wooden-swing.png) ($64 \times 80\text{ px}$) đặt tại $x = 680, y = 240$ (chân khung gỗ chữ A chạm đất $y = 320$, hoàn toàn xóa bỏ cảm giác treo giữa không trung).
  - Tạo sprite ngồi xích đu [public/assets/character/hero-sit-swing.png](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/public/assets/character/hero-sit-swing.png) ($48 \times 48\text{ px}$).
  - Trong phạm vi $x \in [630, 730]$, người chơi bấm `[E]` để ngồi lên xích đu. Ghế và nhân vật đung đưa theo chu kỳ con lắc vật lý điều hòa `swingAngle`. Bấm `[Space]` hoặc `[E]` để nhảy xuống an toàn.

### 4. Nâng Cấp Khả Năng Nhận Diện & Thu Thập Mảnh Thư #3
- **Tệp chỉnh sửa**: [letter-fragment.tsx](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/src/components/letter-fragment.tsx), [game.tsx](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/src/components/game.tsx)
- **Chi tiết khắc phục**:
  - Thêm hào quang vàng óng ánh (pulsing golden aura) và thẻ tên nổi bật `✨ Mảnh Thư #3 [E]`.
  - Mở rộng vùng tương tác từ hẹp thành $x \in [1740, 1860]$.
  - Loại bỏ điều kiện ẩn `isSitting`: Người chơi chỉ cần nhấn `[E]` là nhặt được ngay lập tức.
  - Bổ sung cơ chế nhặt tự động dự phòng (walk-over proximity pickup) khi bước qua $x \approx 1800$.
  - Thêm lời thoại suy nghĩ dẫn đường khi nhân vật vừa đặt chân vào khu vực ($x \ge 1710$).

---

## 🎓 Bài Học & Kinh Nghiệm Đúc Kết (Study Experience Extractor)

### 1. Tổng hợp các lỗi kỹ thuật và lưu ý tư duy
- **Quy tắc Mặt Đất Chuẩn (Ground Coordinate Baseline)**:
  - *Lỗi phổ biến*: Đặt tọa độ các vật thể cảnh quan (props) theo cảm tính hoặc thiếu tính toán chiều cao dẫn đến tình trạng đạo cụ bị treo lơ lửng trên không trung hoặc lún dưới lòng đất.
  - *Tư duy khắc phục*: Luôn xác định mặt sàn vật lý làm mốc chuẩn: $y_{\text{ground}} = 320$. Mọi vật thể đứng trên mặt đất phải tính toán tọa độ theo công thức:
    $$\text{top} = y_{\text{ground}} - \text{height}$$
    Ví dụ: Xích đu cao $80\text{px} \rightarrow y = 320 - 80 = 240$; Ghế đá cao $36\text{px} \rightarrow y = 320 - 36 = 284$.
- **Tránh "Bẫy Phụ Kiện Tách Rời" (Detached Overlay Trap) Cho Nhân Vật**:
  - *Lỗi phổ biến*: Render nhân vật và vật phẩm cầm tay (ô, đuốc, vũ khí) thành 2 thẻ `<img>` độc lập lồng nhau bằng CSS absolute. Khi nhân vật bước đi (chân nhấc lên/hạ xuống 2px) hoặc quay đầu (flip), vật phẩm thường xuyên bị lệch tâm, tạo cảm giác như "lơ lửng trên đỉnh đầu".
  - *Tư duy khắc phục*: Luôn thiết kế sprite tích hợp toàn thân (integrated full-body sprite) cho các trạng thái mang vác lớn. Bằng cách này, cánh tay, bàn tay, cán ô và tán ô luôn đồng bộ 100% từng điểm ảnh với dáng người.
- **Nguyên Tắc Giảm Thiểu Ma Sát Tương Tác (Zero-Friction Quest Items)**:
  - *Lỗi phổ biến*: Đặt ra các điều kiện tiên quyết ẩn (ví dụ: bắt buộc phải ngồi `isSitting` hoặc quay mặt đúng hướng mới được bấm `[E]`) mà không có chỉ dẫn hình ảnh rõ ràng, khiến người chơi nghĩ rằng game bị lỗi (bug) khi bấm `[E]` không thấy phản hồi.
  - *Tư duy khắc phục*: Đối với các vật phẩm mang tính bắt buộc của cốt truyện (Quest-Critical Items):
    1. Luôn hiển thị hào quang phát sáng (visual beacon) và nhãn gợi ý phím rõ ràng.
    2. Cho phép kích hoạt trực tiếp bằng 1 phím duy nhất (`[E]`).
    3. Luôn trang bị cơ chế bảo hiểm va chạm tự động nhặt (walk-over trigger) để đảm bảo không người chơi nào bị kẹt lại.

## 📌 Phiên Hiện Tại: Đợt 19 — Cân Chỉnh Tỷ Lệ Nhân Vật Cầm Ô, Hệ Thống Điều Khiển FPV Chuẩn Hóa, Tối Ưu Thuyền Giấy & Đồng Nhất 7 Bông Hoa
- **Thời gian ghi nhận**: 08/09/2026
- **Mục tiêu phiên**:
  1. **Khắc phục nhân vật cầm ô bị phóng to**: Điều chỉnh `spriteW/spriteH` từ 64x84 về đúng kích thước gốc của sprite 48x64 px trong `hero.tsx`.
  2. **Chuẩn hóa điều khiển FPV**: Chuột click hoặc phím Space dành riêng cho tương tác (vuốt mèo, sưởi tay, gõ tán ô...); Phím mũi tên phải `[→]` hoặc Enter hoặc nút `[Tiếp tục ➔ [→]]` để qua câu thoại.
  3. **Tối ưu quan sát & nhặt thuyền giấy (Mảnh #2)**:
     - Nâng tọa độ thuyền giấy lên $y=295$ (nổi chuẩn trên mặt nước hồ $y=316$).
     - Tăng z-index của container mảnh thư lên `z-25` để thuyền giấy luôn nổi trên mặt hồ nước (`z-10`).
     - Bổ sung hào quang ngọc bích phát sáng và nhãn chỉ dẫn nổi `⛵ Vớt thuyền giấy [E]`.
     - Mở rộng tầm tương tác $x \in [1430, 1610]$ và bổ sung cơ chế tự động vớt khi đi ngang qua $x \approx 1500$.
  4. **Đồng nhất hình ảnh Bông hoa #1**: Đổi sprite hiển thị sang `/assets/others/rose-item.png` (bông hoa hồng pixel đồng nhất tuyệt đối với 6 bông hoa còn lại).

---

## 🎓 Bài Học & Kinh Nghiệm Đúc Kết (Study Experience Extractor)

### 1. Tổng hợp các lỗi kỹ thuật và lưu ý tư duy
- **Đồng Nhất Kích Thước Khung Render Sprite (Sprite Bounding Box Consistency)**:
  - *Lỗi phổ biến*: Khi thiết kế các sprite mới (như nhân vật cầm ô) với khổ canvas mở rộng (ví dụ 64x84px) nhưng sprite vẽ thực tế vẫn là 48x64px, việc gán cưỡng ép `spriteW = 64; spriteH = 84` trong CSS sẽ khiến nhân vật bị scale phóng đại $1.33\times$ so với lúc không cầm ô.
  - *Tư duy khắc phục*: Luôn giữ kích thước render chuẩn của nhân vật cố định theo thông số level (`LEVEL.heroWidth = 48`, `LEVEL.heroHeight = 64`). Nếu phụ kiện vượt quá khung, căn chỉnh anchor bằng CSS absolute hoặc định chuẩn khổ canvas ngay từ khâu xuất ảnh pixel art.
- **Tách Biệt Rạch Ròi Giữa Tương Tác Hành Động Và Tiến Trình Kịch Bản (Interaction vs Dialogue Progression)**:
  - *Lỗi phổ biến*: Gán cả thao tác Click chuột và phím Space cho việc "chuyển câu thoại kế tiếp", khiến người chơi vô tình bấm lướt qua hết thoại mà chưa kịp trải nghiệm các hành động tinh tế (vuốt mèo, sưởi tay ấm).
  - *Tư duy khắc phục*: Quy ước rõ ràng:
    - **Hành động vi mô (Micro-interactions)**: Phím `[Space]` hoặc Click vào bất cứ đâu trên khung nhìn để chạm, vuốt ve, cảm nhận xúc giác.
    - **Tiến trình cốt truyện (Narrative progression)**: Phím điều hướng `[→]` (ArrowRight), `[Enter]` hoặc nút bấm `[Tiếp tục]` chuyên dụng có `stopPropagation()`.
- **Quản Lý Lớp Hiển Thị Z-Index Trên Các Thực Thể Môi Trường (Water & Submerged Entities)**:
  - *Lỗi phổ biến*: Khi bổ sung lớp hồ nước mỹ thuật với hiệu ứng tỏa sáng (`z-10`), các vật thể nhiệm vụ như thuyền giấy nếu không gán z-index tường minh (`z-auto = 0`) sẽ bị che khuất bên dưới mặt nước.
  - *Tư duy khắc phục*: Thiết lập phân tầng z-index rõ ràng:
    - Nền đất & hồ nước: `z-10`
    - Cây cối, đèn đường, ghế đá, đạo cụ: `z-15`
    - Nhân vật & vật phẩm nhiệm vụ (Roses, Fragments): `z-20` đến `z-25`
    - Giao diện người dùng (HUD, Subtitles, Dialogs): `z-30` đến `z-50`.
- **Tính Nhất Quán Về Nhận Diện Của Chuỗi Vật Phẩm (Collectible Visual Consistency)**:
  - *Lỗi phổ biến*: Sử dụng asset khác nhau giữa các vật phẩm cùng một chuỗi (ví dụ: hoa cúc hồng `flower-pink.png` cho hoa #1 nhưng hoa hồng đỏ `rose-item.png` cho hoa #2..#7), làm người chơi thắc mắc hoặc tưởng nhầm là lỗi hiển thị.
  - *Tư duy khắc phục*: Cùng một danh mục vật phẩm nhiệm vụ phải sử dụng chung base asset (`rose-item.png`), chỉ tạo sự khác biệt thông qua hiệu ứng môi trường (ánh sáng đèn, bướm lượn, đom đóm, gợn sóng nước).

## 📌 Phiên Hiện Tại: Đợt 20 — Cơ Chế Tự Ngắt Phím Mũi Tên Phải (One-Shot Dialogue Latch & Key-Release Gating)
- **Thời gian ghi nhận**: 08/09/2026
- **Mục tiêu phiên**:
  - Khắc phục hiện tượng người chơi giữ phím `ArrowRight` (hoặc phím di chuyển sang phải khi vừa bước vào điểm kích hoạt FPV) khiến toàn bộ lời thoại và trải nghiệm bị lướt qua (skip) sạch sẽ trong tích tắc.
  - Hiện thực hóa cơ chế **"Skip 1 lần rồi tự ngắt — Muốn skip tiếp bắt buộc phải nhả phím rồi ấn lại 1 lần nữa"**:
    1. **Loại bỏ hoàn toàn OS Keyboard Auto-Repeat**: Bỏ qua mọi sự kiện `e.repeat === true`.
    2. **Khóa chốt đơn kỳ (One-Shot Latch)**: Ghi nhận `isRightKeyHeldRef = true` ngay sau khi kích hoạt bước kế tiếp, ngắt hoàn toàn mọi tín hiệu phát sinh sau đó.
    3. **Bắt buộc nhả phím vật lý (`keyup`)**: Chỉ khi người chơi thực sự nhấc ngón tay khỏi phím `ArrowRight` (hoặc `Enter`), cờ `isRightKeyHeldRef` mới được giải phóng về `false`.
    4. **Khoảng đệm an toàn khi chuyển cảnh (Mount Grace Period)**: Bỏ qua phím trong 350ms đầu tiên khi FPV/hộp thoại mở ra để không nuốt nhầm phím di chuyển sang phải lúc người chơi đang chạy vào vùng trigger.
    5. **Áp dụng đồng bộ**: Cho toàn bộ các phân cảnh FPV ([first-person-view.tsx](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/src/components/first-person-view.tsx)), hộp thoại kết thúc ([dialogue-box.tsx](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/src/components/dialogue-box.tsx)) và màn chữ mở đầu ([intro-text.tsx](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/src/components/intro-text.tsx)).

---

## 🎓 Bài Học & Kinh Nghiệm Đúc Kết (Study Experience Extractor)

### 1. Tổng hợp các lỗi kỹ thuật và lưu ý tư duy
- **Hiện Tượng Trôi Phím Tự Động (Keyboard Auto-Repeat Bleed-Through)**:
  - *Lỗi phổ biến*: Trong trình duyệt web, khi người dùng giữ một phím, hệ điều hành sẽ phát ra sự kiện `keydown` liên tục với tần số 30–60 lần/giây. Nếu một phân cảnh đối thoại (FPV/Cutscene) được kích hoạt ngay khi nhân vật đang di chuyển bằng `ArrowRight`, các sự kiện `keydown` lặp lại này sẽ lập tức kích hoạt hàm `handleAdvance()` hàng chục lần, tua qua toàn bộ nội dung chỉ trong 200ms.
  - *Tư duy khắc phục*:
    - Luôn lọc `if (e.repeat) return;` trong tất cả các trình xử lý phím tiến trình cốt truyện.
    - Áp dụng kỹ thuật **Latch & Key-Up Release Requirement**: Một phím chỉ kích hoạt đúng 1 tác vụ, sau đó tự khóa (`held = true`). Trình nghe chỉ mở khóa khi nhận sự kiện `keyup` tương ứng.
- **Thời Gian Đệm An Toàn Khi Chuyển Cảnh (Mount Grace Period)**:
  - *Lỗi phổ biến*: Người chơi vừa bước tới tọa độ kích hoạt thì component FPV được mount ngay lập tức. Dù có chặn `e.repeat`, nếu ngón tay người chơi chưa kịp nhả phím di chuyển trước thời điểm mount, sự kiện `keydown` phát sinh sát nút vẫn có thể bị tính là một lần nhấn có chủ đích.
  - *Tư duy khắc phục*: Cài đặt một khoảng đệm an toàn $300\text{ms} - 350\text{ms}$ (`Date.now() - mountTime < 350`) tương ứng với thời lượng hiệu ứng chuyển cảnh mờ dần (fade-in), đảm bảo người chơi đã nhận thức được giao diện mới trước khi bất kỳ phím skip nào có hiệu lực.

## 📌 Phiên Hiện Tại: Đợt 21 — Khắc Phục Tách Đôi Chữ Met & Hệ Thống Mã Code Mở Khóa Game (Single-Use & Infinite Codes)
- **Thời gian ghi nhận**: 08/09/2026
- **Mục tiêu phiên**:
  1. **Khắc phục chữ "Met" bị tách thành đôi ("Me  t")**:
     - Do đặc tính glyph của font monospaced pixel `Press Start 2P`, ký tự `e` có padding rỗng bên phải và ký tự `t` có padding rỗng bên trái, cộng hưởng với `text-6xl` ($60\text{px}$) và thuộc tính `tracking-wider` tạo ra khoảng trống khổng lồ (~$35\text{px}$) giữa `e` và `t` (gấp 5 lần khoảng cách giữa `M` và `e`).
     - Khắc phục bằng cách bỏ `tracking-wider` và định vị chữ `t` với `marginLeft: '-14px'` nhằm triệt tiêu hoàn toàn khoảng cách thừa, đưa 3 chữ cái `M-e-t` về tỉ lệ khoảng cách chuẩn mực, liền mạch và thẩm mỹ.
  2. **Hệ thống nhập mã Code bảo mật phong cách Pixel Art ([title-screen.tsx](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/src/components/title-screen.tsx))**:
     - Thay thế cơ chế "bấm phím bất kỳ để vào game" bằng một thẻ pixel card nhập mã trang nhã:
       - **Mã `140606`**: Dùng duy nhất 1 lần (Single-use). Khi nhập thành công, lưu cờ `met_code_140606_used = 'true'` vào `localStorage`. Nếu nhập lại lần sau sẽ báo lỗi `"Mã 140606 đã được sử dụng! (Chỉ dùng 1 lần)"`.
       - **Mã `291104`**: Dùng vô hạn lần (Infinite-use). Luôn mở khóa thành công.
       - Mã sai hoặc để trống: Rung lắc viền đỏ kèm âm thanh cảnh báo `SFX.umbrellaTap()`.
       - Mã đúng: Phát âm thanh chuông đàn hạc lãng mạn `SFX.harpChime()` kèm thông điệp màu xanh ngọc bích `♥ Mã chính xác! Đang vào trò chơi...`.
     - Bổ sung nút bấm **"Reset Mã Code 140606"** trong Admin Panel ([admin-panel.tsx](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/src/components/admin-panel.tsx)) để thuận tiện thử nghiệm.

---

## 🎓 Bài Học & Kinh Nghiệm Đúc Kết (Study Experience Extractor)

### 1. Tổng hợp các lỗi kỹ thuật và lưu ý tư duy
- **Hiện Tượng Mất Cân Bằng Khoảng Cách Ký Tự Trong Font Monospaced Pixel (Monospace Kerning Disparity)**:
  - *Lỗi phổ biến*: Các font chữ pixel hoài cổ như `Press Start 2P` được thiết kế theo lưới cố định $8 \times 8$ điểm ảnh cho mỗi ký tự. Đối với chữ hoa như `M`, hình vẽ chiếm trọn $8\text{px}$ bề ngang. Tuy nhiên đối với các ký tự chữ thường hẹp như `t`, nét đứng nằm ở cột giữa khiến 2 bên mép chữ chứa các cột pixel trong suốt. Khi phóng to lên cỡ chữ lớn ($60\text{px} - 72\text{px}$), các khoảng rỗng này nhân lên gấp nhiều lần. Nếu lạm dụng `tracking-wider`, chữ viết sẽ bị "gãy khúc" thành từng cụm rời rạc (`Me` và `t`).
  - *Tư duy khắc phục*:
    - Không áp dụng `letter-spacing` dương trên các font monospace khi ở kích thước tiêu đề lớn.
    - Tách từng ký tự hoặc dùng negative margin có tính toán (`marginLeft: '-0.22em'` hoặc `'-14px'`) để bù trừ phần lề thừa của các glyph hẹp, tạo hiệu ứng kerning thủ công hoàn hảo.
- **Quản Lý Trạng Thái Dữ Liệu Cục Bộ An Toàn (Idempotent Local Storage Verification)**:
  - *Lỗi phổ biến*: Đọc/ghi `localStorage` trực tiếp mà không kiểm tra môi trường chạy Next.js Server-Side Rendering (SSR), dễ gây lỗi `ReferenceError: localStorage is not defined` trong quá trình build production.
  - *Tư duy khắc phục*: Luôn bọc các truy vấn lưu trữ trong điều kiện `typeof window !== 'undefined'` và cung cấp các công cụ reset thủ công (trong Admin Panel) để kiểm thử vòng đời của các mã chỉ dùng một lần (One-Time Passcodes).

## 📌 Phiên Hiện Tại: Đợt 23 — Chuẩn Hóa Mỹ Thuật Storybook Cel Theo Ảnh Message.png & Tình Tiết Mèo Cào Rách Thư Trên Ghế Đá
- **Thời gian ghi nhận**: 08/09/2026
- **Mục tiêu phiên**:
  1. **Định chuẩn mỹ thuật FPV theo `message.png` ("Không quá pixel cũng không quá chân thực")**:
     - Loại bỏ các hình minh họa mang hơi hướng giải phẫu thực tế hoặc chì vẽ tả thực (quá chân thực) và các sprite vỡ nét thô (quá pixel).
     - Định chuẩn phong cách **Retro Storybook Doodle / Cel-Shaded**: Nét viền mực đen/nâu sẫm dày 2-3px rõ ràng mộc mạc, các mảng màu phẳng (flat cel shading) ấm áp (kem da `#f0c2a2`, giấy kraft `#c99b66`, đỏ nhung `#e11d48`), loại bỏ khung hộp trắng cứng nhắc, bảo đảm nền trong suốt (transparent PNG) 100%.
  2. **Sáng tác & xử lý 2 tác phẩm FPV mới**:
     - `public/assets/others/fpv-cat-storybook.png`: Đôi bàn tay nâng niu vuốt ve chú mèo tam thể nằm ngoan trên ghế gỗ, bên cạnh là bức thư phong bì kraft thắt nơ đỏ.
     - `public/assets/others/fpv-lamp-hands-storybook.png`: Đôi bàn tay khum chụm che chở đóa hoa hồng đỏ thắm dưới quầng sáng đèn đường vàng ấm áp.
     - `public/assets/others/park-bench-empty.png`: Sprite ghế băng công viên trống khi mèo đã bỏ chạy.
  3. **Tình tiết cốt truyện mới (Cat Letter Rip & Chase Hook)**:
     - Tại ghế đá ($x=450$), khi nhân vật ngồi xuống (`[S]`), phong bì thư tình xuất hiện đặt kế bên chú mèo.
     - Người chơi tương tác vuốt ve mèo trong FPV. Khi hoàn thành:
       - Chú mèo tinh nghịch cào rách phong bì thư, gió thổi thốc cuốn 3 mảnh thư rách bay tán loạn về phía trước.
       - Chú mèo hoảng hốt phóng vụt đi mất dạng. Chiếc ghế trở nên trống trải (`park-bench-empty.png`).
       - Đóa hoa #2 rơi lại dưới gầm ghế để người chơi nhặt.
       - Kích hoạt hành trình người hùng đuổi theo chú mèo và thu thập lại 3 mảnh thư tình!
  4. **Tích hợp & Phân tách thoại FPV Mèo**:
     - Mèo ở ghế đá ($x=450$) có thoại nội tâm về bức thư và nụ cười ấm áp.
     - Mèo ở bìa rừng ($x=1800$) giữ vai trò bảo vệ Mảnh thư #3 (`isForestCat = true`) với thoại dỗ dành mèo rừng.
  5. **Xác thực kiểm thử**: `npm run build` biên dịch thành công 100% trong 10.8s, không phát sinh lỗi TypeScript hay runtime.

---

## 🎓 Bài Học & Kinh Nghiệm Đúc Kết (Study Experience Extractor)

### 1. Tổng hợp các lỗi sai phổ biến và lưu ý về mặt tư duy
- **Định Nghĩa "Phong Cách Trung Dung" Trong Visual Art (The Goldilocks Principle: Neither Hyper-Realistic nor Hyper-Pixelated)**:
  - *Lỗi sai phổ biến*: Khi được yêu cầu tránh phong cách pixel thô sơ, AI thường có xu hướng chuyển hướng sang phong cách hội họa tả thực (semi-realistic painting/pencil sketch) với các chi tiết gân da, nếp nhăn móng tay, sợi lông mèo tả tơ... Điều này gây phá vỡ hoàn toàn ngôn ngữ nghệ thuật của một tựa game indie hoài niệm (chibi / storybook doodle).
  - *Tư duy khắc phục*: Quy chuẩn rõ 3 yếu tố cốt lõi của phong cách `message.png`:
    1. *Contour Lines*: Đường viền mực đen/nâu sẫm 2-3px rõ ràng, dứt khoát nhưng có độ rung tay tự nhiên (wobbly hand-drawn contour).
    2. *Flat Cel-Shading*: Tô màu mảng phẳng (solid warm tones), không dùng gradient 3D phức tạp, bóng đổ chỉ dùng 1-2 sắc độ tối hơn nhẹ nhàng.
    3. *Alpha Transparency*: Tách nền triệt để bằng flood-fill viền hoặc alpha mask, tuyệt đối không chèn các khung viền chữ nhật màu trắng đục vào không gian game đêm.
- **Tính Nhất Quán Về Không Gian & Đạo Cụ Trong Kể Chuyện (Spatial & Prop Continuity)**:
  - *Lỗi sai phổ biến*: Một sự kiện kịch bản xảy ra (như mèo xé thư rồi chạy mất khỏi ghế đá) nhưng trên bản đồ thế giới (Overworld props), chú mèo vẫn nằm ngủ nguyên vẹn trên chiếc ghế như chưa từng có chuyện gì xảy ra.
  - *Tư duy khắc phục*: Phải đồng bộ hóa state của thế giới trò chơi (`hasLostLetter`):
    - Trước khi xé thư: Ghế có mèo nằm + phong bì thư (`isSitting && !hasLostLetter`).
    - Sau khi xé thư: Ghế chuyển sang sprite rỗng (`park-bench-empty.png`), tạo cảm giác mất mát trực quan và thôi thúc người chơi lập tức bước chân đi tìm kiếm.
- **Phân Định Vai Trò Của Các Thực Thể Trùng Loại (Entity Role Differentiation)**:
  - *Lưu ý về mặt tư duy*: Khi trong game có 2 chú mèo (Mèo công viên ở $x=450$ và Mèo bìa rừng ở $x=1800$), nếu dùng chung một component FPV mà không truyền cờ phân biệt (`isForestCat`), người chơi sẽ nghe lại cùng một đoạn thoại vuốt ve lặp lại, làm mất tính logic của câu chuyện. Việc phân nhánh thoại và nhiệm vụ rạch ròi qua props giúp mỗi cuộc gặp gỡ đều mang một ý nghĩa cảm xúc riêng biệt.

### 2. Chuẩn bị nền tảng cho phần tiếp theo
- Chuẩn mỹ thuật "không quá pixel cũng không quá chân thực" giờ đây đã được thiết lập thành kim chỉ nam vững chắc cho toàn bộ các hình ảnh minh họa FPV và cutscene tiếp theo.
- Hành trình người chơi giờ đây có động lực cốt truyện (narrative drive) tự nhiên và giàu cảm xúc ngay từ những phút đầu tiên: từ khoảnh khắc bình yên bên chú mèo công viên, qua cú ngoặt rách thư, đến hành trình kiên trì tìm lại từng mảnh ghép ký ức để kịp giờ hẹn dưới cội hoa anh đào.

---

## 📌 Phiên Hiện Tại: Đợt 24 — Dọn Dẹp Toàn Diện Các Tệp Tạm & Tài Nguyên Không Sử Dụng
- **Thời gian ghi nhận**: 08/09/2026
- **Mục tiêu phiên**:
  1. **Thanh lọc tài nguyên đồ họa lỗi thời trong `public/assets/others/`**:
     - Xóa 6 tệp FPV tả thực/doodle thử nghiệm cũ: `fpv-cat-doodle.jpg`, `fpv-cat-doodle.png`, `fpv-cat.png`, `fpv-lamp-hands-doodle.jpg`, `fpv-lamp-hands-doodle.png`, `fpv-lamp-hands.png` (tiết kiệm ~2.2 MB dung lượng).
     - Xóa 5 tệp hoa và phụ kiện tách rời không còn sử dụng: `flower-pink.png`, `flower-purple.png`, `flower-red.png`, `flower-yellow.png`, `red-umbrella.png`.
  2. **Thanh lọc tệp mẫu mặc định (Next.js Boilerplate)**:
     - Xóa 5 tệp SVG không dùng trong `public/`: `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`.
  3. **Thanh lọc thư mục script tạm thời (`scripts/`)**:
     - Xóa 8 tập lệnh Node.js tạo ảnh pixel/FPV một lần (`generate-*.js`, `process-storybook-assets.js`), trả lại cây thư mục dự án sạch sẽ và chuyên nghiệp.
  4. **Kiểm tra biên dịch xác nhận**:
     - `npm run build` chạy thành công tuyệt đối trong **8.0s** (Turbopack, Exit Code 0, 0 errors).

---

## 🎓 Bài Học & Kinh Nghiệm Đúc Kết (Study Experience Extractor)

### 1. Tổng hợp các lỗi sai phổ biến & Lưu ý về mặt tư duy
- **Hiện tượng "Tích tụ rác kỹ thuật số" (Digital Asset Hoarding & Artifact Accumulation)**:
  - *Lỗi sai phổ biến*: Trong quá trình lặp (iterate) mỹ thuật và tính năng, nhiều file tạm (scratch scripts, ảnh trung gian, ảnh không đạt yêu cầu) liên tục được tạo ra. Nếu không dọn dẹp định kỳ, thư mục `public/` sẽ phình to hàng chục megabyte, làm chậm thời gian clone, tăng dung lượng build bundle và gây nhầm lẫn khi tra cứu file nguồn.
  - *Tư duy khắc phục*:
    1. Chỉ lưu giữ trong `public/` các tệp thực sự được `src/` tham chiếu (Active Assets).
    2. Trước khi xóa, luôn dùng `grep_search` kiểm tra chéo toàn bộ codebase xem có import hay đường dẫn tĩnh nào còn trỏ tới không.
    3. Sau khi xóa, luôn chạy `npm run build` để kiểm tra tĩnh toàn diện.
- **Phân định giữa Script Vận Hành (Operational Scripts) và Script Tạm Thời (One-off Generation Scripts)**:
  - *Lưu ý về mặt tư duy*: Các script sinh ảnh AI hoặc biến đổi ảnh cục bộ chỉ cần thiết tại thời điểm tạo ra asset. Khi asset đã xuất ra file PNG chuẩn trong `public/` và được commit vào kho mã nguồn, các script này trở thành tệp thừa và nên được dọn dẹp để giữ `package.json` và cấu trúc dự án tinh gọn.

### 2. Chuẩn bị nền tảng cho các phần tiếp theo
- Cây thư mục dự án hiện tại hoàn toàn sạch bóng các tệp rác, cấu trúc rõ ràng với chỉ các component, hook, lib và asset thực sự đang phục vụ cho trò chơi.
- Tốc độ build của Next.js Turbopack giảm từ 10.8s xuống còn 8.0s, tối ưu hóa tối đa thời gian phát triển và đóng gói ứng dụng.

---

## 📌 Phiên Hiện Tại: Đợt 25 — Nghiên Cứu Tái Thiết Kế Kịch Bản Master, Logic Hành Vi Chặt Chẽ & Chuẩn Hóa Bộ Prompt Mỹ Thuật FPV
- **Thời gian ghi nhận**: 09/09/2026
- **Mục tiêu phiên (Chế độ Nghiên cứu & Kịch bản - Không viết mã nguồn)**:
  1. **Nâng cấp cốt truyện & Thêm FPV Hòm thư mở đầu ($x = 80$)**: Tạo động cơ xuất phát rõ ràng bằng bưu kiện cuốn sách gửi về địa chỉ cô gái tại "Đỉnh đồi Hoa Anh Đào".
  2. **Logic Ghế đá & Mèo ($x = 450$)**:
     - Bắt buộc ngồi xuống trước (`[S]`) mới được vuốt ve mèo (`[E]`).
     - Sau biến cố xé thư, mèo chạy mất, không thể vuốt mèo nữa nhưng vẫn có thể ngồi xuống ghế đá trống (`[S]`) để suy tư.
  3. **Chốt chặn cốt truyện (Hard Story Gate)**: Phải vuốt ve mèo ở ghế đá thì mới mở khóa biến cố rách thư, nếu bỏ qua thì không spawn 3 mảnh thư và không thể tìm thấy cô gái.
  4. **Cột đèn đường nâng cao ($x = 1150$) & FPV Nhảy với Mảnh #1**: Nâng cao cột đèn, nhân vật tự dừng lại và bước vào FPV, tương tác phím `[Space]` nhảy vươn tay hái Mảnh #1 kẹt trên cành cây sát chao đèn.
  5. **Vớt Thuyền giấy Mảnh #2 ($x = 1500$)**: Loại bỏ hoàn toàn cơ chế đi ngang qua tự nhặt! Buộc người chơi bấm `[E]` kích hoạt FPV vớt thuyền origami xúc động và lời thoại hồi ức.
  6. **Rượt đuổi & Dỗ dành Mèo bìa rừng Mảnh #3 ($x = 1800$)**: FPV rượt đuổi qua rặng cây cổ thụ, dồn mèo dừng lại nép gốc sồi, quỳ gối dỗ dành và nhận lại Mảnh #3.
  7. **Tái thiết kế bàn ghép thư ($x = 2210$)**: Xóa bỏ giao diện vector/SVG phẳng "phèn", chuyển dịch 100% sang giao diện **Retro Pixel Art 16-bit Cozy Crafting Table** đồng điệu với thế giới game.
  8. **Biên soạn bộ Prompt tạo ảnh**: Thiết kế chi tiết các prompt tiếng Anh chất lượng cao theo đúng phong cách Storybook Cel & Pixel Art matching `message.png` để người dùng tự tạo ảnh.

---

## 🎓 Bài Học & Kinh Nghiệm Đúc Kết (Study Experience Extractor)

### 1. Tổng hợp các lỗi sai phổ biến và lưu ý về mặt tư duy
- **Bẫy Bất Đồng Nhất Phong Cách Giao Diện (UI Style Dissonance & Visual Clash)**:
  - *Lỗi sai phổ biến*: Trong một tựa game retro pixel art 2D hoài niệm, việc dựng các mini-game (như bàn ghép thư) bằng các thẻ HTML `rounded-lg`, border nét liền hiện đại và hình vẽ vector SVG giả lập sẽ tạo ra một cú sốc thị giác tiêu cực (người chơi cảm thấy giao diện bị "phèn", lệch tông, như một trang web văn phòng gắn vào game).
  - *Tư duy khắc phục*: Mọi màn hình mini-game, hộp thoại hay trạm chế tạo đều phải được xây dựng từ ngôn ngữ pixel art:
    1. Texture mặt bàn vẽ pixel art với bảng màu DB32 ấm áp (`#5c3a21`, `#7a4e2d`).
    2. Các mảnh ghép, đạo cụ (hoa, băng keo, kéo) phải là sprite pixel art có viền pixel rõ ràng.
    3. Con trỏ và tương tác sử dụng hiệu ứng pixel / chiptune SFX đồng bộ.
- **Tách Biệt Giữa Tiện Lợi Gameplay (QoL) Và Sức Nặng Tự Sự (Narrative Weight)**:
  - *Lỗi sai phổ biến*: Lạm dụng cơ chế "nhặt tự động khi đi ngang qua" (walk-over auto-pickup) cho các kỷ vật mang sức nặng tình cảm (như con thuyền giấy chở mảnh thư tình). Việc nhân vật vô tình chạy vụt qua và tự nhặt khiến khoảnh khắc mất đi sự trân trọng và lắng đọng.
  - *Tư duy khắc phục*: Với các vật phẩm ký ức cốt lõi:
    1. Buộc người chơi phải dừng bước, chủ động kích hoạt bằng một phím hành động có chủ đích (`[E]`).
    2. Chuyển sang góc nhìn thứ nhất (FPV) để người chơi trực tiếp chứng kiến hành động đôi bàn tay nâng niu, chạm vào kỷ vật.
    3. Dành không gian thời gian cho các dòng độc thoại nội tâm vang lên trọn vẹn.
- **Mối Quan Hệ Nhân Quả Trong Thiết Kế Nhiệm Vụ (Strict Cause-and-Effect Narrative Gating)**:
  - *Lỗi sai phổ biến*: Cho phép người chơi bỏ qua sự kiện bước ngoặt (Turning Point Event - ví dụ không vuốt mèo ở ghế đá mà cứ chạy thẳng đến cuối game) dẫn đến mâu thuẫn cốt truyện: bức thư chưa từng bị xé nhưng người chơi lại thấy các mảnh thư trôi dạt phía trước.
  - *Tư duy khắc phục*: Thiết lập các chốt chặn cứng (Hard Gates):
    - Hành động A (Ngồi xuống $\rightarrow$ Vuốt mèo $\rightarrow$ Thư bị xé $\rightarrow$ Mèo bỏ chạy) là điều kiện kích hoạt duy nhất để thế giới chuyển sang State `hasLostLetter = true`.
    - Khi chưa có State này: Các mảnh thư không spawn trên bản đồ, và người chơi bị chặn lại bởi bức tường vô hình kèm lời thoại nhắc nhở quay lại.

### 2. Chuẩn bị nền tảng cho phần tiếp theo
- Cuốn kịch bản gốc `knowledge/storyline-and-atmosphere.md` đã được đại tu toàn diện, chuẩn hóa từng cột mốc tọa độ, cơ chế tương tác, logic điều kiện và toàn bộ bảng lời thoại 38 phân cảnh.
- Bộ prompt tạo ảnh chuyên sâu chuẩn phong cách Storybook Cel & Pixel Art matching `message.png` sẽ là cơ sở tài nguyên để hoàn thiện toàn bộ các visual asset trước khi bắt tay vào khâu lập trình.

## 📌 Phiên Hiện Tại: Đợt 26 — Hiện Thực Hóa Trọn Vẹn 7 Nhiệm Vụ Kịch Bản, FPV Pixel Art & Cơ Chế Hard Gate
- **Thời gian ghi nhận**: 09/09/2026
- **Nội dung thực hiện**:
  1. **Tích hợp tài nguyên mỹ thuật chuẩn Pixel Art**:
     - 4 tác phẩm do người dùng tải lên: `fpv-mailbox-parcel.jpg`, `fpv-cat-storybook.png`, `cutscene-letter-rip.jpg`, `cutscene-cat-chase.jpg`.
     - 4 ảnh bối cảnh FPV & Bàn chế tạo phong cách pixel art: `fpv-lamp-reach.jpg`, `fpv-boat-retrieval.jpg`, `fpv-cat-recover.jpg`, `crafting-table-pixel-bg.jpg`.
     - 3 sprite pixel thế giới overworld: `mailbox.png` ($32 \times 48$), `lamp-post-tall-on.png` ($32 \times 112$), `lamp-post-tall-off.png` ($32 \times 112$).
  2. **Nhiệm vụ 1 (Hòm thư FPV $x = 80$)**: Tương tác mở hòm thư, nhặt bưu kiện cuốn sách kèm địa chỉ "Đỉnh đồi Hoa Anh Đào" tạo động cơ xuất phát.
  3. **Nhiệm vụ 2 (Logic Ghế đá & Mèo $x = 450$)**: Bắt buộc ngồi xuống trước (`[S]`) mới được vuốt ve mèo (`[E]`). Sau khi mèo xé thư và bỏ chạy, không thể vuốt mèo nữa nhưng vẫn có thể ngồi xuống ghế đá trống (`[S]`) để kích hoạt độc thoại suy ngẫm.
  4. **Nhiệm vụ 3 (Hard Story Gate)**: Bức tường vật lý vô hình tại $x = 520$ chặn đứng người chơi nếu chưa vuốt mèo / chưa làm rách thư, hiển thị độc thoại nhắc nhở quay lại.
  5. **Nhiệm vụ 4 (Cột đèn cao $x = 1150$ & FPV Nhảy hái Mảnh #1)**: Nâng cao cột đèn lên 112px ($y = 208$), kích hoạt FPV nhảy với lấy Mảnh #1 kẹt trên cành cây sát chao đèn (`[Space]`).
  6. **Nhiệm vụ 5 (Vớt thuyền giấy FPV $x = 1500$)**: Xóa bỏ hoàn toàn nhặt tự động, buộc người chơi nhấn `[E]` vớt thuyền origami chở Mảnh #2 và đọc kỷ niệm xưa.
  7. **Nhiệm vụ 6 (Dỗ mèo bìa rừng FPV $x = 1800$)**: FPV dỗ dành chú mèo bên gốc sồi già, vuốt ve để mèo nhả lại Mảnh #3.
  8. **Nhiệm vụ 7 (Tái thiết kế bàn ghép thư $x = 2210$)**: Thay thế hoàn toàn giao diện vector/SVG cũ bằng bàn gỗ retro pixel art 16-bit, khay gỗ khảm hoa đào, các mảnh ghép "I", "LIKE", "U" và băng dính Washi hoa đào.
  9. **Kiểm tra biên dịch**: `npm run build` thành công 100% không lỗi (Turbopack, Exit Code 0, 13.5s).

---

## 🎓 Bài Học & Kinh Nghiệm Đúc Kết (Study Experience Extractor)

### 1. Tổng hợp các lỗi sai phổ biến & Lưu ý về mặt tư duy
- **Đồng bộ giữa Trọng tâm Tự sự (Narrative) và Ràng buộc Vật lý (Physics Constraint)**:
  - *Lỗi sai phổ biến*: Chỉ dùng câu lệnh kiểm tra tọa độ trong `handlePositionUpdate` rồi hiển thị ThoughtBubble nhắc nhở, nhưng nhân vật vẫn tiếp tục di chuyển vượt qua trạm nếu người chơi giữ chặt phím sang phải.
  - *Tư duy khắc phục*: Đưa tham số ràng buộc biên độ cứng `gateBarrierX` trực tiếp vào vòng lặp vật lý của `Hero.tsx`. Khi `pos.x > gateBarrierX`, ép vị trí về `gateBarrierX` và gán vận tốc ngang `vel.vx = 0`. Điều này vừa tạo cảm giác bước chân ngập ngừng khựng lại trong thực tế, vừa ngăn chặn hoàn toàn việc bypass checkpoint logic.
- **Tách biệt Trạng thái Tương tác của Đạo cụ Đa trạng thái (Multi-state Props)**:
  - *Lỗi sai phổ biến*: Sử dụng chung một hàm callback `onClick` hoặc một phím bấm duy nhất cho nhiều trạng thái khác nhau của cùng một đạo cụ (ví dụ: ghế đá có mèo vs ghế đá trống sau khi mèo chạy mất).
  - *Tư duy khắc phục*: Phân nhánh rành mạch theo cờ trạng thái thế giới (`hasLostLetter`):
    - Khi `!hasLostLetter`: Nếu chưa ngồi (`!isSitting`) $\rightarrow$ nhắc nhở ngồi xuống trước (`handleSitReminder`); nếu đã ngồi (`isSitting`) $\rightarrow$ mở FPV vuốt ve mèo.
    - Khi `hasLostLetter`: Mèo đã chạy mất $\rightarrow$ chuyển sprite ghế sang `park-bench-empty.png`, vô hiệu hóa hành động vuốt mèo, nhưng giữ nguyên hành động ngồi (`[S]`) và kích hoạt mạch độc thoại nội tâm sâu lắng.

### 2. Chuẩn bị nền tảng cho phần tiếp theo
- Hệ thống FPV đa phân cảnh đã được module hóa hoàn chỉnh trong `first-person-view.tsx`, cho phép mở rộng thêm bất kỳ phân cảnh FPV nào khác trong tương lai chỉ bằng cách định nghĩa thêm một enum key và mảng lời thoại tương ứng.
- Toàn bộ cơ chế thu thập mảnh thư và bàn chế tạo thư đã có tính nhất quán mỹ thuật 16-bit pixel art tuyệt đối, tạo tiền đề vững chắc cho việc mở rộng thêm các mini-game hay cơ chế tương tác kết đôi ở màn chơi sau.

---

## 📌 Phiên Hiện Tại: Đợt 27 - 31 — Tinh Gọn HUD, Chuẩn Hóa Phím Tương Tác, Ghép Thư Tự Do & Hiện Thực Hóa Rừng Hoa Anh Đào Map 2
- **Thời gian ghi nhận**: 09/09/2026 - 10/09/2026
- **Nội dung thực hiện**:
  1. **Đồng bộ vị trí Hòm Thư Overworld**: Đặt hòm thư kề bên Hoa #1 tại $x = 220$ (trước đây đặt ở spawn $x = 80$ gây thừa thãi).
  2. **Chuẩn hóa chuỗi hành vi tại Ghế Đá & Mèo ($x = 450$)**:
     - Khi tiếp cận ghế, chỉ hiển thị phím gợi ý `[S]` để ngồi xuống, ẩn hoàn toàn nút `[E]`.
     - Nếu người chơi phớt lờ không ngồi mà cố bước tiếp, khi vượt qua cự ly cho phép ($x > 470$), nhân vật tự động khựng lại, quay đầu bước trở lại ghế đá kèm lời độc thoại tự nhủ phải dừng chân nghỉ ngơi.
     - Sau khi ngồi xuống (`isSitting = true`), nút `[E]` mới xuất hiện cho phép vuốt ve chú mèo.
  3. **Tối giản hóa giao diện người dùng (HUD Minimalism)**:
     - Gỡ bỏ toàn bộ các nút nổi choán màn hình (nút nhảy, nút tương tác to bản).
     - Chỉ giữ lại các phím gợi ý chìm phẳng đặt sát mặt đất, loại bỏ hiệu ứng hào quang hay icon thừa.
     - Thống nhất phím `[E]` là phím hành động duy nhất trong tất cả các phân cảnh FPV (loại bỏ click chuột và phím cách gây xung đột).
  4. **Nâng cấp độ trễ hiển thị thoại hoa (Thought Bubble Timing & Layout)**:
     - Chờ chữ chạy hết bằng typewriter, sau đó duy trì hiển thị thêm đúng 3 giây mới tự tắt hoặc chuyển sang câu kế tiếp.
     - Nâng cao vị trí hộp thoại lên phía trên màn hình để không che lấp hàng hoa hồng thu thập và nút bật/tắt nhạc.
     - Tự động ngắt chuyển động nhân vật trong lúc thoại hiển thị để người chơi theo dõi trọn vẹn mạch tự sự.
  5. **Trau chuốt góc nhìn FPV Dưới Mưa & Cột Đèn**:
     - *FPV Dưới Mưa*: Loại bỏ cán ô màu vàng ở giữa, chỉ giữ lại vòm tán ô đỏ chở che giọt mưa rơi.
     - *Cột đèn đường*: Thiết kế lại cơ cấu kéo dài tự nhiên của thân đèn, không chồng nhiều đèn lên nhau.
  6. **Bàn Ghép Thư Tự Do (Free-Form Crafting FPV)**:
     - Xóa bỏ các ô rập khuôn có sẵn. 3 mảnh giấy rách ("I", "LIKE", "U") được đặt lộn xộn ngẫu nhiên trên mặt bàn gỗ phong cách retro pixel art.
     - Người chơi tự do kéo-thả, sắp xếp các mảnh giấy theo ý muốn và dán cố định bằng các miếng băng dính washi hoa đào.
  7. **Đại Tu Toàn Diện Map 2 (Khu Vườn Hoa Anh Đào - `HILL_LEVEL`)**:
     - **Hạ độ cao đỉnh dốc**: Giảm độ cao mặt đất đỉnh đồi từ $y = 200$ (chiếm 1/2 màn hình) xuống $y = 265$ (~1/3 màn hình), mở rộng 2/3 không gian cho vòm trời mùa xuân và tán đại thụ.
     - **Triền dốc thoai thoải**: Đi từ $y = 320$ tại $x = 0$ lên $y = 265$ tại $x = 750$, mặt bằng đỉnh đồi phẳng từ $x = 750$ đến $x = 1000$.
     - **Bộ Sprite Cây Anh Đào Pixel 16-Bit Mới**: Tạo công cụ vẽ chuẩn điểm ảnh cho `cherry-tree-grand-pixel.png` ($192 \times 192\text{px}$) và `cherry-tree-small-pixel.png` ($120 \times 120\text{px}$).
     - **Rừng hoa đào bạt ngàn 14+ cây**:
       - 7 cây tầng xa (Background) với tỷ lệ $96\text{px} - 118\text{px}$, độ mờ $0.78 - 0.85$, lật nhánh xen kẽ `scaleX(-1)` tạo chiều sâu bát ngát.
       - 7 cây tầng gần (Foreground) $120\text{px} - 135\text{px}$ sắc nét 100% bám dọc đường leo dốc.
       - 1 cội anh đào đại thụ ($192\text{px}$) tại đỉnh đồi sau lưng cô gái tỏa hào quang phớt hồng.
       - Ghế gỗ nghỉ chân bên sườn đồi tại $x = 340, y = 263$.
     - **Bầu trời xuân & Mưa cánh hoa (`PetalRain`)**: Kích hoạt 50+ cánh hoa bay phấp phới khắp màn hình kết hợp bầu trời xuân gradient xanh da trời sang hồng phấn và nắng sớm ấm áp.
     - **Tiếp đất chuẩn xác**: Tọa độ mọi đạo cụ, nhân vật và cô gái ($x = 840, y = 201$) bám chuẩn theo hàm dốc $y(x)$.
  8. **Kiểm tra biên dịch sản phẩm**: `npm run build` thành công 100% với Next.js Turbopack không lỗi (Exit Code 0).

---

## 🎓 Bài Học & Kinh Nghiệm Đúc Kết (Study Experience Extractor)

### 1. Các lỗi sai phổ biến & Cách phòng tránh
- **Lỗi lặp hình (Repetitive Asset Fatigue) khi tăng số lượng cây cối**:
  - *Hiện tượng*: Khi đặt nhiều cây cùng một loại mẫu vẽ lên một màn hình, nếu giữ nguyên kích thước và hướng nhánh cây thì cảnh quan sẽ trông vô cùng đơn điệu, cứng nhắc như "sao chép dán hàng loạt".
  - *Kinh nghiệm*: Sử dụng kỹ thuật **Micro-transforms** — kết hợp biến thiên tỉ lệ ngẫu nhiên có kiểm soát ($96\text{px} \to 135\text{px}$) cùng việc lật nhánh đối xứng (`transform: scaleX(-1)`) cho các cây xen kẽ. Chỉ với 1 sprite gốc, ta có thể tạo ra cảm giác như một khu rừng tự nhiên với hàng chục cây có thế dáng độc đáo.
- **Trùng mặt phẳng chiều sâu (Z-fighting & Flat Layering)**:
  - *Hiện tượng*: Tất cả các cây nếu đều có độ sắc nét và kích thước bằng nhau sẽ khiến màn hình bị rối mắt, mất đi điểm nhấn vào nhân vật chính và cô gái.
  - *Kinh nghiệm*: Chia cây thành ít nhất 2 lớp:
    - *Lớp hậu cảnh (Background Props)*: Kích thước nhỏ hơn ($80\% - 90\%$), độ mờ $0.8$, mờ biên nhẹ $0.3\text{px}$, z-index thấp hơn nhân vật.
    - *Lớp tiền cảnh (Foreground Props)*: Kích thước thật 100%, độ tương phản cao, đón ánh nắng trực tiếp.

### 2. Lưu ý về mặt tư duy thiết kế
- **Sự chuyển biến cảm xúc qua ánh sáng và màu sắc (Color Scripting)**:
  - Map 1 trải qua mưa lạnh và đêm tối tượng trưng cho sự trắc trở, gian nan khi tìm lại những mảnh thư bị gió cuốn.
  - Map 2 bừng sáng với bầu trời xanh trong, nắng sớm ấm áp, mưa cánh hoa đào bay phấp phới và cả một khu rừng hoa anh đào nở rộ ngút ngàn là phần thưởng thị giác xứng đáng, tạo sự tương phản mạnh mẽ (Catharsis) và nâng tầm cảm xúc hạnh phúc khi nhân vật gặp lại người thương.

### 3. Mẹo tính toán & Kỹ thuật lập trình
- **Tọa độ tiếp đất của thực thể trên mặt dốc đa biến**:
  - Với nhân vật hoặc cây cối có chiều cao $H$ đứng tại hoành độ $x$, tung độ đặt ảnh luôn phải tính dựa theo hàm nội suy độ cao mặt dốc:
    $$y(x) = \begin{cases} 320 - \frac{x}{750} \times 55 & \text{khi } x \le 750 \\ 265 & \text{khi } x > 750 \end{cases}$$
### 4. Nâng Cấp Nghệ Thuật Pixel & Tách Mảnh Thư Nguyên Tác (Session Update)
- **Tách 3 mảnh thư từ `message.png` gốc**:
  - *Kỹ thuật*: Sử dụng thuật toán giải mã PNG scanline defilter (hỗ trợ các bộ lọc sub, up, average, paeth của chuẩn PNG) để trích xuất trực tiếp dữ liệu thô từ ảnh bức thư gốc "I LIKE U", chia làm 3 mảnh ghép rách có đường xé tự nhiên và loại bỏ phần ngón tay cầm thư.
  - *Snapping & Crafting*: Cập nhật tỉ lệ và tọa độ tự động hút `OVERLAP = 6px`, dán keo từng vết rách bằng thao tác kéo thả hoặc nhấn nhanh.
- **Nâng cấp chiếc xích đu gỗ pixel**:
  - Thay thế toàn bộ thẻ vector SVG bằng sprite pixel art 16-bit nguyên bản `wooden-swing-frame.png` với hai móc sắt, dầm ngang và khớp nối vững chãi.
  - Tích hợp bộ dây thừng, ván gỗ và nhân vật ngồi đu đưa đồng bộ theo con lắc vật lý `swingAngle`.
- **Cải tiến cảnh mưa FPV & dù pixel**:
  - Tạo vòm dù đỏ `fpv-umbrella-canopy-pixel.png` với múi vải phong phú, loại bỏ hoàn toàn chuyển động nhấp nhô `title-float`.
- **Nâng cấp tranh minh họa 16:9 FPV**:
  - Bổ sung `fpv-bridge-starry.jpg` (cảnh ngắm sao trên cầu ban đêm) và `fpv-cherry-garden-entrance.jpg` (cảnh bước vào vườn hoa đào), đạt tính nhất quán hoàn hảo với phong cách tranh lấy thư từ thuyền giấy và hòm thư.








