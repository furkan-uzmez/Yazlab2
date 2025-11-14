import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaFilm, FaBook, FaSearch, FaGripLines, FaSignOutAlt } from 'react-icons/fa';
import ShinyText from '../../../components/ShinyText';
import './Sidebar.css';

function Sidebar({ onLogout }) {
  const location = useLocation();

  return (
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
          <button type="button" className="nav-item" onClick={onLogout}>
            <FaSignOutAlt className="nav-icon" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

