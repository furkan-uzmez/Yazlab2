import { useState, useEffect, useRef } from 'react';
import { FaTimes, FaCamera, FaUser, FaEnvelope, FaEdit } from 'react-icons/fa';
import './EditProfileModal.css';

function EditProfileModal({
  isOpen,
  isClosing,
  onClose,
  onSubmit,
  profileUser,
  setProfileUser
}) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    avatar_url: ''
  });
  const [avatarPreview, setAvatarPreview] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && profileUser) {
      setFormData({
        username: profileUser.username || '',
        email: profileUser.email || '',
        bio: profileUser.bio || '',
        avatar_url: profileUser.avatar_url || ''
      });
      setAvatarPreview(profileUser.avatar_url || '');
    }
  }, [isOpen, profileUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFormData(prev => ({
          ...prev,
          avatar_url: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`create-list-modal-overlay ${isClosing ? 'closing' : ''}`} onClick={onClose}>
      <div className={`create-list-modal edit-profile-modal ${isClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="create-list-modal-header">
          <h2>Profili Düzenle</h2>
          <button 
            className="create-list-modal-close"
            onClick={onClose}
            aria-label="Kapat"
          >
            <FaTimes />
          </button>
        </div>
        
        <form className="create-list-modal-form" onSubmit={handleSubmit}>
          {/* Avatar Section */}
          <div className="edit-profile-avatar-section">
            <div className="avatar-preview-container" onClick={handleAvatarClick}>
              <img 
                src={avatarPreview || formData.avatar_url || `https://i.pravatar.cc/150?img=1`}
                alt="Avatar Preview"
                className="avatar-preview"
              />
              <div className="avatar-overlay">
                <FaCamera className="avatar-camera-icon" />
                <span>Fotoğraf Değiştir</span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />
          </div>

          {/* Form Fields */}
          <div className="form-group">
            <label htmlFor="edit-username">
              <FaUser />
              <span>Kullanıcı Adı</span>
            </label>
            <input
              id="edit-username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Kullanıcı adınızı girin"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-email">
              <FaEnvelope />
              <span>E-posta</span>
            </label>
            <input
              id="edit-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="E-posta adresinizi girin"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-bio">
              <FaEdit />
              <span>Biyografi</span>
            </label>
            <textarea
              id="edit-bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Hakkınızda bir şeyler yazın..."
              rows="4"
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
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;

