# 🎨 Đồ Họa & Tài Nguyên Nghệ Thuật (Visual Art & Assets)

## 1. Triết Lý Mỹ Thuật & Bảng Màu DawnBringer DB32
Dự án kết hợp giữa DNA Pixel Art cổ điển (DawnBringer DB32) và phong cách tranh vẽ sáp màu doodle ấm áp matching ảnh gốc `message.png`:

- **Ngoại cảnh & Bầu trời**:
  - Hoàng hôn (Sunset): `#fdba74`, `#fb923c`, `#f43f5e`, `#334155`.
  - Mưa ngâu (Rain Twilight): `#1e293b`, `#0f172a`, `#020617`, ánh sáng phản chiếu vũng nước `#38bdf8`.
  - Đêm đầy sao (Starry Night): `#090d16`, `#171b30`, `#101426`, ánh trăng `#fef08a`.
  - Bình minh đồi hoa (Dawn): `#38bdf8`, `#bae6fd`, `#fed7aa`, `#fecdd3`, `#fda4af`.
- **Màu lông Mèo tam thể**:
  - Lớp lông trắng kem: `#fffcf5`, `#f5ebdc`, bóng lông `#dccdcb`.
  - Đốm cam gừng: `#df7126`, viền bóng `#af4e14`, highlight `#f09146`.
  - Đốm đen than chì: `#282432`, đệm chân và mũi hồng `#f472b6`, má hồng `#fbcfe8`.
- **Màu da & Trang phục nhân vật**:
  - Da tự nhiên: `#d9a066`, bóng da `#b47850`, nâu sâu `#8f563b`, sáng da `#eec39a`, highlight ánh đèn vàng `#fee6b4`.
  - Áo khoác dạ mùa đông: Xanh navy `#3b466b`, bóng áo `#262b44`, sáng áo `#5c6994`, cổ tay áo len xám `#303448`.
- **Hoa hồng**: Đỏ nhung sâu `#5f0f1e`, đỏ sẫm `#961e2d`, đỏ thắm `#d73241`, đỏ tươi `#f55a69`, lấp lánh sương mai `#ffa0af`.

---

## 2. Hệ Thống Tài Nguyên FPV (First-Person View) - Chuẩn Phong Cách `message.png`

> **Quy chuẩn mỹ thuật cốt lõi**: *"Không quá pixel cũng không quá chân thực"* (Storybook Retro Doodle / Cel-Shaded).
> - **Đường nét (Line Art)**: Nét viền mực đen/nâu sẫm 2-3px rõ ràng, hơi nguệch ngoạc mộc mạc như nét vẽ truyện tranh/sổ tay tình yêu.
> - **Màu sắc (Coloring)**: Mảng màu phẳng (flat cel shading), tông ấm áp (kem `#fff8eb`, da `#f0c2a2`, cam kraft `#c99b66`, đỏ nhung `#e11d48`). Không tô bóng 3D rườm rà, không chi tiết hóa da/lông/gân lá chân thực.
> - **Độ trong suốt (Alpha Channel)**: Nền hoàn toàn trong suốt (Transparent PNG), viền sạch không dính hộp trắng hay viền xơ rách.

### 2.1. Phân Cảnh Vuốt Ve Mèo Ghế Đá (`public/assets/others/fpv-cat-storybook.png`)
- **Tập tin**: `public/assets/others/fpv-cat-storybook.png` (thay thế `fpv-cat-doodle.png`).
- **Phong cách**: Retro storybook doodle matching 100% `message.png`.
- **Bố cục**: 
  - Chú mèo tam thể nằm ngoan trên nan ghế gỗ công viên.
  - Phía bên cạnh là phong bì thư tình giấy kraft thắt nơ đỏ xinh xắn.
  - Hai bàn tay nhân vật đưa ra từ góc dưới nâng niu, vuốt ve lưng và đầu mèo.
