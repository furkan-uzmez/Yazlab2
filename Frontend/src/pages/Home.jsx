import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaUser,
  FaFilm,
  FaBook,
  FaSearch,
  FaRegThumbsUp,
  FaRegCommentDots,
  FaGripLines,
  FaSignOutAlt
} from 'react-icons/fa';
import ShinyText from '../components/ShinyText';
import ActivityCardSkeleton from '../components/ActivityCardSkeleton';
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

// Örnek yorumlar (gerçek uygulamada API'den gelecek)
const getMockComments = (activityId) => {
  const commentsMap = {
    1: [
      {
        id: 1,
        userId: 2,
        userName: 'Ayşe Demir',
        userAvatar: 'https://i.pravatar.cc/150?img=5',
        text: 'Harika bir film! Nolan gerçekten usta bir yönetmen.',
        date: new Date(Date.now() - 1 * 3600 * 1000)
      },
      {
        id: 2,
        userId: 3,
        userName: 'Mehmet Kaya',
        userAvatar: 'https://i.pravatar.cc/150?img=12',
        text: 'Kesinlikle izlenmeli. Zaman kavramı çok iyi işlenmiş.',
        date: new Date(Date.now() - 30 * 60 * 1000)
      }
    ],
    2: [
      {
        id: 3,
        userId: 1,
        userName: 'Ahmet Yılmaz',
        userAvatar: 'https://i.pravatar.cc/150?img=1',
        text: 'Çok güzel bir yorum olmuş. Ben de bu kitabı okumak istiyorum.',
        date: new Date(Date.now() - 2 * 3600 * 1000)
      }
    ]
  };
  return commentsMap[activityId] || [];
};

