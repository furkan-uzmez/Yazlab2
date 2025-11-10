import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

// Tüm örnek aktivite verileri (gerçek uygulamada API'den gelecek)
const allMockActivities = [
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

// Aktivite Kartı Bileşeni
function ActivityCard({ activity }) {
  const formatTimeAgo = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInSeconds = Math.floor((now - activityDate) / 1000);
    
    if (diffInSeconds < 60) return 'Az önce';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dakika önce`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} saat önce`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} gün önce`;
    return `${Math.floor(diffInSeconds / 604800)} hafta önce`;
  };

  const renderRatingStars = (rating) => {
    // Rating değerini 0-10 aralığına normalize et
    const normalizedRating = Math.max(0, Math.min(10, rating || 0));
    // 5 yıldız sistemine çevir (10 üzerinden 5 üzerinden)
    const starRating = (normalizedRating / 10) * 5;
    const fullStars = Math.floor(starRating);
    const hasHalfStar = starRating % 1 >= 0.5;
    const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));
    
    return (
      <div className="rating-stars">
        {fullStars > 0 && [...Array(fullStars)].map((_, i) => (
          <span key={i} className="star full">★</span>
        ))}
        {hasHalfStar && <span className="star half">★</span>}
        {emptyStars > 0 && [...Array(emptyStars)].map((_, i) => (
          <span key={i} className="star empty">☆</span>
        ))}
        <span className="rating-value">{normalizedRating.toFixed(1)}/10</span>
      </div>
    );
  };

  const truncateText = (text, maxLength = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="activity-card">
      {/* Üst Bilgi (Header) */}
      <div className="activity-header">
        <div className="user-info">
          <img 
            src={activity.userAvatar || '/api/placeholder/40/40'} 
            alt={activity.userName}
            className="user-avatar"
          />
            <div className="user-details">
            <Link to={`/profile/${activity.userId}`} className="user-name">
              {activity.userName}
            </Link>
            <span className="action-text">{activity.actionText}</span>
          </div>
        </div>
        <span className="activity-date">{formatTimeAgo(activity.date)}</span>
      </div>

      {/* Ana İçerik (Body) */}
      <div className="activity-body">
        {activity.type === 'rating' ? (
          <div className="rating-activity">
            <div className="content-poster">
              <img 
                src={activity.contentPoster || '/api/placeholder/200/300'} 
                alt={activity.contentTitle}
                className="poster-image"
              />
              <div className="content-info">
                <h3 className="content-title">{activity.contentTitle}</h3>
                <p className="content-type">{activity.contentType}</p>
              </div>
            </div>
            <div className="rating-display">
              {renderRatingStars(activity.rating)}
            </div>
          </div>
        ) : activity.type === 'review' ? (
          <div className="review-activity">
            <div className="content-poster">
              <img 
                src={activity.contentPoster || '/api/placeholder/200/300'} 
                alt={activity.contentTitle}
                className="poster-image"
              />
              <div className="content-info">
                <h3 className="content-title">{activity.contentTitle}</h3>
                <p className="content-type">{activity.contentType}</p>
              </div>
            </div>
            <div className="review-excerpt">
              <p>{truncateText(activity.reviewText)}</p>
              {activity.reviewText.length > 200 && (
                <Link to={`/review/${activity.reviewId}`} className="read-more-link">
                  ...daha fazlasını oku
                </Link>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Alt Bilgi (Footer) / Etkileşim */}
      <div className="activity-footer">
        <button className="interaction-btn like-btn">
          <span className="btn-icon">👍</span>
          <span>Beğen</span>
          {activity.likes > 0 && <span className="count">{activity.likes}</span>}
        </button>
        <button className="interaction-btn comment-btn">
          <span className="btn-icon">💬</span>
          <span>Yorum Yap</span>
          {activity.comments > 0 && <span className="count">{activity.comments}</span>}
        </button>
      </div>
    </div>
  );
}

function Home() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const loadingRef = useRef(null);
  const loadingRefValue = useRef(false);

  const fetchActivities = useCallback(async (pageNum) => {
    if (loadingRefValue.current) return;
    
    loadingRefValue.current = true;
    setLoading(true);
    
    try {
      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const itemsPerPage = 10;
      const startIndex = (pageNum - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const newActivities = allMockActivities.slice(startIndex, endIndex);
      
      if (newActivities.length === 0) {
        setHasMore(false);
      } else {
        setActivities(prev => [...prev, ...newActivities]);
        setPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
      loadingRefValue.current = false;
    }
  }, []);

  useEffect(() => {
    // İlk yükleme - sadece bir kez
    fetchActivities(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRefValue.current) {
          fetchActivities(page);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadingRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [page, hasMore, loading, fetchActivities]);

  return (
    <div className="home-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-content">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Menü</h3>
            <nav className="sidebar-nav">
              <Link to="/home" className="nav-item active">
                <span className="nav-icon">🏠</span>
                <span>Ana Sayfa</span>
              </Link>
              <Link to="/profile" className="nav-item">
                <span className="nav-icon">👤</span>
                <span>Profilim</span>
              </Link>
              <Link to="/movies" className="nav-item">
                <span className="nav-icon">🎬</span>
                <span>Filmler</span>
              </Link>
              <Link to="/books" className="nav-item">
                <span className="nav-icon">📚</span>
                <span>Kitaplar</span>
              </Link>
              <Link to="/search" className="nav-item">
                <span className="nav-icon">🔍</span>
                <span>Ara</span>
              </Link>
            </nav>
          </div>
          
          <div className="sidebar-section">
            <h3 className="sidebar-title">Takip Edilenler</h3>
            <div className="following-list">
              <div className="following-item">
                <img src="https://i.pravatar.cc/150?img=1" alt="User" className="following-avatar" />
                <span>Ahmet Yılmaz</span>
              </div>
              <div className="following-item">
                <img src="https://i.pravatar.cc/150?img=5" alt="User" className="following-avatar" />
                <span>Ayşe Demir</span>
              </div>
              <div className="following-item">
                <img src="https://i.pravatar.cc/150?img=12" alt="User" className="following-avatar" />
                <span>Mehmet Kaya</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Feed Bölümü */}
      <main className="feed-container">
        <div className="feed-header">
          <h1 className="feed-title">Ana Sayfa</h1>
          <p className="feed-subtitle">Sosyal Akış - Zaman Tüneli</p>
        </div>

        <div className="activities-feed">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>

        {/* Loading ve Daha Fazla Yükle */}
        <div ref={loadingRef} className="load-more-container">
          {loading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Yükleniyor...</p>
            </div>
          )}
          {!hasMore && activities.length > 0 && (
            <p className="no-more-activities">Tüm aktiviteler yüklendi</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;