- **Hoạt ảnh tích hợp**:
  - Nhịp thở phập phồng tuần hoàn (`sin(t)` $\pm 1.5\%$).
  - Các hạt tim hồng `♥` sinh động bay lên khi click hoặc bấm `Space`.
  - Hiệu ứng rung gừ gừ (purr vibration) và hộp thoại độc thoại nội tâm theo ngữ cảnh ghế đá.

### 2.2. Hai Bàn Tay Chụm Cầm Hoa Dưới Đèn Đường (`public/assets/others/fpv-lamp-hands-storybook.png`)
- **Tập tin**: `public/assets/others/fpv-lamp-hands-storybook.png` (thay thế `fpv-lamp-hands.png`).
- **Phong cách**: Retro storybook doodle matching 100% `message.png`.
- **Chi tiết**:
  - Cổ tay áo khoác dạ xanh navy đơn giản, viền cổ tay len ấm áp.
  - Hai bàn tay nét viền mực đậm, màu da phẳng sáng khum chụm che chở đóa hoa hồng đỏ rực rỡ dưới ánh đèn đường.
  - Nền trong suốt tự nhiên, loại bỏ hoàn toàn viền khung hộp trắng cứng nhắc, hòa hợp mượt mà vào luồng sáng hình nón của cột đèn.
- **Tương tác**:
  - Nhấn `Space` hoặc click chuột để hà hơi sưởi ấm, tỏa ra các cụm hơi sương ấm áp `~*~*~` và tăng chỉ số độ ấm `warmth`.
  - Nhấn phím Mũi tên phải `ArrowRight` để hoàn thành / tiếp tục hành trình.

### 2.3. Hai Bàn Tay Cầm Quà / Bó Hoa 7 Bông (`public/assets/others/fpv-bouquet-hands.png`)
- **Kích thước file**: $140 \times 100$ px (hiển thị ở $280 \times 200$ px).
- **Chi tiết**:
  - Ống tay áo khoác dạ xanh navy đi chéo tự nhiên từ hai góc dưới đáy màn hình.
  - Ngón cái vắt qua mặt trước giữ chặt lớp giấy gói kraft nơ đỏ.
  - 4 ngón tay ôm trọn lấy hông bó hoa với các đốt ngón tay hồng hào rõ rệt.
  - Bó hoa gồm 7 bông hồng nhung nở rực rỡ, lá xanh tươi và thắt nơ ruy băng đỏ tinh tế.

---

## 3. Hệ Thống Sprite Nhân Vật Cầm Ô Tích Hợp Toàn Thân (Full-Body Umbrella Sprites)

Nhằm xóa bỏ hoàn toàn hiện tượng chiếc ô bị trôi lơ lửng trên đầu nhân vật, dự án sử dụng bộ 6 sprite tích hợp vẽ cán ô nằm chắc trong tay nhân vật tại `public/assets/character/`:

| Tên tệp | Kích thước | Tư thế nhân vật | Căn chỉnh tọa độ |
| :--- | :---: | :--- | :--- |
| `hero-umbrella-idle.png` | $64 \times 84\text{ px}$ | Đứng yên hướng nhìn sang phải | `top: pos.y - 36px` |
| `hero-umbrella-left-idle.png` | $64 \times 84\text{ px}$ | Đứng yên hướng nhìn sang trái | `top: pos.y - 36px` |
| `hero-umbrella-right-lf.png` | $64 \times 84\text{ px}$ | Bước chân trái hướng sang phải | `top: pos.y - 36px` |
| `hero-umbrella-right-rf.png` | $64 \times 84\text{ px}$ | Bước chân phải hướng sang phải | `top: pos.y - 36px` |
| `hero-umbrella-left-lf.png` | $64 \times 84\text{ px}$ | Bước chân trái hướng sang trái | `top: pos.y - 36px` |
| `hero-umbrella-left-rf.png` | $64 \times 84\text{ px}$ | Bước chân phải hướng sang trái | `top: pos.y - 36px` |

