import { useState, useEffect, useRef } from 'react';
import { FaTimes, FaSearch, FaPlus, FaFilm, FaBook, FaCheck } from 'react-icons/fa';
import './AddContentModal.css';
import { API_BASE } from '../../../../utils/api';

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
  const [selectedItems, setSelectedItems] = useState(new Set());
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
      setSelectedItems(new Set());
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
      const url = `${API_BASE}/content/search?query=${encodeURIComponent(searchQuery)}&api_type=${searchType}`;
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        let formattedResults = [];

        // API artık normalize edilmiş veri döndürüyor
        const items = data.results || [];

        formattedResults = items.map(item => ({
          id: item.id,
          title: item.title,
          poster_url: item.poster_url || '/placeholder.jpg',
          type: item.type,
          description: item.description,
          release_year: item.release_year,
          duration_or_pages: item.duration_or_pages,
          authors: item.authors
        }));

        setSearchResults(formattedResults);
        setSelectedItems(new Set()); // Yeni arama yapıldığında seçimleri sıfırla
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

  const handleToggleSelect = (contentId) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(contentId)) {
        newSet.delete(contentId);
      } else {
        newSet.add(contentId);
      }
      return newSet;
    });
  };

  const handleAddSelected = () => {
    if (selectedItems.size === 0) return;

    const itemsToAdd = searchResults.filter(result => selectedItems.has(result.id));
    itemsToAdd.forEach(item => {
      onAddContent(item);
    });

    setSelectedItems(new Set());
    setSearchQuery('');
    setSearchResults([]);
    onClose();
  };

  const handleAdd = (content) => {
    onAddContent(content);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedItems(new Set());
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
            <>
              {selectedItems.size > 0 && (
                <div className="add-content-bulk-actions">
                  <span className="selected-count">{selectedItems.size} içerik seçildi</span>
                  <button
                    type="button"
                    className="add-content-bulk-btn"
                    onClick={handleAddSelected}
                  >
                    <FaPlus />
                    <span>Seçilenleri Ekle</span>
                  </button>
                </div>
              )}
              <div className="add-content-results">
                {searchResults.map((result) => {
                  const isSelected = selectedItems.has(result.id);
                  return (
                    <div
                      key={result.id}
                      className={`add-content-result-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleToggleSelect(result.id)}
                    >
                      <div className="add-content-checkbox">
                        {isSelected && <FaCheck />}
                      </div>
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAdd(result);
                        }}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
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

