import { useRef } from 'react';
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
  return (
    <main className="feed-container">
      <div className="feed-header">
        <h1 className="feed-title">Ana Sayfa</h1>
        <p className="feed-subtitle">Sosyal Akış - Zaman Tüneli</p>
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
            <div className="modern-spinner">
              <div className="spinner-ring">
                <div className="spinner-ring-inner"></div>
              </div>
              <div className="spinner-dots">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
            <div className="loading-text-container">
              <p className="loading-text">Yeni içerikler yükleniyor</p>
              <div className="loading-progress">
                <div className="loading-progress-bar"></div>
              </div>
            </div>
          </div>
        )}
        {!hasMore && activities.length > 0 && !initialLoading && (
          <div className="no-more-wrapper">
            <div className="no-more-icon">✓</div>
            <p className="no-more-activities">Tüm aktiviteler yüklendi</p>
            <p className="no-more-subtitle">Daha fazla içerik için sayfayı yenileyin</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default Feed;

