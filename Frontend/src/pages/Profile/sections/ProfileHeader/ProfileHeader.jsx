import { useState, useEffect } from 'react';
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
  onFollow,
  onFollowersClick,
  onFollowingClick,
  onListsClick
}) {
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loadingCounts, setLoadingCounts] = useState(true);

  // Güvenli veri erişimi ve varsayılan değerler
  const username = profileUser?.username || 'İsimsiz Kullanıcı';
  const bio = profileUser?.bio || 'Henüz bir biyografi eklenmemiş.';
  const avatarUrl = profileUser?.avatar_url || `https://i.pravatar.cc/150?img=${profileUser?.user_id || 1}`;

  // Takip ve takipçi sayılarını al
  useEffect(() => {
    const fetchFollowCounts = async () => {
      if (!profileUser?.email) {
        setLoadingCounts(false);
        return;
      }

      try {
        // Takipçi sayısı
        const followersResponse = await fetch(`http://localhost:8000/user/${encodeURIComponent(profileUser.email)}/followers`);
        if (followersResponse.ok) {
          const followersData = await followersResponse.json();
          setFollowersCount(followersData.followers?.length || 0);
        }

        // Takip edilen sayısı
        const followingResponse = await fetch(`http://localhost:8000/user/${encodeURIComponent(profileUser.email)}/following`);
        if (followingResponse.ok) {
          const followingData = await followingResponse.json();
          setFollowingCount(followingData.following?.length || 0);
        }
      } catch (error) {
        console.error('Takip sayıları alınamadı:', error);
      } finally {
        setLoadingCounts(false);
      }
    };

    fetchFollowCounts();
  }, [profileUser?.email]);

  const handleFollowersClick = () => {
    if (onFollowersClick) {
      onFollowersClick();
    }
  };

  const handleFollowingClick = () => {
    if (onFollowingClick) {
      onFollowingClick();
    }
  };

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
          <button className="profile-stat clickable-stat">
            <span className="stat-value">{libraryData?.watched?.length + libraryData?.read?.length || 0}</span>
            <span className="stat-label">İçerik</span>
          </button>
          <button 
            className="profile-stat clickable-stat" 
            onClick={onListsClick}
          >
            <span className="stat-value">{customLists?.length || 0}</span>
            <span className="stat-label">Liste</span>
          </button>
          <button 
            className="profile-stat clickable-stat" 
            onClick={handleFollowingClick}
            disabled={loadingCounts}
          >
            <span className="stat-value">{loadingCounts ? '...' : followingCount}</span>
            <span className="stat-label">Takip</span>
          </button>
          <button 
            className="profile-stat clickable-stat" 
            onClick={handleFollowersClick}
            disabled={loadingCounts}
          >
            <span className="stat-value">{loadingCounts ? '...' : followersCount}</span>
            <span className="stat-label">Takipçi</span>
          </button>
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