// Level data and narrative milestones for the cozy story-driven "Met" game

export interface StoryMilestone {
  flowerId: number;
  x: number;
  text: string;
}

export const STORIES: StoryMilestone[] = [
  {
    flowerId: 1,
    x: 220,
    text: 'Ngày hôm ấy, trời có cả nắng và mưa... Nhưng khi khoảnh khắc em quay đầu lại cười, thế giới trong anh như ngập tràn thêm ngàn màu sắc.',
  },
  {
    flowerId: 2,
    x: 450,
    text: 'Em từng bảo em thích những điều giản dị như ngắm một chú mèo hay 1 chú chó... Còn anh, anh chỉ thích nhìn em kể về những điều giản dị ấy với đôi mắt lấp lánh.',
  },
  {
    flowerId: 3,
    x: 850,
    text: 'Có những đêm nằm nghe tiếng mưa rơi, anh mở lại từng dòng tin nhắn cũ... Đọc từng câu chữ ngốc nghếch rồi tự cười một mình. Hóa ra nhớ một người là cảm giác như thế.',
  },
  {
    flowerId: 4,
    x: 1150,
    text: 'Những ngày lòng mình nhiều mây đen và giông bão nhất... Chỉ cần nghĩ đến việc có em ở phía trước, mọi mỏi mệt bỗng chốc hóa dịu dàng.',
  },
  {
    flowerId: 5,
    x: 1500,
    text: 'Em nhìn xem, ánh sáng đom đóm quá đỗi mong manh... Nhưng em biết không, đôi khi chỉ cần một đốm sáng nhỏ nơi ánh mắt em, cũng đủ để mình không bao giờ lạc đường.',
  },
  {
    flowerId: 6,
    x: 1750,
    text: 'Mỗi bản nhạc anh nghe, mỗi góc phố mình từng đi qua... Bằng một cách kỳ diệu nào đó, tâm trí mình đều vô thức dẫn về phía em.',
  },
  {
    flowerId: 7,
    x: 2100,
    text: 'Và bông hoa này... là tất cả dũng khí anh gom góp bấy lâu nay. Để hôm nay, anh có thể đứng trước mặt em mà không còn ngập ngừng.',
  },
];

export interface LetterFragmentData {
  id: number;
  x: number;
  y: number;
  title: string;
  excerpt: string;
  hint: string;
  type: 'tree-branch' | 'paper-boat' | 'cat-pounce';
}

export const LETTER_FRAGMENTS: LetterFragmentData[] = [
  {
    id: 1,
    x: 1150,
    y: 235,
    title: 'Mảnh #1: Kỷ Niệm Ngày Đầu Tiên',
    excerpt: 'Em có nhớ lần đầu tiên tắm mưa rồi dạo chơi không? Chúng ta cùng ngồi trú dưới mái hiên, ánh mắt em thì rất hồn nhiên, còn anh thì ngại ngùng, lúng túng không biết bắt chuyện nên chẳng dám nhìn thẳng vào ánh mắt ấy...',
    hint: 'Nhìn lên ngọn đèn đường [E] để với lấy mảnh thư',
    type: 'tree-branch',
  },
  {
    id: 2,
    x: 1500,
    y: 295,
    title: 'Mảnh #2: Những Đêm Lắng Nghe',
    excerpt: 'Có những đêm nghe em thở dài vì mệt mỏi, anh chỉ ước có thể mang cho cậu một ly trà ấm. Anh sợ sự vụng về làm phiền em, nên chỉ biết lặng lẽ thức cùng em...',
    hint: 'Vớt con thuyền giấy dập dềnh trên mặt suối [E]',
    type: 'paper-boat',
  },
  {
    id: 3,
    x: 1800,
    y: 295,
    title: 'Mảnh #3: Lời Chưa Dám Nói',
    excerpt: 'Hôm nay, anh gom hết tất cả sự can đảm tích cóp từ những ngày tháng ngắm nhìn em từ xa. Nếu không bước đến nói thật lòng mình, anh sẽ hối tiếc cả đời... Dù câu trả lời có là gì, cảm ơn em vì đã xuất hiện trong thanh xuân của mình.',
    hint: 'Dỗ dành chú mèo bìa rừng [E] để nhận lại mảnh thư',
    type: 'cat-pounce',
  },
];

export interface CollectibleData {
  id: number;
  x: number;
  y: number;
  type: 'bloom' | 'cat' | 'falling' | 'lamp' | 'fireflies' | 'high-hop' | 'dawn';
}

export interface DecorationData {
  id: number;
  x: number;
  y: number;
  type: 'flower-small' | 'grass-tuft' | 'butterfly';
  color?: string;
}

