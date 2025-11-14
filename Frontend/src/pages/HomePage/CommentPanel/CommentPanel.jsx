import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes, FaFilm, FaBook, FaRegThumbsUp, FaArrowRight } from 'react-icons/fa';
import { formatTimeAgo } from '../utils/utils';
import './CommentPanel.css';

// Yorum Metni Bileşeni (Daha Fazla Göster özelliği ile)
function CommentText({ text, maxLength = 150 }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = text.length > maxLength;
  const displayText = isExpanded || !shouldTruncate ? text : text.substring(0, maxLength) + '...';

  if (!shouldTruncate) {
    return <p className="comment-panel-comment-text">{text}</p>;
  }

  return (
    <div className="comment-text-wrapper">
      <p className="comment-panel-comment-text">
        {displayText}
      </p>
      <button 
        className="comment-show-more-btn"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? 'Daha az göster' : 'Daha fazla göster'}
      </button>
    </div>
  );
}

function CommentPanel({ 
  isOpen, 
  isClosing, 
  selectedActivity, 
  comments, 
  likedComments,
  commentText,
  onClose, 
  onCommentLike, 
  onCommentSubmit, 
  onCommentTextChange 
}) {
  if (!isOpen || !selectedActivity) return null;

  return (
    <>
      <div 
        className={`comment-panel-overlay ${isClosing ? 'closing' : ''}`} 
        onClick={onClose}
      ></div>
      <div className={`comment-panel ${isClosing ? 'closing' : ''}`}>
        <div className="comment-panel-header">
          <h3 className="comment-panel-title">Yorumlar</h3>
          <button 
            className="comment-panel-close"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>

        <div className="comment-panel-content">
          {/* Gönderi Bilgileri */}
          <div className="comment-panel-post">
            <div className="comment-panel-post-header">
              <img 
                src={selectedActivity.userAvatar || '/api/placeholder/40/40'} 
                alt={selectedActivity.userName}
                className="comment-panel-user-avatar"
              />
              <div className="comment-panel-user-info">
                <Link to={`/profile/${selectedActivity.userId}`} className="comment-panel-user-name">
                  {selectedActivity.userName}
                </Link>
                <span className="comment-panel-post-date">
                  {formatTimeAgo(selectedActivity.date)}
                </span>
              </div>
            </div>
            <div className="comment-panel-post-content">
              {selectedActivity.type === 'rating' ? (
                <div className="comment-panel-rating">
                  <div className="comment-panel-poster">
                    <img 
                      src={selectedActivity.contentPoster || '/api/placeholder/200/300'} 
                      alt={selectedActivity.contentTitle}
                      className="comment-panel-poster-image"
                    />
                    <div className="comment-panel-poster-info">
                      <h4>{selectedActivity.contentTitle}</h4>
                      <span className={`content-type-badge ${selectedActivity.contentType === 'Film' ? 'film-badge' : 'book-badge'}`}>
                        {selectedActivity.contentType === 'Film' ? <FaFilm /> : <FaBook />}
                        <span>{selectedActivity.contentType}</span>
                      </span>
                      {selectedActivity.rating && (
                        <div className="comment-panel-rating-display">
                          <div className="comment-panel-rating-stars">
                            {[...Array(5)].map((_, i) => {
                              const starRating = (selectedActivity.rating / 10) * 5;
                              if (i < Math.floor(starRating)) {
                                return <span key={i} className="star full">★</span>;
                              } else if (i < Math.ceil(starRating) && starRating % 1 >= 0.5) {
                                return <span key={i} className="star half">★</span>;
                              } else {
                                return <span key={i} className="star empty">☆</span>;
                              }
                            })}
                            <span className="comment-panel-rating-value">{selectedActivity.rating.toFixed(1)}/10</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : selectedActivity.type === 'review' ? (
                <div className="comment-panel-review">
                  <div className="comment-panel-poster">
                    <img 
                      src={selectedActivity.contentPoster || '/api/placeholder/200/300'} 
                      alt={selectedActivity.contentTitle}
                      className="comment-panel-poster-image"
                    />
                    <div className="comment-panel-poster-info">
                      <h4>{selectedActivity.contentTitle}</h4>
                      <span className={`content-type-badge ${selectedActivity.contentType === 'Film' ? 'film-badge' : 'book-badge'}`}>
                        {selectedActivity.contentType === 'Film' ? <FaFilm /> : <FaBook />}
                        <span>{selectedActivity.contentType}</span>
                      </span>
                    </div>
                  </div>
                  <p className="comment-panel-review-text">{selectedActivity.reviewText}</p>
                </div>
              ) : null}
            </div>
          </div>

          {/* Yorumlar Listesi */}
          <div className="comment-panel-comments">
            {comments.length > 0 ? (
              comments.map((comment) => {
                const isLiked = likedComments.has(comment.id);
                const likeCount = (comment.likes || 0) + (isLiked ? 1 : 0);
                return (
                  <div key={comment.id} className="comment-panel-item">
                    <img 
                      src={comment.userAvatar || '/api/placeholder/32/32'} 
                      alt={comment.userName}
                      className="comment-panel-avatar"
                    />
                    <div className="comment-panel-comment-content">
                      <div className="comment-panel-comment-header">
                        <span className="comment-panel-author">{comment.userName}</span>
                        <span className="comment-panel-comment-date">{formatTimeAgo(comment.date)}</span>
                      </div>
                      <div className="comment-panel-comment-body">
                        <CommentText text={comment.text} maxLength={150} />
                        <button 
                          className={`comment-like-btn ${isLiked ? 'liked' : ''}`}
                          onClick={() => onCommentLike(comment.id)}
                        >
                          <FaRegThumbsUp className="comment-like-icon" />
                          {likeCount > 0 && <span className="comment-like-count">{likeCount}</span>}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="comment-panel-empty">
                <p>Henüz yorum yok. İlk yorumu sen yap!</p>
              </div>
            )}
          </div>
        </div>

        {/* Yorum Yapma Formu */}
        <div className="comment-panel-footer">
          <form onSubmit={onCommentSubmit} className="comment-panel-form">
            <textarea
              className="comment-panel-input"
              placeholder="Yorumunuzu yazın..."
              value={commentText}
              onChange={(e) => onCommentTextChange(e.target.value)}
              rows="2"
            />
            <button 
              type="submit" 
              className="comment-panel-submit-btn"
              disabled={!commentText.trim()}
            >
              <FaArrowRight />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CommentPanel;

