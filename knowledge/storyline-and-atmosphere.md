# 📖 Kịch Bản Cốt Truyện, Âm Thanh & Bối Cảnh Nghệ Thuật
*(Master Storyline, Atmosphere, Audio & Cinematics Bible)*

> **Quy ước đồng bộ bắt buộc**: Mọi thay đổi về cốt truyện, lời thoại nhân vật, hiệu ứng âm thanh, ánh sáng bầu trời, góc nhìn camera hay các phân cảnh điện ảnh trong mã nguồn **BẮT BUỘC** phải được cập nhật đồng thời vào tệp tài liệu này.

---

## 🌹 1. Tổng Quan Tác Phẩm & Chủ Đề Cảm Xúc (Overview & Theme)

- **Tên tác phẩm**: *Met — A Tiny Love Story* (Phiên bản Web / Retro Pixel Art DB32)
- **Thông điệp chủ đạo**: *"Hành trình gom góp từng cánh hoa dũng khí qua giông bão để trao tặng người mình thương."*
- **Trục chuyển biến không - thời gian cảm xúc (Emotional Arc)**:
  1. **Khởi hành (Sunset)**: Hoàng hôn vàng cam ấm áp, rụt rè và bỡ ngỡ.
  2. **Thử thách (Twilight Rain)**: Mưa rào chạng vạng buốt lạnh, gợi lại những kỷ niệm ngọt ngào xen lẫn xót xa.
  3. **Tĩnh lặng & Niềm tin (Deep Night & Moonlit Bridge)**: Đêm sâu huyền ảo dưới ánh trăng và đom đóm, kiên định với tình cảm trong lòng.
  4. **Tái ngộ & Tỏ tình (Dawn Summit)**: Bình minh rực rỡ trên đỉnh đồi hoa anh đào, trao gửi đóa hoa và tấm thiệp *"I LOVE U"*.

---

## 🎬 2. Màn Mở Đầu (Title Screen & Intro Text)

### 2.1. Màn Hình Tiêu Đề (Title Screen)
- **Góc nhìn**: Khung hình cố định $600 \times 400\text{ px}$.
- **Ánh sáng & Bầu không khí**: Nền trời đêm tĩnh mịch chuyển từ xanh chàm `#0f172a` sang `#1e293b`.
- **Thị giác**: 
  - Logo chính: Chữ `MET` lớn màu đỏ hồng `#fb7185` phát sáng dịu với hiệu ứng nhấp nhô lơ lửng `title-float`.
  - Phụ đề: `a tiny love story` màu xám lam `#94a3b8`.
  - Lời mời: `[ nhấn phím bất kỳ hoặc click để bắt đầu ]` nhấp nháy nhịp 1.2s.
  - Chân trang: `made with love` nhỏ nhắn ở đáy màn hình.
- **Âm thanh**: Im lặng tuyệt đối, chỉ có tiếng gió khẽ thì thào khi người chơi tương tác.

### 2.2. Lời Dẫn Nhập (Intro Monologue)
- **Góc nhìn**: Căn giữa màn hình, chữ gõ máy typewriter 50ms/ký tự, các dòng trước mờ dần về opacity 0.5.
- **Ánh sáng**: Gradient đêm tối huyền bí, con trỏ gõ máy màu hồng đào `#f9a8d4` nhấp nháy.
- **Lời dẫn chuyện**:
  > **Dòng 1**: *"Hôm nay, mình muốn nói với bạn một điều..."*  
  > *(nghỉ 800ms)*  
  > **Dòng 2**: *"Nhưng trước tiên, mình phải tìm đến bạn."*
- **Âm thanh**: Tiếng gió lướt nhẹ chuyển cảnh sang màn chơi chính.

### 2.3. Hòm Thư Trước Ngõ & Bưu Kiện Cuốn Sách Kèm Địa Chỉ (Mailbox & Parcel FPV, $x = 200$)
- **Vị trí**: Chiếc hòm thư gỗ mộc cắm bên vệ đường trước ngõ ($x = 200, y = 272$).
- **Bối cảnh & Ánh sáng**: Ráng chiều hoàng hôn buông lơi, ánh nắng vàng cam hắt bóng dài trên con đường đất.
- **Cơ chế & Hành động**:
  - Nhân vật bước tới hòm thư, xuất hiện chỉ dẫn: `[E] Mở hòm thư`.
  - Nhấn `[E]` chuyển sang **FPV Hòm Thư & Bưu Kiện Cuốn Sách** (`scene = "mailbox"`):
    - Đôi bàn tay chàng trai mở nắp hòm thư gỗ mộc, nhấc ra một bưu kiện bọc giấy kraft nâu thắt dây thừng gai vintage.
    - Bên trong là một **cuốn sách văn học đặc biệt** mà cô gái từng nhắc tới.
    - Kẹp trên bìa sách là một mẩu giấy nhãn bưu điện viết tay nắn nót ghi dòng địa chỉ: *"Gửi về: Đỉnh đồi Hoa Anh Đào, nơi hoàng hôn gặp bình minh..."*
    - Kèm theo bưu kiện sách là bức thư tình chàng trai đã thức bao đêm viết và đóa hoa hồng đỏ thắm đầu tiên.
    - Chàng trai nắm chặt bưu kiện và bức thư trong tay, trái tim rộn ràng hạ quyết tâm lên đường tìm đến địa chỉ của cô gái.
- **Âm thanh**: Tiếng kẽo kẹt nắp hòm thư gỗ `SFX.mailboxOpen()`, tiếng sột soạt giấy kraft `SFX.paperPickup()`.
- **Lời thoại / Độc thoại**:
  > **Dòng 1**: *"Một bưu kiện gửi đến hòm thư... Là cuốn sách hôm trước cậu ấy nhắc tới!"*  
  > **Dòng 2**: *"Mẩu giấy nhắn kẹp kèm theo... 'Đỉnh đồi Hoa Anh Đào'. Đây chính là địa chỉ nơi cậu ấy đang đợi!"*  
  > **Dòng 3**: *"Bức thư tình này mình đã nắn nót viết suốt bao đêm... Mình phải lên đường ngay để trao tận tay cậu ấy!"*

---

## 🗺️ 3. Hành Trình Thu Thập 7 Đóa Hoa & 3 Mảnh Thư (Master Milestones Arc)

Bản đồ trò chơi được chia làm 2 giai đoạn lớn với tổng chiều dài $4600\text{ px}$ ($2400\text{ px}$ Thung lũng Kỷ niệm + $2200\text{ px}$ Đỉnh đồi Hoa Anh Đào), được kết nối bằng hiệu ứng điện ảnh chuyển cảnh 2 pha (Cinematic 2-Phase Map Crossfade):

```
[BẢN ĐỒ 1: THUNG LŨNG KỶ NIỆM (VALLEY MAP) - 2400px]
[Spawn: x=40] ── [Hòm thư: x=200 - Bưu kiện sách & Địa chỉ] ── (Hoa #1: x=220) 
── [Ghế đá & Mèo cào xé thư: x=450 - Hoa #2 (Bắt buộc ngồi [S] mới vuốt [E])] 
── [Xích đu chữ A: x=680] 
── [Vùng Mưa: x=580..1350] ── (Hoa #3: x=850) 
── [Cột đèn cao & Mảnh #1 cành cây: x=1150 - Hoa #4 (FPV Nhảy với)] 
── [Cầu đêm sao & Mảnh #2 thuyền giấy: x=1500 - Hoa #5 (FPV Vớt thuyền - Không nhặt tự động)] 
── [Mỏm Đá: x=1750 - Hoa #6] 
── [Mảnh #3 rượt đuổi Mèo bìa rừng: x=1800 (FPV Rượt đuổi & Dỗ dành)] 
── (Hoa #7: x=2100) 
── [Bàn đá dán thư FPV Pixel Art: x=2210] 
── [Chuyển cảnh 2-pha mờ đen "Đang tiến về Đồi Hoa Anh Đào...": x=2400]

[BẢN ĐỒ 2: ĐỒI HOA ANH ĐÀO (CHERRY HILL MAP) - 2200px]
[Cổng Vườn Đào: x=0..130 - FPV cherry-entrance choáng ngợp] 
── [Con dốc uốn lượn 2200px & 28 cây anh đào bạt ngàn] 
── [Ghế sườn núi nghỉ chân: x=940] 
── [Đỉnh đồi y=265: x=1850..2200] 
── [Cội Đại Thụ Anh Đào: x=1940] 
── [Em đứng chờ: x=2050] ── [FPV Tái Ngộ Dưới Gốc Anh Đào] 
── [Ending: Pháo hoa, Trái tim dạ quang & Thiệp "I LOVE U" cuộn 60FPS]
```

---

