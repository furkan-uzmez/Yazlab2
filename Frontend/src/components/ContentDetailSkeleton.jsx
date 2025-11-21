import './ContentDetailSkeleton.css';

function ContentDetailSkeleton() {
  return (
    <div className="content-detail-skeleton">
      {/* Hero Section Skeleton */}
      <div className="skeleton-hero">
        <div className="skeleton-poster-wrapper">
          <div className="skeleton-poster"></div>
        </div>
        <div className="skeleton-info">
          <div className="skeleton-title"></div>
          <div className="skeleton-meta-row">
            <div className="skeleton-meta-item"></div>
            <div className="skeleton-meta-item"></div>
          </div>
          <div className="skeleton-rating-section">
            <div className="skeleton-rating-value"></div>
            <div className="skeleton-rating-count"></div>
          </div>
          <div className="skeleton-genres">
            <div className="skeleton-genre"></div>
            <div className="skeleton-genre"></div>
            <div className="skeleton-genre"></div>
          </div>
          <div className="skeleton-creator"></div>
          <div className="skeleton-actions">
            <div className="skeleton-rating-stars"></div>
            <div className="skeleton-buttons">
              <div className="skeleton-button"></div>
              <div className="skeleton-button"></div>
              <div className="skeleton-button"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Section Skeleton */}
      <div className="skeleton-overview">
        <div className="skeleton-overview-title"></div>
        <div className="skeleton-overview-lines">
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line skeleton-line-short"></div>
        </div>
      </div>
    </div>
  );
}

export default ContentDetailSkeleton;

