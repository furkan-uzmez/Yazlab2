import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaFilm, FaBook, FaSearch } from 'react-icons/fa';
import './BottomNav.css';

function BottomNav({ onSearchClick, isSearchMode }) {
  const location = useLocation();

  const handleSearchClick = (e) => {
    e.preventDefault();
    if (onSearchClick) {
      onSearchClick();
    }
  };

  return (
    <nav className="bottom-nav">
      <Link 
        to="/home" 
        className={`bottom-nav-item ${location.pathname === '/home' || location.pathname === '/' ? 'active' : ''}`}
      >
        <FaHome className="bottom-nav-icon" />
      </Link>
      <Link 
        to="/profile" 
        className={`bottom-nav-item ${location.pathname.startsWith('/profile') ? 'active' : ''}`}
      >
        <FaUser className="bottom-nav-icon" />
      </Link>
      <Link 
        to="/movies" 
        className={`bottom-nav-item ${location.pathname === '/movies' ? 'active' : ''}`}
      >
        <FaFilm className="bottom-nav-icon" />
      </Link>
      <Link 
        to="/books" 
        className={`bottom-nav-item ${location.pathname === '/books' ? 'active' : ''}`}
      >
        <FaBook className="bottom-nav-icon" />
      </Link>
      <button
        type="button"
        className={`bottom-nav-item ${isSearchMode ? 'active' : ''}`}
        onClick={handleSearchClick}
      >
        <FaSearch className="bottom-nav-icon" />
      </button>
    </nav>
  );
}

export default BottomNav;