> **Quy chuẩn tọa độ**: Chiều cao sprite $84\text{ px}$ (lớn hơn sprite gốc $48\text{ px}$ do có thêm tán ô phía trên $36\text{ px}$). Khi render trong `src/components/hero.tsx`, vị trí Y được tính `pos.y - 36` để bảo toàn mặt sàn chân nhân vật tại $y_{\text{ground}} = 320$.

---

## 4. Hệ Thống Đạo Cụ Tiếp Đất Vững Chãi (Grounded Props)

Mọi đạo cụ đứng trên mặt đất đều tuân thủ nguyên tắc:
$$\text{top} = 320 - \text{height}$$

### 4.1. Ghế Đá Công Viên Kèm Mèo Ngủ (`public/assets/others/park-bench.png`)
- **Kích thước**: $80 \times 36\text{ px}$.
- **Vị trí**: $x = 450, y = 284$ ($284 + 36 = 320\text{px}$ chạm sàn).
- **Chi tiết**: Chân ghế sắt uốn cổ điển màu than chì, nan gỗ nâu ấm. Nửa bên phải có chú mèo tam thể cuộn tròn ngủ say sưa.
- **Tương tác**: Nhân vật bấm `[S]` để ngồi xuống nửa bên trái ghế ($x = 426, y = 274$).

### 4.2. Xích Đu Gỗ Khung Chữ A (`public/assets/others/wooden-swing-frame.png`)
- **Kích thước**: $72 \times 80\text{ px}$.
- **Vị trí**: $x = 680, y = 240$ ($240 + 80 = 320\text{px}$ chạm sàn).
- **Chi tiết**: Khung gỗ chữ A cắm chắc chắn xuống đất với thanh xà ngang phía trên, hai móc sắt treo hai sợi dây thừng bện và tấm ván gỗ đung đưa. Đồ họa pixel art 16-bit nguyên bản, chuẩn bảng màu DB32.
- **Sprite nhân vật ngồi xích đu**: `public/assets/character/hero-sit-swing.png` ($48 \times 48\text{ px}$), xoay theo góc con lắc `swingAngle` ($\pm 14^\circ$) đồng bộ với toàn bộ cụm dây và ghế ngồi.

---

## 5. Hệ Thống Hạt Nước Mưa Chân Thực (`FpvRainEffect`)
Được triển khai trong [src/components/fpv-rain-effect.tsx](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/src/components/fpv-rain-effect.tsx):

1. **Hạt mưa độc lập (Không dùng dòng kẻ sọc)**:
   - 40 giọt nước tiền cảnh hình giọt lệ phát sáng (`#ffffff` ở đầu giọt, `#bae6fd` ở thân), rơi nghiêng 6 độ tự nhiên.
   - 45 giọt nước hậu cảnh mờ ảo tạo chiều sâu khí quyển.
2. **Nước nhỏ giọt từ tán ô đỏ**:
   - 9 điểm nhỏ giọt dọc theo đường cong viền ô.
   - Giọt nước đọng lại, phồng to rồi rơi từng giọt tí tách (`canopy-drip`).
3. **Mặt vũng nước & bọt nước bắn tung tóe**:
   - Vòng tròn sóng nước lan tỏa (`puddle-ripple`) khi giọt nước chạm mặt đường.
   - Bọt nước li ti bắn nảy lên (`rain-splash`).

---

