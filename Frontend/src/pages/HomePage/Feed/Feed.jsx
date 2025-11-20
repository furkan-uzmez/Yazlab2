import { useState, useRef, useEffect } from 'react';
import ActivityCard from '../ActivityCard/ActivityCard';
import ActivityCardSkeleton from '../../../components/ActivityCardSkeleton';
import './Feed.css';

function Feed({ 
  activities, 
  loading, 
  initialLoading, 
  hasMore, 
  onCommentClick, 
  commentPanelOpen, 
  selectedActivity,
  loadingRef,
  followedUsers = new Set()
}) {
  const [activeTab, setActiveTab] = useState('for-you'); // 'for-you' or 'following'
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
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
    </main>
  );
}

export default Feed;

