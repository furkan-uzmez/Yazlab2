import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaFilm, FaBook, FaSearch, FaGripLines, FaSignOutAlt, FaArrowLeft, FaTimes, FaSpinner, FaTh, FaPalette, FaCog, FaInfoCircle, FaQuestionCircle } from 'react-icons/fa';
import ShinyText from '../../../components/ShinyText';
import './Sidebar.css';

function Sidebar({ onLogout, isSearchMode: externalSearchMode, onSearchModeChange }) {
  const location = useLocation();
  const [internalSearchMode, setInternalSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all'); // 'all', 'movie', 'book', 'user'
  const [isSearching, setIsSearching] = useState(false);
  const [isCompactTabs, setIsCompactTabs] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  const tabsRef = useRef(null);
  const moreMenuRef = useRef(null);

  // Use external state if provided, otherwise use internal state
  const isSearchMode = externalSearchMode !== undefined ? externalSearchMode : internalSearchMode;

  const handleSearchClick = () => {
    if (onSearchModeChange) {
      onSearchModeChange(true);
    } else {
      setInternalSearchMode(true);
    }
  };

  const handleBackClick = () => {
    if (onSearchModeChange) {
      onSearchModeChange(false);
    } else {
      setInternalSearchMode(false);
    }
    setSearchQuery('');
    setSearchType('all');
  };

  // Auto-focus search input when search mode opens and lock body scroll on mobile
  useEffect(() => {
    if (isSearchMode) {
      // Lock body scroll on mobile
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
      // Unlock body scroll
      if (window.innerWidth <= 768) {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
      }
    }
    
    return () => {
      // Cleanup on unmount
      if (window.innerWidth <= 768) {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
      }
    };
  }, [isSearchMode]);

  // Debounce search query for smooth UX
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isSearchMode) {
        handleBackClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchMode]);

  // Check if tabs need compact mode
  useEffect(() => {
    if (isSearchMode && tabsRef.current) {
      const checkTabsFit = () => {
        const tabs = tabsRef.current;
        if (!tabs) return;
        
        // Force a reflow to get accurate measurements
        tabs.style.display = 'flex';
        const containerWidth = tabs.offsetWidth;
        
        // Calculate if tabs would overflow
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
        
        // Add gap spacing (4 tabs * 0.25rem gap)
        totalWidth += 0.25 * 3 * 16; // 3 gaps * 0.25rem in pixels
        
        setIsCompactTabs(totalWidth > containerWidth - 10); // 10px buffer
      };
      
      // Check after a short delay to ensure DOM is ready
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

  const handleMoreClick = () => {
    setIsMoreMenuOpen(!isMoreMenuOpen);
  };

  const handleChangeView = () => {
    // Görünümü değiştir fonksiyonu - şimdilik placeholder
    console.log('Görünüm değiştirildi');
    setIsMoreMenuOpen(false);
  };

  const handleSettings = () => {
    // Ayarlar fonksiyonu - şimdilik placeholder
    console.log('Ayarlar açıldı');
    setIsMoreMenuOpen(false);
  };

  const handleAbout = () => {
    // Hakkında fonksiyonu - şimdilik placeholder
    console.log('Hakkında açıldı');
    setIsMoreMenuOpen(false);
  };

  const handleHelp = () => {
    // Yardım fonksiyonu - şimdilik placeholder
    console.log('Yardım açıldı');
    setIsMoreMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setIsMoreMenuOpen(false);
      }
    };

    if (isMoreMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMoreMenuOpen]);

  return (
    <aside className={`sidebar ${isSearchMode ? 'search-mode' : ''}`}>
      <div className={`sidebar-content-wrapper ${isSearchMode ? 'search-active' : 'menu-active'}`}>
        {!isSearchMode ? (
          <>
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
                  <button 
                    type="button"
                    className="nav-item"
                    onClick={handleSearchClick}
                  >
                    <FaSearch className="nav-icon" />
                    <span>Ara</span>
                  </button>
                </nav>
              </div>

              <div className="sidebar-footer">
                <div className="more-menu-wrapper" ref={moreMenuRef}>
                  <button 
                    type="button" 
                    className={`nav-item ${isMoreMenuOpen ? 'active' : ''}`}
                    onClick={handleMoreClick}
                  >
                    <FaGripLines className="nav-icon" />
                    <span>Daha Fazla</span>
                  </button>
                  {isMoreMenuOpen && (
                    <>
                      <div className="more-menu-backdrop" onClick={handleMoreClick}></div>
                      <div className="more-menu">
                        <button 
                          type="button" 
                          className="more-menu-item"
                          onClick={handleChangeView}
                        >
                          <FaPalette className="more-menu-icon" />
                          <span>Görünümü Değiştir</span>
                        </button>
                        <button 
                          type="button" 
                          className="more-menu-item"
                          onClick={handleSettings}
                        >
                          <FaCog className="more-menu-icon" />
                          <span>Ayarlar</span>
                        </button>
                        <button 
                          type="button" 
                          className="more-menu-item"
                          onClick={handleAbout}
                        >
                          <FaInfoCircle className="more-menu-icon" />
                          <span>Hakkında</span>
                        </button>
                        <button 
                          type="button" 
                          className="more-menu-item"
                          onClick={handleHelp}
                        >
                          <FaQuestionCircle className="more-menu-icon" />
                          <span>Yardım</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <button type="button" className="nav-item" onClick={onLogout}>
                  <FaSignOutAlt className="nav-icon" />
                  <span>Çıkış Yap</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="search-panel">
            <div className="search-panel-header">
              <button 
                type="button" 
                className="search-back-btn"
                onClick={handleBackClick}
                aria-label="Geri dön"
              >
                <FaArrowLeft className="nav-icon" />
              </button>
              <h2 className="search-panel-title">Arama</h2>
              <div className="search-header-spacer"></div>
            </div>

            <div className="search-panel-content">
              <div className="search-input-wrapper">
                <FaSearch className="search-input-icon" />
                <input
                  ref={searchInputRef}
                  type="text"
                  className="search-input"
                  placeholder="Film, kitap veya kullanıcı ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div 
                ref={tabsRef}
                className={`search-type-tabs ${isCompactTabs ? 'compact' : ''}`}
              >
                <button
                  type="button"
                  className={`search-tab ${searchType === 'all' ? 'active' : ''}`}
                  onClick={() => setSearchType('all')}
                  title="Tümü"
                >
                  <FaTh className="search-tab-icon" />
                  <span className="search-tab-text">Tümü</span>
                </button>
                <button
                  type="button"
                  className={`search-tab ${searchType === 'movie' ? 'active' : ''}`}
                  onClick={() => setSearchType('movie')}
                  title="Filmler"
                >
                  <FaFilm className="search-tab-icon" />
                  <span className="search-tab-text">Filmler</span>
                </button>
                <button
                  type="button"
                  className={`search-tab ${searchType === 'book' ? 'active' : ''}`}
                  onClick={() => setSearchType('book')}
                  title="Kitaplar"
                >
                  <FaBook className="search-tab-icon" />
                  <span className="search-tab-text">Kitaplar</span>
                </button>
                <button
                  type="button"
                  className={`search-tab ${searchType === 'user' ? 'active' : ''}`}
                  onClick={() => setSearchType('user')}
                  title="Kullanıcılar"
                >
                  <FaUser className="search-tab-icon" />
                  <span className="search-tab-text">Kullanıcılar</span>
                </button>
              </div>

              <div className="search-results">
                {isSearching && searchQuery ? (
                  <div className="search-results-loading">
                    <div className="search-skeleton">
                      <div className="skeleton-avatar"></div>
                      <div className="skeleton-content">
                        <div className="skeleton-line skeleton-title"></div>
                        <div className="skeleton-line skeleton-subtitle"></div>
                      </div>
                    </div>
                    <div className="search-skeleton">
                      <div className="skeleton-avatar"></div>
                      <div className="skeleton-content">
                        <div className="skeleton-line skeleton-title"></div>
                        <div className="skeleton-line skeleton-subtitle"></div>
                      </div>
                    </div>
                    <div className="search-skeleton">
                      <div className="skeleton-avatar"></div>
                      <div className="skeleton-content">
                        <div className="skeleton-line skeleton-title"></div>
                        <div className="skeleton-line skeleton-subtitle"></div>
                      </div>
                    </div>
                  </div>
                ) : searchQuery ? (
                  <div className="search-results-content">
                    <div className="search-results-header">
                      <p className="search-results-count">
                        "{searchQuery}" için <span className="search-type-label">{getSearchTypeLabel()}</span> araması
                      </p>
                    </div>
                    <div className="search-results-placeholder">
                      <div className="search-empty-state">
                        <FaSearch className="search-empty-icon" />
                        <p className="search-empty-text">Sonuçlar burada görünecek</p>
                        <p className="search-empty-hint">
                          Backend bağlantısı eklendiğinde arama sonuçları burada listelenecek
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="search-results-placeholder">
                    <div className="search-empty-state">
                      <div className="search-empty-animation">
                        <FaSearch className="search-placeholder-icon" />
                      </div>
                      <p className="search-results-text">Arama yapmak için yukarıdaki alana yazın</p>
                      <div className="search-shortcuts">
                        <div className="shortcut-item">
                          <kbd>ESC</kbd>
                          <span>Geri dön</span>
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

