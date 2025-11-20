import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';
import Sidebar from '../HomePage/Sidebar/Sidebar';
import LogoutModal from '../HomePage/LogoutModal/LogoutModal';
import { FaEdit, FaPlus, FaUserPlus, FaUserCheck, FaFilm, FaBook, FaStar, FaClock, FaList } from 'react-icons/fa';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  
  // Mock data - Frontend only
  const isOwnProfile = !userId; // If no userId, it's own profile
  const isFollowing = false;
  
  // Mock profile user
  const profileUser = {
    username: userId || 'Kullanıcı Adı',
    email: userId || 'user@example.com',
    avatar_url: 'https://i.pravatar.cc/150?img=1',
    bio: 'Bu bir örnek biyografi metnidir. Kullanıcı hakkında bilgiler buraya gelecek.',
    user_id: 1
  };
  
  // Library tabs
  const [activeLibraryTab, setActiveLibraryTab] = useState('watched');
  const [isTabTransitioning, setIsTabTransitioning] = useState(false);
  
  const handleTabChange = (newTab) => {
    if (newTab !== activeLibraryTab) {
      setIsTabTransitioning(true);
      setTimeout(() => {
        setActiveLibraryTab(newTab);
        setTimeout(() => {
          setIsTabTransitioning(false);
        }, 50);
      }, 200);
    }
  };
  
  // Mock library data
  const libraryData = {
    watched: [
      { title: 'Inception', poster_url: 'https://image.tmdb.org/t/p/w200/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg' },
      { title: 'The Matrix', poster_url: 'https://image.tmdb.org/t/p/w200/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg' },
      { title: 'Interstellar', poster_url: 'https://image.tmdb.org/t/p/w200/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
      { title: 'The Dark Knight', poster_url: 'https://image.tmdb.org/t/p/w200/qJ2tW6WMUDux911r6m7haRef0WH.jpg' }
    ],
    toWatch: [
      { title: 'Dune', poster_url: 'https://image.tmdb.org/t/p/w200/d5NXSklXo0qyIhbkgX2r5Y5D3vT.jpg' },
      { title: 'Blade Runner 2049', poster_url: 'https://image.tmdb.org/t/p/w200/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg' }
    ],
    read: [
      { title: '1984', poster_url: 'https://covers.openlibrary.org/b/id/7222246-M.jpg' },
      { title: 'Dune', poster_url: 'https://covers.openlibrary.org/b/id/8739161-M.jpg' },
      { title: 'The Lord of the Rings', poster_url: 'https://covers.openlibrary.org/b/id/6979861-M.jpg' }
    ],
    toRead: [
      { title: 'Foundation', poster_url: 'https://covers.openlibrary.org/b/id/8739162-M.jpg' },
      { title: 'Brave New World', poster_url: 'https://covers.openlibrary.org/b/id/7222247-M.jpg' }
    ]
  };
  
  // Mock custom lists
  const customLists = [
    { name: 'En İyi Bilimkurgu Filmlerim', description: 'Favori bilimkurgu filmlerim', items: [1, 2, 3] },
    { name: 'Okunacak Klasikler', description: 'Mutlaka okumam gereken klasik eserler', items: [1, 2] }
  ];
  
  // Mock recent activities
  const recentActivities = [
    { type: 'rating', content_title: 'Inception', rating_score: 9.5, created_at: new Date(Date.now() - 2 * 3600 * 1000) },
    { type: 'review', content_title: '1984', created_at: new Date(Date.now() - 5 * 3600 * 1000) },
    { type: 'rating', content_title: 'The Matrix', rating_score: 8.5, created_at: new Date(Date.now() - 8 * 3600 * 1000) },
    { type: 'review', content_title: 'Dune', created_at: new Date(Date.now() - 12 * 3600 * 1000) }
  ];

  const handleLogout = () => setLogoutModalOpen(true);
  
  const handleConfirmLogout = () => {
    setLogoutLoading(true);
    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('email');
      navigate('/');
    }, 1300);
  };

  const handleCancelLogout = () => {
    setLogoutModalOpen(false);
  };

  const handleFollow = async () => {
    // TODO: Implement follow/unfollow API call
    setIsFollowing(!isFollowing);
  };

  const handleEditProfile = () => {
    // TODO: Open edit profile modal
    console.log('Edit profile');
  };

  const handleCreateList = () => {
    // TODO: Open create list modal
    console.log('Create new list');
  };


  return (
    <div className="profile-container">
      <Sidebar 
        onLogout={handleLogout}
        isSearchMode={isSearchMode}
        onSearchModeChange={setIsSearchMode}
      />
      <div className="profile-content">
        {/* Profile Header */}
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
                <button className="profile-action-btn primary" onClick={handleEditProfile}>
                  <FaEdit />
                  <span>Profili Düzenle</span>
                </button>
                <button className="profile-action-btn secondary" onClick={handleCreateList}>
                  <FaPlus />
                  <span>Yeni Liste Oluştur</span>
                </button>
              </>
            ) : (
              <button 
                className={`profile-action-btn ${isFollowing ? 'unfollow' : 'follow'}`}
                onClick={handleFollow}
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

        {/* Library Tabs */}
        <div className="profile-library-section">
          <div className="library-tabs">
            <button
              className={`library-tab ${activeLibraryTab === 'watched' ? 'active' : ''}`}
              onClick={() => handleTabChange('watched')}
            >
              <FaFilm />
              <span>İzlediklerim</span>
            </button>
            <button
              className={`library-tab ${activeLibraryTab === 'toWatch' ? 'active' : ''}`}
              onClick={() => handleTabChange('toWatch')}
            >
              <FaClock />
              <span>İzlenecekler</span>
            </button>
            <button
              className={`library-tab ${activeLibraryTab === 'read' ? 'active' : ''}`}
              onClick={() => handleTabChange('read')}
            >
              <FaBook />
              <span>Okuduklarım</span>
            </button>
            <button
              className={`library-tab ${activeLibraryTab === 'toRead' ? 'active' : ''}`}
              onClick={() => handleTabChange('toRead')}
            >
              <FaClock />
              <span>Okunacaklar</span>
            </button>
          </div>
          <div className={`library-content ${isTabTransitioning ? 'transitioning' : ''}`}>
            {activeLibraryTab === 'watched' && (
              <div className="library-items">
                {libraryData.watched.length > 0 ? (
                  libraryData.watched.map((item, index) => (
                    <div key={index} className="library-item">
                      <img src={item.poster_url || '/placeholder.jpg'} alt={item.title} />
                      <span>{item.title}</span>
                    </div>
                  ))
                ) : (
                  <p className="empty-state">Henüz izlenen içerik yok</p>
                )}
              </div>
            )}
            {activeLibraryTab === 'toWatch' && (
              <div className="library-items">
                {libraryData.toWatch.length > 0 ? (
                  libraryData.toWatch.map((item, index) => (
                    <div key={index} className="library-item">
                      <img src={item.poster_url || '/placeholder.jpg'} alt={item.title} />
                      <span>{item.title}</span>
                    </div>
                  ))
                ) : (
                  <p className="empty-state">Henüz izlenecek içerik yok</p>
                )}
              </div>
            )}
            {activeLibraryTab === 'read' && (
              <div className="library-items">
                {libraryData.read.length > 0 ? (
                  libraryData.read.map((item, index) => (
                    <div key={index} className="library-item">
                      <img src={item.poster_url || '/placeholder.jpg'} alt={item.title} />
                      <span>{item.title}</span>
                    </div>
                  ))
                ) : (
                  <p className="empty-state">Henüz okunan içerik yok</p>
                )}
              </div>
            )}
            {activeLibraryTab === 'toRead' && (
              <div className="library-items">
                {libraryData.toRead.length > 0 ? (
                  libraryData.toRead.map((item, index) => (
                    <div key={index} className="library-item">
                      <img src={item.poster_url || '/placeholder.jpg'} alt={item.title} />
                      <span>{item.title}</span>
                    </div>
                  ))
                ) : (
                  <p className="empty-state">Henüz okunacak içerik yok</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Custom Lists */}
        {isOwnProfile && (
          <div className="profile-custom-lists-section">
            <h2 className="section-title">
              <FaList />
              <span>Özel Listelerim</span>
            </h2>
            <div className="custom-lists">
              {customLists.length > 0 ? (
                customLists.map((list, index) => (
                  <div key={index} className="custom-list-card">
                    <div className="custom-list-card-header">
                      <h3>{list.name}</h3>
                    </div>
                    <p>{list.description || 'Açıklama yok'}</p>
                    <div className="custom-list-card-footer">
                      <span className="list-count">{list.items?.length || 0} içerik</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-state">Henüz özel liste oluşturulmamış</p>
              )}
            </div>
          </div>
        )}

        {/* Recent Activities */}
        <div className="profile-activities-section">
          <h2 className="section-title">
            <FaStar />
            <span>Son Aktiviteler</span>
          </h2>
          <div className="activities-list">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className={`activity-icon ${activity.type === 'rating' ? 'rating-icon' : 'review-icon'}`}>
                    {activity.type === 'rating' ? <FaStar /> : <FaEdit />}
                  </div>
                  <div className="activity-content">
                    <p className="activity-text">
                      {activity.type === 'rating' 
                        ? `${activity.content_title} için ${activity.rating_score} puan verdi`
                        : `${activity.content_title} hakkında yorum yaptı`}
                    </p>
                    <span className="activity-date">
                      {new Date(activity.created_at).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-state">Henüz aktivite yok</p>
            )}
          </div>
        </div>
      </div>
      <BottomNav 
        onSearchClick={() => setIsSearchMode(true)}
        isSearchMode={isSearchMode}
      />
      <LogoutModal
        isOpen={logoutModalOpen}
        isLoading={logoutLoading}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </div>
  );
}

export default Profile;
