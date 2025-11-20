import { FaFilm, FaBook, FaClock } from 'react-icons/fa';
import './LibraryTabs.css';

function LibraryTabs({ 
  activeTab, 
  onTabChange, 
  isTabTransitioning,
  libraryData 
}) {
  return (
    <div className="profile-library-section">
      <div className="library-tabs">
        <button
          className={`library-tab ${activeTab === 'watched' ? 'active' : ''}`}
          onClick={() => onTabChange('watched')}
        >
          <FaFilm />
          <span>İzlediklerim</span>
        </button>
        <button
          className={`library-tab ${activeTab === 'toWatch' ? 'active' : ''}`}
          onClick={() => onTabChange('toWatch')}
        >
          <FaClock />
          <span>İzlenecekler</span>
        </button>
        <button
          className={`library-tab ${activeTab === 'read' ? 'active' : ''}`}
          onClick={() => onTabChange('read')}
        >
          <FaBook />
          <span>Okuduklarım</span>
        </button>
        <button
          className={`library-tab ${activeTab === 'toRead' ? 'active' : ''}`}
          onClick={() => onTabChange('toRead')}
        >
          <FaClock />
          <span>Okunacaklar</span>
        </button>
      </div>
      <div className={`library-content ${isTabTransitioning ? 'transitioning' : ''}`}>
        {activeTab === 'watched' && (
          <div className="library-items">
            {libraryData.watched.length > 0 ? (
              libraryData.watched.map((item, index) => (
                <div key={index} className="library-item">
                  <img src={item.poster_url || '/placeholder.jpg'} alt={item.title} />
                  <span>{item.title}</span>
                </div>
              ))
            ) : (
              <p className="empty-state">Henüz izlenen içerik yok</p>
            )}
          </div>
        )}
        {activeTab === 'toWatch' && (
          <div className="library-items">
            {libraryData.toWatch.length > 0 ? (
              libraryData.toWatch.map((item, index) => (
                <div key={index} className="library-item">
                  <img src={item.poster_url || '/placeholder.jpg'} alt={item.title} />
                  <span>{item.title}</span>
                </div>
              ))
            ) : (
              <p className="empty-state">Henüz izlenecek içerik yok</p>
            )}
          </div>
        )}
        {activeTab === 'read' && (
          <div className="library-items">
            {libraryData.read.length > 0 ? (
              libraryData.read.map((item, index) => (
                <div key={index} className="library-item">
                  <img src={item.poster_url || '/placeholder.jpg'} alt={item.title} />
                  <span>{item.title}</span>
                </div>
              ))
            ) : (
              <p className="empty-state">Henüz okunan içerik yok</p>
            )}
          </div>
        )}
        {activeTab === 'toRead' && (
          <div className="library-items">
            {libraryData.toRead.length > 0 ? (
              libraryData.toRead.map((item, index) => (
                <div key={index} className="library-item">
                  <img src={item.poster_url || '/placeholder.jpg'} alt={item.title} />
                  <span>{item.title}</span>
                </div>
              ))
            ) : (
              <p className="empty-state">Henüz okunacak içerik yok</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default LibraryTabs;

