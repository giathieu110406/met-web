# Kế hoạch Triển khai Ô Đăng Nhập Màn Hình Khóa Hoa (Flower Login Lockscreen)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thay thế ô game ban đầu bằng ô đăng nhập PIN lãng mạn chuẩn pixel theo ảnh 1 (mật khẩu chính thức: **1406**). Khi bấm từng số thì hoa rơi xuống từ ô bấm rồi tự biến mất; khi bấm phím thứ 4 đúng mật khẩu (phím số 6), toàn bộ hoa từ ô đấy bung nở tràn ngập toàn màn hình; giữ biển hoa trong 3 giây rồi biến mất để hiển thị màn hình game hoàn chỉnh.

**Architecture:** Sử dụng kiến trúc hướng sự kiện nhẹ nhàng (Ponytail ladder - Native React 19 + Canvas 2D Particles + CSS Transitions). Không cài thêm thư viện thừa. Canvas 2D chịu trách nhiệm vẽ các bông hoa rơi từ tọa độ nút bấm và vụ nổ hoa hướng tâm; component quản lý state luồng chuyển đổi giữa Ô đăng nhập -> Hiệu ứng nở hoa -> Toàn màn hình 3s -> Fade-out vào `<Game />`.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, HTML5 Canvas 2D API, Web Audio API (âm thanh tinh tế), Playwright CLI (kiểm thử e2e tự động).

**Spec & Assets:**
- Mẫu giao diện: `C:\Users\Tran Gia Thieu\Downloads\Project mẫu\ảnh 1.jpg`
- 13 ảnh hoa chất lượng cao: `C:\Users\Tran Gia Thieu\Downloads\Project mẫu\Ảnh hoa` -> `public/assets/flowers/flower-[1..13].png`
- Ảnh chân dung: `public/assets/lockscreen/portrait.jpg`
- Biển hoa tràn màn hình: `public/assets/lockscreen/flower-bg-full.jpg`

## Global Constraints

