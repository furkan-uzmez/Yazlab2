import { FaTimes } from 'react-icons/fa';
import './CreateListModal.css';

function CreateListModal({ 
  isOpen, 
  isClosing, 
  onClose, 
  onSubmit, 
  listName, 
  setListName, 
  listDescription, 
  setListDescription 
}) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (listName.trim()) {
      onSubmit(e);
    }
  };

  return (
    <div className={`create-list-modal-overlay ${isClosing ? 'closing' : ''}`} onClick={onClose}>
      <div className={`create-list-modal ${isClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="create-list-modal-header">
          <h2>Yeni Liste Oluştur</h2>
          <button 
            className="create-list-modal-close"
            onClick={onClose}
            aria-label="Kapat"
          >
            <FaTimes />
          </button>
        </div>
        <form className="create-list-modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="list-name">Liste Adı</label>
            <input
              id="list-name"
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="Örn: En İyi Bilimkurgu Filmlerim"
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="list-description">Açıklama (Opsiyonel)</label>
            <textarea
              id="list-description"
              value={listDescription}
              onChange={(e) => setListDescription(e.target.value)}
              placeholder="Liste hakkında kısa bir açıklama..."
              rows="3"
            />
          </div>
          <div className="create-list-modal-actions">
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
            >
              Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateListModal;

