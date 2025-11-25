import { useState, useEffect, useRef } from 'react';
import { FaTimes, FaSearch, FaStar, FaFilm, FaBook, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './AddPostModal.css';

function AddPostModal({ isOpen, onClose, onPostAdded }) {
  const [step, setStep] = useState(1); // 1: Tip Seç, 2: İçerik Seç, 3: Puan Ver
  const [contentType, setContentType] = useState(null); // 'movie' or 'book'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && searchInputRef.current && step === 2) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 200);
    }
  }, [isOpen, step]);

  useEffect(() => {
    if (!isOpen) {
      // Modal kapandığında state'leri sıfırla
      setStep(1);
      setContentType(null);
      setSearchQuery('');
      setSearchResults([]);
      setIsSearching(false);
      setSelectedContent(null);
      setRating(0);
      setHoveredRating(0);
      setReviewText('');
    }
  }, [isOpen]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `http://localhost:8000/content/search?query=${encodeURIComponent(searchQuery)}&api_type=${contentType}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log("API Ham Veri:", data);
        
        let formattedResults = [];
        
        if (contentType === 'movie') {
          // TMDB API'si {"results": [...]} formatında döndürüyor
          const items = data.results?.results || data.results || [];
          formattedResults = items.map(movie => ({
            content_id: movie.id,
            title: movie.title,
            poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : '/api/placeholder/60/90',
            cover_url: movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : '/api/placeholder/60/90',
            release_year: movie.release_date ? movie.release_date.split('-')[0] : null
          }));
        } else if (contentType === 'book') {
          // Google Books API'si {"items": [...]} formatında döndürüyor
          const items = data.results?.items || data.items || [];
          formattedResults = items.map(book => {
            const info = book.volumeInfo;
            return {
              content_id: book.id,
              title: info.title,
              poster_url: info.imageLinks?.smallThumbnail?.replace('http:', 'https:') || '/api/placeholder/60/90',
              cover_url: info.imageLinks?.smallThumbnail?.replace('http:', 'https:') || '/api/placeholder/60/90',
              release_year: info.publishedDate ? info.publishedDate.split('-')[0] : null
            };
          });
        }
        
        console.log("Formatlanmış Sonuçlar:", formattedResults);
        setSearchResults(formattedResults);
      } else {
        const errorData = await response.json().catch(() => ({ detail: "Arama yapılamadı" }));
        console.error("Arama hatası:", errorData);
      }
    } catch (error) {
      console.error("Arama API hatası:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleContentSelect = (content) => {
    setSelectedContent(content);
    setStep(3);
  };

  const handleSubmit = async () => {
    if (!selectedContent) {
      alert("Lütfen bir içerik seçin.");
      return;
    }

    const hasRating = rating > 0;
    const hasReview = reviewText.trim().length > 0;

    if (!hasRating && !hasReview) {
      alert("Lütfen en az bir puan veya yorum ekleyin.");
      return;
    }

    const userEmail = localStorage.getItem("email");
    if (!userEmail) {
      alert("Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (hasReview) {
        // If there's a review, send review with optional rating
        const reviewPayload = {
          user_email: userEmail,
          content_id: selectedContent.content_id,
          review_text: reviewText.trim(),
          content_title: selectedContent.title,
          content_type: contentType,
          cover_url: selectedContent.poster_url || selectedContent.cover_url,
          api_id: String(selectedContent.content_id)
        };
        
        // Only include rating_score if rating exists
        if (hasRating) {
          reviewPayload.rating_score = rating;
        }
        
        const reviewResponse = await fetch('http://localhost:8000/feed/add_review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reviewPayload)
        });

        if (!reviewResponse.ok) {
          const errorData = await reviewResponse.json().catch(() => ({ detail: "Review eklenemedi" }));
          throw new Error(errorData.detail || "Review eklenemedi");
        }
      } else if (hasRating) {
        // If only rating, send to add_rating
        const ratingResponse = await fetch('http://localhost:8000/feed/add_rating', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_email: userEmail,
            content_id: selectedContent.content_id,
            score: rating,
            content_title: selectedContent.title,
            content_type: contentType,
            cover_url: selectedContent.poster_url || selectedContent.cover_url,
            api_id: String(selectedContent.content_id)
          })
        });

        if (!ratingResponse.ok) {
          const errorData = await ratingResponse.json().catch(() => ({ detail: "Rating eklenemedi" }));
          throw new Error(errorData.detail || "Rating eklenemedi");
        }
      }

      if (onPostAdded) {
        onPostAdded();
      }
      onClose();
    } catch (error) {
      console.error("Gönderi ekleme hatası:", error);
      alert("Gönderi eklenirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const steps = [
    { number: 1, label: 'Tip Seç', title: 'İçerik Tipi Seç' },
    { number: 2, label: 'İçerik Seç', title: 'İçerik Ara ve Seç' },
    { number: 3, label: 'Puan Ver', title: 'Puan ve Yorum Ekle' }
  ];

  return (
    <div className="add-post-modal-overlay" onClick={onClose}>
      <div className="add-post-modal" onClick={(e) => e.stopPropagation()}>
        <div className="add-post-modal-header">
          <h2>Yeni Gönderi</h2>
          <button 
            className="add-post-modal-close"
            onClick={onClose}
            aria-label="Kapat"
          >
            <FaTimes />
          </button>
        </div>

        <div className="add-post-modal-content">
          {/* Step Indicator */}
          <div className="add-post-step-indicator">
            {steps.map((stepItem, index) => (
              <div key={stepItem.number} className="step-wrapper">
                <div className={`step-item ${step === stepItem.number ? 'active' : step > stepItem.number ? 'completed' : ''}`}>
                  <div className="step-number">
                    {step > stepItem.number ? '✓' : stepItem.number}
                  </div>
                  <div className="step-label">{stepItem.label}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`step-connector ${step > stepItem.number ? 'active' : ''}`}></div>
                )}
              </div>
            ))}
          </div>

          <div className="add-post-step-content">
            {/* Step 1: Tip Seç */}
            {step === 1 && (
              <div className="add-post-type-selector">
                <h3 className="step-title">{steps[0].title}</h3>
                <div className="add-post-type-buttons">
                  <button
                    type="button"
                    className={`add-post-type-btn ${contentType === 'movie' ? 'active' : ''}`}
                    onClick={() => {
                      setContentType('movie');
                      setStep(2);
                    }}
                  >
                    <FaFilm />
                    <span>Film</span>
                  </button>
                  <button
                    type="button"
                    className={`add-post-type-btn ${contentType === 'book' ? 'active' : ''}`}
                    onClick={() => {
                      setContentType('book');
                      setStep(2);
                    }}
                  >
                    <FaBook />
                    <span>Kitap</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: İçerik Seç */}
            {step === 2 && (
              <div className="add-post-search-section">
                <h3 className="step-title">{steps[1].title}</h3>
                <div className="add-post-search-wrapper">
                  <FaSearch className="add-post-search-icon" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearch();
                      }
                    }}
                    placeholder={contentType === 'movie' ? 'Film ara...' : 'Kitap ara...'}
                    className="add-post-search-input"
                  />
                  <button
                    type="button"
                    className="add-post-search-btn"
                    onClick={handleSearch}
                    disabled={isSearching || !searchQuery.trim()}
                  >
                    {isSearching ? 'Aranıyor...' : 'Ara'}
                  </button>
                </div>

                {isSearching && (
                  <div className="add-post-search-results">
                    {[...Array(5)].map((_, index) => (
                      <div key={index} className="add-post-result-item-skeleton">
                        <div className="skeleton-poster"></div>
                        <div className="skeleton-info">
                          <div className="skeleton-title"></div>
                          <div className="skeleton-year"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!isSearching && searchResults.length > 0 && (
                  <div className="add-post-search-results">
                    {searchResults.map((result) => (
                      <div
                        key={result.content_id}
                        className="add-post-result-item"
                        onClick={() => handleContentSelect(result)}
                      >
                        <img
                          src={result.poster_url || '/placeholder.jpg'}
                          alt={result.title}
                          className="add-post-result-poster"
                        />
                        <div className="add-post-result-info">
                          <span className="add-post-result-title">{result.title}</span>
                          {result.release_year && (
                            <span className="add-post-result-year">{result.release_year}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {searchQuery && !isSearching && searchResults.length === 0 && (
                  <div className="add-post-empty">
                    <p>Sonuç bulunamadı</p>
                  </div>
                )}

                {!searchQuery && !isSearching && (
                  <div className="add-post-placeholder">
                    <FaSearch className="placeholder-icon" />
                    <p>Arama yapmak için yukarıdaki alana yazın</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Puan Ver */}
            {step === 3 && selectedContent && (
              <div className="add-post-rating-section-full">
                <h3 className="step-title">{steps[2].title}</h3>
                
                {/* Selected Content Display */}
                <div className="add-post-selected-content">
                  <img
                    src={selectedContent.poster_url || '/placeholder.jpg'}
                    alt={selectedContent.title}
                    className="add-post-selected-poster"
                  />
                  <div className="add-post-selected-info">
                    <h3>{selectedContent.title}</h3>
                    {selectedContent.release_year && (
                      <span className="add-post-selected-year">{selectedContent.release_year}</span>
                    )}
                  </div>
                </div>

                {/* Rating */}
                <div className="add-post-rating-section">
                  <label className="add-post-label">Puanınız (İsteğe Bağlı, 1-10)</label>
                  <div className="add-post-rating-stars">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`add-post-star-btn ${star <= (hoveredRating || rating) ? 'active' : ''}`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                      >
                        <FaStar />
                      </button>
                    ))}
                    {rating > 0 && (
                      <span className="add-post-rating-value">{rating}</span>
                    )}
                  </div>
                </div>

                {/* Review */}
                <div className="add-post-review-section">
                  <label className="add-post-label">Yorumunuz (İsteğe Bağlı)</label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="İçerik hakkında düşüncelerinizi paylaşın..."
                    className="add-post-review-input"
                    rows={6}
                  />
                </div>

                {/* Submit Button */}
                <div className="add-post-submit-section">
                  <button
                    type="button"
                    className="add-post-nav-btn add-post-back-btn"
                    onClick={() => setStep(2)}
                  >
                    <FaChevronLeft />
                    Geri
                  </button>
                  <button
                    type="button"
                    className="add-post-submit-btn"
                    onClick={handleSubmit}
                    disabled={isSubmitting || (rating === 0 && reviewText.trim().length === 0)}
                  >
                    {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="add-post-navigation">
            {step > 1 && step < 3 && (
              <button
                type="button"
                className="add-post-nav-btn add-post-back-btn"
                onClick={() => {
                  if (step === 2) {
                    setStep(1);
                    setSearchQuery('');
                    setSearchResults([]);
                    setSelectedContent(null);
                  }
                }}
              >
                <FaChevronLeft />
                Geri
              </button>
            )}
            {step === 2 && selectedContent && (
              <button
                type="button"
                className="add-post-nav-btn add-post-next-btn"
                onClick={() => setStep(3)}
              >
                İleri
                <FaChevronRight />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPostModal;
