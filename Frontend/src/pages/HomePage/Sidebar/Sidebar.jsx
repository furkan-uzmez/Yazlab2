import { useState, useEffect, useRef } from 'react';
import { Link, useLocation , useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaFilm, FaBook, FaSearch, FaGripLines, FaSignOutAlt, FaArrowLeft, FaTimes, FaSpinner, FaSun, FaMoon, FaCog, FaInfoCircle, FaQuestionCircle, FaArrowRight } from 'react-icons/fa';
import ShinyText from '../../../components/ShinyText';
import './Sidebar.css';

function Sidebar({ onLogout, isSearchMode: externalSearchMode, onSearchModeChange }) {
  const location = useLocation();

  const navigate = useNavigate();

  const [internalSearchMode, setInternalSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // DİKKAT: Varsayılanı 'movie' yapalım ki test ederken sonuç görebilesiniz
  const [searchType, setSearchType] = useState('movie'); 
  
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isCompactTabs, setIsCompactTabs] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isMoreMenuClosing, setIsMoreMenuClosing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const searchInputRef = useRef(null);
  const tabsRef = useRef(null);
  const moreMenuRef = useRef(null);

  const isSearchMode = externalSearchMode !== undefined ? externalSearchMode : internalSearchMode;

  const handleSearchClick = () => {
    if (onSearchModeChange) onSearchModeChange(true);
    else setInternalSearchMode(true);
  };

  const handleBackClick = () => {
    if (onSearchModeChange) onSearchModeChange(false);
    else setInternalSearchMode(false);
    setSearchQuery('');
    setSearchType('movie'); // Resetlerken de movie yapalım
    setSearchResults([]);
  };

  useEffect(() => {
    if (isSearchMode) {
      if (window.innerWidth <= 768) {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
      }
      if (searchInputRef.current) {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 200);
      }
    } else {
      if (window.innerWidth <= 768) {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
      }
    }
    return () => {
      if (window.innerWidth <= 768) {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
      }
    };
  }, [isSearchMode]);

  // --- ASIL ARAMA FONKSİYONU (GÜNCELLENDİ) ---
const executeSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResults([]); 

    try {
      let url = '';
      
      if (searchType === 'movie' || searchType === 'book') {
        url = `http://localhost:8000/content/search?query=${encodeURIComponent(searchQuery)}&api_type=${searchType}`;
      } else if (searchType === 'user') {
        url = `http://localhost:8000/user/search?query=${encodeURIComponent(searchQuery)}`;
      }

      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        console.log("API Ham Veri:", data); 

        let formattedResults = [];

        if (searchType === 'movie') {
          const items = data.results?.results || data.results || [];
          formattedResults = items.map(movie => ({
            id: movie.id,
            title: movie.title, 
            image: movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : '/api/placeholder/50/75',
            subtitle: movie.release_date ? movie.release_date.split('-')[0] : 'Tarih Yok', 
            type: 'movie'
          }));

        } else if (searchType === 'book') {
          const items = data.results?.items || data.items || [];
          formattedResults = items.map(book => {
            const info = book.volumeInfo;
            return {
              id: book.id,
              title: info.title, 
              image: info.imageLinks?.smallThumbnail?.replace('http:', 'https:') || '/api/placeholder/50/75',
              subtitle: info.authors ? info.authors.join(', ') : 'Yazar Yok', 
              type: 'book'
            };
          });

        } else if (searchType === 'user') { 
          // Veri yapısı kontrolü
          let items = [];
          if (Array.isArray(data.results)) {
            items = data.results;
          } else if (data.results && typeof data.results === 'object') {
            items = [data.results]; // Tek objeyi diziye çevir
          } else if (data.user) {
             items = [data.user]; // Tek objeyi diziye çevir
          }
          
          formattedResults = items.map(user => ({
            id: user.user_id || user.username || Math.random(), 
            title: user.username, 
            image: user.avatar_url || 'https://i.pravatar.cc/150?img=default', 
            subtitle: user.bio 
              ? (user.bio.length > 30 ? user.bio.substring(0, 30) + '...' : user.bio) 
              : 'Kullanıcı',
            type: 'user'
          }));
        }

        setSearchResults(formattedResults);

      } else {
        console.error("Arama başarısız:", response.status);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Arama hatası:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // --- YENİ: FORM GÖNDERME (SUBMIT) FONKSİYONU ---
  // Bu fonksiyon Enter tuşuna basılınca otomatik çalışır
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Sayfanın yenilenmesini engelle
    executeSearch();    // Aramayı başlat
  };

  // Klavye kısayolu (ESC ile çıkış)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Escape' && isSearchMode) {
        handleBackClick();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isSearchMode]);

  // Tab sıkıştırma kontrolü (Aynı kaldı)
  useEffect(() => {
    if (isSearchMode && tabsRef.current) {
      const checkTabsFit = () => {
        const tabs = tabsRef.current;
        if (!tabs) return;
        tabs.style.display = 'flex';
        const containerWidth = tabs.offsetWidth;
        let totalWidth = 0;
        const tabElements = tabs.querySelectorAll('.search-tab');
        tabElements.forEach((tab) => {
          const tabClone = tab.cloneNode(true);
          tabClone.style.visibility = 'hidden';
          tabClone.style.position = 'absolute';
          tabClone.style.width = 'auto';
          document.body.appendChild(tabClone);
          totalWidth += tabClone.offsetWidth;
          document.body.removeChild(tabClone);
        });
        totalWidth += 0.25 * 2 * 16; 
        setIsCompactTabs(totalWidth > containerWidth - 10); 
      };
      const timeoutId = setTimeout(checkTabsFit, 100);
      window.addEventListener('resize', checkTabsFit);
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('resize', checkTabsFit);
      };
    } else {
      setIsCompactTabs(false);
    }
  }, [isSearchMode]);

  const getSearchTypeLabel = () => {
    switch (searchType) {
      case 'movie': return 'film';
      case 'book': return 'kitap';
      case 'user': return 'kullanıcı';
      default: return 'sonuç';
    }
  };

  // Menü açma/kapama (Aynı kaldı)
  const handleMoreClick = () => {
    if (isMoreMenuOpen) {
      setIsMoreMenuClosing(true);
      setTimeout(() => {
        setIsMoreMenuOpen(false);
        setIsMoreMenuClosing(false);
      }, 300); 
    } else {
      setIsMoreMenuOpen(true);
      setIsMoreMenuClosing(false);
    }
  };

