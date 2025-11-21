import './BookCardSkeleton.css';

function BookCardSkeleton() {
  return (
    <div className="book-card-skeleton">
      <div className="skeleton-poster-wrapper">
        <div className="skeleton-poster"></div>
      </div>
      <div className="skeleton-info">
        <div className="skeleton-title"></div>
        <div className="skeleton-meta"></div>
      </div>
    </div>
  );
}

export default BookCardSkeleton;

