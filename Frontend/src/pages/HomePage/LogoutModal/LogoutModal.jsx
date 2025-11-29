import './LogoutModal.css';

function LogoutModal({ isOpen, isLoading, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div 
      className="logout-modal-overlay"
      onClick={!isLoading ? onCancel : undefined}
    >
      <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
        {!isLoading ? (
          <div className="logout-modal-content">
            <h3 className="logout-modal-title">Çıkış Yapmak İstiyor Musunuz?</h3>
            <p className="logout-modal-message">
              Çıkış yaptığınızda oturumunuz sonlandırılacak ve ana giriş sayfasına yönlendirileceksiniz.
            </p>
            <div className="logout-modal-buttons">
              <button 
                className="logout-modal-btn logout-modal-btn-cancel"
                onClick={onCancel}
              >
                İptal
              </button>
              <button 
                className="logout-modal-btn logout-modal-btn-confirm"
                onClick={onConfirm}
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        ) : (
          <div className="logout-loading">
            <div className="logout-spinner"></div>
            <p className="logout-loading-text">Çıkış yapılıyor...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LogoutModal;