### 🌸 Bông Hoa #1: Hé Nở Ban Sơ (Proximity Bloom)
- **Tọa độ**: $x = 220, y = 290$
- **Bối cảnh & Ánh sáng**: 
  - Đất non thoai thoải, thảm cỏ xanh mướt điểm xuyết hoa dại trắng và vàng.
  - Ánh hoàng hôn ấm áp đổ dài (`#fdba74` $\rightarrow$ `#fb923c`). Đàn bướm vàng chập chờn bay lượn.
- **Hành động & Cơ chế**: 
  - Hoa ban đầu e ấp dưới dạng nụ hoa nhỏ.
  - Khi nhân vật bước tới gần trong bán kính $65\text{ px}$, hoa tự động bung nở 4 cánh đỏ thắm rực rỡ.
- **Âm thanh**: 
  - Tiếng hoa nở thanh khiết `SFX.flowerBloom()`.
  - **Stem 2 BGM (Lo-Fi Piano)** chính thức được kích hoạt: Hợp âm rải vòng `Fmaj7 - G6 - Em7 - Am7` ngọt ngào hoài niệm.
- **Lời thoại nội tâm (Thought Bubble)**:
  > *"Ngày hôm ấy, trời chẳng nắng cũng chẳng mưa... Nhưng khoảnh khắc cậu quay đầu lại cười, thế giới của mình tự nhiên có màu."*

---

### 🐾 Bông Hoa #2: Món Quà Từ Chú Mèo & Biến Cố Xé Thư Ở Ghế Đá (The Cat & Torn Letter Incident)
- **Tọa độ**: $x = 450, y = 284$ (Ghế gỗ công viên kèm mèo ngủ)
- **Bối cảnh & Không gian nghệ thuật**: 
  - Chiếc ghế băng gỗ mộc đặt bên bờ cỏ xanh rì. Dưới ráng chiều hoàng hôn buông lơi (`#fdba74` $\rightarrow$ `#f97316`), một chú mèo tam thể đang cuộn tròn ngủ say sưa trên nửa phải nan ghế.
- **Cơ chế tương tác & Quy tắc Logic nghiêm ngặt**:
  1. **Bắt buộc ngồi xuống trước (Sit-to-Pet Prerequisite)**:
     - Khi đứng cạnh ghế, người chơi **chưa thể vuốt ve mèo**. Nếu bấm `[E]`, nhân vật sẽ có lời thoại nội tâm nhắc nhở: *"Mình nên ngồi xuống ghế nghỉ chân một chút..."*.
     - Người chơi **bắt buộc phải nhấn phím `[S]` hoặc `[↓]` để nhân vật ngồi xuống nửa bên trái ghế đá** ($x = 426, y = 274$) kề bên chú mèo.
     - Khi đã ở trạng thái ngồi (`isSitting === true`), bức thư tình phong bì kraft thắt nơ đỏ xuất hiện phẳng phiu trên nan ghế và nhãn gợi ý `[E] Vuốt ve chú mèo 🐾` mới chính thức hiển thị!
  2. **Biến cố xé thư & Mèo chạy mất**:
     - Bấm `[E]` kích hoạt FPV 1 (Vuốt ve chú mèo). Khi người chơi vuốt ve đủ cảm xúc, chú mèo vươn vai cựa mình, vô tình bật móng vuốt cào rách phong bì thư giấy!
     - Cơn gió thốc cuốn 3 mảnh thư bay tán loạn về phía màn mưa.
     - Chú mèo hoảng hốt kêu thất thanh rồi phóng vụt biến mất dạng vào rặng cây. Chiếc ghế trở nên trống trải (`park-bench-empty.png`).
     - Đóa hoa thứ 2 rơi lại trên đám cỏ xanh dưới chân ghế.
  3. **Quy tắc sau biến cố xé thư (Post-Rip Logic)**:
     - Chú mèo đã chạy mất nên người chơi **hoàn toàn không thể vuốt ve mèo tại vị trí này nữa**.
     - **TUY NHIÊN, người chơi VẪN CÓ THỂ bấm `[S]` để ngồi xuống chiếc ghế đá trống bất kỳ lúc nào!** Khi ngồi trên chiếc ghế trống trải, nhân vật sẽ nhìn nan ghế trống vắng và cất lên dòng suy nghĩ bồi hồi: *"Chiếc ghế giờ chỉ còn lại mình... Bức thư đã bị gió cuốn đi, mình phải tìm lại cho bằng được!"*.
  4. **Chốt chặn cốt truyện bắt buộc (Hard Story Gate)**:
     - **Nếu người chơi không ngồi và không vuốt ve chú mèo ở ghế đá**: Chú mèo sẽ không xé thư, 3 mảnh thư sẽ KHÔNG bao giờ xuất hiện trên thế giới, và người chơi sẽ KHÔNG THỂ tìm thấy cô gái ở đỉnh đồi (đường đi sẽ bị chặn bởi cơn gió ngược và lời thoại ngăn lại: *"Mình chưa thể đi tiếp... Cảm giác như mình đã bỏ quên một điều gì đó vô cùng quan trọng ở chiếc ghế công viên ban nãy"*).
- **Âm thanh**: Tiếng mèo gừ rừ `SFX.catPurr()`, tiếng mèo giật mình kêu thót `SFX.catMeowShort()`, tiếng xé giấy giòn tan xót xa `SFX.paperRip()`.
- **Lời thoại nội tâm**:
  - *Khi nhặt hoa #2*: *"Cậu từng bảo cậu thích những điều giản dị như ngắm một chú mèo ngủ ngoan... Còn mình, mình chỉ thích nhìn cậu kể về những điều giản dị ấy với đôi mắt lấp lánh."*
  - *Khoảnh khắc thư bay mất*: *"Không thể nào! Bức thư... bức thư mình nắn nót viết suốt bao đêm qua! Gió cuốn đi đâu mất rồi... Chú mèo ơi chờ đã!"*

---

### 🪑 Phân Đoạn Nối: Khoảng Lặng Chiếc Xích Đu Dưới Mưa (The Solitary Swing in Rain)
- **Tọa độ**: $x = 680, y = 240$ (Chiếc xích đu gỗ chữ A tiếp đất)
- **Bối cảnh & Ánh sáng**: 
  - Vừa qua mốc $x = 580$, bầu trời sập tối đột ngột. Ráng chiều tắt hẳn, nhường chỗ cho sắc trời xanh đen u ám (`#1e293b` $\rightarrow$ `#0f172a`). Những hạt mưa ngâu đầu mùa bắt đầu rơi buốt lạnh.
  - Chiếc xích đu gỗ chữ A đứng trơ trọi bên vệ đường.
- **Hành động & Diễn biến tâm lý (Emotional Valley)**:
  - Sau cú rượt đuổi hụt hơi và bất thành, chàng trai rũ vai, lững thững bước từng bước nặng trĩu đến bên chiếc xích đu.
  - Người chơi bấm `[E]` để ngồi lên xích đu, đu đưa theo con lắc vật lý `swingAngle` trong tiếng mưa rơi tí tách.
  - **Cuộc đấu tranh nội tâm (Doubt & Hesitation)**:
    > *"Đến cả một bức thư cũng không giữ trọn vẹn được... thì lấy tư cách gì để bước tới trước mặt người ta?"*  
    > *"Hay là... mình bỏ cuộc ở đây thôi? Có lẽ duyên phận đã định rằng mình không nên nói ra..."*
  - **Khoảnh khắc bừng tỉnh (The Spark of Courage)**:
    - Trong lúc gục đầu, anh chợt nhìn thấy một nhành hoa dại bên chân xích đu, kiên cường đứng vững trước gió mưa.
    - Một ý nghĩ lóe lên như tia chớp giữa trời đêm:
      > *"Bức thư có thể rách, nhưng lòng chân thành của mình đâu có rách!"*  
      > *"Dù có phải lội qua cả cơn bão này, nhặt lại từng mảnh vụn chắp vá lại từng con chữ... mình cũng nhất định phải đi tới cùng!"*
  - Chàng trai kiên quyết ngẩng đầu dậy, bật mở chiếc ô đỏ thắm trên tay che chắn gió mưa, ánh mắt tràn đầy dũng khí tiếp tục sải bước về phía trước.
- **Âm thanh**: Tiếng xích đu đung đưa kẽo kẹt `SFX.swingCreak()`, tiếng mưa rơi buốt giá, tiếng bật dù dứt khoát `SFX.umbrellaOpen()`.

---

