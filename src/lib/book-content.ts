export interface BookPageSide {
  id: string;
  pageNumber?: number;
  type: 'cover' | 'story' | 'letter' | 'back-cover';
  title?: string;
  subtitle?: string;
  paragraphs?: string[];
  quote?: string;
  tag?: string;
  signature?: string;
}

export interface BookSheet {
  id: number;
  front: BookPageSide;
  back: BookPageSide;
}

/**
 * Danh sách các trang sách kỷ niệm (Easter Egg).
 * Cấu trúc tinh gọn, ấm áp, văn phong dịu dàng chuẩn bị cho câu chuyện của hai bạn.
 */
export const DEFAULT_BOOK_SHEETS: BookSheet[] = [
  // Sheet 0: Bìa trước & Trang 1
  {
    id: 0,
    front: {
      id: 'cover-front',
      type: 'cover',
      title: 'Kỷ Niệm Của Chúng Mình',
      subtitle: 'Món quà mang theo suốt chuyến hành trình',
      tag: 'Kỷ Niệm Của Chúng Mình',
      paragraphs: [
        'Một cuốn sách nhỏ gom nhặt những điều dịu dàng nhất, dành riêng cho Ánh...',
      ],
      quote: '“Gặp được người mình thương, mọi bước chân đều hóa dịu dàng.”',
      signature: 'LYCHE GỬI ÁNH',
    },
    back: {
      id: 'page-1',
      pageNumber: 1,
      type: 'story',
      title: 'Ngày Nắng Mưa & Công Viên Nước',
      subtitle: 'Nơi Vịnh Kỳ Diệu',
      paragraphs: [
        'Hôm ấy là một ngày thật đặc biệt, bầu trời vừa lất phất mưa rồi lại bừng nắng nhẹ.',
        'Tớ cùng cậu và nhóm bạn hòa mình vào không khí rộn rã nơi công viên nước, giữa tiếng cười đùa và những làn sóng mát rượi.',
        'Tớ chẳng nghĩ rằng một ngày tưởng chừng bình thường ấy, lại là điểm khởi đầu cho những rung động êm đềm nhất trong tớ.',
      ],
      quote: '“Có những cuộc gặp gỡ, chỉ một khoảnh khắc cũng đủ khắc sâu vào ký ức.”',
    },
  },

  // Sheet 1: Trang 2 & Trang 3
  {
    id: 1,
    front: {
      id: 'page-2',
      pageNumber: 2,
      type: 'story',
      title: 'Ngọn Sóng & Cái Nắm Tay',
      subtitle: 'Khoảnh khắc ngưng đọng',
      paragraphs: [
        'Khi trò chơi sóng thần bắt đầu, từng đợt sóng dồn dập cuộn trào. Giữa làn nước xô đẩy, tớ và cậu đã nắm chặt lấy tay nhau để cùng đón đầu con sóng lớn.',
        'Thế rồi con sóng ào qua, bọt nước tan đi... nhưng bàn tay tớ vẫn chẳng buông, và tay cậu vẫn ở nguyên trong tay tớ.',
        'Cậu e thẹn, ngượng ngùng cúi đầu. Còn tớ khi ấy tim cũng đập loạn nhịp, chỉ biết vụng về nắm chặt hơn một chút.',
      ],
      quote: '“Sóng có thể ào qua rất nhanh, nhưng hơi ấm nơi bàn tay thì còn mãi.”',
    },
    back: {
      id: 'page-3',
      pageNumber: 3,
      type: 'story',
      title: 'Những Câu Chuyện Thường Nhật',
      subtitle: 'Dịu dàng từng ngày trôi qua',
      paragraphs: [
        'Sau ngày hôm ấy, khoảng cách dường như ngắn lại tự bao giờ qua những dòng tin nhắn nối tiếp nhau không dứt.',
        'Từ những mẩu chuyện vu vơ chẳng đầu chẳng đuôi, những điều nhỏ nhặt trong ngày, cho đến những lời chúc ngủ ngon dịu dàng lúc đêm muộn.',
        'Không vội vã, không ồn ào, từng chút quan tâm nhẹ nhàng len lỏi vào cuộc sống thường ngày của tớ.',
      ],
      quote: '“Hạnh phúc đôi khi chỉ là sau một ngày dài, luôn có một người để sẻ chia.”',
    },
  },

  // Sheet 2: Trang 4 & Trang 5
  {
    id: 2,
    front: {
      id: 'page-4',
      pageNumber: 4,
      type: 'letter',
      title: 'Nụ Cười & Sự Thấu Hiểu',
      subtitle: 'Những điều tớ trân quý ở Ánh',
      paragraphs: [
        'Có những điều ở cậu làm tớ xao xuyến hơn tất thảy. Là nụ cười dịu dàng và đôi mắt biết cười mỗi khi cậu vui vẻ kể một câu chuyện nào đó.',
        'Chỉ cần nhìn thấy ánh mắt ấy, bao bộn bề mệt mỏi trong tớ dường như đều tan biến, chỉ còn lại sự bình yên đến lạ.',
        'Và tớ trân trọng cả sự ân cần lắng nghe, cách cậu thấu hiểu và sẻ chia những điều nhỏ bé nhất cùng tớ.',
      ],
      quote: '“Bình yên nhất là khi tìm thấy một ánh mắt hiểu được những điều mình chưa kịp nói.”',
    },
    back: {
      id: 'page-5',
      pageNumber: 5,
      type: 'letter',
      title: 'Những Điều Giản Đơn',
      subtitle: 'Vì có cậu ở đây',
      paragraphs: [
        'Trước khi gặp cậu, thế giới của tớ trôi qua khá đơn điệu — chỉ là những con đường quen thuộc, những ngày làm việc lặp lại và những buổi chiều tan tầm vội vã.',
        'Nhưng từ ngày cậu xuất hiện, mọi thứ bỗng chốc có thêm màu sắc. Một bản nhạc hay, một buổi chiều hoàng hôn đẹp, hay chỉ là quán ăn nhỏ bên đường... tớ đều bất giác nghĩ đến cậu đầu tiên.',
        'Hóa ra điều tuyệt vời nhất không phải là đi đến những chân trời xa xôi, mà là giữa thành phố tấp nập này, tớ biết luôn có một người khiến mình mỉm cười mỗi khi nhớ về.',
      ],
      quote: '“Hạnh phúc đôi khi chỉ là tìm được một người để cùng ăn những bữa cơm bình dị và sẻ chia những điều nhỏ nhặt.”',
      signature: 'Thương cậu thật nhiều',
    },
  },

  // Sheet 3: Trang 6 & Bìa sau
  {
    id: 3,
    front: {
      id: 'page-6',
      pageNumber: 6,
      type: 'letter',
      title: 'Lời Ngỏ Chân Thành',
      subtitle: 'Cùng nhau bước sang trang mới',
      paragraphs: [
        'Cuốn sách nhỏ này có thể khép lại chuyến hành trình trong game, nhưng tớ mong chặng đường của hai đứa mình ngoài đời chỉ mới bắt đầu.',
        'Tớ không chỉ muốn nắm tay cậu khi đón sóng, mà muốn được nắm tay cậu bước qua những năm tháng dài phía trước.',
      ],
      quote: '“Hy vọng trang tiếp theo của câu chuyện này, sẽ do hai chúng mình cùng viết nên.”',
      signature: 'Lyche',
    },
    back: {
      id: 'cover-back',
      type: 'back-cover',
      title: 'Met — A Tiny Love Story',
      subtitle: 'Kỷ Niệm Của Chúng Mình',
      paragraphs: [
        'Made with love, care, and pixel nostalgia.',
        'Dành riêng cho Ánh — món quà bất ngờ từ Lyche.',
      ],
      quote: '“Gặp được nhau giữa vạn người là duyên số, nắm chặt tay nhau là sự lựa chọn của trái tim.”',
    },
  },
];
