import { useState, useEffect, useRef } from 'react';
import { FaTimes, FaSearch, FaPlus, FaFilm, FaBook } from 'react-icons/fa';
import './AddContentModal.css';

function AddContentModal({
  isOpen,
  isClosing,
  onClose,
  contentType, // 'movie' or 'book'
  onAddContent
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState(contentType === 'watched' || contentType === 'toWatch' ? 'movie' : 'book');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 200);
    } else if (!isOpen) {
      // Modal kapandığında state'leri sıfırla
      setSearchQuery('');
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (contentType === 'watched' || contentType === 'toWatch') {
      setSearchType('movie');
    } else {
      setSearchType('book');
    }
  }, [contentType]);

  const executeSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchResults([]);

    try {
      const url = `http://localhost:8000/content/search?query=${encodeURIComponent(searchQuery)}&api_type=${searchType}`;
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        let formattedResults = [];

        if (searchType === 'movie') {
          const items = data.results?.results || [];
          formattedResults = items.map(movie => ({
            id: movie.id,
            title: movie.title,
            poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : '/placeholder.jpg',
            type: 'Film',
            release_date: movie.release_date
          }));
        } else if (searchType === 'book') {
          const items = data.results?.items || [];
          formattedResults = items.map(book => {
            const info = book.volumeInfo;
            return {
              id: book.id,
              title: info.title,
              poster_url: info.imageLinks?.smallThumbnail?.replace('http:', 'https:') || '/placeholder.jpg',
              type: 'Kitap',
              authors: info.authors
            };
          });
        }

        setSearchResults(formattedResults);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Arama hatası:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    executeSearch();
  };

  const handleAdd = (content) => {
    onAddContent(content);
    setSearchQuery('');
    setSearchResults([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`add-content-modal-overlay ${isClosing ? 'closing' : ''}`} onClick={onClose}>
      <div className={`add-content-modal ${isClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="add-content-modal-header">
          <h2>
            {contentType === 'watched' && 'İzlediklerime Ekle'}
            {contentType === 'toWatch' && 'İzleneceklere Ekle'}
            {contentType === 'read' && 'Okuduklarıma Ekle'}
            {contentType === 'toRead' && 'Okunacaklara Ekle'}
          </h2>
          <button 
            className="add-content-modal-close"
            onClick={onClose}
            aria-label="Kapat"
          >
            <FaTimes />
          </button>
        </div>

        <div className="add-content-modal-content">
          <div className="search-content-wrapper">
            <form onSubmit={handleSearchSubmit}>
              <FaSearch className="search-content-icon" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchType === 'movie' ? 'Film ara...' : 'Kitap ara...'}
              />
            </form>
          </div>

          {isSearching && (
            <div className="add-content-results">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="add-content-result-item-skeleton">
                  <div className="skeleton-poster"></div>
                  <div className="skeleton-info">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-type"></div>
                  </div>
                  <div className="skeleton-btn"></div>
                </div>
              ))}
            </div>
          )}

          {!isSearching && searchResults.length > 0 && (
            <div className="add-content-results">
              {searchResults.map((result) => (
                <div key={result.id} className="add-content-result-item">
                  <img src={result.poster_url || '/placeholder.jpg'} alt={result.title} />
                  <div className="add-content-result-info">
                    <span className="add-content-result-title">{result.title}</span>
                    <span className="add-content-result-type">
                      {result.type === 'Film' ? <FaFilm /> : <FaBook />}
                      {result.type}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="add-content-btn"
                    onClick={() => handleAdd(result)}
                  >
                    <FaPlus />
                  </button>
                </div>
              ))}
            </div>
          )}

          {searchQuery && !isSearching && searchResults.length === 0 && (
            <div className="add-content-empty">
              <p>Sonuç bulunamadı</p>
            </div>
          )}

          {!searchQuery && !isSearching && (
            <div className="add-content-placeholder">
              <FaSearch className="placeholder-icon" />
              <p>Arama yapmak için yukarıdaki alana yazın</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddContentModal;

