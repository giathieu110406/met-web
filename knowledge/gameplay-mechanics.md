# 🎮 Cơ Chế Trò Chơi (Gameplay & Mechanics)

## 1. Hệ Thống Điều Khiển & Giao Diện Tối Giản (Minimal UI & Controls)
- **Di chuyển trái/phải**: Phím mũi tên `ArrowLeft` / `ArrowRight` hoặc `A` / `D`.
- **Nhảy**: Phím `Space` hoặc `ArrowUp` / `W` (nhảy nhẹ nhàng êm ái, lực nhảy $-8.5$, hỗ trợ nhảy lên mỏm đá rêu hái hoa #6).
- **Ngồi nghỉ trên ghế đá**: Phím `S` hoặc `ArrowDown` khi đứng gần ghế đá ($x \in [420, 480]$). Nhân vật ngồi nghỉ cạnh chú mèo tam thể. Nhấn phím di chuyển bất kỳ để đứng dậy.
- **Lên / Xuống Xích Đu Chữ A**:
  - Nhấn `[E]` trong phạm vi $x \in [630, 730]$ để ngồi lên xích đu gỗ.
  - Xích đu dao động con lắc điều hòa tuần hoàn `swingAngle`.
  - Nhấn `[Space]` hoặc `[E]` để nhảy xuống an toàn.
- **Hộp Thoại Chỉ Dẫn Dưới Đáy Khung Hình (Unified Bottom Instruction Dialog)**:
  - Toàn bộ hướng dẫn tương tác được gom tập trung vào **1 thanh hộp thoại điện ảnh thanh lịch đặt cố định ở đáy màn hình** (`bottom: 14px`, căn giữa).
  - Hộp thoại chỉ xuất hiện mềm mại khi nhân vật đứng trong tầm tương tác của một đối tượng cụ thể:
    - Cạnh Ghế & Mèo: `[E] Vuốt ve chú mèo 🐾  •  [S / ↓] Ngồi nghỉ 🪑`
    - Cạnh Xích Đu Chữ A: `[E] Lên xích đu gỗ 🌿`
    - Đang Đu Xích Đu: `Đang đung đưa...  •  [Space / E] Bước xuống`
    - Đang Ngồi Nghỉ: `Đang ngồi nghỉ...  •  [S / ↓] Đứng dậy`
    - Cạnh Mảnh Thư #1: `[E] Nhặt mảnh thư trên cây`
    - Cạnh Mảnh Thư #2: `[E] Vớt con thuyền giấy ⛵`
    - Cạnh Mảnh Thư #3: `[E] Nhặt mảnh thư ký ức ✨`
    - Cạnh Bàn Đá Hoa Đào ($x=2210$): `[E] Hàn gắn bức thư ký ức 🌸`
    - Các Địa Danh FPV (Mưa, Đèn, Cầu): `[E] Lắng nghe tiếng mưa / Đứng dưới ánh đèn / Ngắm trăng & đom đóm`
  - Khi người chơi bước ra ngoài vùng tương tác, hộp thoại tự động biến mất.
- **Bật / Tắt âm nhạc**: Nút tròn tối giản `🎵 / 🔇` thu gọn ở góc trên phải Canvas.
- **Bảng Debug Admin**: Phím `~` hoặc `F2` (dịch chuyển tức thời, xem hitbox, chỉnh số lượng hoa/thư).

---

## 2. Quy Tắc Ngắt Đà Di Chuyển Khi Nhặt Hoa & Chuyển Cảnh
- **Vấn đề cần giải quyết**: Khi nhặt hoa hoặc khi kết thúc FPV, người chơi vô thức giữ phím di chuyển khiến nhân vật phóng đi quá trớn.
- **Quy chuẩn triển khai**:
  - Khi nhặt hoa (`onCollectItem`) hoặc nhặt mảnh thư: Gọi ngay `resetKeys()` và gán vận tốc ngang `velRef.current.vx = 0`.
  - Khi `lockMovement` thay đổi (vào hoặc ra khỏi FPV, ngồi nghỉ, đu xích đu, cutscene): Gọi ngay `resetKeys()` và gán `velRef.current.vx = 0`.
  - **Trải nghiệm thực tế**: Nhân vật dừng ngay tại chỗ. Người chơi **bắt buộc phải nhấc ngón tay khỏi phím di chuyển và bấm lại** thì nhân vật mới bước tiếp.

---

## 3. 7 Cơ Chế Thu Thập Hoa Độc Đáo (Playful Rose Gathering)

Bản đồ có tổng chiều dài $2400\text{ px}$. 7 bông hoa sở hữu 7 cơ chế tương tác riêng biệt:

| ID | Tọa độ X, Y | Loại cơ chế | Chi tiết tương tác & Phản hồi |
| :---: | :---: | :---: | :--- |
| **1** | `x = 220, y = 290` | **Hé Nở (Bloom Proximity)** | Xuất hiện ban đầu dưới dạng nụ hoa nhỏ. Khi nhân vật bước tới gần ($< 65\text{px}$), hoa phóng nở 4 cánh rực rỡ kèm tiếng chuông hạc ngân vang `SFX.flowerBloom()`. |
| **2** | `x = 450, y = 290` | **Mèo Trao Tặng (Cat Petting)** | Sau khi hoàn thành tương tác vuốt ve mèo theo nhịp thở trong FPV, mèo ngủ say và trao tặng đóa hoa #2. |
| **3** | `x = 850, y = 280` | **Đón Cánh Hoa Bay (Falling Petal)** | Trong làn mưa ngâu, đóa hoa chao đảo bay lơ lửng theo làn gió mưa, người chơi bước tới đón lấy. |
| **4** | `x = 1150, y = 290` | **Thắp Sáng Đèn (Lamp Lit)** | Đóa hoa ẩn trong bóng tối dưới cột đèn. Khi đèn đường bật sáng vàng rực, đóa hoa bừng sáng với hào quang ấm áp. |
| **5** | `x = 1500, y = 290` | **Đom Đóm Tụ (Firefly Swarm)** | Đóa hoa trên cầu gỗ đêm sao được bao bọc bởi đàn đom đóm 3 con bay lượn phát sáng. |
| **6** | `x = 1750, y = 245` | **Nhảy Hái Trên Đá (High Hop)** | Hoa đặt trên mỏm đá rêu phong nhô cao ($y = 245$). Người chơi thực hiện cú nhảy nhẹ nhàng (`Space`) để với hái. |
| **7** | `x = 2100, y = 290` | **Bình Minh Rực Rỡ (Dawn Crown)** | Đóa hoa thứ 7 phát quang hồng đào, kích hoạt 7 đóa hoa kết thành bó hoa hoàn chỉnh ôm trên tay nhân vật. |

---

## 4. Hệ Thống 3 Thử Thách Mảnh Thư Ký Ức (Letter Fragments System)

Tại $x = 1050$, một cơn lốc xoáy thổi rách bức thiệp viết tay thành 3 mảnh thất lạc dọc đường:

1. **Mảnh #1 (Cành Cây Đèn Đường, $x = 1150, y = 185$)**:
   - Mảnh thư giấy kraft mắc trên cành cây cao cạnh cột đèn. Người chơi nhảy lên cành cây đón lấy.
2. **Mảnh #2 (Thuyền Giấy Dập Dềnh Dưới Suối, $x = 1500, y = 305$)**:
   - Mảnh thư trôi dạt dưới gầm cầu gỗ đêm sao dưới hình dạng chiếc thuyền giấy nhỏ dập dềnh theo sóng nước. Người chơi đứng trên mép cầu nhấn `[E]` để vớt lên.
3. **Mảnh #3 (Mảnh Ký Ức Bìa Rừng, $x = 1800, y = 295$)**:
   - Mảnh thư có vết cào tinh nghịch của mèo, phát hào quang vàng lấp lánh và bảng tên `✨ Mảnh Thư #3 [E]`.
   - **Tương tác trực tiếp không ma sát**: Người chơi nhấn `[E]` trong phạm vi $x \in [1740, 1860]$ để nhặt ngay, hoặc tự động thu hoạch khi bước chân đi qua tọa độ $x \approx 1800$.

---

## 5. Tương Tác Vi Mô Trong Góc Nhìn Thứ Nhất (FPV Micro-Interactions)
- **Chuẩn hóa nút điều khiển FPV**: Phím `[E]` là phím tương tác duy nhất xuyên suốt tất cả các phân cảnh FPV (thay thế cho click chuột hay spacebar).

1. **Hòm Thư Bưu Kiện (`scene = "mailbox"`, $x = 220$)**:
   - Nhấn `[E]` mở hòm thư bưu điện cổ kính, nhận cuốn sách bưu kiện kèm dòng địa chỉ "Đỉnh đồi Hoa Anh Đào" dẫn dắt hành trình.
2. **Cảnh Mèo Ghế Đá (`scene = "cat"`, $x = 450$)**:
   - Bắt buộc ngồi xuống ghế đá trước (`[S]`).
   - Nhấn `[E]` vuốt ve chú mèo tam thể: Mèo vươn vai cào rách bức thư và chạy mất, kích hoạt mạch cốt truyện tìm kiếm 3 mảnh thư.
3. **Cảnh Mưa (`scene = "rain"`)**:
   - Tán ô đỏ che chắn những giọt mưa xuân tí tách, loại bỏ cán vàng ở giữa cho tầm nhìn thoáng đãng.
4. **Cảnh Đèn Đường (`scene = "lamp"`, $x = 1150$)**:
   - Thân đèn kéo dài tự nhiên, chao đèn ấm áp thắp sáng đóa hoa hồng và chiếu rọi Mảnh thư #1 trên cành cây.
5. **Cảnh Cầu Gỗ & Thuyền Giấy (`scene = "bridge"`, $x = 1500$)**:
   - Nhấn `[E]` vớt chiếc thuyền origami chở Mảnh thư #2 trôi dưới chân cầu đêm sao.
6. **Cảnh Dỗ Mèo Bìa Rừng (`scene = "cat_recover"`, $x = 1800$)**:
   - Nhấn `[E]` dỗ dành chú mèo bên gốc sồi già để nhận lại Mảnh thư #3.
7. **Cảnh Bàn Dán Thư Tự Do (`FpvLetterCrafting`, $x = 2210$)**:
   - 3 mảnh giấy rách ("I", "LIKE", "U") đặt ngẫu nhiên tự do trên mặt bàn gỗ retro pixel art.
   - Người chơi tự do kéo-thả ghép các mép rách rồi dán cố định bằng băng keo washi hoa đào.

---

## 6. Màn Chơi 2: Khu Vườn Hoa Anh Đào (Map 2 - `HILL_LEVEL`)
- **Chuyển màn**: Kích hoạt sau khi hoàn thành dán thư tại $x = 2210$ và bước qua cổng hoa.
- **Địa hình triền dốc biến thiên**:
  - Dốc thoải từ chân dốc $x = 0, y = 320$ lên đỉnh đồi $x = 750, y = 265$.
  - Mặt bằng đỉnh đồi phẳng từ $x = 750$ đến $x = 1000$ ở cao độ $y = 265$ (~1/3 màn hình).
- **Rừng hoa đào đa tầng 14+ cây**:
  - 7 cây tầng xa (Background) nhỏ gọn mờ nhẹ, lật nhánh xen kẽ `scaleX(-1)`.
  - 7 cây tầng gần (Foreground) sắc nét 100% đón nắng mai rực rỡ.
  - Cội Đại Thụ Anh Đào $192\text{px}$ tại đỉnh đồi ($x = 730, y = 73$) tỏa hào quang bảo bọc khoảnh khắc hội ngộ.
  - Chiếc ghế gỗ dừng chân sườn đồi ($x = 340, y = 263$).
- **Mưa cánh hoa bay (`PetalRain`)**: 50+ cánh hoa đào bay phấp phới ngập tràn không gian.
- **Đại Kết Cục (Ending)**:
  - Chàng trai bước đến bên cô gái ($x = 840, y = 201$).
  - Bức thư tình "I LIKE U" hoàn chỉnh từ từ trượt lên màn hình trong tiếng chuông ngân vang và mưa cánh hoa đào.

