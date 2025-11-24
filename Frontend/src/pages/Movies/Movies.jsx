import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaFilter, FaSearch, FaStar, FaCalendarAlt } from 'react-icons/fa';
import BottomNav from '../../components/BottomNav';
import Sidebar from '../HomePage/Sidebar/Sidebar';
import LogoutModal from '../HomePage/LogoutModal/LogoutModal';
import MovieCardSkeleton from '../../components/MovieCardSkeleton';
import FilterModal from './components/FilterModal/FilterModal';
import { genres } from './utils/genres';
import { filterMovies, sortMovies, hasActiveFilters } from './utils/filterUtils';
import './styles/Movies.css';

function Movies() {
  const navigate = useNavigate();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [movies, setMovies] = useState([]);
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


  // Fetch movies from API
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        // Map category to API category
        let apiCategory = 'popular';
        if (activeCategory === 'top-rated') {
          apiCategory = 'top-rated';
        } else if (activeCategory === 'new') {
          apiCategory = 'new';
        }
        
        const response = await fetch(
          `http://localhost:8000/content/popular/movies?category=${apiCategory}&page=1`
        );
        
        if (response.ok) {
          const data = await response.json();
          const moviesList = data.results || [];
          
          // Format movies data
          const formattedMovies = moviesList.map(movie => ({
            id: movie.id, // TMDB API ID - this will be used directly
            title: movie.title,
            poster_path: movie.poster_path 
              ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` 
              : '/placeholder.jpg',
            release_date: movie.release_date,
            vote_average: movie.vote_average || 0,
            overview: movie.overview || '',
            genre_ids: movie.genre_ids || []
          }));
          
          setMovies(formattedMovies);
        } else {
          console.error("Filmler yüklenemedi:", response.status);
        }
      } catch (error) {
        console.error("Filmler API hatası:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, [activeCategory]);

  // Old mock data removed - now using API
  useEffect(() => {
    if (false) { // Disabled mock data
      const mockMovies = [
        {
          id: 1,
          title: 'Inception',
          poster_path: 'https://image.tmdb.org/t/p/w200/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
          release_date: '2010-07-16',
          vote_average: 8.8,
          overview: 'A skilled thief is given a chance at redemption if he can pull off an impossible heist.',
          genre_ids: [28, 878]
        },
        {
          id: 2,
          title: 'The Matrix',
          poster_path: 'https://image.tmdb.org/t/p/w200/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
          release_date: '1999-03-31',
          vote_average: 8.7,
          overview: 'A computer hacker learns about the true nature of reality.',
          genre_ids: [28, 878]
        },
        {
          id: 3,
          title: 'Interstellar',
          poster_path: 'https://image.tmdb.org/t/p/w200/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
          release_date: '2014-11-07',
          vote_average: 8.6,
          overview: 'A team of explorers travel through a wormhole in space.',
          genre_ids: [18, 878]
        },
        {
          id: 4,
          title: 'The Dark Knight',
          poster_path: 'https://image.tmdb.org/t/p/w200/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
          release_date: '2008-07-18',
          vote_average: 9.0,
          overview: 'Batman faces the Joker in a battle for Gotham City.',
          genre_ids: [28, 80, 18]
        },
        {
          id: 5,
          title: 'Pulp Fiction',
          poster_path: 'https://image.tmdb.org/t/p/w200/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
          release_date: '1994-10-14',
          vote_average: 8.9,
          overview: 'The lives of two mob hitmen, a boxer, and more intertwine.',
          genre_ids: [80, 18]
        },
        {
          id: 6,
          title: 'Fight Club',
          poster_path: 'https://image.tmdb.org/t/p/w200/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
          release_date: '1999-10-15',
          vote_average: 8.8,
          overview: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club.',
          genre_ids: [18]
        },
        {
          id: 7,
          title: 'The Shawshank Redemption',
          poster_path: 'https://image.tmdb.org/t/p/w200/9cqN61eyFph8HHi0zA6T1YgXvT.jpg',
          release_date: '1994-09-23',
          vote_average: 9.3,
          overview: 'Two imprisoned men bond over a number of years.',
          genre_ids: [18, 80]
        },
        {
          id: 8,
          title: 'Forrest Gump',
          poster_path: 'https://image.tmdb.org/t/p/w200/arw2vcBveWOVZr6pxd9XTd1Td2a.jpg',
          release_date: '1994-07-06',
          vote_average: 8.8,
          overview: 'The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man.',
          genre_ids: [18, 10749]
        },
        {
          id: 9,
          title: 'The Godfather',
          poster_path: 'https://image.tmdb.org/t/p/w200/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
          release_date: '1972-03-24',
          vote_average: 9.2,
          overview: 'The aging patriarch of an organized crime dynasty transfers control to his son.',
          genre_ids: [80, 18]
        },
        {
          id: 10,
          title: 'The Lord of the Rings: The Return of the King',
          poster_path: 'https://image.tmdb.org/t/p/w200/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg',
          release_date: '2003-12-17',
          vote_average: 8.9,
          overview: 'Aragorn is revealed as the heir to the ancient kings as he leads the forces of good.',
          genre_ids: [12, 14, 28]
        },
        {
          id: 11,
          title: 'Schindler\'s List',
          poster_path: 'https://image.tmdb.org/t/p/w200/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg',
          release_date: '1993-12-15',
          vote_average: 8.9,
          overview: 'In German-occupied Poland, Oskar Schindler gradually becomes concerned for his Jewish workforce.',
          genre_ids: [18, 36, 10752]
        },
        {
          id: 12,
          title: '12 Angry Men',
          poster_path: 'https://image.tmdb.org/t/p/w200/3W0v956XxSG5xgm7LB6qu8ExbJx.jpg',
          release_date: '1957-04-10',
          vote_average: 9.0,
          overview: 'A jury holdout attempts to prevent a miscarriage of justice.',
          genre_ids: [18, 80]
        },
        {
          id: 13,
          title: 'The Good, the Bad and the Ugly',
          poster_path: 'https://image.tmdb.org/t/p/w200/bX2xnavhMYjWDoZp1VM6VnU1xwe.jpg',
          release_date: '1966-12-23',
          vote_average: 8.8,
          overview: 'While the Civil War rages, three men hunt for a fortune in gold.',
          genre_ids: [37, 28]
        },
        {
          id: 14,
          title: 'The Dark Knight Rises',
          poster_path: 'https://image.tmdb.org/t/p/w200/85cWkCCftN5DJcX1q2rT2dwi7fw.jpg',
          release_date: '2012-07-20',
          vote_average: 8.4,
          overview: 'Eight years after the Joker\'s reign of anarchy, Batman must accept one of the greatest tests.',
          genre_ids: [28, 80, 18]
        },
        {
          id: 15,
          title: 'Goodfellas',
          poster_path: 'https://image.tmdb.org/t/p/w200/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg',
          release_date: '1990-09-21',
          vote_average: 8.7,
          overview: 'The story of Henry Hill and his life in the mob.',
          genre_ids: [80, 18]
        },
        {
          id: 16,
          title: 'Se7en',
          poster_path: 'https://image.tmdb.org/t/p/w200/69Sns8WoET6CfaYlIkHbla4l7nC.jpg',
          release_date: '1995-09-22',
          vote_average: 8.6,
          overview: 'Two detectives hunt a serial killer who uses the seven deadly sins as his motives.',
          genre_ids: [80, 18, 53]
        },
        {
          id: 17,
          title: 'The Silence of the Lambs',
          poster_path: 'https://image.tmdb.org/t/p/w200/uS9m8OBk1A8eM9I1415tXRfGq2C.jpg',
          release_date: '1991-02-14',
          vote_average: 8.6,
          overview: 'A young F.B.I. cadet must receive the help of an incarcerated cannibalistic serial killer.',
          genre_ids: [80, 18, 53, 27]
        },
        {
          id: 18,
          title: 'It\'s a Wonderful Life',
          poster_path: 'https://image.tmdb.org/t/p/w200/bSqt9rhDZx1Q7UZ16d1wM3Q6nxc.jpg',
          release_date: '1946-12-20',
          vote_average: 8.6,
          overview: 'An angel is sent from Heaven to help a desperately frustrated businessman.',
          genre_ids: [18, 14, 10751]
        },
        {
          id: 19,
          title: 'City of God',
          poster_path: 'https://image.tmdb.org/t/p/w200/k7eYdWvhYQyRQoU2TB2A2Xu2TfD.jpg',
          release_date: '2002-08-30',
          vote_average: 8.6,
          overview: 'Two boys growing up in a violent neighborhood of Rio de Janeiro take different paths.',
          genre_ids: [80, 18]
        },
        {
          id: 20,
          title: 'Saving Private Ryan',
          poster_path: 'https://image.tmdb.org/t/p/w200/uqx37cS8cpHg8U5fX5NvjJ6XHvB.jpg',
          release_date: '1998-07-24',
          vote_average: 8.6,
          overview: 'Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines.',
          genre_ids: [18, 10752]
        },
        {
          id: 21,
          title: 'The Green Mile',
          poster_path: 'https://image.tmdb.org/t/p/w200/velWPhVMQeQKcxggNEU8YmIo52R.jpg',
          release_date: '1999-12-10',
          vote_average: 8.6,
          overview: 'The lives of guards on Death Row are affected by one of their charges.',
          genre_ids: [18, 14, 80]
        },
        {
          id: 22,
          title: 'Life Is Beautiful',
          poster_path: 'https://image.tmdb.org/t/p/w200/74hLDKjD5aGYOotO6esUVaeISa2.jpg',
          release_date: '1997-12-20',
          vote_average: 8.6,
          overview: 'When an open-minded Jewish waiter and his son become victims of the Holocaust.',
          genre_ids: [35, 18]
        },
        {
          id: 23,
          title: 'Terminator 2: Judgment Day',
          poster_path: 'https://image.tmdb.org/t/p/w200/5M0j0B18abtWI5BI0E9orckvS25.jpg',
          release_date: '1991-07-03',
          vote_average: 8.5,
          overview: 'A cyborg, identical to the one who failed to kill Sarah Connor, must now protect her son.',
          genre_ids: [28, 878, 53]
        },
        {
          id: 24,
          title: 'Back to the Future',
          poster_path: 'https://image.tmdb.org/t/p/w200/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg',
          release_date: '1985-07-03',
          vote_average: 8.5,
          overview: 'Marty McFly, a 17-year-old high school student, is accidentally sent 30 years into the past.',
          genre_ids: [12, 35, 878, 10751]
        },
        {
          id: 25,
          title: 'Spirited Away',
          poster_path: 'https://image.tmdb.org/t/p/w200/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
          release_date: '2001-07-20',
          vote_average: 8.5,
          overview: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods.',
          genre_ids: [16, 14, 10751]
        }
      ];
      // Mock data disabled
    }
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

  const handleClearFilters = () => {
    setFilters({
      genres: [],
      yearFrom: '',
      yearTo: '',
      ratingFrom: '',
      ratingTo: ''
    });
  };

  const handleFilterModalClose = () => {
    setIsFilterModalClosing(true);
    setTimeout(() => {
      setIsFilterModalOpen(false);
      setIsFilterModalClosing(false);
    }, 300);
  };

  // Filter and sort movies
  const filteredMovies = filterMovies(movies, searchQuery, activeCategory, filters);
  const filteredAndSortedMovies = sortMovies(filteredMovies, sortBy);

  return (
    <div className="movies-container">
      <Sidebar 
        onLogout={handleLogout}
        isSearchMode={isSearchMode}
        onSearchModeChange={setIsSearchMode}
      />
      <div className="movies-content">
        {/* Header */}
        <div className="movies-header">
          <h1 className="movies-title">Filmler</h1>
          <p className="movies-subtitle">Keşfetmek için binlerce film</p>
        </div>

        {/* Category Tabs */}
        <div className="movies-categories">
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
        <div className="movies-controls">
          <div className="movies-search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="movies-search-input"
              placeholder="Film ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="movies-filters">
            <button
              type="button"
              className={`filter-btn ${hasActiveFilters(filters) ? 'active' : ''}`}
              onClick={() => {
                setIsFilterModalOpen(true);
                setIsFilterModalClosing(false);
              }}
            >
              <FaFilter className="filter-icon" />
              <span>Filtrele</span>
              {hasActiveFilters(filters) && <span className="filter-badge">{filters.genres.length + (filters.yearFrom ? 1 : 0) + (filters.yearTo ? 1 : 0) + (filters.ratingFrom ? 1 : 0) + (filters.ratingTo ? 1 : 0)}</span>}
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
          <div className="movies-results-count">
            <span>{filteredAndSortedMovies.length} film bulundu</span>
          </div>
        )}

        {/* Movies Grid */}
        {loading ? (
          <div className="movies-grid">
            {[...Array(12)].map((_, index) => (
              <MovieCardSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        ) : filteredAndSortedMovies.length > 0 ? (
          <div className="movies-grid">
            {filteredAndSortedMovies.map((movie, index) => (
              <Link
                key={movie.id}
                to={`/content/movie/${movie.id}`}
                className="movie-card"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <div className="movie-poster-wrapper">
                  <img
                    src={movie.poster_path || '/placeholder.jpg'}
                    alt={movie.title}
                    className="movie-poster"
                  />
                  <div className="movie-overlay">
                    <div className="movie-rating">
                      <FaStar className="star-icon" />
                      <span>{movie.vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <div className="movie-meta">
                    <span className="movie-year">
                      <FaCalendarAlt className="meta-icon" />
                      {new Date(movie.release_date).getFullYear()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="movies-empty">
            <p>Film bulunamadı</p>
            {hasActiveFilters(filters) && (
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
      <FilterModal
        isOpen={isFilterModalOpen}
        isClosing={isFilterModalClosing}
        onClose={handleFilterModalClose}
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={handleClearFilters}
        genres={genres}
      />

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

export default Movies;
