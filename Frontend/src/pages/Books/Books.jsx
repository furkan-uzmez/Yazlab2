import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaFilter, FaSort, FaSearch, FaStar, FaCalendarAlt, FaTimes, FaChevronDown } from 'react-icons/fa';
import BottomNav from '../../components/BottomNav';
import Sidebar from '../HomePage/Sidebar/Sidebar';
import LogoutModal from '../HomePage/LogoutModal/LogoutModal';
import './Books.css';

function Books() {
  const navigate = useNavigate();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('popular'); // 'popular', 'new', 'top-rated', 'all'
  const [sortBy, setSortBy] = useState('popularity');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isFilterModalClosing, setIsFilterModalClosing] = useState(false);
  const [filters, setFilters] = useState({
    genres: [],
    yearFrom: '',
    yearTo: '',
    ratingFrom: '',
    ratingTo: ''
  });

  // Mock genres for books
  const genres = [
    { id: 1, name: 'Roman' },
    { id: 2, name: 'Bilimkurgu' },
    { id: 3, name: 'Polisiye' },
    { id: 4, name: 'Gerilim' },
    { id: 5, name: 'Fantastik' },
    { id: 6, name: 'Tarih' },
    { id: 7, name: 'Biyografi' },
    { id: 8, name: 'Felsefe' },
    { id: 9, name: 'Psikoloji' },
    { id: 10, name: 'Klasik' },
    { id: 11, name: 'Çocuk' },
    { id: 12, name: 'Genç Yetişkin' },
    { id: 13, name: 'Romantik' },
    { id: 14, name: 'Macera' },
    { id: 15, name: 'Korku' },
    { id: 16, name: 'Mizah' },
    { id: 17, name: 'Şiir' },
    { id: 18, name: 'Deneme' },
    { id: 19, name: 'Araştırma' },
    { id: 20, name: 'Edebiyat' }
  ];

  // Mock books data - Frontend only
  useEffect(() => {
    setTimeout(() => {
      const mockBooks = [
        {
          id: 1,
          title: '1984',
          poster_path: 'https://covers.openlibrary.org/b/id/7222246-M.jpg',
          release_date: '1949-06-08',
          vote_average: 9.1,
          overview: 'Totaliter bir gelecekte yaşayan Winston Smith\'in hikayesi.',
          genre_ids: [1, 5, 10]
        },
        {
          id: 2,
          title: 'Suç ve Ceza',
          poster_path: 'https://covers.openlibrary.org/b/id/7222247-M.jpg',
          release_date: '1866-01-01',
          vote_average: 9.2,
          overview: 'Raskolnikov\'un işlediği cinayet ve sonrasında yaşadığı vicdan azabı.',
          genre_ids: [1, 10, 20]
        },
        {
          id: 3,
          title: 'Savaş ve Barış',
          poster_path: 'https://covers.openlibrary.org/b/id/7222248-M.jpg',
          release_date: '1869-01-01',
          vote_average: 9.0,
          overview: 'Napolyon döneminde Rus aristokrasisinin hikayesi.',
          genre_ids: [1, 6, 10]
        },
        {
          id: 4,
          title: 'Dönüşüm',
          poster_path: 'https://covers.openlibrary.org/b/id/7222249-M.jpg',
          release_date: '1915-10-15',
          vote_average: 8.8,
          overview: 'Gregor Samsa\'nın bir sabah böceğe dönüşmesi.',
          genre_ids: [1, 5, 10]
        },
        {
          id: 5,
          title: 'Yabancı',
          poster_path: 'https://covers.openlibrary.org/b/id/7222250-M.jpg',
          release_date: '1942-06-01',
          vote_average: 8.7,
          overview: 'Meursault\'un absürt bir cinayet işlemesi ve sonrası.',
          genre_ids: [1, 8, 10]
        },
        {
          id: 6,
          title: 'Bülbülü Öldürmek',
          poster_path: 'https://covers.openlibrary.org/b/id/7222251-M.jpg',
          release_date: '1960-07-11',
          vote_average: 9.0,
          overview: 'Amerika\'nın güneyinde ırkçılık ve adalet teması.',
          genre_ids: [1, 6, 20]
        },
        {
          id: 7,
          title: 'Harry Potter ve Felsefe Taşı',
          poster_path: 'https://covers.openlibrary.org/b/id/7222252-M.jpg',
          release_date: '1997-06-26',
          vote_average: 8.9,
          overview: 'Genç bir büyücünün Hogwarts\'taki maceraları.',
          genre_ids: [5, 11, 14]
        },
        {
          id: 8,
          title: 'Yüzüklerin Efendisi',
          poster_path: 'https://covers.openlibrary.org/b/id/7222253-M.jpg',
          release_date: '1954-07-29',
          vote_average: 9.2,
          overview: 'Orta Dünya\'da bir yüzüğün yok edilmesi görevi.',
          genre_ids: [5, 14]
        },
        {
          id: 9,
          title: 'Dune',
          poster_path: 'https://covers.openlibrary.org/b/id/7222254-M.jpg',
          release_date: '1965-08-01',
          vote_average: 8.8,
          overview: 'Arrakis gezegenindeki baharat savaşları.',
          genre_ids: [2, 5]
        },
        {
          id: 10,
          title: 'Fareler ve İnsanlar',
          poster_path: 'https://covers.openlibrary.org/b/id/7222255-M.jpg',
          release_date: '1937-01-01',
          vote_average: 8.9,
          overview: 'İki göçmen işçinin dostluğu ve hayalleri.',
          genre_ids: [1, 6, 20]
        },
        {
          id: 11,
          title: 'Beyaz Gemi',
          poster_path: 'https://covers.openlibrary.org/b/id/7222256-M.jpg',
          release_date: '1970-01-01',
          vote_average: 8.6,
          overview: 'Kırgızistan\'da bir çocuğun hayal dünyası.',
          genre_ids: [1, 20]
        },
        {
          id: 12,
          title: 'Simyacı',
          poster_path: 'https://covers.openlibrary.org/b/id/7222257-M.jpg',
          release_date: '1988-01-01',
          vote_average: 8.5,
          overview: 'Bir çobanın kişisel efsanesini arayışı.',
          genre_ids: [1, 8, 14]
        },
        {
          id: 13,
          title: 'Karamazov Kardeşler',
          poster_path: 'https://covers.openlibrary.org/b/id/7222258-M.jpg',
          release_date: '1880-01-01',
          vote_average: 9.1,
          overview: 'Üç kardeşin babalarının ölümü etrafındaki hikayesi.',
          genre_ids: [1, 8, 10]
        },
        {
          id: 14,
          title: 'Anna Karenina',
          poster_path: 'https://covers.openlibrary.org/b/id/7222259-M.jpg',
          release_date: '1877-01-01',
          vote_average: 9.0,
          overview: 'Evli bir kadının aşk ve toplumsal baskı arasındaki mücadelesi.',
          genre_ids: [1, 13, 20]
        },
        {
          id: 15,
          title: 'Ulysses',
          poster_path: 'https://covers.openlibrary.org/b/id/7222260-M.jpg',
          release_date: '1922-02-02',
          vote_average: 8.7,
          overview: 'Leopold Bloom\'un Dublin\'deki bir günü.',
          genre_ids: [1, 10, 20]
        },
        {
          id: 16,
          title: 'Lolita',
          poster_path: 'https://covers.openlibrary.org/b/id/7222261-M.jpg',
          release_date: '1955-09-01',
          vote_average: 8.6,
          overview: 'Humbert Humbert\'in Lolita\'ya olan takıntısı.',
          genre_ids: [1, 10, 20]
        },
        {
          id: 17,
          title: 'Cesur Yeni Dünya',
          poster_path: 'https://covers.openlibrary.org/b/id/7222262-M.jpg',
          release_date: '1932-01-01',
          vote_average: 8.8,
          overview: 'Distopik bir gelecekte teknoloji ve insanlık.',
          genre_ids: [2, 5]
        },
        {
          id: 18,
          title: 'Fahrenheit 451',
          poster_path: 'https://covers.openlibrary.org/b/id/7222263-M.jpg',
          release_date: '1953-10-19',
          vote_average: 8.7,
          overview: 'Kitapların yasaklandığı bir toplumda bir itfaiyecinin hikayesi.',
          genre_ids: [2, 5]
        },
        {
          id: 19,
          title: 'Hayvan Çiftliği',
          poster_path: 'https://covers.openlibrary.org/b/id/7222264-M.jpg',
          release_date: '1945-08-17',
          vote_average: 8.9,
          overview: 'Çiftlik hayvanlarının devrimi ve sonrası.',
          genre_ids: [1, 5, 10]
        },
        {
          id: 20,
          title: 'Gurur ve Önyargı',
          poster_path: 'https://covers.openlibrary.org/b/id/7222265-M.jpg',
          release_date: '1813-01-28',
          vote_average: 8.8,
          overview: 'Elizabeth Bennet ve Mr. Darcy\'nin aşk hikayesi.',
          genre_ids: [1, 13, 20]
        },
        {
          id: 21,
          title: 'Jane Eyre',
          poster_path: 'https://covers.openlibrary.org/b/id/7222266-M.jpg',
          release_date: '1847-10-16',
          vote_average: 8.7,
          overview: 'Genç bir kadının bağımsızlık ve aşk arayışı.',
          genre_ids: [1, 13, 20]
        },
        {
          id: 22,
          title: 'Moby Dick',
          poster_path: 'https://covers.openlibrary.org/b/id/7222267-M.jpg',
          release_date: '1851-10-18',
          vote_average: 8.6,
          overview: 'Kaptan Ahab\'ın beyaz balina Moby Dick\'e olan takıntısı.',
          genre_ids: [1, 14, 20]
        },
        {
          id: 23,
          title: 'Sefiller',
          poster_path: 'https://covers.openlibrary.org/b/id/7222268-M.jpg',
          release_date: '1862-01-01',
          vote_average: 9.0,
          overview: 'Jean Valjean\'ın adalet ve merhamet arayışı.',
          genre_ids: [1, 6, 20]
        },
        {
          id: 24,
          title: 'Don Kişot',
          poster_path: 'https://covers.openlibrary.org/b/id/7222269-M.jpg',
          release_date: '1605-01-16',
          vote_average: 8.9,
          overview: 'Şövalye olmak isteyen bir adamın maceraları.',
          genre_ids: [1, 10, 16]
        },
        {
          id: 25,
          title: 'İnce Memed',
          poster_path: 'https://covers.openlibrary.org/b/id/7222270-M.jpg',
          release_date: '1955-01-01',
          vote_average: 8.8,
          overview: 'Toroslar\'da bir eşkıyanın hikayesi.',
          genre_ids: [1, 14, 20]
        }
      ];
      setBooks(mockBooks);
      setLoading(false);
    }, 500);
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

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleGenreToggle = (genreId) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genreId)
        ? prev.genres.filter(id => id !== genreId)
        : [...prev.genres, genreId]
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      genres: [],
      yearFrom: '',
      yearTo: '',
      ratingFrom: '',
      ratingTo: ''
    });
  };

  const hasActiveFilters = filters.genres.length > 0 || filters.yearFrom || filters.yearTo || filters.ratingFrom || filters.ratingTo;

  // Filter and sort books
  const filteredAndSortedBooks = books
    .filter(book => {
      // Search filter
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      let matchesCategory = true;
      const currentYear = new Date().getFullYear();
      const bookYear = new Date(book.release_date).getFullYear();
      
      switch (activeCategory) {
        case 'new':
          matchesCategory = bookYear >= currentYear - 2;
          break;
        case 'top-rated':
          matchesCategory = book.vote_average >= 8.0;
          break;
        case 'popular':
        default:
          matchesCategory = true;
      }

      // Genre filter
      const matchesGenre = filters.genres.length === 0 || 
        filters.genres.some(genreId => book.genre_ids.includes(genreId));

      // Year filter
      const matchesYear = (!filters.yearFrom || bookYear >= parseInt(filters.yearFrom)) &&
                         (!filters.yearTo || bookYear <= parseInt(filters.yearTo));

      // Rating filter
      const matchesRating = (!filters.ratingFrom || book.vote_average >= parseFloat(filters.ratingFrom)) &&
                           (!filters.ratingTo || book.vote_average <= parseFloat(filters.ratingTo));

      return matchesSearch && matchesCategory && matchesGenre && matchesYear && matchesRating;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.vote_average - a.vote_average;
        case 'date':
          return new Date(b.release_date) - new Date(a.release_date);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'popularity':
        default:
          return 0;
      }
    });

  return (
    <div className="books-container">
      <Sidebar 
        onLogout={handleLogout}
        isSearchMode={isSearchMode}
        onSearchModeChange={setIsSearchMode}
      />
      <div className="books-content">
        {/* Header */}
        <div className="books-header">
          <h1 className="books-title">Kitaplar</h1>
          <p className="books-subtitle">Keşfetmek için binlerce kitap</p>
        </div>

        {/* Category Tabs */}
        <div className="books-categories">
          <button
            type="button"
            className={`category-tab ${activeCategory === 'popular' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('popular')}
          >
            Popüler
          </button>
          <button
            type="button"
            className={`category-tab ${activeCategory === 'new' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('new')}
          >
            Yeni Çıkanlar
          </button>
          <button
            type="button"
            className={`category-tab ${activeCategory === 'top-rated' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('top-rated')}
          >
            En Yüksek Puanlı
          </button>
          <button
            type="button"
            className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('all')}
          >
            Tümü
          </button>
        </div>

        {/* Search and Filters */}
        <div className="books-controls">
          <div className="books-search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="books-search-input"
              placeholder="Kitap ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="books-filters">
            <button
              type="button"
              className={`filter-btn ${hasActiveFilters ? 'active' : ''}`}
              onClick={() => {
                setIsFilterModalOpen(true);
                setIsFilterModalClosing(false);
              }}
            >
              <FaFilter className="filter-icon" />
              <span>Filtrele</span>
              {hasActiveFilters && <span className="filter-badge">{filters.genres.length + (filters.yearFrom ? 1 : 0) + (filters.yearTo ? 1 : 0) + (filters.ratingFrom ? 1 : 0) + (filters.ratingTo ? 1 : 0)}</span>}
            </button>
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popularity">Popülerlik</option>
              <option value="rating">Puan</option>
              <option value="date">Tarih</option>
              <option value="title">İsim</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="books-results-count">
            <span>{filteredAndSortedBooks.length} kitap bulundu</span>
          </div>
        )}

        {/* Books Grid */}
        {loading ? (
          <div className="books-loading">
            <div className="spinner"></div>
            <p>Yükleniyor...</p>
          </div>
        ) : filteredAndSortedBooks.length > 0 ? (
          <div className="books-grid">
            {filteredAndSortedBooks.map((book, index) => (
              <Link
                key={book.id}
                to={`/content/book/${book.id}`}
                className="book-card"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <div className="book-poster-wrapper">
                  <img
                    src={book.poster_path || '/placeholder.jpg'}
                    alt={book.title}
                    className="book-poster"
                  />
                  <div className="book-overlay">
                    <div className="book-rating">
                      <FaStar className="star-icon" />
                      <span>{book.vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <div className="book-meta">
                    <span className="book-year">
                      <FaCalendarAlt className="meta-icon" />
                      {new Date(book.release_date).getFullYear()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="books-empty">
            <p>Kitap bulunamadı</p>
            {hasActiveFilters && (
              <button
                type="button"
                className="clear-filters-btn"
                onClick={handleClearFilters}
              >
                Filtreleri Temizle
              </button>
            )}
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div 
          className={`filter-modal-overlay ${isFilterModalClosing ? 'closing' : ''}`}
          onClick={() => {
            setIsFilterModalClosing(true);
            setTimeout(() => {
              setIsFilterModalOpen(false);
              setIsFilterModalClosing(false);
            }, 300);
          }}
        >
          <div 
            className={`filter-modal ${isFilterModalClosing ? 'closing' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="filter-modal-header">
              <h2>Filtrele</h2>
              <button
                type="button"
                className="filter-modal-close"
                onClick={() => {
                  setIsFilterModalClosing(true);
                  setTimeout(() => {
                    setIsFilterModalOpen(false);
                    setIsFilterModalClosing(false);
                  }, 300);
                }}
              >
                <FaTimes />
              </button>
            </div>
            <div className="filter-modal-content">
              {/* Genres */}
              <div className="filter-section">
                <h3 className="filter-section-title">Türler</h3>
                <div className="genres-grid">
                  {genres.map(genre => (
                    <button
                      key={genre.id}
                      type="button"
                      className={`genre-chip ${filters.genres.includes(genre.id) ? 'active' : ''}`}
                      onClick={() => handleGenreToggle(genre.id)}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year Range */}
              <div className="filter-section">
                <h3 className="filter-section-title">Yıl Aralığı</h3>
                <div className="year-range">
                  <input
                    type="number"
                    className="year-input"
                    placeholder="Başlangıç"
                    value={filters.yearFrom}
                    onChange={(e) => setFilters(prev => ({ ...prev, yearFrom: e.target.value }))}
                    min="1000"
                    max={new Date().getFullYear()}
                  />
                  <span className="year-separator">-</span>
                  <input
                    type="number"
                    className="year-input"
                    placeholder="Bitiş"
                    value={filters.yearTo}
                    onChange={(e) => setFilters(prev => ({ ...prev, yearTo: e.target.value }))}
                    min="1000"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>

              {/* Rating Range */}
              <div className="filter-section">
                <h3 className="filter-section-title">Puan Aralığı</h3>
                <div className="rating-range">
                  <input
                    type="number"
                    className="rating-input"
                    placeholder="Min"
                    value={filters.ratingFrom}
                    onChange={(e) => setFilters(prev => ({ ...prev, ratingFrom: e.target.value }))}
                    min="0"
                    max="10"
                    step="0.1"
                  />
                  <span className="rating-separator">-</span>
                  <input
                    type="number"
                    className="rating-input"
                    placeholder="Max"
                    value={filters.ratingTo}
                    onChange={(e) => setFilters(prev => ({ ...prev, ratingTo: e.target.value }))}
                    min="0"
                    max="10"
                    step="0.1"
                  />
                </div>
              </div>
            </div>
            <div className="filter-modal-actions">
              <button
                type="button"
                className="filter-clear-btn"
                onClick={handleClearFilters}
              >
                Temizle
              </button>
              <button
                type="button"
                className="filter-apply-btn"
                onClick={() => {
                  setIsFilterModalClosing(true);
                  setTimeout(() => {
                    setIsFilterModalOpen(false);
                    setIsFilterModalClosing(false);
                  }, 300);
                }}
              >
                Uygula
              </button>
            </div>
          </div>
        </div>
      )}

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

export default Books;