// Aktivite Kartı Bileşeni
function ActivityCard({ activity }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(getMockComments(activity.id));

  const handleLike = (e) => {
    e.preventDefault();
    setIsLiked(!isLiked);
  };

  const handleCommentToggle = (e) => {
    e.preventDefault();
    setIsCommentOpen(!isCommentOpen);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      // Yeni yorum ekle
      const newComment = {
        id: comments.length + 1,
        userId: 999, // Mevcut kullanıcı ID'si
        userName: 'Sen',
        userAvatar: 'https://i.pravatar.cc/150?img=20',
        text: commentText,
        date: new Date()
      };
      setComments([...comments, newComment]);
      setCommentText('');
      // Yorum sayısını güncelle (gerçek uygulamada API çağrısı yapılacak)
    }
  };

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
    const normalizedRating = Math.max(0, Math.min(10, rating || 0));
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
            <Link to={`/profile/${activity.userId}`} className="user-name-link">
              <ShinyText text={activity.userName} speed={4} className="user-name" />
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
                <div className="content-header">
                  <Link to="#" className="content-title-link">
                  <ShinyText text={activity.contentTitle} speed={4} className="content-title" />
                </Link>
                  <div className={`content-type-badge ${activity.contentType === 'Film' ? 'film-badge' : 'book-badge'}`}>
                    {activity.contentType === 'Film' ? <FaFilm /> : <FaBook />}
                    <span>{activity.contentType}</span>
                  </div>
                </div>
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
                <div className="content-header">
                  <Link to="#" className="content-title-link">
                  <ShinyText text={activity.contentTitle} speed={4} className="content-title" />
                </Link>
                  <div className={`content-type-badge ${activity.contentType === 'Film' ? 'film-badge' : 'book-badge'}`}>
                    {activity.contentType === 'Film' ? <FaFilm /> : <FaBook />}
                    <span>{activity.contentType}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="review-excerpt">
              <p>{truncateText(activity.reviewText)}</p>
              {activity.reviewText.length > 200 && (
                <Link to={`/review/${activity.reviewId}`} className="read-more-link">
                  <ShinyText text="...daha fazlasını oku" speed={4} className="read-more-text" />
                </Link>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Alt Bilgi (Footer) / Etkileşim */}
      <div className="activity-footer">
        <button 
          className={`interaction-btn like-btn ${isLiked ? 'active' : ''}`}
          onClick={handleLike}
        >
          <FaRegThumbsUp className="btn-icon" />
          {(activity.likes > 0 || isLiked) && (
            <span className="count">{activity.likes + (isLiked ? 1 : 0)}</span>
          )}
        </button>
        <button 
          className={`interaction-btn comment-btn ${isCommentOpen ? 'active' : ''}`}
          onClick={handleCommentToggle}
        >
          <FaRegCommentDots className="btn-icon" />
          {(activity.comments > 0 || comments.length > 0) && (
            <span className="count">{comments.length > 0 ? comments.length : activity.comments}</span>
          )}
        </button>
      </div>

      {/* Yorumlar ve Yorum Yapma Formu */}
      {isCommentOpen && (
        <div className="comment-section">
          {/* Mevcut Yorumlar */}
          {comments.length > 0 && (
            <div className="comments-list">
              <h4 className="comments-title">Yorumlar ({comments.length})</h4>
              {comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <img 
                    src={comment.userAvatar || '/api/placeholder/32/32'} 
                    alt={comment.userName}
                    className="comment-avatar"
                  />
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-author">{comment.userName}</span>
                      <span className="comment-date">{formatTimeAgo(comment.date)}</span>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Yorum Yapma Formu */}
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              className="comment-input"
              placeholder="Yorumunuzu yazın..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows="3"
            />
            <div className="comment-form-actions">
              <button 
                type="button" 
                className="comment-cancel-btn"
                onClick={() => setIsCommentOpen(false)}
              >
                İptal
              </button>
              <button 
                type="submit" 
                className="comment-submit-btn"
                disabled={!commentText.trim()}
              >
                Gönder
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const loadingRef = useRef(null);
  const loadingRefValue = useRef(false);

  const handleLogout = () => {
    // localStorage'dan token ve kullanıcı bilgilerini temizle
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Ana giriş sayfasına yönlendir
    navigate('/');
  };

  const fetchActivities = useCallback(async (pageNum) => {
    if (loadingRefValue.current) return;
    
    loadingRefValue.current = true;
    const isInitialLoad = pageNum === 1 && activities.length === 0;
    
    if (isInitialLoad) {
      setInitialLoading(true);
    } else {
      setLoading(true);
    }
    
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
      setInitialLoading(false);
      loadingRefValue.current = false;
    }
  }, [activities.length]);

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
        <div className="sidebar-brand">
          <ShinyText text="READDIT" speed={3} className="brand-text" />
        </div>
        <div className="sidebar-content">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Menü</h3>
            <nav className="sidebar-nav">
              <Link 
                to="/home" 
                className={`nav-item ${location.pathname === '/home' || location.pathname === '/' ? 'active' : ''}`}
              >
                <FaHome className="nav-icon" />
                <span>Ana Sayfa</span>
              </Link>
              <Link 
                to="/profile" 
                className={`nav-item ${location.pathname.startsWith('/profile') ? 'active' : ''}`}
              >
                <FaUser className="nav-icon" />
                <span>Profilim</span>
              </Link>
              <Link 
                to="/movies" 
                className={`nav-item ${location.pathname === '/movies' ? 'active' : ''}`}
              >
                <FaFilm className="nav-icon" />
                <span>Filmler</span>
              </Link>
              <Link 
                to="/books" 
                className={`nav-item ${location.pathname === '/books' ? 'active' : ''}`}
              >
                <FaBook className="nav-icon" />
                <span>Kitaplar</span>
              </Link>
              <Link 
                to="/search" 
                className={`nav-item ${location.pathname === '/search' ? 'active' : ''}`}
              >
                <FaSearch className="nav-icon" />
                <span>Ara</span>
              </Link>
            </nav>
          </div>

          <div className="sidebar-footer">
            <button type="button" className="nav-item">
              <FaGripLines className="nav-icon" />
              <span>Daha Fazla</span>
            </button>
            <button type="button" className="nav-item" onClick={handleLogout}>
              <FaSignOutAlt className="nav-icon" />
              <span>Çıkış Yap</span>
            </button>
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
          {initialLoading ? (
            // İlk yükleme için skeleton loader'lar
            <>
              {[...Array(5)].map((_, index) => (
                <ActivityCardSkeleton key={`skeleton-${index}`} />
              ))}
            </>
          ) : (
            // Yüklenen aktiviteler
            <>
              {activities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
              {loading && (
                // Daha fazla yükleme için skeleton loader'lar
                <>
                  {[...Array(3)].map((_, index) => (
                    <ActivityCardSkeleton key={`loading-skeleton-${index}`} />
                  ))}
                </>
              )}
            </>
          )}
        </div>

        {/* Loading ve Daha Fazla Yükle */}
        <div ref={loadingRef} className="load-more-container">
          {!initialLoading && loading && activities.length > 0 && (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Yükleniyor...</p>
            </div>
          )}
          {!hasMore && activities.length > 0 && !initialLoading && (
            <p className="no-more-activities">Tüm aktiviteler yüklendi</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;
