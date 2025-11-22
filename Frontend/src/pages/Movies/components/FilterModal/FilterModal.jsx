import { FaTimes } from 'react-icons/fa';
import './FilterModal.css';

function FilterModal({
  isOpen,
  isClosing,
  onClose,
  filters,
  onFilterChange,
  onClearFilters,
  genres
}) {
  if (!isOpen) return null;

  const handleGenreToggle = (genreId) => {
    onFilterChange(prev => ({
      ...prev,
      genres: prev.genres.includes(genreId)
        ? prev.genres.filter(id => id !== genreId)
        : [...prev.genres, genreId]
    }));
  };

  return (
    <div 
      className={`filter-modal-overlay ${isClosing ? 'closing' : ''}`}
      onClick={onClose}
    >
      <div 
        className={`filter-modal ${isClosing ? 'closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="filter-modal-header">
          <h2>Filtrele</h2>
          <button
            type="button"
            className="filter-modal-close"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>
        <div className="filter-modal-content">
          {/* Genres */}
          <div className="filter-section">
            <h3 className="filter-section-title">Türler</h3>
            <div className="genres-grid">
              {genres.map(genre => (
                <button
                  key={genre.id}
                  type="button"
                  className={`genre-chip ${filters.genres.includes(genre.id) ? 'active' : ''}`}
                  onClick={() => handleGenreToggle(genre.id)}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

          {/* Year Range */}
          <div className="filter-section">
            <h3 className="filter-section-title">Yıl Aralığı</h3>
            <div className="year-range">
              <input
                type="number"
                className="year-input"
                placeholder="Başlangıç"
                value={filters.yearFrom}
                onChange={(e) => onFilterChange(prev => ({ ...prev, yearFrom: e.target.value }))}
                min="1900"
                max={new Date().getFullYear()}
              />
              <span className="year-separator">-</span>
              <input
                type="number"
                className="year-input"
                placeholder="Bitiş"
                value={filters.yearTo}
                onChange={(e) => onFilterChange(prev => ({ ...prev, yearTo: e.target.value }))}
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
          </div>

          {/* Rating Range */}
          <div className="filter-section">
            <h3 className="filter-section-title">Puan Aralığı</h3>
            <div className="rating-range">
              <input
                type="number"
                className="rating-input"
                placeholder="Min"
                value={filters.ratingFrom}
                onChange={(e) => onFilterChange(prev => ({ ...prev, ratingFrom: e.target.value }))}
                min="0"
                max="10"
                step="0.1"
              />
              <span className="rating-separator">-</span>
              <input
                type="number"
                className="rating-input"
                placeholder="Max"
                value={filters.ratingTo}
                onChange={(e) => onFilterChange(prev => ({ ...prev, ratingTo: e.target.value }))}
                min="0"
                max="10"
                step="0.1"
              />
            </div>
          </div>
        </div>
        <div className="filter-modal-actions">
          <button
            type="button"
            className="filter-clear-btn"
            onClick={onClearFilters}
          >
            Temizle
          </button>
          <button
            type="button"
            className="filter-apply-btn"
            onClick={onClose}
          >
            Uygula
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterModal;

