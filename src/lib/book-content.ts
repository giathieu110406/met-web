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
        'Một cuốn sách nhỏ dành riêng cho người anh thương, được bọc cẩn thận từ chiếc hòm thư nơi đầu thung lũng...',
      ],
      quote: '“Gặp được người mình thương, mọi bước chân đều hóa dịu dàng.”',
      signature: 'GỬI EM',
    },
    back: {
      id: 'page-1',
      pageNumber: 1,
      type: 'story',
      title: 'Khởi Đầu & Chiếc Hòm Thư',
      subtitle: 'Thung Lũng Kỷ Niệm (x=200)',
      paragraphs: [
        'Sáng hôm ấy trời lất phất mưa lạnh, chiếc hòm thư cổ đầu làng bỗng rung nhẹ.',
        'Bên trong là một bưu kiện nhỏ thơm mùi giấy mới cùng mẩu giấy quen thuộc: "Hẹn gặp nhau trên đỉnh đồi Hoa Anh Đào".',
        'Anh cẩn thận cất cuốn sách vào túi áo, che chiếc ô xanh và bắt đầu chuyến hành trình tìm em.',
      ],
      quote: '“Mỗi hành trình dài đều bắt đầu từ một nhịp tim rung động.”',
    },
  },

  // Sheet 1: Trang 2 & Trang 3
  {
    id: 1,
    front: {
      id: 'page-2',
      pageNumber: 2,
      type: 'story',
      title: 'Cơn Mưa & Những Mảnh Thư',
      subtitle: 'Thử thách dọc đường gió lạnh',
      paragraphs: [
        'Chú mèo bên ghế đá vô tình cào rách bức thư, từng mảnh giấy nâu bị gió cuốn bay tứ tán khắp lối.',
        'Nhưng anh không nản lòng. Từ cành đèn cao, chiếc thuyền giấy dưới suối trăng, đến chú mèo nhỏ bìa rừng...',
        'Mỗi mảnh thư tìm lại đều được ép phẳng phiu cùng những đóa hoa thơm ngát nhặt bên đường.',
      ],
      quote: '“Càng qua giông bão, mới càng biết chân tình đáng quý biết bao.”',
    },
    back: {
      id: 'page-3',
      pageNumber: 3,
      type: 'story',
      title: 'Đồi Hoa Anh Đào Mùa Xuân',
      subtitle: 'Triền dốc thoai thoải ngập tràn sắc hoa',
      paragraphs: [
        'Bước qua vòm cây anh đào đầu tiên, bầu trời chuyển mình từ sắc lam chiều sang sắc hồng ấm áp.',
        '28 tán hoa đào bung nở trong gió sớm, mưa cánh hoa rơi rợp lối đi như một dải lụa dẫn lối.',
        'Anh biết, chỉ cần bước thêm một đoạn nữa thôi, em sẽ ở đó mỉm cười đón anh.',
      ],
      quote: '“Gió xuân đưa lối, hoa nở vì người.”',
    },
  },

  // Sheet 2: Trang 4 & Trang 5
  {
    id: 2,
    front: {
      id: 'page-4',
      pageNumber: 4,
      type: 'letter',
      title: 'Tái Ngộ Dưới Gốc Cây',
      subtitle: 'Khoảnh khắc trọn vẹn bên cội đại thụ',
      paragraphs: [
        'Dưới cội đại thụ ngàn hoa, em đứng đợi với ánh mắt dịu dàng xua tan đi tất cả mệt mỏi của chặng đường dài.',
        '"Em đã đợi anh rất lâu rồi... Thật mừng vì anh đã tới!"',
        '7 đóa hoa hồng đỏ thắm và bức thư hàn gắn trao tay. Không cần lời hoa mỹ, chỉ có sự chân thành vẹn nguyên.',
      ],
      quote: '“Cảm ơn anh vì đã không bỏ cuộc để đến bên em.”',
    },
    back: {
      id: 'page-5',
      pageNumber: 5,
      type: 'letter',
      title: 'Gửi Đến Người Thương',
      subtitle: 'Trang viết dành riêng cho em',
      paragraphs: [
        'Cảm ơn em vì đã xuất hiện và làm cho mỗi ngày trôi qua đều có ý nghĩa.',
        'Dù chặng đường phía trước có mưa gió hay thử thách, mong rằng hai ta sẽ luôn nắm chặt tay nhau như cách anh đã kiên trì bước tới đỉnh đồi hoa đào này.',
        'Cuốn sách này vẫn còn nhiều trang trống — để chúng mình cùng viết tiếp những kỷ niệm đẹp tiếp theo nhé!',
      ],
      quote: '“Happy Ending is just the beginning of our new chapter.”',
      signature: 'Yêu em rất nhiều',
    },
  },

  // Sheet 3: Trang 6 & Bìa sau
  {
    id: 3,
    front: {
      id: 'page-6',
      pageNumber: 6,
      type: 'letter',
      title: 'To Be Continued...',
      subtitle: 'Thanh xuân có nhau',
      paragraphs: [
        'Hành trình nhỏ trong trò chơi đã khép lại, nhưng tình yêu ngoài đời thực của chúng mình sẽ luôn tiếp diễn.',
        'Chúc cho nụ cười của em luôn rạng rỡ và an yên như những cánh anh đào giữa trời xuân ngát hương.',
      ],
      quote: '“Yêu không phải là đích đến, mà là từng bước chân cùng nhau đồng hành.”',
      signature: 'Forever & Always',
    },
    back: {
      id: 'cover-back',
      type: 'back-cover',
      title: 'Met — A Tiny Love Story',
      subtitle: 'Kỷ Niệm Của Chúng Mình',
      paragraphs: [
        'Made with love, care, and pixel nostalgia.',
        'Cảm ơn bạn đã lật mở và lắng nghe trọn vẹn câu chuyện này.',
      ],
      quote: '“Cuộc gặp gỡ đẹp nhất là khi hai trái tim cùng chung một nhịp đập.”',
    },
  },
];
