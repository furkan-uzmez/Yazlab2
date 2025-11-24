import { useState, useRef, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import ActivityCard from '../ActivityCard/ActivityCard';
import ActivityCardSkeleton from '../../../components/ActivityCardSkeleton';
import GradualBlur from '../../../components/GradualBlur';
import AddPostModal from './AddPostModal/AddPostModal';
import './Feed.css';

function Feed({ 
  activities, 
  loading, 
  initialLoading, 
  hasMore, 
  onCommentClick, 
  onLike,
  commentPanelOpen, 
  selectedActivity,
  loadingRef,
  followedUsers = new Set(),
  onRefreshFeed
}) {
  const [activeTab, setActiveTab] = useState('for-you'); // 'for-you' or 'following'
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false);
  const feedContainerRef = useRef(null);

  // Tab'a göre aktiviteleri filtrele
  const filteredActivities = activeTab === 'following' 
    ? activities.filter(activity => {
        // userId veya userName'e göre filtrele
        const userId = activity.userId;
        const userName = activity.userName;
        return followedUsers.has(userId) || followedUsers.has(userName);
      })
    : activities;

  // Tab değiştiğinde geçiş animasyonu
  const handleTabChange = (newTab) => {
    if (newTab !== activeTab) {
      setIsTransitioning(true);
      // Scroll pozisyonunu sıfırla
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        setActiveTab(newTab);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 200);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        // En üstteyse her zaman göster
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Aşağı kaydırılıyor
        setIsHeaderVisible(false);
      } else {
        // Yukarı kaydırılıyor
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <main className="feed-container" ref={feedContainerRef}>
      <div className={`feed-header ${isHeaderVisible ? 'visible' : 'hidden'}`}>
        <div className="feed-header-content">
          <div className="feed-tabs">
            <button
              type="button"
              className={`feed-tab ${activeTab === 'for-you' ? 'active' : ''}`}
              onClick={() => handleTabChange('for-you')}
            >
              Senin için
            </button>
            <button
              type="button"
              className={`feed-tab ${activeTab === 'following' ? 'active' : ''}`}
              onClick={() => handleTabChange('following')}
            >
              Takip Ettiklerin
            </button>
          </div>
          <div className="feed-header-logo">
            <img src="/readditlogo.png" alt="Readdit Logo" className="feed-logo" />
          </div>
          <div className="feed-header-spacer"></div>
        </div>
      </div>

      <div className={`activities-feed ${isTransitioning ? 'transitioning' : ''}`}>
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
            {filteredActivities.length > 0 ? (
              <>
                {filteredActivities.map((activity, index) => (
                  <div 
                    key={activity.id}
                    className="activity-card-wrapper"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <ActivityCard 
                      activity={activity} 
                      onCommentClick={onCommentClick}
                      onLike={onLike}
                      isCommentPanelOpen={commentPanelOpen && selectedActivity?.id === activity.id}
                    />
                  </div>
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
            ) : (
              <div className="empty-feed-message">
                <p>
                  {activeTab === 'following' 
                    ? 'Takip ettiğiniz kullanıcıların henüz gönderisi yok.' 
                    : 'Henüz gönderi yok.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Loading ve Daha Fazla Yükle */}
      <div ref={loadingRef} className="load-more-container">
        {!initialLoading && loading && filteredActivities.length > 0 && (
          <div className="loading-wrapper">
            <div className="simple-spinner"></div>
            <p className="loading-text">Yükleniyor...</p>
          </div>
        )}
        {!hasMore && filteredActivities.length > 0 && !initialLoading && (
          <div className="no-more-wrapper">
            <div className="no-more-divider"></div>
            <p className="no-more-text">Tüm aktiviteler yüklendi</p>
            <div className="no-more-divider"></div>
          </div>
        )}
      </div>

      {/* Gradual Blur Effect - Fixed at bottom of screen, only in feed area */}
      <div className="feed-gradual-blur-wrapper">
        <GradualBlur 
          position="bottom"
          height="6rem"
          strength={2}
          opacity={1}
          target="parent"
        />
      </div>

      {/* Add Post Button */}
      <button
        type="button"
        className="feed-add-post-btn"
        onClick={() => setIsAddPostModalOpen(true)}
        title="Yeni Gönderi"
      >
        <FaPlus />
      </button>

      {/* Add Post Modal */}
      <AddPostModal
        isOpen={isAddPostModalOpen}
        onClose={() => setIsAddPostModalOpen(false)}
        onPostAdded={() => {
          if (onRefreshFeed) {
            onRefreshFeed();
          }
        }}
      />
    </main>
  );
}

export default Feed;

