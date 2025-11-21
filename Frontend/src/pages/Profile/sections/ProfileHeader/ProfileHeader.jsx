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

  // profileUser'ın varlığını kontrol etmek her zaman iyidir, ancak Profile.js'de zaten kontrol ediyoruz.
  // Burada, username veya bio'nun eksik gelme ihtimaline karşı varsayılan değerler veya kontroller ekleyebiliriz.

  // Güvenli veri erişimi ve varsayılan değerler
  const username = profileUser?.username || 'İsimsiz Kullanıcı';
  const bio = profileUser?.bio || 'Henüz bir biyografi eklenmemiş.';
  const avatarUrl = profileUser?.avatar_url || `https://i.pravatar.cc/150?img=${profileUser?.user_id || 1}`;

  return (
    <div className="profile-header">
      <div className="profile-avatar-section">
        <img 
          src={avatarUrl}
          alt={username}
          className="profile-avatar"
          onError={(e) => { e.target.src = `https://i.pravatar.cc/150?img=${profileUser?.user_id || 1}`; }} // Kırık resimler için fallback
        />
      </div>
      <div className="profile-info-section">
        <h1 className="profile-username">{username}</h1>
        
        {/* Bio varsa veya placeholder göstermek istiyorsak */}
        <p className="profile-bio">{bio}</p>
        
        <div className="profile-stats">
          <div className="profile-stat">
            <span className="stat-value">{libraryData?.watched?.length + libraryData?.read?.length || 0}</span>
            <span className="stat-label">İçerik</span>
          </div>
          <div className="profile-stat">
            <span className="stat-value">{customLists?.length || 0}</span>
            <span className="stat-label">Liste</span>
          </div>
          <div className="profile-stat">
            <span className="stat-value">{recentActivities?.length || 0}</span>
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