- **Minimal Blast Radius:** Không làm ảnh hưởng tới logic game hiện hữu trong `src/components/game.tsx`. Game giữ nguyên 100% chức năng.
- **Zero Heavy Dependencies (Ponytail):** Tận dụng tối đa HTML5 Canvas 2D cho hạt hoa thay vì import các thư viện animation nặng nề.
- **Pixel Perfection:** Kích thước, màu sắc (#e11d48, #fff0f5, viền bo 36px/22px, đổ bóng) khớp chính xác với ảnh mẫu 1.
- **Timing Constraint:** Biển hoa hiển thị đúng 3 giây trước khi kích hoạt hiệu ứng fade-out vào game.

---

### Task 1: Module Hạt Hoa Rơi & Bung Nở (Canvas Flower Particle Engine)

**Files:**
- Create: `src/components/flower-login/flower-canvas.tsx`
- Create: `src/components/flower-login/particle-engine.ts`

**Interfaces:**
- Consumes: 13 ảnh hoa trong `/assets/flowers/flower-[1..13].png`
- Produces: 
  - `spawnFallingFlowers(originX: number, originY: number, count?: number)`: Tạo 3-5 bông hoa rơi từ tọa độ phím bấm
  - `triggerRadialBloom(originX: number, originY: number)`: Kích hoạt vụ nổ hoa hướng tâm từ ô số cuối cùng tràn màn hình

- [ ] **Step 1: Viết Engine tính toán vật lý hạt hoa (`particle-engine.ts`)**
  - Quản lý mảng hạt hoa: `x, y, vx, vy, gravity, rotation, rotSpeed, scale, opacity, flowerImgIndex`.
  - Cập nhật hạt rơi: `vy += gravity`, `x += vx`, `opacity -= fadeSpeed`.
  - Cập nhật hạt bung nổ (radial bloom): bắn ra 360 độ từ tọa độ `(originX, originY)` với vận tốc lớn hướng ra các mép màn hình.
  - Tự động giải phóng (garbage collect) khi hạt ra khỏi màn hình hoặc `opacity <= 0`.

- [ ] **Step 2: Viết Component Canvas toàn màn hình (`flower-canvas.tsx`)**
  - Canvas gắn cố định `fixed inset-0 pointer-events-none z-50`.
  - Tiền tải sẵn (preload) 13 ảnh hoa vào RAM khi mount để render 60fps không bị giật lag.
  - Vòng lặp `requestAnimationFrame` tối ưu (dừng khi mảng hạt rỗng để tiết kiệm CPU/pin).

- [ ] **Step 3: Kiểm chứng TypeScript & Build**
  - Chạy `npx tsc --noEmit` đảm bảo không lỗi kiểu dữ liệu.

---

### Task 2: Component Ô Đăng Nhập Chuẩn Pixel (`FlowerLoginModal`)

**Files:**
- Create: `src/components/flower-login/flower-login-modal.tsx`
- Create: `src/components/flower-login/sound.ts`

**Interfaces:**
- Consumes: `particle-engine.ts`, `/assets/lockscreen/portrait.jpg`
- Produces: Component giao diện modal đăng nhập với bàn phím số 3x4, trái tim, 4 chấm PIN và callback `onSuccess(lastButtonRect: DOMRect)`.

- [ ] **Step 1: Viết module âm thanh Web Audio (`sound.ts`)**
  - Âm thanh click phím nhẹ nhàng và âm thanh harp ngân vang khi mở khóa thành công.

- [ ] **Step 2: Dựng layout chuẩn pixel theo `ảnh 1.jpg`**
  - Kích thước card: `w-[720px] min-h-[480px] rounded-[36px] bg-white/95 border border-white/80 shadow-[0_20px_60px_-10px_rgba(244,114,182,0.25)]`.
  - Cột trái: Ảnh chân dung `portrait.jpg` bo góc `rounded-[22px]`.
  - Cột phải:
    - Icon trái tim màu `#e11d48`.
    - 4 chấm tròn PIN: Rỗng (`border-2 border-rose-500 bg-transparent`), Đầy (`bg-[#e11d48] border-[#e11d48]`).
    - Bàn phím số 3x4: Nút số `1-9, 0` màu `#e11d48` font bold 28px; Nút xóa hình thẻ bài đỏ kèm dấu `✕` trắng.
  - Hỗ trợ cả click chuột lẫn bàn phím vật lý (0-9, Backspace).

- [ ] **Step 3: Tích hợp hiệu ứng hoa rơi theo tọa độ phím bấm**
  - Khi click vào bất kỳ nút nào, lấy `e.currentTarget.getBoundingClientRect()`.
  - Gọi `spawnFallingFlowers(rect.left + rect.width / 2, rect.top + rect.height / 2)`.
  - Hoa rơi xuống tự nhiên và tự mờ biến mất sau ~1s.

- [ ] **Step 4: Kiểm tra xác thực mã PIN**
  - Cấu hình mật khẩu (mặc định chấp nhận mã chuẩn hoặc bất kỳ mã 4 số được cấu hình, ví dụ `2024`).
  - Khi bấm ký tự thứ 4 đúng: lấy tọa độ phím thứ 4 và kích hoạt `onSuccess(lastRect)`.

---

### Task 3: Bộ Điều Khiển Luồng & Hiệu Ứng Biển Hoa 3 Giây Chuyển Vào Game

**Files:**
- Modify: `src/app/(root)/page.tsx`
- Create: `src/components/flower-login/index.tsx`

**Interfaces:**
- Consumes: `FlowerLoginModal`, `FlowerCanvas`, `Game` (`src/components/game.tsx`)
- Produces: Trang chủ chính kết nối luồng từ Login -> Hoa tràn màn hình (3s) -> Màn hình Game.

- [ ] **Step 1: Xây dựng State Transition**
  - Trạng thái `loginState`: `'locked' | 'blooming' | 'holding_3s' | 'fade_to_game' | 'game'`.
  - Khi `onSuccess(rect)` được gọi:
    1. Kích hoạt `triggerRadialBloom(rect.x, rect.y)` từ đúng ô số cuối.
    2. Cụm hoa nở to và lớp biển hoa `flower-bg-full.jpg` phóng to phủ kín 100% màn hình.
    3. Đặt bộ đếm thời gian: giữ nguyên biển hoa trong đúng 3000ms (3 giây).
    4. Sau 3000ms: kích hoạt CSS class `opacity-0 scale-105 duration-800` để làm biển hoa biến mất mượt mà.
    5. Kết thúc transition: chuyển sang hiển thị `<Game />` trọn vẹn.

- [ ] **Step 2: Ghép vào `src/app/(root)/page.tsx`**
  - Thay thế trực tiếp `<Game />` bằng luồng đăng nhập có kiểm soát này.

---

### Task 4: Kiểm Thử Tự Động & Thẩm Tra Trực Quan với Playwright CLI

**Files:**
- Script kiểm thử Playwright tự động hoặc chạy qua `playwright-cli`

- [ ] **Step 1: Kiểm thử màn hình ban đầu (State Locked)**
  - Chạy `playwright-cli goto http://localhost:3000`.
  - Kiểm tra ô đăng nhập hiển thị thay vì màn hình game. Chụp screenshot đối chiếu với `ảnh 1.jpg`.

- [ ] **Step 2: Kiểm thử tương tác bấm phím & hoa rơi**
  - Click các phím số `2`, `0`, `2`.
  - Xác nhận các hạt hoa rơi xuất hiện từ tọa độ phím bấm và tự biến mất sau 1s.

- [ ] **Step 3: Kiểm thử phím cuối cùng & hoa bung tràn màn hình**
  - Click phím số thứ 4 (`4`).
  - Xác minh tất cả hoa bung ra từ tâm phím `4`, tràn ngập toàn màn hình.

- [ ] **Step 4: Kiểm thử giữ 3 giây và chuyển cảnh vào Game**
  - Đếm thời gian: trong 3s đầu tiên hoa vẫn tràn màn hình.
  - Sau 3s: hiệu ứng mờ dần biến mất, màn hình Game (`Met — A TINY LOVE STORY`) xuất hiện đầy đủ và chơi được bình thường.