const handleResultClick = (item) => {
    if (searchType === 'user') {
      // Kullanıcı araması ise profile git (title=username)
      navigate(`/profile/${item.title}`);
    } else if (searchType === 'movie') {
      // Film ise detay sayfasına git
      navigate(`/content/movie/${item.id}`);
    } else if (searchType === 'book') {
      // Kitap ise detay sayfasına git
      navigate(`/content/book/${item.id}`);
    }
    
    // Mobildeysek menüyü kapatmak isteyebilirsiniz:
    if (window.innerWidth <= 768 && onSearchModeChange) {
        onSearchModeChange(false);
    }
  };


  // ... (Diğer handler'lar: handleChangeView, handleSettings vb. aynı)
  const handleChangeView = () => { setIsDarkMode(!isDarkMode); setIsMoreMenuOpen(false); };
  const handleSettings = () => {
    // TODO: Navigate to settings page or open settings modal
    console.log('Ayarlar');
    setIsMoreMenuClosing(true);
    setTimeout(() => {
      setIsMoreMenuOpen(false);
      setIsMoreMenuClosing(false);
    }, 300);
  };

  const handleHelp = () => {
    // TODO: Open help page or modal
    console.log('Yardım');
    setIsMoreMenuClosing(true);
    setTimeout(() => {
      setIsMoreMenuOpen(false);
      setIsMoreMenuClosing(false);
    }, 300);
  };

  const handleAbout = () => {
    // TODO: Open about page or modal
    console.log('Hakkında');
    setIsMoreMenuClosing(true);
    setTimeout(() => {
      setIsMoreMenuOpen(false);
      setIsMoreMenuClosing(false);
    }, 300);
  };

  // Menü dışına tıklama (Aynı kaldı)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setIsMoreMenuClosing(true);
        setTimeout(() => {
          setIsMoreMenuOpen(false);
          setIsMoreMenuClosing(false);
        }, 300);
      }
    };
    if (isMoreMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMoreMenuOpen]);

  return (
    <aside className={`sidebar ${isSearchMode ? 'search-mode' : ''}`}>
      <div className={`sidebar-content-wrapper ${isSearchMode ? 'search-active' : 'menu-active'}`}>
        {!isSearchMode ? (
          // ... (Menü Modu - Burası aynı kaldı) ...
          <>
            <div className="sidebar-brand">
              <ShinyText text="READDIT" speed={3} className="brand-text" />
            </div>
            <div className="sidebar-content">
              <div className="sidebar-section">
                <h3 className="sidebar-title">Menü</h3>
                <nav className="sidebar-nav">
                  <Link to="/home" className={`nav-item ${location.pathname === '/home' ? 'active' : ''}`}>
                    <FaHome className="nav-icon" /> <span>Ana Sayfa</span>
                  </Link>
                  <Link to="/profile" className={`nav-item ${location.pathname.startsWith('/profile') ? 'active' : ''}`}>
                    <FaUser className="nav-icon" /> <span>Profilim</span>
                  </Link>
                  <Link to="/movies" className={`nav-item ${location.pathname === '/movies' ? 'active' : ''}`}>
                    <FaFilm className="nav-icon" /> <span>Filmler</span>
                  </Link>
                  <Link to="/books" className={`nav-item ${location.pathname === '/books' ? 'active' : ''}`}>
                    <FaBook className="nav-icon" /> <span>Kitaplar</span>
                  </Link>
                  <button type="button" className="nav-item" onClick={handleSearchClick}>
                    <FaSearch className="nav-icon" /> <span>Ara & Keşfet</span>
                  </button>
                </nav>
              </div>
              <div className="sidebar-footer">
                <div className="more-menu-wrapper" ref={moreMenuRef}>
                  <button type="button" className={`nav-item ${isMoreMenuOpen ? 'active' : ''}`} onClick={handleMoreClick}>
                    <FaGripLines className="nav-icon" /> <span>Daha Fazla</span>
                  </button>
                  {isMoreMenuOpen && (
                    <>
                      <div className={`more-menu-backdrop ${isMoreMenuClosing ? 'closing' : ''}`} onClick={handleMoreClick}></div>
                      <div className={`more-menu ${isMoreMenuClosing ? 'closing' : ''}`}>
                        <button type="button" className="more-menu-item" onClick={handleChangeView}>
                          {isDarkMode ? <FaSun className="more-menu-icon" /> : <FaMoon className="more-menu-icon" />}
                          <span>Görünümü Değiştir</span>
                        </button>
                         <button type="button" className="more-menu-item" onClick={handleSettings}>
                          <FaCog className="more-menu-icon" />
                          <span>Ayarlar</span>
                        </button>
                        <button type="button" className="more-menu-item" onClick={handleHelp}>
                          <FaQuestionCircle className="more-menu-icon" />
                          <span>Yardım</span>
                        </button>
                        <button type="button" className="more-menu-item" onClick={handleAbout}>
                          <FaInfoCircle className="more-menu-icon" />
                          <span>Hakkında</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <button type="button" className="nav-item" onClick={onLogout}>
                  <FaSignOutAlt className="nav-icon" /> <span>Çıkış Yap</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="search-panel">
            <div className="search-panel-header">
              <button type="button" className="search-back-btn" onClick={handleBackClick}>
                <FaArrowLeft className="nav-icon" />
              </button>
              <h2 className="search-panel-title">Arama</h2>
              <div className="search-header-spacer"></div>
            </div>

            <div className="search-panel-content">
              {/* --- FORM YAPISI: Enter tuşu için en garantili yöntem --- */}
              <form className="search-input-wrapper" onSubmit={handleSearchSubmit}>
                <FaSearch 
                  className="search-input-icon" 
                  onClick={executeSearch} 
                  style={{ cursor: 'pointer' }}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  className="search-input"
                  placeholder="Film, kitap veya kullanıcı ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  // onKeyDown artık gerekmez, form onSubmit halleder
                />
              </form>

              <div ref={tabsRef} className={`search-type-tabs ${isCompactTabs ? 'compact' : ''}`}>
                <button
                  type="button"
                  className={`search-tab ${searchType === 'user' ? 'active' : ''}`}
                  onClick={() => setSearchType('user')}
                >
                  <FaUser className="search-tab-icon" /> <span className="search-tab-text">Kullanıcılar</span>
                </button>
                <button
                  type="button"
                  className={`search-tab ${searchType === 'movie' ? 'active' : ''}`}
                  onClick={() => setSearchType('movie')}
                >
                  <FaFilm className="search-tab-icon" /> <span className="search-tab-text">Filmler</span>
                </button>
                <button
                  type="button"
                  className={`search-tab ${searchType === 'book' ? 'active' : ''}`}
                  onClick={() => setSearchType('book')}
                >
                  <FaBook className="search-tab-icon" /> <span className="search-tab-text">Kitaplar</span>
                </button>
              </div>

              <div className="search-results">
                {isSearching ? (
                  <div className="search-results-loading">
                    {/* Skeleton Loaders */}
                    {[1, 2, 3].map(i => (
                      <div key={i} className="search-skeleton">
                        <div className="skeleton-avatar"></div>
                        <div className="skeleton-content">
                          <div className="skeleton-line skeleton-title"></div>
                          <div className="skeleton-line skeleton-subtitle"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="search-results-content">
                    <div className="search-results-header">
                      <p className="search-results-count">
                        "{searchQuery}" için <span className="search-type-label">{getSearchTypeLabel()}</span> araması
                      </p>
                    </div>

                   {/* --- SONUÇ LİSTESİ --- */}
                    <div className="search-results-list">
                        {searchResults.map((item, index) => (
                          <div 
                            key={item.id || index} 
                            className="search-result-item"
                            // --- GÜNCELLENDİ: onClick olayı eklendi ---
                            onClick={() => handleResultClick(item)}
                            style={{ cursor: 'pointer' }}
                          >
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              className="search-result-img" 
                              onError={(e) => { e.target.src = '/api/placeholder/50/75'; }} 
                            />
                            <div className="search-result-info">
                              <h4 className="search-result-title">{item.title}</h4>
                              <p className="search-result-subtitle">{item.subtitle}</p>
                            </div>
                            <button className="search-result-action">
                              <FaArrowRight />
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : searchQuery && !isSearching && searchResults.length === 0 ? (
                    <div className="search-results-placeholder">
                       <div className="search-empty-state">
                          <FaSearch className="search-empty-icon" />
                          <p className="search-empty-text">Sonuç bulunamadı</p>
                       </div>
                    </div>
                ) : (
                  <div className="search-results-placeholder">
                    <div className="search-empty-state">
                      <div className="search-empty-animation">
                        <FaSearch className="search-placeholder-icon" />
                      </div>
                      <p className="search-results-text">Arama yapmak için yukarıdaki alana yazın ve Enter'a basın</p>
                      <div className="search-shortcuts">
                        <div className="shortcut-item">
                          <kbd>ESC</kbd> <span>Geri dön</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;