export interface SpawnPoint {
  x: number;
  y: number;
}

export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 400;

export const LEVEL = {
  mapWidth: 2400,
  mapHeight: 400,

  // Smooth walking physics
  gravity: 0.6,
  jumpForce: -8.5,
  moveSpeed: 3.2,
  maxFallSpeed: 8,
  heroWidth: 48,
  heroHeight: 64,

  // Continuous ground (flat path for romantic walk)
  grounds: [
    { x: 0, width: 2400, y: 320, type: 'ground' as const },
  ],

  // Platforms (none - flat romantic path)
  platforms: [] as { x: number; width: number; y: number; type: 'floating' | 'solid' }[],

  // 7 Unique Collectible roses along the path
  collectibles: [
    { id: 1, x: 220, y: 290, type: 'bloom' as const },
    { id: 2, x: 450, y: 290, type: 'cat' as const },
    { id: 3, x: 850, y: 280, type: 'falling' as const },
    { id: 4, x: 1150, y: 290, type: 'lamp' as const },
    { id: 5, x: 1520, y: 300, type: 'fireflies' as const },
    { id: 6, x: 1750, y: 290, type: 'dawn' as const },
    { id: 7, x: 2100, y: 290, type: 'dawn' as const },
  ],

  // Props and milestones
  props: {
    mailbox: { x: 200, y: 272, width: 32, height: 48 },
    swing: { x: 680, y: 252 },
    cat: { x: 450, y: 302 },
    bench: { x: 450, y: 304 },
    bridge: { x: 790, y: 296, width: 120 },
    lampPost: { x: 1150, y: 208, width: 32, height: 112 },
    starBridge: { x: 1600, y: 296, width: 130 },
    cherryTree: { x: 2260, y: 254 },
    craftingTable: { x: 2210, y: 300 },
  },

  // Atmospheric zones (based on cameraX or hero position)
  zones: {
    sunset: { start: 0, end: 600 },
    rain: { start: 600, end: 1350 },
    starryNight: { start: 1350, end: 1900 },
    dawn: { start: 1900, end: 2400 },
  },

  // Environmental decorations
  decorations: [
    { id: 1, x: 90, y: 308, type: 'flower-small' as const, color: '#f0abfc' },
    { id: 2, x: 140, y: 310, type: 'grass-tuft' as const },
    { id: 3, x: 300, y: 308, type: 'flower-small' as const, color: '#fbbf24' },
    { id: 4, x: 370, y: 310, type: 'grass-tuft' as const },
    { id: 5, x: 550, y: 200, type: 'butterfly' as const, color: '#c4b5fd' },
    { id: 6, x: 615, y: 308, type: 'flower-small' as const, color: '#f9a8d4' },
    { id: 7, x: 740, y: 310, type: 'grass-tuft' as const },
    { id: 8, x: 980, y: 310, type: 'grass-tuft' as const },
    { id: 9, x: 1040, y: 190, type: 'butterfly' as const, color: '#fca5a5' },
    { id: 10, x: 1250, y: 310, type: 'grass-tuft' as const },
    { id: 11, x: 1380, y: 308, type: 'flower-small' as const, color: '#fde68a' },
    { id: 12, x: 1450, y: 310, type: 'grass-tuft' as const },
    { id: 13, x: 1620, y: 308, type: 'flower-small' as const, color: '#c4b5fd' },
    { id: 14, x: 1720, y: 310, type: 'grass-tuft' as const },
    { id: 15, x: 1950, y: 308, type: 'flower-small' as const, color: '#f0abfc' },
    { id: 16, x: 2050, y: 310, type: 'grass-tuft' as const },
    { id: 17, x: 2200, y: 308, type: 'flower-small' as const, color: '#f43f5e' },
  ],

  heroSpawn: { x: 40, y: 256 } as SpawnPoint,
  companionPos: { x: 2320, y: 256 } as SpawnPoint,
};

// Map 2: Cherry Blossom Garden & Hill (an arduous, winding mountain ascent across 2200px)
export const HILL_LEVEL = {
  mapWidth: 2200,
  mapHeight: 400,
  // Undulating curved ground ascending from left (y: 320) across 1850px of rolling crests to summit (y: 265)
  grounds: [
    { x: 0, width: 1850, y: 320, endY: 265, type: 'hill-curve' as const },
    { x: 1850, width: 350, y: 265, type: 'ground' as const },
  ],
  heroSpawn: { x: 40, y: 256 } as SpawnPoint,
  companionPos: { x: 2050, y: 201 } as SpawnPoint,
  cherryTree: { x: 1940, y: 73 },
};
