import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaCalendarAlt, FaClock, FaBookOpen, FaUser, FaFilm, FaBook, FaCheck, FaPlus, FaTimes } from 'react-icons/fa';
import BottomNav from '../../components/BottomNav';
import Sidebar from '../HomePage/Sidebar/Sidebar';
import LogoutModal from '../HomePage/LogoutModal/LogoutModal';
import './ContentDetail.css';

function ContentDetail() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isInWatched, setIsInWatched] = useState(false);
  const [isInToWatch, setIsInToWatch] = useState(false);
  const [isInRead, setIsInRead] = useState(false);
  const [isInToRead, setIsInToRead] = useState(false);
  const [showListMenu, setShowListMenu] = useState(false);
  const [customLists, setCustomLists] = useState([]);
  const [platformRating, setPlatformRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const customListWrapperRef = useRef(null);
  const customListMenuRef = useRef(null);

  // Mock data - In real app, fetch from API
  useEffect(() => {
    setTimeout(() => {
      if (type === 'movie') {
        const mockMovies = [
          {
            id: 1,
            title: 'Inception',
            poster_path: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
            release_date: '2010-07-16',
            vote_average: 8.8,
            overview: 'A skilled thief is given a chance at redemption if he can pull off an impossible heist.',
            genre_ids: [28, 878],
            genres: ['Aksiyon', 'Bilimkurgu'],
            directors: ['Christopher Nolan'],
            runtime: 148,
            platformRating: 8.8,
            totalRatings: 12543
          },
          {
            id: 2,
            title: 'The Matrix',
            poster_path: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
            release_date: '1999-03-31',
            vote_average: 8.7,
            overview: 'A computer hacker learns about the true nature of reality.',
            genre_ids: [28, 878],
            genres: ['Aksiyon', 'Bilimkurgu'],
            directors: ['Lana Wachowski', 'Lilly Wachowski'],
            runtime: 136,
            platformRating: 8.7,
            totalRatings: 9876
          }
        ];
        const found = mockMovies.find(m => m.id === parseInt(id));
        if (found) {
          setContent(found);
          setPlatformRating(found.platformRating);
          setTotalRatings(found.totalRatings);
        }
      } else if (type === 'book') {
        const mockBooks = [
          {
            id: 1,
            title: '1984',
            poster_path: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
            release_date: '1949-06-08',
            vote_average: 9.1,
            overview: 'Totaliter bir gelecekte yaşayan Winston Smith\'in hikayesi.',
            genre_ids: [1, 5, 10],
            genres: ['Roman', 'Fantastik', 'Klasik'],
            authors: ['George Orwell'],
            pageCount: 328,
            platformRating: 9.1,
            totalRatings: 15234
          },
          {
            id: 2,
            title: 'Suç ve Ceza',
            poster_path: 'https://covers.openlibrary.org/b/id/7222247-L.jpg',
            release_date: '1866-01-01',
            vote_average: 9.2,
            overview: 'Raskolnikov\'un işlediği cinayet ve sonrasında yaşadığı vicdan azabı.',
            genre_ids: [1, 10, 20],
            genres: ['Roman', 'Klasik', 'Edebiyat'],
            authors: ['Fyodor Dostoyevsky'],
            pageCount: 671,
            platformRating: 9.2,
            totalRatings: 13456
          }
        ];
        const found = mockBooks.find(b => b.id === parseInt(id));
        if (found) {
          setContent(found);
          setPlatformRating(found.platformRating);
          setTotalRatings(found.totalRatings);
        }
      }
      setLoading(false);
    }, 500);
  }, [type, id]);

  // Mock custom lists
  useEffect(() => {
    setCustomLists([
      { id: 1, name: 'En İyi Bilimkurgu Filmlerim' },
      { id: 2, name: 'İzlenmesi Gerekenler' },
      { id: 3, name: 'Favori Kitaplarım' }
    ]);
  }, []);

  const handleLogout = () => setLogoutModalOpen(true);
  
  const handleConfirmLogout = () => {
    setLogoutLoading(true);
    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }, 1300);
  };

  const handleCancelLogout = () => {
    setLogoutModalOpen(false);
  };

  const handleRatingClick = (rating) => {
    setUserRating(rating);
    // In real app, save to API
  };

  const handleWatchedToggle = () => {
    if (type === 'movie') {
      setIsInWatched(!isInWatched);
      if (isInToWatch) setIsInToWatch(false);
    } else {
      setIsInRead(!isInRead);
      if (isInToRead) setIsInToRead(false);
    }
    // In real app, update API
  };

  const handleToWatchToggle = () => {
    if (type === 'movie') {
      setIsInToWatch(!isInToWatch);
      if (isInWatched) setIsInWatched(false);
    } else {
      setIsInToRead(!isInToRead);
      if (isInRead) setIsInRead(false);
    }
    // In real app, update API
  };

  const handleAddToList = (listId) => {
    // In real app, add to list via API
    setShowListMenu(false);
  };

  // Position menu when it opens
  useEffect(() => {
    if (showListMenu && customListWrapperRef.current && customListMenuRef.current) {
      const wrapperRect = customListWrapperRef.current.getBoundingClientRect();
      const menu = customListMenuRef.current;
      menu.style.top = `${wrapperRect.bottom + 8}px`;
      menu.style.left = `${wrapperRect.left}px`;
    }
  }, [showListMenu]);

  if (loading) {
    return (
      <div className="content-detail-container">
        <Sidebar 
          onLogout={handleLogout}
          isSearchMode={isSearchMode}
          onSearchModeChange={setIsSearchMode}
        />
        <div className="content-detail-loading">
          <div className="spinner"></div>
          <p>Yükleniyor...</p>
        </div>
        <BottomNav 
          onSearchClick={() => setIsSearchMode(true)}
          isSearchMode={isSearchMode}
        />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="content-detail-container">
        <Sidebar 
          onLogout={handleLogout}
          isSearchMode={isSearchMode}
          onSearchModeChange={setIsSearchMode}
        />
        <div className="content-detail-empty">
          <p>İçerik bulunamadı</p>
        </div>
        <BottomNav 
          onSearchClick={() => setIsSearchMode(true)}
          isSearchMode={isSearchMode}
        />
      </div>
    );
  }

  return (
    <div className="content-detail-container">
      <Sidebar 
        onLogout={handleLogout}
        isSearchMode={isSearchMode}
        onSearchModeChange={setIsSearchMode}
      />
      <div className="content-detail-content">
        {/* Hero Section */}
        <div className="content-detail-hero">
          <div className="content-poster-wrapper">
            <img
              src={content.poster_path || '/placeholder.jpg'}
              alt={content.title}
              className="content-poster"
            />
          </div>
          <div className="content-info">
            <div className="content-header">
              <h1 className="content-title">{content.title}</h1>
              <div className="content-meta-row">
                <span className="content-year">
                  <FaCalendarAlt className="meta-icon" />
                  {new Date(content.release_date).getFullYear()}
                </span>
                {type === 'movie' && content.runtime && (
                  <span className="content-runtime">
                    <FaClock className="meta-icon" />
                    {content.runtime} dk
                  </span>
                )}
                {type === 'book' && content.pageCount && (
                  <span className="content-pages">
                    <FaBookOpen className="meta-icon" />
                    {content.pageCount} sayfa
                  </span>
                )}
              </div>
            </div>

            {/* Platform Rating */}
            <div className="platform-rating-section">
              <div className="platform-rating">
                <div className="platform-rating-value">
                  <FaStar className="star-icon" />
                  <span className="rating-number">{platformRating.toFixed(1)}</span>
                  <span className="rating-max">/10</span>
                </div>
                <div className="platform-rating-count">
                  {totalRatings.toLocaleString()} oy
                </div>
              </div>
            </div>

            {/* Genres */}
            <div className="content-genres">
              {content.genres && content.genres.map((genre, index) => (
                <span key={index} className="genre-badge">
                  {genre}
                </span>
              ))}
            </div>

            {/* Directors/Authors */}
            <div className="content-creators">
              {type === 'movie' && content.directors && (
                <div className="creator-item">
                  <FaFilm className="creator-icon" />
                  <span className="creator-label">Yönetmen:</span>
                  <span className="creator-names">{content.directors.join(', ')}</span>
                </div>
              )}
              {type === 'book' && content.authors && (
                <div className="creator-item">
                  <FaBook className="creator-icon" />
                  <span className="creator-label">Yazar:</span>
                  <span className="creator-names">{content.authors.join(', ')}</span>
                </div>
              )}
            </div>

            {/* User Actions */}
            <div className="content-actions">
              {/* Rating Component */}
              <div className="rating-section">
                <label className="rating-label">Puanınız:</label>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`rating-star ${userRating >= star ? 'active' : ''} ${hoveredRating >= star ? 'hovered' : ''}`}
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                    >
                      <FaStar />
                    </button>
                  ))}
                  {userRating > 0 && (
                    <span className="user-rating-value">{userRating}/10</span>
                  )}
                </div>
              </div>

              {/* Library Buttons and Custom List */}
              <div className="library-actions-row">
                <div className="library-buttons">
                  {type === 'movie' ? (
                    <>
                      <button
                        type="button"
                        className={`library-btn ${isInWatched ? 'active' : ''}`}
                        onClick={handleWatchedToggle}
                      >
                        {isInWatched ? <FaCheck /> : <FaPlus />}
                        <span>{isInWatched ? 'İzledim' : 'İzledim'}</span>
                      </button>
                      <button
                        type="button"
                        className={`library-btn ${isInToWatch ? 'active' : ''}`}
                        onClick={handleToWatchToggle}
                      >
                        {isInToWatch ? <FaCheck /> : <FaPlus />}
                        <span>{isInToWatch ? 'İzlenecek' : 'İzlenecek'}</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className={`library-btn ${isInRead ? 'active' : ''}`}
                        onClick={handleWatchedToggle}
                      >
                        {isInRead ? <FaCheck /> : <FaPlus />}
                        <span>{isInRead ? 'Okudum' : 'Okudum'}</span>
                      </button>
                      <button
                        type="button"
                        className={`library-btn ${isInToRead ? 'active' : ''}`}
                        onClick={handleToWatchToggle}
                      >
                        {isInToRead ? <FaCheck /> : <FaPlus />}
                        <span>{isInToRead ? 'Okunacak' : 'Okunacak'}</span>
                      </button>
                    </>
                  )}
                </div>

                {/* Add to Custom List */}
                <div className="custom-list-wrapper" ref={customListWrapperRef}>
                  <button
                    type="button"
                    className="custom-list-btn"
                    onClick={() => setShowListMenu(!showListMenu)}
                  >
                    <FaPlus />
                    <span>Özel Listeye Ekle</span>
                  </button>
                  {showListMenu && (
                    <div className="custom-list-menu" ref={customListMenuRef}>
                      {customLists.length > 0 ? (
                        customLists.map(list => (
                          <button
                            key={list.id}
                            type="button"
                            className="custom-list-item"
                            onClick={() => handleAddToList(list.id)}
                          >
                            {list.name}
                          </button>
                        ))
                      ) : (
                        <div className="custom-list-empty">
                          <p>Henüz özel listeniz yok</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <div className="content-overview">
          <h2 className="overview-title">Özet</h2>
          <p className="overview-text">{content.overview}</p>
        </div>
      </div>

      <BottomNav 
        onSearchClick={() => setIsSearchMode(true)}
        isSearchMode={isSearchMode}
      />
      <LogoutModal
        isOpen={logoutModalOpen}
        isLoading={logoutLoading}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </div>
  );
}

export default ContentDetail;

