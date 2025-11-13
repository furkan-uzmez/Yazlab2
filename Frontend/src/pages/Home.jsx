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
  FaSignOutAlt,
  FaTimes,
  FaArrowRight,
  FaUserPlus,
  FaUserFriends,
  FaStar
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

// Yorum Metni Bileşeni (Daha Fazla Göster özelliği ile)
function CommentText({ text, maxLength = 150 }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = text.length > maxLength;
  const displayText = isExpanded || !shouldTruncate ? text : text.substring(0, maxLength) + '...';

  if (!shouldTruncate) {
    return <p className="comment-panel-comment-text">{text}</p>;
  }

  return (
    <div className="comment-text-wrapper">
      <p className="comment-panel-comment-text">
        {displayText}
      </p>
      <button 
        className="comment-show-more-btn"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? 'Daha az göster' : 'Daha fazla göster'}
      </button>
    </div>
  );
}

// Aktivite Kartı Bileşeni
function ActivityCard({ activity, onCommentClick, isCommentPanelOpen }) {
  const [isLiked, setIsLiked] = useState(false);
  const [comments] = useState(getMockComments(activity.id));

  const handleLike = (e) => {
    e.preventDefault();
    setIsLiked(!isLiked);
  };

  const handleCommentToggle = (e) => {
    e.preventDefault();
    if (onCommentClick) {
      onCommentClick(activity, comments);
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
                <button 
                  onClick={handleCommentToggle}
                  className="read-more-link"
                >
                  <ShinyText text="...daha fazlasını oku" speed={4} className="read-more-text" />
                </button>
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
          className={`interaction-btn comment-btn ${isCommentPanelOpen ? 'active' : ''}`}
          onClick={handleCommentToggle}
        >
          <FaRegCommentDots className="btn-icon" />
          {(activity.comments > 0 || comments.length > 0) && (
            <span className="count">{activity.comments > 0 ? activity.comments : comments.length}</span>
          )}
        </button>
      </div>

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
  const [commentPanelOpen, setCommentPanelOpen] = useState(false);
  const [commentPanelClosing, setCommentPanelClosing] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [panelComments, setPanelComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [likedComments, setLikedComments] = useState(new Set());
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = () => {
    setLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    setLogoutLoading(true);
    setTimeout(() => {
      // localStorage'dan token ve kullanıcı bilgilerini temizle
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Ana giriş sayfasına yönlendir
      navigate('/');
    }, 1300);
  };

  const handleCancelLogout = () => {
    setLogoutModalOpen(false);
  };

  const handleCommentClick = (activity, comments) => {
    setSelectedActivity(activity);
    setPanelComments(comments);
    setCommentPanelOpen(true);
  };

  const handleCloseCommentPanel = () => {
    setCommentPanelClosing(true);
    setTimeout(() => {
      setCommentPanelOpen(false);
      setCommentPanelClosing(false);
      setSelectedActivity(null);
      setPanelComments([]);
      setCommentText('');
    }, 400); // Animasyon süresi ile eşleşmeli
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      const newComment = {
        id: panelComments.length + 1,
        userId: 999,
        userName: 'Sen',
        userAvatar: 'https://i.pravatar.cc/150?img=20',
        text: commentText,
        date: new Date(),
        likes: 0
      };
      setPanelComments([...panelComments, newComment]);
      setCommentText('');
      
      // Gönderinin yorum sayısını artır
      if (selectedActivity) {
        setSelectedActivity({
          ...selectedActivity,
          comments: (selectedActivity.comments || 0) + 1
        });
        
        // Activity card'daki yorum sayısını da güncelle
        setActivities(prevActivities => 
          prevActivities.map(activity => 
            activity.id === selectedActivity.id 
              ? { ...activity, comments: (activity.comments || 0) + 1 }
              : activity
          )
        );
      }
    }
  };

  const handleCommentLike = (commentId) => {
    setLikedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handleFollowUser = (userId) => {
    setFollowedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleShowMoreFollowing = () => {
    navigate('/profile');
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
      // Simüle edilmiş API çağrısı - minimum süre skeleton loader için
      const minLoadingTime = isInitialLoad ? 1000 : 500;
      await new Promise(resolve => setTimeout(resolve, minLoadingTime));
      
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
                <ActivityCard 
                  key={activity.id} 
                  activity={activity} 
                  onCommentClick={handleCommentClick}
                  isCommentPanelOpen={commentPanelOpen && selectedActivity?.id === activity.id}
                />
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

      {/* Sağ Panel */}
      <aside className="right-panel">
        <div className="right-panel-content">
          {/* Takip Ettiklerin */}
          <div className="right-panel-section">
            <h3 className="right-panel-title">
              <FaUserFriends className="right-panel-title-icon" />
              Takip Ettiklerin
            </h3>
            <div className="right-panel-list">
              {[
                { id: 1, name: 'Mehmet Demir', avatar: 'https://i.pravatar.cc/150?img=12' },
                { id: 2, name: 'Ayşe Kaya', avatar: 'https://i.pravatar.cc/150?img=15' },
                { id: 3, name: 'Can Özkan', avatar: 'https://i.pravatar.cc/150?img=20' },
                { id: 4, name: 'Zeynep Yıldız', avatar: 'https://i.pravatar.cc/150?img=25' },
                { id: 5, name: 'Ali Çelik', avatar: 'https://i.pravatar.cc/150?img=30' },
                { id: 6, name: 'Fatma Yılmaz', avatar: 'https://i.pravatar.cc/150?img=33' },
                { id: 7, name: 'Mustafa Kaya', avatar: 'https://i.pravatar.cc/150?img=36' }
              ].slice(0, 5).map((user) => (
                <div key={user.id} className="right-panel-item">
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="right-panel-avatar"
                  />
                  <div className="right-panel-item-info">
                    <span className="right-panel-item-name">{user.name}</span>
                  </div>
                </div>
              ))}
              <button 
                className="right-panel-show-more-btn"
                onClick={handleShowMoreFollowing}
              >
                + Daha fazla göster
              </button>
            </div>
          </div>

          {/* Senin İçin Önerilenler */}
          <div className="right-panel-section">
            <h3 className="right-panel-title">
              <FaStar className="right-panel-title-icon" />
              Senin İçin Önerilenler
            </h3>
            <div className="right-panel-list">
              {[
                { id: 101, name: 'Elif Şahin', avatar: 'https://i.pravatar.cc/150?img=35', followers: '1.2K takipçi', mutual: '3 ortak takipçi' },
                { id: 102, name: 'Burak Arslan', avatar: 'https://i.pravatar.cc/150?img=40', followers: '856 takipçi', mutual: '5 ortak takipçi' },
                { id: 103, name: 'Selin Aydın', avatar: 'https://i.pravatar.cc/150?img=45', followers: '2.1K takipçi', mutual: '2 ortak takipçi' },
                { id: 104, name: 'Emre Doğan', avatar: 'https://i.pravatar.cc/150?img=50', followers: '3.5K takipçi', mutual: '7 ortak takipçi' }
              ].map((user) => {
                const isFollowed = followedUsers.has(user.id);
                return (
                  <div key={user.id} className="right-panel-item">
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="right-panel-avatar"
                    />
                    <div className="right-panel-item-info">
                      <span className="right-panel-item-name">{user.name}</span>
                      <span className="right-panel-item-details">{user.followers}</span>
                      <span className="right-panel-item-mutual">{user.mutual}</span>
                    </div>
                    <button 
                      className={`right-panel-follow-text-btn ${isFollowed ? 'followed' : ''}`}
                      onClick={() => handleFollowUser(user.id)}
                    >
                      {isFollowed ? 'Takip Ediliyor' : 'Takip Et'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      {/* Yorum Paneli */}
      {commentPanelOpen && selectedActivity && (
        <>
          <div 
            className={`comment-panel-overlay ${commentPanelClosing ? 'closing' : ''}`} 
            onClick={handleCloseCommentPanel}
          ></div>
          <div className={`comment-panel ${commentPanelClosing ? 'closing' : ''}`}>
            <div className="comment-panel-header">
              <h3 className="comment-panel-title">Yorumlar</h3>
              <button 
                className="comment-panel-close"
                onClick={handleCloseCommentPanel}
              >
                <FaTimes />
              </button>
            </div>

            <div className="comment-panel-content">
              {/* Gönderi Bilgileri */}
              <div className="comment-panel-post">
                <div className="comment-panel-post-header">
                  <img 
                    src={selectedActivity.userAvatar || '/api/placeholder/40/40'} 
                    alt={selectedActivity.userName}
                    className="comment-panel-user-avatar"
                  />
                  <div className="comment-panel-user-info">
                    <Link to={`/profile/${selectedActivity.userId}`} className="comment-panel-user-name">
                      {selectedActivity.userName}
                    </Link>
                    <span className="comment-panel-post-date">
                      {formatTimeAgo(selectedActivity.date)}
                    </span>
                  </div>
                </div>
                <div className="comment-panel-post-content">
                  {selectedActivity.type === 'rating' ? (
                    <div className="comment-panel-rating">
                      <div className="comment-panel-poster">
                        <img 
                          src={selectedActivity.contentPoster || '/api/placeholder/200/300'} 
                          alt={selectedActivity.contentTitle}
                          className="comment-panel-poster-image"
                        />
                        <div className="comment-panel-poster-info">
                          <h4>{selectedActivity.contentTitle}</h4>
                          <span className={`content-type-badge ${selectedActivity.contentType === 'Film' ? 'film-badge' : 'book-badge'}`}>
                            {selectedActivity.contentType === 'Film' ? <FaFilm /> : <FaBook />}
                            <span>{selectedActivity.contentType}</span>
                          </span>
                          {selectedActivity.rating && (
                            <div className="comment-panel-rating-display">
                              <div className="comment-panel-rating-stars">
                                {[...Array(5)].map((_, i) => {
                                  const starRating = (selectedActivity.rating / 10) * 5;
                                  if (i < Math.floor(starRating)) {
                                    return <span key={i} className="star full">★</span>;
                                  } else if (i < Math.ceil(starRating) && starRating % 1 >= 0.5) {
                                    return <span key={i} className="star half">★</span>;
                                  } else {
                                    return <span key={i} className="star empty">☆</span>;
                                  }
                                })}
                                <span className="comment-panel-rating-value">{selectedActivity.rating.toFixed(1)}/10</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : selectedActivity.type === 'review' ? (
                    <div className="comment-panel-review">
                      <div className="comment-panel-poster">
                        <img 
                          src={selectedActivity.contentPoster || '/api/placeholder/200/300'} 
                          alt={selectedActivity.contentTitle}
                          className="comment-panel-poster-image"
                        />
                        <div className="comment-panel-poster-info">
                          <h4>{selectedActivity.contentTitle}</h4>
                          <span className={`content-type-badge ${selectedActivity.contentType === 'Film' ? 'film-badge' : 'book-badge'}`}>
                            {selectedActivity.contentType === 'Film' ? <FaFilm /> : <FaBook />}
                            <span>{selectedActivity.contentType}</span>
                          </span>
                        </div>
                      </div>
                      <p className="comment-panel-review-text">{selectedActivity.reviewText}</p>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Yorumlar Listesi */}
              <div className="comment-panel-comments">
                {panelComments.length > 0 ? (
                  panelComments.map((comment) => {
                    const isLiked = likedComments.has(comment.id);
                    const likeCount = (comment.likes || 0) + (isLiked ? 1 : 0);
                    return (
                      <div key={comment.id} className="comment-panel-item">
                        <img 
                          src={comment.userAvatar || '/api/placeholder/32/32'} 
                          alt={comment.userName}
                          className="comment-panel-avatar"
                        />
                        <div className="comment-panel-comment-content">
                          <div className="comment-panel-comment-header">
                            <span className="comment-panel-author">{comment.userName}</span>
                            <span className="comment-panel-comment-date">{formatTimeAgo(comment.date)}</span>
                          </div>
                          <div className="comment-panel-comment-body">
                            <CommentText text={comment.text} maxLength={150} />
                            <button 
                              className={`comment-like-btn ${isLiked ? 'liked' : ''}`}
                              onClick={() => handleCommentLike(comment.id)}
                            >
                              <FaRegThumbsUp className="comment-like-icon" />
                              {likeCount > 0 && <span className="comment-like-count">{likeCount}</span>}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="comment-panel-empty">
                    <p>Henüz yorum yok. İlk yorumu sen yap!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Yorum Yapma Formu */}
            <div className="comment-panel-footer">
              <form onSubmit={handleCommentSubmit} className="comment-panel-form">
                <textarea
                  className="comment-panel-input"
                  placeholder="Yorumunuzu yazın..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows="2"
                />
                <button 
                  type="submit" 
                  className="comment-panel-submit-btn"
                  disabled={!commentText.trim()}
                >
                  <FaArrowRight />
                </button>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Çıkış Yap Onay Modalı */}
      {logoutModalOpen && (
        <>
          <div 
            className="logout-modal-overlay"
            onClick={!logoutLoading ? handleCancelLogout : undefined}
          ></div>
          <div className="logout-modal">
            {!logoutLoading ? (
              <>
                <h3 className="logout-modal-title">Çıkış Yapmak İstiyor Musunuz?</h3>
                <p className="logout-modal-message">
                  Çıkış yaptığınızda oturumunuz sonlandırılacak ve ana giriş sayfasına yönlendirileceksiniz.
                </p>
                <div className="logout-modal-buttons">
                  <button 
                    className="logout-modal-btn logout-modal-btn-cancel"
                    onClick={handleCancelLogout}
                  >
                    İptal
                  </button>
                  <button 
                    className="logout-modal-btn logout-modal-btn-confirm"
                    onClick={handleConfirmLogout}
                  >
                    Çıkış Yap
                  </button>
                </div>
              </>
            ) : (
              <div className="logout-loading">
                <div className="logout-spinner"></div>
                <p className="logout-loading-text">Çıkış yapılıyor...</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
