import './ActivityCardSkeleton.css';

function ActivityCardSkeleton() {
  return (
    <div className="activity-card-skeleton">
      {/* Üst Bilgi (Header) Skeleton */}
      <div className="skeleton-header">
        <div className="skeleton-user-info">
          <div className="skeleton-avatar"></div>
          <div className="skeleton-user-details">
            <div className="skeleton-line skeleton-name"></div>
            <div className="skeleton-line skeleton-action"></div>
          </div>
        </div>
        <div className="skeleton-line skeleton-date"></div>
      </div>

      {/* Ana İçerik (Body) Skeleton */}
      <div className="skeleton-body">
        <div className="skeleton-content-poster">
          <div className="skeleton-poster-image"></div>
          <div className="skeleton-content-info">
            <div className="skeleton-line skeleton-title"></div>
            <div className="skeleton-line skeleton-type"></div>
          </div>
        </div>
        <div className="skeleton-rating">
          <div className="skeleton-stars"></div>
        </div>
      </div>

      {/* Alt Bilgi (Footer) Skeleton */}
      <div className="skeleton-footer">
        <div className="skeleton-button"></div>
        <div className="skeleton-button"></div>
      </div>
    </div>
  );
}

export default ActivityCardSkeleton;