### 🌧️ Bông Hoa #3: Đón Cánh Hoa Rơi Trong Mưa (Falling Petal in Rain)
- **Tọa độ**: $x = 850, y = 280$
- **Bối cảnh & Ánh sáng**: Bầu trời xám xanh Slate (`#334155` $\rightarrow$ `#1e293b`), mưa ngâu rơi chéo theo gió. 3 vũng nước mưa phản chiếu ánh chớp bạc.
- **Hành động & Cơ chế**: Cành hoa trôi dạt bồng bềnh từ trên cao rơi chầm chậm xuống đất theo gió mưa. Nhân vật chạy qua vũng nước làm giọt nước bắn tóe.
- **Âm thanh**: **Stem 3 BGM (Cello Bass)** hòa tấu trầm ấm, tiếng bước chân bì bõm `SFX.puddleStep()`.
- **Lời thoại nội tâm**:
  > *"Có những đêm nằm nghe tiếng mưa rơi, mình mở lại từng dòng tin nhắn cũ... Đọc từng câu chữ ngốc nghếch rồi tự cười một mình. Hóa ra nhớ một người là cảm giác như thế."*

---

### 💡 Bông Hoa #4 & Mảnh Thư #1: Cột Đèn Cao & FPV Nhảy Vươn Tay Với Mảnh Thư (Tall Lamp Post & High Reach FPV)
- **Tọa độ**: $x = 1150, y = 220$ (Cột đèn kim loại vươn cao, đỉnh chao đèn $y \approx 190$)
- **Bối cảnh & Nâng cấp hình ảnh**: 
  - Cột đèn đường được nâng cao vượt trội so với chiều cao nhân vật (cao $96 - 112\text{ px}$), chao đèn uốn cong cổ điển chiếu rọi nón ánh sáng vàng ấm áp từ trên cao xuống bao phủ mặt đất ẩm ướt.
- **Cơ chế dừng lại & Kích hoạt FPV**: 
  - Khi nhân vật bước vào quầng sáng vàng dưới chân cột đèn ($x \approx 1130 - 1170$), nhân vật **tự động dừng bước** (ngắt đà di chuyển) và chuyển sang **FPV Cột Đèn & Nhảy Vươn Tay Với Thư** (`scene = "lamp-reach"`).
  - **Diễn biến FPV**:
    - Dưới luồng sáng ấm rọi qua màn mưa đêm, chàng trai ngước nhìn lên và vô tình phát hiện **Mảnh thư #1** đang bị mắc kẹt trên chạc cây chìa sát chóa đèn trên cao.
    - Người chơi bấm phím `[Space]` để chàng trai nhún chân kiễng gót, vươn cao hai bàn tay nhảy với lấy mảnh thư trong gió.
    - Sau 2-3 nhịp nhảy với đầy nỗ lực, chàng trai túm được góc giấy và áp mảnh thư vào ngực áo che chở khỏi giọt mưa.
    - Đồng thời, đóa hoa hồng #4 dưới chân cột đèn bừng nở rực rỡ.
- **Âm thanh**: Tiếng công tắc đèn `SFX.lampClick()`, tiếng nhảy với `SFX.jump()`, tiếng sột soạt giấy bắt trúng `SFX.paperPickup()`.
- **Lời thoại nội tâm & Trích đoạn Mảnh #1**:
  - *Mảnh #1 (Kỷ Niệm Ngày Đầu Tiên)*: *"“Cậu có nhớ lần đầu tiên chúng mình ngồi trú mưa ở hiên quán cũ không? Cậu chia cho mình nửa chiếc bánh quy, còn mình thì lúng túng chẳng dám nhìn thẳng vào mắt cậu...”"*
  - *Thought #4*: *"Những ngày lòng mình nhiều mây đen và giông bão nhất... Chỉ cần nghĩ đến việc có cậu ở phía trước, mọi mỏi mệt bỗng chốc hóa dịu dàng."*

---

### 🌙 Bông Hoa #5 & Mảnh Thư #2: Thuyền Giấy Dưới Suối Đêm & FPV Vớt Thuyền (Paper Boat Retrieval FPV)
- **Tọa độ**: $x = 1500, y = 295$ (Mặt hồ suối bên cây cầu gỗ đêm sao)
- **Bối cảnh & Ánh sáng**: Cây cầu gỗ vắt ngang qua dòng suối đêm tĩnh lặng (`#090d16`), ngàn vì sao lung linh và vầng trăng khuyết soi bóng. 4 chú đom đóm dập dờn bay quanh đóa hoa #5 trên nhịp cầu.
- **Cơ chế tương tác nghiêm ngặt — TUYỆT ĐỐI KHÔNG TỰ ĐỘNG NHẶT (No Walk-over Auto-pickup)**:
  - Một chiếc thuyền giấy origami nhỏ màu trắng ngà đang dập dềnh trôi trên mặt nước suối, bên trong chở **Mảnh thư #2**.
  - **Loại bỏ hoàn toàn cơ chế đi ngang qua tự nhặt**: Người chơi phải chủ động bước tới mép cầu/bờ suối và bấm phím `[E] Vớt thuyền giấy ⛵`.
  - Bấm `[E]` kích hoạt **FPV Vớt Thuyền Giấy** (`scene = "boat-retrieve"`):
    - Góc nhìn FPV: Đôi bàn tay chàng trai khom người vươn sát mặt nước suối đêm lấp lánh ánh trăng sao. Chiếc thuyền giấy dập dềnh trôi đến gần, đôi bàn tay nhẹ nhàng nâng chiếc thuyền ướt sũng lên khỏi mặt nước.
    - Chàng trai cẩn thận gỡ Mảnh thư #2 ra khỏi lòng thuyền, vuốt phẳng từng nếp gấp ướt sương đêm.
- **Âm thanh**: **Stem 4 BGM (Glockenspiel Chimes)** hòa tấu chuông ngọc, tiếng nước xao động khẽ khàng `SFX.boatSplosh()`.
- **Lời thoại nội tâm & Trích đoạn Mảnh #2**:
  - *Mảnh #2 (Những Đêm Lắng Nghe)*: *"“Có những đêm nghe cậu thở dài vì mệt mỏi, mình chỉ ước có thể mang cho cậu một ly trà ấm. Mình sợ sự vụng về làm phiền cậu, nên chỉ biết lặng lẽ thức cùng cậu...”"*
  - *Thought #5*: *"Cậu từng bảo ánh sáng đom đóm quá đỗi mong manh... Nhưng cậu biết không, đôi khi chỉ cần một đốm sáng nhỏ nơi ánh mắt cậu, cũng đủ để mình không bao giờ lạc đường."*

---

