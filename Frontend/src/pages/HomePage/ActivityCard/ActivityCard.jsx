import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFilm, FaBook, FaRegThumbsUp, FaRegCommentDots } from 'react-icons/fa';
import ShinyText from '../../../components/ShinyText';
import { getMockComments } from '../utils/mockData';
import { formatTimeAgo, truncateText } from '../utils/utils';
import './ActivityCard.css';

// Aktivite Kartı Bileşeni
function ActivityCard({ activity, onCommentClick, isCommentPanelOpen }) {
  const [isLiked, setIsLiked] = useState(false);
  const [comments] = useState(getMockComments(activity.id));

  const handleLike = (e) => {
    e.preventDefault();
    setIsLiked(!isLiked);
  };

  const handleCommentToggle = (e) => {
    e.preventDefault();
    if (onCommentClick) {
      onCommentClick(activity, comments);
    }
  };

  const renderRatingStars = (rating) => {
    const normalizedRating = Math.max(0, Math.min(10, rating || 0));
    const starRating = (normalizedRating / 10) * 5;
    const fullStars = Math.floor(starRating);
    const hasHalfStar = starRating % 1 >= 0.5;
    const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

    return (
      <div className="rating-stars">
        {fullStars > 0 && [...Array(fullStars)].map((_, i) => (
          <span key={i} className="star full">★</span>
        ))}
        {hasHalfStar && <span className="star half">★</span>}
        {emptyStars > 0 && [...Array(emptyStars)].map((_, i) => (
          <span key={i} className="star empty">☆</span>
        ))}
        <span className="rating-value">{normalizedRating.toFixed(1)}/10</span>
      </div>
    );
  };

  return (
    <div className="activity-card">
      {/* Üst Bilgi (Header) */}
      <div className="activity-header">
        <div className="user-info">
          <img 
            src={activity.userAvatar || '/api/placeholder/40/40'} 
            alt={activity.userName}
            className="user-avatar"
          />
          <div className="user-details">
            <Link to={`/profile/${activity.userId}`} className="user-name-link">
              <ShinyText text={activity.userName} speed={4} className="user-name" />
            </Link>
            <span className="action-text">{activity.actionText}</span>
          </div>
        </div>
        <span className="activity-date">{formatTimeAgo(activity.date)}</span>
      </div>

      {/* Ana İçerik (Body) */}
      <div className="activity-body">
        {activity.type === 'rating' ? (
          <div className="rating-activity">
            <div className="content-poster">
              <Link 
                to={`/content/${activity.contentType === 'Film' ? 'movie' : 'book'}/${activity.contentId || activity.id}`}
                className="poster-link"
              >
                <img 
                  src={activity.contentPoster || '/api/placeholder/200/300'} 
                  alt={activity.contentTitle}
                  className="poster-image"
                />
              </Link>
              <div className="content-info">
                <div className="content-header">
                  <Link 
                    to={`/content/${activity.contentType === 'Film' ? 'movie' : 'book'}/${activity.contentId || activity.id}`} 
                    className="content-title-link"
                  >
                    <ShinyText text={activity.contentTitle} speed={4} className="content-title" />
                  </Link>
                  <div className={`content-type-badge ${activity.contentType === 'Film' ? 'film-badge' : 'book-badge'}`}>
                    {activity.contentType === 'Film' ? <FaFilm /> : <FaBook />}
                    <span>{activity.contentType}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="rating-display">
              {renderRatingStars(activity.rating)}
            </div>
          </div>
        ) : activity.type === 'review' ? (
          <div className="review-activity">
            <div className="content-poster">
              <Link 
                to={`/content/${activity.contentType === 'Film' ? 'movie' : 'book'}/${activity.contentId || activity.id}`}
                className="poster-link"
              >
                <img 
                  src={activity.contentPoster || '/api/placeholder/200/300'} 
                  alt={activity.contentTitle}
                  className="poster-image"
                />
              </Link>
              <div className="content-info">
                <div className="content-header">
                  <Link 
                    to={`/content/${activity.contentType === 'Film' ? 'movie' : 'book'}/${activity.contentId || activity.id}`} 
                    className="content-title-link"
                  >
                    <ShinyText text={activity.contentTitle} speed={4} className="content-title" />
                  </Link>
                  <div className={`content-type-badge ${activity.contentType === 'Film' ? 'film-badge' : 'book-badge'}`}>
                    {activity.contentType === 'Film' ? <FaFilm /> : <FaBook />}
                    <span>{activity.contentType}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="review-excerpt">
              <p>{truncateText(activity.reviewText)}</p>
              {activity.reviewText.length > 200 && (
                <button 
                  onClick={handleCommentToggle}
                  className="read-more-link"
                >
                  <ShinyText text="...daha fazlasını oku" speed={4} className="read-more-text" />
                </button>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Alt Bilgi (Footer) / Etkileşim */}
      <div className="activity-footer">
        <button 
          className={`interaction-btn like-btn ${isLiked ? 'active' : ''}`}
          onClick={handleLike}
        >
          <FaRegThumbsUp className="btn-icon" />
          {(activity.likes > 0 || isLiked) && (
            <span className="count">{activity.likes + (isLiked ? 1 : 0)}</span>
          )}
        </button>
        <button 
          className={`interaction-btn comment-btn ${isCommentPanelOpen ? 'active' : ''}`}
          onClick={handleCommentToggle}
        >
          <FaRegCommentDots className="btn-icon" />
          {(activity.comments > 0 || comments.length > 0) && (
            <span className="count">{activity.comments > 0 ? activity.comments : comments.length}</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default ActivityCard;