## 6. Hiệu Ứng Hào Quang Mảnh Thư #3 (Visual Beacon)
- **Tệp**: [src/components/letter-fragment.tsx](file:///c:/Users/Tran%20Gia%20Thieu/.gemini/antigravity-ide/scratch/met-web/src/components/letter-fragment.tsx)
- **Hào quang tỏa sáng**: Sử dụng lớp filter `drop-shadow(0 0 10px rgba(251, 191, 36, 0.9))` kết hợp pulse scaling nhẹ nhàng.
- **Bảng tên nổi**: Thẻ badge màu vàng kim hổ phách `✨ Mảnh Thư #3 [E]` nổi bật phía trên giúp người chơi dễ dàng nhận diện từ xa giữa cảnh đêm tối bìa rừng.

---

## 7. Mỹ Thuật Cuốn Sách Kỷ Niệm Cổ Điển & Quy Chuẩn Không Emoji (Vintage Vector Art)

### 7.1. Triết lý thiết kế: Tinh xảo - Cổ kính - Không Icon / Emoji nhân tạo
- **Vấn đề đã giải quyết**: Việc sử dụng các emoji unicode hệ thống (như `🌸`, `✦`, `📖`, `🕊️`, đặc biệt là biểu tượng ngôi sao 4 cánh Gemini `✦`) khiến UI trông giống ứng dụng chat hiện đại, phá vỡ bầu không khí cổ tích hoài niệm retro của game.
- **Quy tắc nghiêm ngặt**:
  1. Tuyệt đối không dùng Unicode emoji trong giao diện game, các đoạn cutscene và cuốn sách kỷ niệm.
  2. Toàn bộ hoa văn trang trí sử dụng đồ họa **Vector SVG** được thiết kế thủ công, đồng bộ hoàn hảo với bảng màu DB32 và phong cách sách da cổ điển.

### 7.2. Bộ họa tiết Vector SVG độc quyền
| Họa tiết | Tọa độ / Vị trí | Mô tả mỹ thuật |
| :--- | :--- | :--- |
| **`BrassCorner`** | 4 góc bìa ngoài (Trang 0 & 7) | Miếng bọc góc đồng thau đúc chạm khắc hoa văn Baroque/Victorian màu vàng kim (`#d4af37`), đinh tán tròn nổi khối và bóng đổ chìm (`#453208`). |
| **`CherryBranchCorner`** | 4 góc các trang giấy ngà (Trang 1 - 6) | Cành hoa anh đào uốn lượn mềm mại (`stroke="#9c734b"`), 5 cánh hoa đào hồng phớt nở rộ (`fill="#fda4af"`) kèm chồi lá non xanh dịu (`#86efac`). |
| **`CherryCrest`** | Đỉnh đầu trang giấy | Huy hiệu hoa anh đào 5 cánh nở rộ ở chính giữa, tỏa ra 2 nhánh chỉ vàng đối xứng và các hạt nhụy hoa vàng kim lấp lánh. |
| **`SmallFlowerDivider`** | Giữa các đoạn văn | Dấu phân cách hoa đào nhỏ với 2 đường chỉ vàng thuôn nhọn về hai phía, tạo nhịp nghỉ thanh thoát cho người đọc. |
| **`QuoteBox`** | Khung trích dẫn trang trái | Khung viền chỉ đôi cách điệu bo góc tròn, 4 góc đính 4 hạt kim cương hình học `◇` sang trọng thay cho ngoặc kép hay icon thông thường. |

### 7.3. Bảng màu chất liệu sách (Book Material Palette)
- **Vỏ bìa da mận thẫm (`Burgundy Leather`)**:
  - Gradient nền: `linear-gradient(145deg, #3d0c15 0%, #29060c 50%, #1a0307 100%)`.
  - Mép gập da may chỉ đôi: viền vàng mờ `rgba(212, 175, 55, 0.45)`.
- **Giấy ngà cổ ngả vàng (`Aged Ivory Paper`)**:
  - Nền trang ruột: `linear-gradient(135deg, #fcf9f2 0%, #f6f0df 50%, #eee4cd 100%)`.
  - Hiệu ứng ố thời gian (vignette): `box-shadow: inset 0 0 25px rgba(120, 80, 40, 0.12)`.
  - Mép giấy xếp lớp dày dặn (deckled edge / page edge layers).
- **Ruy băng nhung đỏ đánh dấu trang (`Velvet Bookmark Ribbon`)**:
  - Đỏ thẫm nhung `#b91c1c` kết hợp bóng đổ mềm `drop-shadow`. Đuôi ruy băng cắt chữ V (`clip-path: polygon(...)`).
  - Tự động ẩn khi sách đóng (ở Bìa trước hoặc Bìa sau) qua điều kiện `!isOuterCover`.