### 🧗 Bông Hoa #6 & Mảnh Thư #3: Mỏm Đá Rêu & Cuộc Rượt Đuổi Mèo Bìa Rừng (Forest Cat Chase & Retrieval FPV)
- **Tọa độ**: $x = 1750, y = 245$ (Hoa #6 trên mỏm đá rêu) và $x = 1800, y = 295$ (Bìa rừng cổ thụ)
- **Bối cảnh & Hành động**: 
  - Người chơi nhảy lên mỏm đá rêu hái Hoa #6 (`SFX.jump()`).
  - Vừa đặt chân xuống bìa rừng ($x = 1800$), chàng trai bất ngờ chạm mặt lại **chính chú mèo tam thể công viên** đang vờn Mảnh thư #3!
  - Thấy bóng người, chú mèo giật mình ngậm mảnh thư phóng vụt vào rừng cây mờ ảo.
- **Kích hoạt FPV Rượt Đuổi & Dỗ Dành Mèo** (`scene = "forest-cat-chase"`):
  - **Giai đoạn 1 (Rượt đuổi qua rặng cây)**: FPV góc nhìn chàng trai chạy dồn dập đuổi theo bóng lưng chú mèo len lỏi qua các gốc cây cổ thụ phủ rêu dưới ánh sao đêm.
  - **Giai đoạn 2 (Chú mèo dừng lại nép gốc cây)**: Chú mèo thấm mệt, dừng lại nép dưới một gốc sồi già, thở dốc và ngoái nhìn lại với ánh mắt e dè, Mảnh thư #3 bị đè dưới móng vuốt.
  - **Giai đoạn 3 (Quỳ gối dỗ dành & Nhận lại thư)**: Chàng trai từ từ quỳ gối dang nhẹ hai tay, dỗ dành chú mèo bằng giọng trầm ấm. Người chơi nhấp `[Space]` hoặc click để vuốt ve cằm và lưng mèo.
  - Chú mèo an lòng nhắm mắt kêu rừ rừ (`SFX.catPurr()`), chàng trai cẩn thận rút lấy Mảnh thư #3 nguyên vẹn từ tay chú mèo.
- **Âm thanh**: Tiếng bước chân dồn dập trong rừng, tiếng mèo gừ êm dịu, tiếng sột soạt giấy `SFX.paperPickup()`.
- **Lời thoại nội tâm & Trích đoạn Mảnh #3**:
  - *Mảnh #3 (Lời Chưa Dám Nói)*: *"“Hôm nay, mình gom hết tất cả sự can đảm tích cóp từ những ngày tháng ngắm nhìn cậu từ xa. Nếu không bước đến nói thật lòng mình, mình sẽ hối tiếc cả đời...”"*
  - *Thought #6*: *"Mỗi bản nhạc mình nghe, mỗi góc phố mình từng đi qua... Bằng một cách kỳ diệu nào đó, tâm trí mình đều vô thức dẫn về phía cậu."*

---

### 🌅 Bông Hoa #7: Vương Miện Bình Minh (Dawn Blossom Crown)
- **Tọa độ**: $x = 2100, y = 290$
- **Bối cảnh & Ánh sáng**: Bầu trời rạng đông bừng sắc hồng đào và xanh sớm (`#38bdf8` $\rightarrow$ `#fed7aa` $\rightarrow$ `#fecdd3`). Gió sớm thổi tung những cánh hoa anh đào bay lượn.
- **Hành động**: Thu hoạch đóa hoa thứ 7 tỏa hào quang bình minh. Bó hoa 7 đóa hoàn chỉnh bọc giấy kraft xuất hiện trên tay.
- **Âm thanh**: Chuỗi hợp âm khải hoàn `SFX.allCollected()`.
- **Lời thoại nội tâm**:
  > *"Và bông hoa này... là tất cả dũng khí mình gom góp bấy lâu nay. Để hôm nay, mình có thể đứng trước mặt cậu mà không còn ngập ngừng."*

---

### 📜 Trạm Dừng Chân: Bàn Ghép Thư Ký Ức Chuẩn Retro Pixel Art ($x = 2210$)
- **Vị trí**: Chiếc bàn gỗ mộc mạc đặt trước thềm con dốc lên đồi hoa anh đào ($x = 2210$).
- **Yêu cầu thiết kế**: **Tái thiết kế toàn diện theo chuẩn Retro Pixel Art 16-bit** (Loại bỏ 100% giao diện vector/SVG phẳng hiện tại).
- **Chi tiết xem Mục 4 (FPV 6 - Pixel Art Crafting Desk)**.
  - Khi nhặt được bông thứ 7: Bó hoa 7 đóa hoàn chỉnh bọc giấy craft và nơ đỏ xuất hiện trên tay nhân vật.
- **Âm thanh**: 
  - Hợp âm vinh quang `SFX.allCollected()` ngân vang rực rỡ, toàn bộ 4 tầng BGM đạt độ tròn trịa và viên mãn nhất.
- **Lời thoại nội tâm (Thought Bubble)**:
  > *"Và bông hoa này... là tất cả dũng khí mình gom góp bấy lâu nay. Để hôm nay, mình có thể đứng trước mặt cậu mà không còn ngập ngừng."*

---

## 👁️ 4. Chi Tiết Các Phân Cảnh Góc Nhìn Thứ Nhất (First-Person Views - FPV)

Tất cả các cảnh FPV đều tuân thủ các quy tắc điện ảnh cốt lõi:
- Viền đen điện ảnh letterbox $20\text{ px}$ trên/dưới.
- Khung phụ đề điện ảnh tối giản đặt sát đáy màn hình (`bottom: 10px`, căn giữa).
- Chữ chạy typewriter $25\text{ ms}$/ký tự, mũi tên nhấp nháy `▼` tinh tế.
- Tích hợp phím thao tác vi mô: `[Space]` / Chuột dành riêng cho hành động chạm/vuốt/với lấy; Phím `[→]` (ArrowRight) / `[Enter]` hoặc nút `[Tiếp tục ➔]` để sang câu thoại tiếp theo (trang bị cơ chế One-Shot Latch chống lướt thoại).

---

### 📬 FPV 0: Mở Hòm Thư & Bưu Kiện Cuốn Sách Kèm Địa Chỉ (`scene = "mailbox"`, $x = 80$)
- **Hình ảnh & Mỹ thuật**: 
  - Phong cách Storybook Cel matching `message.png` ("không quá pixel, không quá chân thực").
  - Tiền cảnh: Đôi bàn tay chàng trai khẽ vươn ra mở nắp chiếc hòm thư gỗ mộc bên vệ đường hoàng hôn.
  - Trung tâm: Bên trong hòm thư là một gói bưu kiện hình chữ nhật bọc giấy kraft nâu mộc mạc, thắt dây thừng gai vintage theo hình chữ thập.
  - Trên mặt bưu kiện: Dán một mẩu nhãn bưu điện viết tay nắn nót dòng địa chỉ: *"Gửi về: Đỉnh đồi Hoa Anh Đào, nơi hoàng hôn gặp bình minh..."*.
  - Bên dưới lớp dây buộc hé lộ gáy một cuốn sách đặc biệt kèm theo phong bì thư tình thắt nơ đỏ và đóa hoa hồng hé nụ.
- **Tương tác vi mô**:
  - Người chơi click chuột hoặc bấm `[Space]` để đôi bàn tay khẽ lật mở góc giấy bọc bưu kiện, cảm nhận sự nâng niu trước hành trình.
- **Lời thoại / Độc thoại**:
  > **Dòng 1**: *"Một bưu kiện gửi đến hòm thư... Là cuốn sách hôm trước cậu ấy nhắc tới!"*  
  > **Dòng 2**: *"Mẩu giấy nhắn kẹp kèm theo... 'Đỉnh đồi Hoa Anh Đào'. Đây chính là địa chỉ nơi cậu ấy đang đợi!"*  
  > **Dòng 3**: *"Bức thư tình này mình đã nắn nót viết suốt bao đêm... Mình phải lên đường ngay để trao tận tay cậu ấy!"*

---

### 🐱 FPV 1: Vuốt Ve Chú Mèo Trên Ghế Đá (`scene = "cat"`, $x = 450$)
- **Điều kiện mở**: Người chơi **bắt buộc phải ngồi xuống ghế đá trước (`isSitting === true`)**, sau đó mới bấm `[E]` để mở FPV.
- **Hình ảnh & Mỹ thuật**: 
  - Tác phẩm tranh Storybook Cel vẽ sáp màu doodle ấm cúng (`public/assets/others/fpv-cat-storybook.png`).
  - Đôi bàn tay chàng trai khẽ chạm vuốt ve chú mèo tam thể đang cuộn tròn ngủ ngoan trên nan ghế gỗ công viên. Kế bên là bức thư tình phong bì kraft thắt nơ đỏ đặt phẳng phiu.
- **Tương tác vi mô**:
  - Chú mèo thở phập phồng tuần hoàn nhịp $3\text{s}$ (`sin(t)` $\pm 1.5\%$).
  - Nhấp `[Space]` hoặc Click để vuốt ve, tỏa hạt tim hồng `♥` kèm rung nhẹ `purr`.
- **Diễn biến kịch tính khi hoàn thành**:
  - Chú mèo vươn vai cựa mình, vô tình cào rách toạc góc phong bì thư! Cơn gió thốc cuốn 3 mảnh thư bay vút về phía trước (`SFX.paperRip()`).
  - Chú mèo hoảng hốt kêu thất thanh rồi phóng chạy biến mất vào rặng cây. Chiếc ghế trở nên trống rỗng (`park-bench-empty.png`).
  - Đóa hoa #2 rơi lại dưới chân ghế.
- **Quy tắc sau biến cố**:
  - Mèo đã chạy mất nên **không thể vuốt ve lại tại vị trí này**.
  - Người chơi **vẫn có thể bấm `[S]` ngồi xuống ghế đá trống** để suy ngẫm bồi hồi: *"Bức thư bị gió cuốn đi rồi... Mình phải tìm lại cho bằng được!"*.
- **Lời thoại / Độc thoại**:
  > **Dòng 1**: *"Bộ lông ấm áp thật đấy... Ngoan quá. Mình đặt bức thư tỏ tình ở đây một chút nhé, nắn nót viết mãi mới xong đấy..."*  
  > **Dòng 2**: *"Ô kìa, chú mèo cựa mình vươn móng vuốt... Mèo ơi đừng cào vào phong bì thư!"*  
  > **Dòng 3**: *"Gió bất ngờ thổi thốc qua cuốn 3 mảnh thư bay vút đi! Chú mèo cũng giật mình phóng chạy... Mình phải đuổi theo ngay!"*

---

### ☔ FPV 2: Đứng Dưới Mưa Chiều Che Ô Đỏ (`scene = "rain"`, $x = 980$)
- **Hình ảnh**: Nền trời mưa chạng vạng xanh xám đậm chất điện ảnh. Tán ô đỏ rực bao trùm góc trên. Giọt mưa rơi xiên, bật tóe giọt li ti trên tán ô.
- **Tương tác vi mô**: Bấm phím `[← / →]` hoặc `[A / D]` để nghiêng ô $\pm 25^\circ$ chắn đúng hướng gió tạt. Tiếng mưa gõ lộp độp `SFX.umbrellaTap()`.
- **Lời thoại / Độc thoại**:
  > **Dòng 1**: *"Tiếng mưa rơi tí tách trên mặt ô nghe thật êm đềm..."*  
  > **Dòng 2**: *"Chiếc ô này ngày ấy quá nhỏ cho cả hai... nhưng em lại cố tình nép sát vào vai anh. Mưa làm ướt một bên áo, mà tim anh lúc đó lại ấm lạ thường."*

---

### 💡 FPV 3: Cột Đèn Cao & Vươn Tay Nhảy Lấy Mảnh Thư #1 (`scene = "lamp-reach"`, $x = 1150$)
- **Vị trí & Kích hoạt**: Cột đèn đường kim loại vươn cao $112\text{ px}$. Nhân vật bước vào quầng sáng dưới chân cột đèn thì **tự động dừng bước** và mở FPV.
- **Hình ảnh & Mỹ thuật**: 
  - Góc nhìn FPV ngước nhìn lên cao: Nón ánh sáng vàng ấm từ chao đèn rọi xuyên qua làn mưa đêm lung linh bụi phấn vàng.
  - Phía trên cao: Một cành cây cổ thụ chìa ra cạnh chao đèn, nơi **Mảnh thư #1** màu kraft đang bị mắc kẹt, phấp phới trong gió mưa.
  - Phía dưới: Đôi bàn tay chàng trai vươn cao về phía quầng sáng.
- **Tương tác vi mô (High Reach & Jump)**:
  - Người chơi bấm phím `[Space]` để chàng trai nhún chân, kiễng gót và nhảy với tay lên cao (`SFX.jump()`).
  - Sau 2-3 nhịp nhảy với kiên trì, bàn tay chàng trai túm chặt lấy góc mảnh thư (`SFX.paperPickup()`), cẩn thận kéo xuống và áp vào ngực áo ấm che chở khỏi mưa ướt.
  - Đóa hoa hồng #4 dưới chân cột đèn bừng nở tỏa hương.
- **Lời thoại / Độc thoại**:
  > **Dòng 1**: *"Ánh đèn đường soi rọi qua màn mưa... Kìa, trên cành cây sát chao đèn có một mảnh giấy màu nâu!"*  
  > **Dòng 2**: *"Đúng là Mảnh #1 rồi! 'Cậu có nhớ lần đầu tiên chúng mình ngồi trú mưa ở hiên quán cũ không? Cậu chia cho mình nửa chiếc bánh quy...' Mình phải nhảy lên lấy lại mới được!"*  
  > **Dòng 3**: *"Bắt được rồi! May quá, con chữ vẫn còn nguyên vẹn. Cố lên, mình sẽ tìm lại đủ cả 3 mảnh!"*

---

### 🌙 FPV 4: Ngắm Trăng & Đom Đóm Trên Cầu Gỗ (`scene = "bridge"`, $x = 1500$)
- **Hình ảnh**: Lan can cầu gỗ sồi mộc mạc, vầng trăng khuyết treo lơ lửng soi bóng xuống dòng suối tĩnh mịch, 5 chú đom đóm vàng chanh dập dờn bay lượn.
- **Lời thoại / Độc thoại**:
  > **Dòng 1**: *"Đứng trên cây cầu này nhìn xuống, dòng suối lặng lẽ trôi dưới ánh trăng vàng..."*  
  > **Dòng 2**: *"Những chú đom đóm dập dờn như ngàn vì sao lạc lối. Ước gì em cũng đang đứng ở đây cùng anh lúc này."*

---

### ⛵ FPV 4.5: Vớt Thuyền Giấy Chở Mảnh Thư #2 Dưới Suối Đêm (`scene = "boat-retrieve"`, $x = 1500$)
- **Vị trí & Kích hoạt**: Người chơi đứng trên nhịp cầu đêm sao nhìn xuống suối, bấm phím `[E] Vớt thuyền giấy ⛵` (Tuyệt đối không có cơ chế tự động nhặt).
- **Hình ảnh & Mỹ thuật**: 
  - Góc nhìn FPV sát mặt nước suối đêm lấp lánh phản chiếu trăng sao và ánh sáng đom đóm.
  - Trung tâm: Một chiếc thuyền giấy origami màu trắng ngà nhỏ nhắn đang dập dềnh trôi đến, bên trong lòng thuyền chở **Mảnh thư #2** màu kraft cuộn khẽ.
  - Hai bàn tay chàng trai nhẹ nhàng vươn xuống sát mặt nước, khum lại nâng trọn chiếc thuyền giấy ướt sũng lên bờ.
- **Tương tác vi mô**:
  - Bấm `[Space]` hoặc Click để nâng thuyền giấy lên khỏi mặt nước (`SFX.boatSplosh()`), gỡ nhẹ nhàng mảnh giấy số 2 ra khỏi thuyền.
- **Lời thoại / Độc thoại**:
  > **Dòng 1**: *"Một chiếc thuyền giấy đang trôi dưới suối đêm... Bên trong chở một mảnh thư!"*  
  > **Dòng 2**: *"Mảnh #2: 'Có những đêm nghe cậu thở dài vì mệt mỏi, mình chỉ ước có thể mang cho cậu một ly trà ấm. Mình sợ sự vụng về làm phiền cậu, nên chỉ biết lặng lẽ thức cùng cậu...'"*  
  > **Dòng 3**: *"Từng con chữ ướt sương đêm nhưng vẫn vẹn nguyên tấm lòng... Chỉ còn một mảnh nữa thôi!"*

---

### 🌲 FPV 5.5: Cuộc Rượt Đuổi & Dỗ Dành Mèo Bìa Rừng Lấy Mảnh Thư #3 (`scene = "forest-cat-chase"`, $x = 1800$)
- **Vị trí & Kích hoạt**: Người chơi đến mốc $x = 1800$ bìa rừng, gặp lại chú mèo tam thể đang vờn Mảnh thư #3. Khi tiếp cận, mèo hoảng sợ chạy vụt đi $\rightarrow$ Mở FPV rượt đuổi.
- **Hình ảnh & 3 Phân kỳ điện ảnh**:
  - **Kỳ 1 (Rượt đuổi qua rặng cây)**: FPV góc nhìn chàng trai sải bước dồn dập rượt theo bóng chú mèo tam thể đang thoăn thoắt phóng qua các thân cây cổ thụ phủ rêu xanh dưới ánh sao mờ ảo.
  - **Kỳ 2 (Mèo dừng lại thở dốc)**: Chú mèo thấm mệt, dừng lại nép mình bên một gốc sồi già xù xì, thở phập phồng và ngoái đôi mắt to tròn nhìn lại với vẻ e dè cảnh giác. Dưới móng vuốt mèo là **Mảnh thư #3** kẹp chiếc nơ đỏ.
  - **Kỳ 3 (Quỳ gối dỗ dành & Nhận lại thư)**: Chàng trai từ từ quỳ gối xuống thảm lá rừng, dang hai tay dỗ dành bằng giọng trầm ấm.
- **Tương tác vi mô**:
  - Nhấp `[Space]` hoặc click để vuốt ve cằm và lưng chú mèo. Chú mèo an lòng nhắm mắt kêu rừ rừ hạnh phúc (`SFX.catPurr()`).
  - Chàng trai nhẹ nhàng rút Mảnh thư #3 ra khỏi móng vuốt (`SFX.paperPickup()`).
- **Lời thoại / Độc thoại**:
  > **Dòng 1**: *"Chú mèo dừng lại rồi... Ngoan nào, đừng sợ, anh không làm đau em đâu."*  
  > **Dòng 2**: *"Mảnh #3 đây rồi: 'Hôm nay, mình gom hết tất cả sự can đảm tích cóp từ những ngày tháng ngắm nhìn cậu từ xa... Dù câu trả lời có là gì, cảm ơn cậu vì đã xuất hiện trong thanh xuân của mình.' "*  
  > **Dòng 3**: *"Cả 3 mảnh thư đã được tìm lại đầy đủ! Mình phải mang tới bàn đá trước đỉnh đồi để dán lại ngay!"*

---

### 🌸 FPV 4.8: Choáng Ngợp Trước Cổng Vườn Hoa Anh Đào (`scene = "cherry-entrance"`, $x = 130$ trên Map 2)
- **Vị trí & Kích hoạt**: Sau khi chuyển màn 2 và bước những bước đầu tiên vào khu vườn mùa xuân ($x \ge 130$), chàng trai tự động dừng bước, ngỡ ngàng trước vẻ đẹp thần tiên của Đồi Hoa Anh Đào.
- **Hình ảnh & Mỹ thuật**:
  - Không gian chuyển từ đêm bão sang vòm trời lam biếc `#60a5fa` và chân trời vàng hồng `#fed7aa`.
  - Hàng cây hoa đào nở rộ đa tầng, từng luồng cánh hoa hồng phấn rơi chao nghiêng ngập tràn trong gió xuân.
  - Phía xa xa trên triền đồi cao vút, bóng dáng cội đại thụ anh đào cổ thụ và người thương đang ẩn hiện.
- **Lời thoại / Độc thoại**:
  > **Dòng 1**: *"Khu vườn hoa anh đào... Khung cảnh nơi đây rực rỡ và bình yên đến nghẹn ngào."*  
  > **Dòng 2**: *"Từng cánh hoa đào đang rơi phấp phới trong làn gió xuân... Đẹp tựa như một giấc mơ vậy."*  
  > **Dòng 3**: *"Cô ấy đang đứng đợi mình trên đỉnh đồi kia rồi. Mình phải bước tiếp lên gặp cậu ấy ngay!"*

---

### 🌸 FPV 5: Tái Ngộ Dưới Gốc Anh Đào Đỉnh Đồi (`scene = "cherry-summit"`, $x = 2050$ trên Map 2)
- **Hình ảnh**: Bầu trời ban mai trong trẻo màu lam ngọc và phấn hồng. Cội đại thụ hoa anh đào sum sê ($x = 1940$) rủ bóng che chở nơi đỉnh núi bình yên ($y = 265$). Phía đối diện: Bạn gái trong chiếc váy xanh dương ($x = 2050$), mỉm cười dịu dàng đón chào. Tiền cảnh: Đôi bàn tay chàng trai nâng niu bó 7 đóa hoa hồng đỏ thắm và tấm thiệp "I LOVE U" đã được dán phẳng phiu bằng những dải băng hoa đào.
- **Đối thoại Tái Ngộ**:
  > **[Anh]**: *"Gió sớm khẽ lay lọn tóc em... Cuối cùng, anh cũng đã đến được nơi này."*  
  > **[Em]**: *"Em đã đợi anh rất lâu rồi... Thật mừng vì anh đã tới!"*  
  > **[Anh]**: *"Gió bão dọc đường đã xé rách bức thư anh viết... Nhưng anh đã nhặt lại từng mảnh, dán lại phẳng phiu cùng 7 đóa hoa này gửi trao em."*  
  > **[Em]**: *"Từng vết dán hoa đào này... thật đẹp và ấm áp. Cảm ơn anh vì đã không bỏ cuộc để mang trọn vẹn chân thành đến đây cùng em!"*

---

### 📜 FPV 6: Bàn Ghép Thư Ký Ức — Chuẩn Retro Pixel Art 16-bit (`scene = "letter-crafting"`, $x = 2210$)
- **Vị trí**: Chiếc bàn gỗ mộc mạc đặt trước thềm con dốc lên đỉnh đồi ($x = 2210$).
- **Triết lý tái thiết kế**: **Loại bỏ 100% giao diện vector/SVG phẳng hiện tại**, chuyển dịch hoàn toàn sang **Retro Pixel Art 16-bit Cozy Crafting Table**.
- **Mỹ thuật Bối Cảnh Bàn Ghép Thư Pixel Art**:
  - Mặt bàn gỗ sồi mộc mạc vẽ pixel art rõ nét (vân gỗ pixel đậm nhạt tông nâu `#5c3a21` / `#7a4e2d`).
  - Góc trái trên bàn: Bó hoa 7 đóa hồng đỏ thắm đã thu thập cắm trong bình sứ men lam pixel thanh nhã.
  - Góc phải trên bàn: 1 cuộn băng dính Washi hoa anh đào màu hồng pastel pixel và chiếc kéo đồng cổ điển.
  - Rải rác trên mặt bàn: 4-5 cánh hoa anh đào rơi phớt hồng.
  - Trung tâm bàn: Khung viền rãnh gỗ pixel chữ nhật lõm xuống làm vị trí đặt bức thư.
- **3 Mảnh Thư Pixel Art (Pixel Kraft Fragments)**:
  - 3 mảnh giấy kraft nâu be viền rách răng cưa pixel chuẩn mực:
    - **Mảnh #1 (Trái)**: Nét chữ doodle pixel **"I"** viết tay đậm đà.
    - **Mảnh #2 (Giữa)**: Nét chữ doodle pixel **"LOVE"** mộc mạc, bo góc mịn màng.
    - **Mảnh #3 (Phải)**: Nét chữ doodle pixel **"U"** và trái tim nhỏ đỏ thắm.
- **Cơ chế tương tác Gameplay Pixel Retro**:
  1. Khay đựng mảnh vụn ở đáy màn hình hiển thị 3 mảnh thư pixel nhấp nhô lơ lửng nhẹ.
  2. Người chơi dùng chuột (con trỏ găng tay pixel) click chọn từng mảnh, đặt vào đúng rãnh trên thiệp (`SFX.paperPickup()`).
  3. Khi cả 3 mảnh khít vào khung: Cuộn băng dính Washi hoa anh đào phát sáng. Người chơi click miết dán 2 dải băng keo chéo qua các vết nứt (âm thanh `SFX.tapeStick()` giòn tan).
  4. Hoàn thành: Toàn bộ bức thiệp bừng sáng vầng hào quang pixel vàng óng ánh, chuỗi chuông hạc `SFX.harpChime()` ngân vang, hiện ra chính xác bức họa nguyên bản `message.png` kinh điển!
- **Âm thanh**: `SFX.paperPickup()`, `SFX.tapeStick()`, `SFX.harpChime()`.

---

## 🎆 5. Đại Kết Cục: Tỏ Tình & Tấm Thiệp "I LOVE U" (Ending Cutscene)

Ngay khi lời thoại thứ 4 của cảnh FPV 5 kết thúc, trò chơi chuyển sang `gameState = 'ending'`:

1. **Hiệu ứng Thị Giác Toàn Cảnh**:
   - Nhân vật nam và bạn gái đứng kề bên nhau dưới cội hoa anh đào cổ thụ.
   - Những đợt pháo hoa rực rỡ (đỏ, vàng, hồng, lục, lam) bung nở liên tiếp trên nền trời bình minh.
   - Cánh hoa anh đào rơi ngập tràn không gian.
2. **Tấm Thiệp Tỏ Tình Thần Thánh ("I LOVE U" Card)**:
   - Tái hiện trung thành **100% nguyên tác** với phông chữ doodle comic tự nhiên, mượt mà:
   - Tấm thiệp bìa kraft mộc mạc hai bàn tay nâng niu, mang dòng chữ viết tay lớn:
     $$\mathbf{I\ LOVE\ U}$$
   - **Chuyển động mượt mà**: Thiệp trượt từ từ từ đáy màn hình lên giữa khung hình (`position` xuất phát từ 0, giảm 5px mỗi 100ms cho đến khi đạt ngưỡng cân đối).
   - **Âm thanh**: Tiếng nhạc nền Lo-Fi ấm áp và tiếng pháo hoa nhẹ nhàng ngân nga.

---

## 🎼 6. Thiết Kế Âm Thanh & BGM Tổng Thể (Audio Design Bible)

Toàn bộ âm thanh được lập trình bằng Web Audio API Synthesizer trong `src/lib/sound.ts`:

### 6.1. Bảng Hiệu Ứng Âm Thanh (SFX)
| Tên hàm | Loại âm | Ý nghĩa cảm xúc |
| :--- | :--- | :--- |
| `SFX.jump()` | Sóng vuông nhẹ $320\text{Hz} \rightarrow 480\text{Hz}$ | Cú nhảy nhẹ nhàng / nhún nhảy với lấy thư. |
| `SFX.flowerBloom()` | Hợp âm tam giác $440\text{Hz} \rightarrow 880\text{Hz}$ | Nụ hoa hé nở bừng sức sống. |
| `SFX.harpChime()` | Hợp âm rải đàn hạc $C_5 - E_5 - G_5 - B_5 - C_6$ | Khoảnh khắc thu thập hoa và hoàn thiện dán thiệp. |
| `SFX.catPurr()` | Sóng sin rung tần số cực thấp $65\text{Hz} \pm 12\text{Hz}$ | Tiếng mèo gừ êm ái khi được vuốt ve / dỗ dành. |
| `SFX.catMeowShort()` | Glissando ngọt ngào $600\text{Hz} \rightarrow 850\text{Hz} \rightarrow 500\text{Hz}$ | Tiếng "meo" giật mình hoặc hạnh phúc của mèo. |
| `SFX.umbrellaOpen()` | Tiếng cơ học lách cách màng ô căng | Mở ô che mưa sau khoảng lặng xích đu. |
| `SFX.umbrellaTap()` | Tiếng giọt nước va chạm trên mặt vải dù | Giọt mưa gõ lộp độp khi nghiêng ô đúng hướng gió. |
| `SFX.lampClick()` | Tiếng công tắc điện tách đanh gọn | Ngọn đèn đường bừng sáng. |
| `SFX.puddleStep()` | Tiếng nước bắn xao động | Bàn chân chạy qua vũng nước mưa. |
| `SFX.swingCreak()` | Tiếng cọt kẹt của khung gỗ xích đu | Tiếng đung đưa cô đơn của xích đu dưới mưa. |
| `SFX.paperRip()` | Tiếng gió rít và tiếng xé giấy giòn tan | Khoảnh khắc mèo cào rách bức thư ở ghế đá ($x=450$). |
| `SFX.paperPickup()` | Tiếng sột soạt giấy và hợp âm tinh khôi | Nhặt mảnh thư ký ức / bưu kiện hòm thư. |
| `SFX.boatSplosh()` | Tiếng nước xao động và chuông ngọc khẽ | Vớt con thuyền giấy dập dềnh dưới suối đêm ($x=1500$). |
| `SFX.tapeStick()` | Tiếng miết dải băng keo Washi hoa anh đào | Hàn gắn vết rách bức thư trên bàn ghép thư. |
| `SFX.mailboxOpen()` | Tiếng bản lề gỗ kẽo kẹt mở nắp | Mở hòm thư lấy bưu kiện mở đầu ($x=80$). |
| `SFX.allCollected()` | Chuỗi hợp âm khải hoàn $C - G - Am - F - C$ | Thu thập đủ 7 đóa hoa hồng và hoàn thiện thư. |

### 6.2. 4 Tầng Nhạc Nền Thích Ứng (Adaptive BGM Controller)
- **Nhịp độ**: $70\text{ BPM}$ thư thái, êm dịu (Lo-Fi Chiptune Aesthetic).
- **Tiến trình hợp âm**: `Fmaj7` $\rightarrow$ `G6` $\rightarrow$ `Em7` $\rightarrow$ `Am7` (Vòng hợp âm hoài niệm, da diết).
- **4 Tầng thích ứng (Stems)**:
  - **Stem 1 (Breeze Ambience)**: Tiếng gió lướt xào xạc tạo chiều sâu không gian (chạy xuyên suốt).
  - **Stem 2 (Lo-Fi Piano)**: Giai điệu piano rải arpeggio ngọt ngào (bật từ khi nhặt Hoa #1).
  - **Stem 3 (Cello Bass)**: Tiếng vĩ cầm trầm ấm nâng đỡ cảm xúc hoặc hòa vào tiếng mưa rào (bật từ Hoa #3 hoặc vùng mưa).
  - **Stem 4 (Glockenspiel Chimes)**: Giai điệu chuông ngọc lấp lánh như hộp nhạc thiên thần (bật từ Hoa #5 trở đi).
- **Kỹ thuật Lookahead Scheduling**: Đảm bảo nhịp điệu chính xác từng micro-giây, chuyển tầng âm lượng mượt mà $1.5\text{s}$ bằng `linearRampToValueAtTime`.

---

## 📊 7. Bảng Tra Cứu Toàn Bộ Lời Thoại (Master Script Reference)

| STT | Phân Cảnh | Vị trí / Kích hoạt | Nhân vật / Ngữ cảnh | Toàn văn lời thoại |
| :---: | :--- | :--- | :---: | :--- |
| **0.1** | Intro | Bắt đầu game dòng 1 | Dẫn chuyện | *"Hôm nay, mình muốn nói với bạn một điều..."* |
| **0.2** | Intro | Bắt đầu game dòng 2 | Dẫn chuyện | *"Nhưng trước tiên, mình phải tìm đến bạn."* |
| **0.3** | FPV Mailbox | Mở hòm thư dòng 1 ($x=200$) | Chàng trai | *"Một bưu kiện gửi đến hòm thư... Là cuốn sách hôm trước cậu ấy nhắc tới!"* |
| **0.4** | FPV Mailbox | Mở hòm thư dòng 2 ($x=200$) | Chàng trai | *"Mẩu giấy nhắn kẹp kèm theo... 'Đỉnh đồi Hoa Anh Đào'. Đây chính là địa chỉ nơi cậu ấy đang đợi!"* |
| **0.5** | FPV Mailbox | Mở hòm thư dòng 3 ($x=200$) | Chàng trai | *"Bức thư tình này mình đã nắn nót viết suốt bao đêm... Mình phải lên đường ngay để trao tận tay cậu ấy!"* |
| **1** | Thought #1 | Nhặt Hoa #1 ($x=220$) | Độc thoại nội tâm | *"Ngày hôm ấy, trời chẳng nắng cũng chẳng mưa... Nhưng khoảnh khắc cậu quay đầu lại cười, thế giới của mình tự nhiên có màu."* |
| **1.8** | Stand Hint | Bấm [E] khi chưa ngồi ghế ($x=450$) | Độc thoại nội tâm | *"Mình nên ngồi xuống ghế nghỉ chân một chút..."* |
| **1.9** | Empty Bench Sit | Ngồi xuống ghế sau khi rách thư ($x=450$) | Độc thoại nội tâm | *"Chiếc ghế giờ chỉ còn lại mình... Bức thư đã bị gió cuốn đi, mình phải tìm lại cho bằng được!"* |
| **2** | Thought #2 | Nhặt Hoa #2 ($x=450$) | Độc thoại nội tâm | *"Cậu từng bảo cậu thích những điều giản dị như ngắm một chú mèo ngủ ngoan... Còn mình, mình chỉ thích nhìn cậu kể về những điều giản dị ấy với đôi mắt lấp lánh."* |
| **2.1** | FPV Cat | Ngồi bấm [E] vuốt mèo dòng 1 ($x=450$) | Chàng trai | *"Bộ lông ấm áp thật đấy... Ngoan quá. Mình đặt bức thư tỏ tình ở đây một chút nhé, nắn nót viết mãi mới xong đấy..."* |
| **2.2** | FPV Cat | Vuốt mèo dòng 2 ($x=450$) | Chàng trai | *"Ô kìa, chú mèo cựa mình vươn móng vuốt... Mèo ơi đừng cào vào phong bì thư!"* |
| **2.3** | FPV Cat | Mèo xé thư & chạy mất ($x=450$) | Chàng trai | *"Gió bất ngờ thổi thốc qua cuốn 3 mảnh thư bay vút đi! Chú mèo cũng giật mình phóng chạy... Mình phải đuổi theo ngay!"* |
| **2.5** | Swing Hesitation | Ngồi xích đu dưới mưa ($x=680$) | Độc thoại nội tâm | *"Đến cả một bức thư cũng không giữ trọn vẹn được... thì lấy tư cách gì để bước tới trước mặt người ta?"* |
| **2.6** | Swing Courage | Nhìn nhành hoa dại bên xích đu | Độc thoại nội tâm | *"Bức thư có thể rách, nhưng lòng chân thành của mình đâu có rách! Dù có phải lội qua cả cơn bão này, mình cũng nhất định phải đi tới cùng!"* |
| **3** | Thought #3 | Nhặt Hoa #3 ($x=850$) | Độc thoại nội tâm | *"Có những đêm nằm nghe tiếng mưa rơi, mình mở lại từng dòng tin nhắn cũ... Đọc từng câu chữ ngốc nghếch rồi tự cười một mình. Hóa ra nhớ một người là cảm giác như thế."* |
| **3.1** | FPV Rain | Che ô dưới mưa dòng 1 ($x=980$) | Chàng trai | *"Tiếng mưa rơi tí tách trên mặt ô nghe thật êm đềm..."* |
| **3.2** | FPV Rain | Che ô dưới mưa dòng 2 ($x=980$) | Chàng trai | *"Chiếc ô này ngày ấy quá nhỏ cho cả hai... nhưng em lại cố tình nép sát vào vai anh. Mưa làm ướt một bên áo, mà tim anh lúc đó lại ấm lạ thường."* |
| **4.1** | FPV Lamp Reach | Tới chân đèn đường dòng 1 ($x=1150$) | Chàng trai | *"Ánh đèn đường soi rọi qua màn mưa... Kìa, trên cành cây sát chao đèn có một mảnh giấy màu nâu!"* |
| **4.2** | FPV Lamp Reach | Nhận diện Mảnh #1 dòng 2 ($x=1150$) | Chàng trai | *"Đúng là Mảnh #1 rồi! 'Cậu có nhớ lần đầu tiên chúng mình ngồi trú mưa ở hiên quán cũ không? Cậu chia cho mình nửa chiếc bánh quy...' Mình phải nhảy lên lấy lại mới được!"* |
| **4.3** | FPV Lamp Reach | Nhảy bắt được Mảnh #1 dòng 3 | Chàng trai | *"Bắt được rồi! May quá, con chữ vẫn còn nguyên vẹn. Cố lên, mình sẽ tìm lại đủ cả 3 mảnh!"* |
| **4** | Thought #4 | Nhặt Hoa #4 ($x=1150$) | Độc thoại nội tâm | *"Những ngày lòng mình nhiều mây đen và giông bão nhất... Chỉ cần nghĩ đến việc có cậu ở phía trước, mọi mỏi mệt bỗng chốc hóa dịu dàng."* |
| **5.1** | FPV Boat Retrieve | Bấm [E] vớt thuyền giấy dòng 1 ($x=1500$) | Chàng trai | *"Một chiếc thuyền giấy đang trôi dưới suối đêm... Bên trong chở một mảnh thư!"* |
| **5.2** | FPV Boat Retrieve | Nâng thuyền & đọc Mảnh #2 dòng 2 | Chàng trai | *"Mảnh #2: 'Có những đêm nghe cậu thở dài vì mệt mỏi, mình chỉ ước có thể mang cho cậu một ly trà ấm. Mình sợ sự vụng về làm phiền cậu, nên chỉ biết lặng lẽ thức cùng cậu...'"* |
| **5.3** | FPV Boat Retrieve | Đọc Mảnh #2 dòng 3 | Chàng trai | *"Từng con chữ ướt sương đêm nhưng vẫn vẹn nguyên tấm lòng... Chỉ còn một mảnh nữa thôi!"* |
| **5** | Thought #5 | Nhặt Hoa #5 ($x=1500$) | Độc thoại nội tâm | *"Cậu từng bảo ánh sáng đom đóm quá đỗi mong manh... Nhưng cậu biết không, đôi khi chỉ cần một đốm sáng nhỏ nơi ánh mắt cậu, cũng đủ để mình không bao giờ lạc đường."* |
| **6** | Thought #6 | Nhặt Hoa #6 ($x=1750$) | Độc thoại nội tâm | *"Mỗi bản nhạc mình nghe, mỗi góc phố mình từng đi qua... Bằng một cách kỳ diệu nào đó, tâm trí mình đều vô thức dẫn về phía cậu."* |
| **6.1** | FPV Cat Chase | Chạm mặt mèo bìa rừng dòng 1 ($x=1800$) | Chàng trai | *"Chú mèo tam thể ở ghế đá kìa! Trên miệng nó... chính là Mảnh thư #3! Mèo ơi đứng lại đã!"* |
| **6.2** | FPV Cat Chase | Dỗ dành mèo dòng 2 ($x=1800$) | Chàng trai | *"Chú mèo dừng lại rồi... Ngoan nào, đừng sợ, anh không làm đau em đâu."* |
| **6.3** | FPV Cat Chase | Đọc Mảnh #3 & vuốt ve dòng 3 | Chàng trai | *"Mảnh #3: 'Hôm nay, mình gom hết tất cả sự can đảm tích cóp từ những ngày tháng ngắm nhìn cậu từ xa... Dù câu trả lời có là gì, cảm ơn cậu vì đã xuất hiện trong thanh xuân của mình.' Cả 3 mảnh đã đủ rồi!"* |
| **7** | Thought #7 | Nhặt Hoa #7 ($x=2100$) | Độc thoại nội tâm | *"Và bông hoa này... là tất cả dũng khí mình gom góp bấy lâu nay. Để hôm nay, mình có thể đứng trước mặt cậu mà không còn ngập ngừng."* |
| **7.5** | Crafting Complete | Hoàn tất dán thư trên bàn pixel ($x=2210$) | Độc thoại nội tâm | *"Bức thư đã được hàn gắn lại trọn vẹn bằng những dải băng hoa anh đào... Giờ mình có thể tự tin bước tới gặp em!"* |
| **8.1** | FPV Cherry Entrance | Bước vào cổng vườn đào dòng 1 ($x=130$) | Chàng trai | *"Khu vườn hoa anh đào... Khung cảnh nơi đây rực rỡ và bình yên đến nghẹn ngào."* |
| **8.2** | FPV Cherry Entrance | Bước vào cổng vườn đào dòng 2 ($x=130$) | Chàng trai | *"Từng cánh hoa đào đang rơi phấp phới trong làn gió xuân... Đẹp tựa như một giấc mơ vậy."* |
| **8.3** | FPV Cherry Entrance | Bước vào cổng vườn đào dòng 3 ($x=130$) | Chàng trai | *"Cô ấy đang đứng đợi mình trên đỉnh đồi kia rồi. Mình phải bước tiếp lên gặp cậu ấy ngay!"* |
| **12.1** | Reunion | Gặp bạn gái dòng 1 ($x=2050$ Map 2) | Anh | *"Gió sớm khẽ lay lọn tóc em... Cuối cùng, anh cũng đã đến được nơi này."* |
| **12.2** | Reunion | Gặp bạn gái dòng 2 ($x=2050$ Map 2) | Em | *"Em đã đợi anh rất lâu rồi... Thật mừng vì anh đã tới!"* |
| **12.3** | Reunion | Gặp bạn gái dòng 3 ($x=2050$ Map 2) | Anh | *"Gió bão dọc đường đã xé rách bức thư anh viết... Nhưng anh đã nhặt lại từng mảnh, dán lại phẳng phiu cùng 7 đóa hoa này gửi trao em."* |
| **12.4** | Reunion | Gặp bạn gái dòng 4 ($x=2050$ Map 2) | Em | *"Từng vết dán hoa đào này... thật đẹp và ấm áp. Cảm ơn anh vì đã không bỏ cuộc để mang trọn vẹn chân thành đến đây cùng em!"* |
| **13** | Ending | Thiệp trượt từ dưới lên | Thiệp tỏ tình | **"I LOVE U"** (Bức thư viết tay kèm hào quang trái tim dạ quang) |
| **14** | Easter Egg | Kích hoạt sau bức thư "I LOVE U" | Cuốn Sách Kỷ Niệm 3D | Cuốn sách lật trang 3D (*StPageFlip*) gồm 8 mặt trang kể câu chuyện thật của **Lyche & Ánh** (kỷ niệm công viên nước, cái nắm tay đón sóng không buông, những tin nhắn khuya thường nhật, nụ cười và lời ngỏ chân thành). |

---

## 📖 8. Cuốn Sách Kỷ Niệm 3D (Easter Egg Storybook — Lyche & Ánh)

- **Vị trí & Ý nghĩa**: Phần thưởng bí mật sau màn kết "I LOVE U", khép lại chuyến phiêu lưu trong game và mở ra chương mới ngoài đời thực cho **Lyche (tớ)** và **Ánh (cậu)**.
- **Quy cách**: 4 tờ (Sheets) — 8 mặt trang mô phỏng giấy da cừu (vintage parchment) và bìa da mận thẫm ép nhũ hoàng gia.
- **Tóm tắt 8 mặt trang**:
  1. **Bìa Trước**: *Kỷ Niệm Của Chúng Mình* — Lời đề tặng dành riêng cho Ánh, chữ ký *LYCHE GỬI ÁNH*.
  2. **Trang 1**: *Ngày Nắng Mưa & Công Viên Nước (Nơi Vịnh Kỳ Diệu)* — Ngày vừa nắng vừa mưa cùng nhóm bạn, khởi đầu cho những rung động êm đềm.
  3. **Trang 2**: *Ngọn Sóng & Cái Nắm Tay (Khoảnh khắc ngưng đọng)* — Cùng nhau đón đầu ngọn sóng thần, sóng tan nhưng bàn tay vẫn siết chặt không buông, ánh mắt e thẹn ngập ngừng.
  4. **Trang 3**: *Những Câu Chuyện Thường Nhật (Dịu dàng từng ngày trôi qua)* — Những tin nhắn vu vơ từ sáng đến khuya, lời chúc ngủ ngon dịu dàng đưa vào giấc ngủ.
  5. **Trang 4**: *Nụ Cười & Sự Thấu Hiểu (Những điều tớ trân quý ở Ánh)* — Nụ cười và đôi mắt biết cười mang lại bình yên lạ kỳ; trân trọng sự lắng nghe và thấu hiểu.
  6. **Trang 5**: *Tâm Tình Gửi Cậu (Chân thành từ đáy lòng)* — Thổ lộ chân thành không áp lực, trân quý từng khoảnh khắc và mong ước đồng hành qua mọi ngày nắng mưa.
  7. **Trang 6**: *Lời Ngỏ Chân Thành (Cùng nhau bước sang trang mới)* — Lời tỏ tình ngọt ngào: mong muốn được chăm sóc Ánh mỗi ngày và chính thức làm bạn trai của cậu.
  8. **Trang 7 (Bìa Sau)**: *Met — A Tiny Love Story* — Lời bạt kết cuốn: *“Gặp được nhau giữa vạn người là duyên số, nắm chặt tay nhau là sự lựa chọn của trái tim.”*

---

## 📜 9. Quy Tắc Duy Trì & Cập Nhật (Maintenance Directive)

1. Khi người dùng yêu cầu chỉnh sửa, thêm bớt bất kỳ chi tiết nào về cốt truyện, lời thoại, góc nhìn hay mỹ thuật.
2. **Hành động bắt buộc**:
   - Cập nhật mã nguồn tương ứng (`src/lib/level-data.ts`, `src/components/first-person-view.tsx`, `src/lib/sound.ts`, `src/lib/book-content.ts`, ...).
   - **Lập tức mở và cập nhật tệp này (`knowledge/storyline-and-atmosphere.md`)** để đảm bảo tính nhất quán của cuốn kịch bản gốc.
