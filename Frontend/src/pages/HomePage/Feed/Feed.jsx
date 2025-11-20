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
  loadingRef 
}) {
  const [activeTab, setActiveTab] = useState('for-you'); // 'for-you' or 'following'
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const feedContainerRef = useRef(null);

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
            onClick={() => setActiveTab('for-you')}
          >
            Senin için
          </button>
          <button
            type="button"
            className={`feed-tab ${activeTab === 'following' ? 'active' : ''}`}
            onClick={() => setActiveTab('following')}
          >
            Takip Ettiklerin
          </button>
        </div>
      </div>

      <div className="activities-feed">
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
            {activities.map((activity) => (
              <ActivityCard 
                key={activity.id} 
                activity={activity} 
                onCommentClick={onCommentClick}
                isCommentPanelOpen={commentPanelOpen && selectedActivity?.id === activity.id}
              />
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
        )}
      </div>

      {/* Loading ve Daha Fazla Yükle */}
      <div ref={loadingRef} className="load-more-container">
        {!initialLoading && loading && activities.length > 0 && (
          <div className="loading-wrapper">
            <div className="simple-spinner"></div>
            <p className="loading-text">Yükleniyor...</p>
          </div>
        )}
        {!hasMore && activities.length > 0 && !initialLoading && (
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

