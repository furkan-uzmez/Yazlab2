import { FaEdit, FaPlus, FaUserPlus, FaUserCheck } from 'react-icons/fa';
import './ProfileHeader.css';

function ProfileHeader({ 
  profileUser, 
  isOwnProfile, 
  isFollowing, 
  customLists, 
  libraryData, 
  recentActivities,
  onEditProfile,
  onCreateList,
  onFollow
}) {

  return (
    <div className="profile-header">
      <div className="profile-avatar-section">
        <img 
          src={profileUser.avatar_url || `https://i.pravatar.cc/150?img=${profileUser.user_id || 1}`}
          alt={profileUser.username}
          className="profile-avatar"
        />
      </div>
      <div className="profile-info-section">
        <h1 className="profile-username">{profileUser.username}</h1>
        {profileUser.bio && (
          <p className="profile-bio">{profileUser.bio}</p>
        )}
        <div className="profile-stats">
          <div className="profile-stat">
            <span className="stat-value">{libraryData.watched.length + libraryData.read.length}</span>
            <span className="stat-label">İçerik</span>
          </div>
          <div className="profile-stat">
            <span className="stat-value">{customLists.length}</span>
            <span className="stat-label">Liste</span>
          </div>
          <div className="profile-stat">
            <span className="stat-value">{recentActivities.length}</span>
            <span className="stat-label">Aktivite</span>
          </div>
        </div>
      </div>
      <div className="profile-actions">
        {isOwnProfile ? (
          <>
            <button className="profile-action-btn primary" onClick={onEditProfile}>
              <FaEdit />
              <span>Profili Düzenle</span>
            </button>
            <button className="profile-action-btn secondary" onClick={onCreateList}>
              <FaPlus />
              <span>Yeni Liste Oluştur</span>
            </button>
          </>
        ) : (
          <button 
            className={`profile-action-btn ${isFollowing ? 'unfollow' : 'follow'}`}
            onClick={onFollow}
          >
            {isFollowing ? (
              <>
                <FaUserCheck />
                <span>Takipten Çık</span>
              </>
            ) : (
              <>
                <FaUserPlus />
                <span>Takip Et</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default ProfileHeader;

