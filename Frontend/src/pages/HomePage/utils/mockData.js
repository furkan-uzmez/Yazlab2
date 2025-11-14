// Tüm örnek aktivite verileri (gerçek uygulamada API'den gelecek)
export const allMockActivities = [
  {
    id: 1,
    userId: 1,
    userName: 'Ahmet Yılmaz',
    userAvatar: 'https://i.pravatar.cc/150?img=1',
    type: 'rating',
    actionText: 'bir filmi oyladı',
    contentTitle: 'Inception',
    contentType: 'Film',
    contentPoster: 'https://image.tmdb.org/t/p/w200/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    rating: 9.5,
    date: new Date(Date.now() - 2 * 3600 * 1000),
    likes: 12,
    comments: 3
  },
  {
    id: 2,
    userId: 2,
    userName: 'Ayşe Demir',
    userAvatar: 'https://i.pravatar.cc/150?img=5',
    type: 'review',
    actionText: 'bir kitap hakkında yorum yaptı',
    contentTitle: '1984',
    contentType: 'Kitap',
    contentPoster: 'https://covers.openlibrary.org/b/id/7222246-M.jpg',
    reviewText: 'Bu kitap gerçekten çok etkileyici. Orwell\'in distopya dünyası günümüzde hala geçerliliğini koruyor. Karakterlerin derinliği ve hikayenin akıcılığı beni çok etkiledi. Özellikle Big Brother kavramı ve gözetleme toplumu üzerine düşündürücü bir eser.',
    reviewId: 1,
    date: new Date(Date.now() - 5 * 3600 * 1000),
    likes: 8,
    comments: 5
  },
  {
    id: 3,
    userId: 3,
    userName: 'Mehmet Kaya',
    userAvatar: 'https://i.pravatar.cc/150?img=12',
    type: 'rating',
    actionText: 'bir filmi oyladı',
    contentTitle: 'The Matrix',
    contentType: 'Film',
    contentPoster: 'https://image.tmdb.org/t/p/w200/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    rating: 8.5,
    date: new Date(Date.now() - 8 * 3600 * 1000),
    likes: 15,
    comments: 7
  },
  {
    id: 4,
    userId: 4,
    userName: 'Zeynep Şahin',
    userAvatar: 'https://i.pravatar.cc/150?img=9',
    type: 'review',
    actionText: 'bir film hakkında yorum yaptı',
    contentTitle: 'Interstellar',
    contentType: 'Film',
    contentPoster: 'https://image.tmdb.org/t/p/w200/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    reviewText: 'Nolan\'ın en iyi filmlerinden biri. Bilim kurgu ve duygusal derinliğin mükemmel birleşimi. Müzikler ve görsel efektler muhteşem. Zaman kavramı üzerine düşündürücü bir yolculuk.',
    reviewId: 2,
    date: new Date(Date.now() - 12 * 3600 * 1000),
    likes: 24,
    comments: 12
  },
  {
    id: 5,
    userId: 5,
    userName: 'Can Özkan',
    userAvatar: 'https://i.pravatar.cc/150?img=15',
    type: 'rating',
    actionText: 'bir kitabı oyladı',
    contentTitle: 'Suç ve Ceza',
    contentType: 'Kitap',
    contentPoster: 'https://covers.openlibrary.org/b/id/8739161-M.jpg',
    rating: 9.0,
    date: new Date(Date.now() - 1 * 24 * 3600 * 1000),
    likes: 18,
    comments: 4
  },
  {
    id: 6,
    userId: 1,
    userName: 'Ahmet Yılmaz',
    userAvatar: 'https://i.pravatar.cc/150?img=1',
    type: 'review',
    actionText: 'bir film hakkında yorum yaptı',
    contentTitle: 'The Dark Knight',
    contentType: 'Film',
    contentPoster: 'https://image.tmdb.org/t/p/w200/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    reviewText: 'Heath Ledger\'ın Joker performansı sinema tarihinin en iyilerinden biri. Nolan\'ın yönetmenliği ve senaryosu mükemmel. Aksiyon sahneleri ve karakter gelişimi harika.',
    reviewId: 3,
    date: new Date(Date.now() - 2 * 24 * 3600 * 1000),
    likes: 35,
    comments: 18
  },
  {
    id: 7,
    userId: 2,
    userName: 'Ayşe Demir',
    userAvatar: 'https://i.pravatar.cc/150?img=5',
    type: 'rating',
    actionText: 'bir kitabı oyladı',
    contentTitle: 'Savaş ve Barış',
    contentType: 'Kitap',
    contentPoster: 'https://covers.openlibrary.org/b/id/8739161-M.jpg',
    rating: 9.2,
    date: new Date(Date.now() - 3 * 24 * 3600 * 1000),
    likes: 22,
    comments: 9
  }
];

// Örnek yorumlar (gerçek uygulamada API'den gelecek)
export const getMockComments = (activityId) => {
  const commentsMap = {
    1: [
      {
        id: 1,
        userId: 2,
        userName: 'Ayşe Demir',
        userAvatar: 'https://i.pravatar.cc/150?img=5',
        text: 'Harika bir film! Nolan gerçekten usta bir yönetmen.',
        date: new Date(Date.now() - 1 * 3600 * 1000),
        likes: 5
      },
      {
        id: 2,
        userId: 3,
        userName: 'Mehmet Kaya',
        userAvatar: 'https://i.pravatar.cc/150?img=12',
        text: 'Kesinlikle izlenmeli. Zaman kavramı çok iyi işlenmiş. Bu film gerçekten çok etkileyici bir yapım. Nolan\'ın sinematografisi ve hikaye anlatımı mükemmel. Özellikle rüya içinde rüya konsepti çok yaratıcı. Her izlediğimde yeni detaylar keşfediyorum. Müzikler de harika, Hans Zimmer gerçekten usta bir besteci. Bu filmi herkese tavsiye ederim, kesinlikle izlenmeye değer bir başyapıt.',
        date: new Date(Date.now() - 30 * 60 * 1000),
        likes: 3
      }
    ],
    2: [
      {
        id: 3,
        userId: 1,
        userName: 'Ahmet Yılmaz',
        userAvatar: 'https://i.pravatar.cc/150?img=1',
        text: 'Çok güzel bir yorum olmuş. Ben de bu kitabı okumak istiyorum.',
        date: new Date(Date.now() - 2 * 3600 * 1000),
        likes: 2
      }
    ]
  };
  return commentsMap[activityId] || [];
};

