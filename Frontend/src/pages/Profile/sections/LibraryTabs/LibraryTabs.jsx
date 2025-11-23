import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFilm, FaBook, FaClock, FaPlus, FaChevronRight } from 'react-icons/fa';
import './LibraryTabs.css';

function LibraryTabs({ 
  activeTab, 
  onTabChange, 
  isTabTransitioning,
  libraryData,
  isOwnProfile,
  onAddContentClick
}) {
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState({
    watched: false,
    toWatch: false,
    read: false,
    toRead: false
  });

  const handleItemClick = (item) => {
    if (!item.id) return; // Eğer id yoksa tıklanabilir değil
    
    // Tab'a göre type belirle
    const contentType = (activeTab === 'watched' || activeTab === 'toWatch') ? 'movie' : 'book';
    navigate(`/content/${contentType}/${item.id}`);
  };

  const getItemsToShow = (items, tabKey) => {
    const totalItems = items.length + (isOwnProfile ? 1 : 0);
    if (showMore[tabKey] || totalItems <= 6) {
      return items;
    }
    // 5 içerik + 1 ekle butonu = 6, o yüzden 5 içerik göster
    return items.slice(0, 5);
  };

  const shouldShowMoreButton = (items, tabKey) => {
    const totalItems = items.length + (isOwnProfile ? 1 : 0);
    return totalItems > 6 && !showMore[tabKey];
  };

  // Tab değiştiğinde showMore state'ini sıfırla
  const handleTabChangeWithReset = (newTab) => {
    setShowMore({
      watched: false,
      toWatch: false,
      read: false,
      toRead: false
    });
    onTabChange(newTab);
  };
  return (
    <div className="profile-library-section">
      <div className="library-tabs">
        <button
          className={`library-tab ${activeTab === 'watched' ? 'active' : ''}`}
          onClick={() => handleTabChangeWithReset('watched')}
        >
          <FaFilm />
          <span>İzlediklerim</span>
        </button>
        <button
          className={`library-tab ${activeTab === 'toWatch' ? 'active' : ''}`}
          onClick={() => handleTabChangeWithReset('toWatch')}
        >
          <FaClock />
          <span>İzlenecekler</span>
        </button>
        <button
          className={`library-tab ${activeTab === 'read' ? 'active' : ''}`}
          onClick={() => handleTabChangeWithReset('read')}
        >
          <FaBook />
          <span>Okuduklarım</span>
        </button>
        <button
          className={`library-tab ${activeTab === 'toRead' ? 'active' : ''}`}
          onClick={() => handleTabChangeWithReset('toRead')}
        >
          <FaClock />
          <span>Okunacaklar</span>
        </button>
      </div>
      <div className={`library-content ${isTabTransitioning ? 'transitioning' : ''}`}>
        {activeTab === 'watched' && (
          <>
            <div className="library-items">
              {getItemsToShow(libraryData.watched, 'watched').map((item, index) => (
                <div 
                  key={index} 
                  className="library-item"
                  onClick={() => handleItemClick(item)}
                  style={{ cursor: item.id ? 'pointer' : 'default' }}
                >
                  <img src={item.poster_url || '/placeholder.jpg'} alt={item.title} />
                  <span>{item.title}</span>
                </div>
              ))}
              {isOwnProfile && (
                <div className="library-item library-item-add" onClick={() => onAddContentClick('watched')}>
                  <div className="add-poster">
                    <FaPlus className="add-icon" />
                  </div>
                  <span>Ekle</span>
                </div>
              )}
            </div>
            {shouldShowMoreButton(libraryData.watched, 'watched') && (
              <button 
                className="show-more-btn"
                onClick={() => setShowMore(prev => ({ ...prev, watched: true }))}
              >
                <span>Daha fazla göster</span>
                <FaChevronRight />
              </button>
            )}
          </>
        )}
        {activeTab === 'toWatch' && (
          <>
            <div className="library-items">
              {getItemsToShow(libraryData.toWatch, 'toWatch').map((item, index) => (
                <div 
                  key={index} 
                  className="library-item"
                  onClick={() => handleItemClick(item)}
                  style={{ cursor: item.id ? 'pointer' : 'default' }}
                >
                  <img src={item.poster_url || '/placeholder.jpg'} alt={item.title} />
                  <span>{item.title}</span>
                </div>
              ))}
              {isOwnProfile && (
                <div className="library-item library-item-add" onClick={() => onAddContentClick('toWatch')}>
                  <div className="add-poster">
                    <FaPlus className="add-icon" />
                  </div>
                  <span>Ekle</span>
                </div>
              )}
            </div>
            {shouldShowMoreButton(libraryData.toWatch, 'toWatch') && (
              <button 
                className="show-more-btn"
                onClick={() => setShowMore(prev => ({ ...prev, toWatch: true }))}
              >
                <span>Daha fazla göster</span>
                <FaChevronRight />
              </button>
            )}
          </>
        )}
        {activeTab === 'read' && (
          <>
            <div className="library-items">
              {getItemsToShow(libraryData.read, 'read').map((item, index) => (
                <div 
                  key={index} 
                  className="library-item"
                  onClick={() => handleItemClick(item)}
                  style={{ cursor: item.id ? 'pointer' : 'default' }}
                >
                  <img src={item.poster_url || '/placeholder.jpg'} alt={item.title} />
                  <span>{item.title}</span>
                </div>
              ))}
              {isOwnProfile && (
                <div className="library-item library-item-add" onClick={() => onAddContentClick('read')}>
                  <div className="add-poster">
                    <FaPlus className="add-icon" />
                  </div>
                  <span>Ekle</span>
                </div>
              )}
            </div>
            {shouldShowMoreButton(libraryData.read, 'read') && (
              <button 
                className="show-more-btn"
                onClick={() => setShowMore(prev => ({ ...prev, read: true }))}
              >
                <span>Daha fazla göster</span>
                <FaChevronRight />
              </button>
            )}
          </>
        )}
        {activeTab === 'toRead' && (
          <>
            <div className="library-items">
              {getItemsToShow(libraryData.toRead, 'toRead').map((item, index) => (
                <div 
                  key={index} 
                  className="library-item"
                  onClick={() => handleItemClick(item)}
                  style={{ cursor: item.id ? 'pointer' : 'default' }}
                >
                  <img src={item.poster_url || '/placeholder.jpg'} alt={item.title} />
                  <span>{item.title}</span>
                </div>
              ))}
              {isOwnProfile && (
                <div className="library-item library-item-add" onClick={() => onAddContentClick('toRead')}>
                  <div className="add-poster">
                    <FaPlus className="add-icon" />
                  </div>
                  <span>Ekle</span>
                </div>
              )}
            </div>
            {shouldShowMoreButton(libraryData.toRead, 'toRead') && (
              <button 
                className="show-more-btn"
                onClick={() => setShowMore(prev => ({ ...prev, toRead: true }))}
              >
                <span>Daha fazla göster</span>
                <FaChevronRight />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default LibraryTabs;

