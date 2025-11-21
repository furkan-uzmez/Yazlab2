import { FaTimes, FaSearch, FaPlus, FaTrash } from 'react-icons/fa';
import './EditListModal.css';

function EditListModal({
  isOpen,
  isClosing,
  onClose,
  selectedList,
  setSelectedList,
  searchQuery,
  setSearchQuery,
  searchResults,
  setSearchResults,
  isSearching,
  isSearchResultsClosing,
  onSearchContent,
  onAddToList,
  onRemoveFromList,
  onUpdateList,
  onDeleteList
}) {
  if (!isOpen || !selectedList) return null;

  return (
    <div className={`create-list-modal-overlay ${isClosing ? 'closing' : ''}`} onClick={onClose}>
      <div className={`create-list-modal edit-list-modal ${isClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="create-list-modal-header">
          <h2>Listeyi Düzenle</h2>
          <button 
            className="create-list-modal-close"
            onClick={onClose}
            aria-label="Kapat"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="edit-list-modal-content">
          {/* Left Side - Content Management */}
          <div className="edit-list-left-panel">
            {/* Add Content Section */}
            <div className="edit-list-add-content">
              <div className="form-group">
                <label htmlFor="search-content">İçerik Ekle</label>
                <div className="search-content-wrapper">
                  <FaSearch className="search-content-icon" />
                  <input
                    id="search-content"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchContent(e.target.value)}
                    placeholder="Film veya kitap ara..."
                  />
                  {isSearching && <div className="search-spinner"></div>}
                </div>
              </div>

              {/* Search Results */}
              {(searchResults.length > 0 || isSearchResultsClosing) && (
                <div className={`search-results-list ${isSearchResultsClosing ? 'closing' : ''}`}>
                  {searchResults.map((result) => (
                    <div key={result.id} className="search-result-item">
                      <img src={result.poster_url || '/placeholder.jpg'} alt={result.title} />
                      <div className="search-result-info">
                        <span className="search-result-title">{result.title}</span>
                        <span className="search-result-type">{result.type}</span>
                      </div>
                      <button
                        type="button"
                        className="add-content-btn"
                        onClick={() => onAddToList(result)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* List Items */}
            <div className="edit-list-items">
              <h3 className="list-items-title">Listedeki İçerikler ({selectedList.items?.length || 0})</h3>
              {selectedList.items && selectedList.items.length > 0 ? (
                <div className="list-items-grid">
                  {selectedList.items.map((item) => (
                    <div key={item.id} className="list-item-card">
                      <img src={item.poster_url || '/placeholder.jpg'} alt={item.title} />
                      <div className="list-item-info">
                        <span className="list-item-title">{item.title}</span>
                        <span className="list-item-type">{item.type}</span>
                      </div>
                      <button
                        type="button"
                        className="remove-item-btn"
                        onClick={() => onRemoveFromList(item.id)}
                        aria-label="Kaldır"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-list-message">Listede henüz içerik yok</p>
              )}
            </div>
          </div>

          {/* Right Side - List Info */}
          <div className="edit-list-right-panel">
            <h2 className="list-title-header">{selectedList.name || 'Liste Adı'}</h2>
            <form className="create-list-modal-form" onSubmit={onUpdateList}>
              <div className="form-group">
                <label htmlFor="edit-list-name">Liste Adı</label>
                <input
                  id="edit-list-name"
                  type="text"
                  value={selectedList.name}
                  onChange={(e) => setSelectedList({...selectedList, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-list-description">Açıklama</label>
                <textarea
                  id="edit-list-description"
                  value={selectedList.description || ''}
                  onChange={(e) => setSelectedList({...selectedList, description: e.target.value})}
                  rows="4"
                />
              </div>
            </form>
          </div>
        </div>

        <div className="create-list-modal-actions">
          <button 
            type="button" 
            className="create-list-modal-delete"
            onClick={onDeleteList}
          >
            <FaTrash />
            <span>Listeyi Sil</span>
          </button>
          <div className="action-buttons-group">
            <button 
              type="button" 
              className="create-list-modal-cancel"
              onClick={onClose}
            >
              İptal
            </button>
            <button 
              type="submit" 
              className="create-list-modal-submit"
              onClick={onUpdateList}
            >
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditListModal;

