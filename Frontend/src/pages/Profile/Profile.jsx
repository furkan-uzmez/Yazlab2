import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';
import Sidebar from '../HomePage/Sidebar/Sidebar';
import LogoutModal from '../HomePage/LogoutModal/LogoutModal';
import { FaEdit, FaPlus, FaUserPlus, FaUserCheck, FaFilm, FaBook, FaStar, FaClock, FaList, FaTimes, FaSearch, FaTrash } from 'react-icons/fa';
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
  
  // Create list modal
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);
  const [isCreateListModalClosing, setIsCreateListModalClosing] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  
  // Edit list modal
  const [isEditListModalOpen, setIsEditListModalOpen] = useState(false);
  const [isEditListModalClosing, setIsEditListModalClosing] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchResultsClosing, setIsSearchResultsClosing] = useState(false);
  
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
  
  // Mock custom lists - now using state
  const [customLists, setCustomLists] = useState([
    { id: 1, name: 'En İyi Bilimkurgu Filmlerim', description: 'Favori bilimkurgu filmlerim', items: [
      { id: 1, title: 'Inception', type: 'Film', poster_url: 'https://image.tmdb.org/t/p/w200/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg' },
      { id: 2, title: 'The Matrix', type: 'Film', poster_url: 'https://image.tmdb.org/t/p/w200/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg' }
    ]},
    { id: 2, name: 'Okunacak Klasikler', description: 'Mutlaka okumam gereken klasik eserler', items: [
      { id: 3, title: '1984', type: 'Kitap', poster_url: 'https://covers.openlibrary.org/b/id/7222246-M.jpg' }
    ]}
  ]);
  
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
    setIsCreateListModalOpen(true);
  };

  const handleCloseCreateListModal = () => {
    setIsCreateListModalClosing(true);
    setTimeout(() => {
      setIsCreateListModalOpen(false);
      setIsCreateListModalClosing(false);
      setNewListName('');
      setNewListDescription('');
    }, 300);
  };

  const handleSubmitNewList = (e) => {
    e.preventDefault();
    if (newListName.trim()) {
      const newList = {
        id: Date.now(),
        name: newListName,
        description: newListDescription,
        items: []
      };
      // Add to custom lists (in real app, this would be an API call)
      setCustomLists([...customLists, newList]);
      // Close with animation
      setIsCreateListModalClosing(true);
      setTimeout(() => {
        setIsCreateListModalOpen(false);
        setIsCreateListModalClosing(false);
        setNewListName('');
        setNewListDescription('');
      }, 300);
    }
  };

  const handleEditList = (list) => {
    setSelectedList(list);
    setIsEditListModalOpen(true);
  };

  const handleCloseEditListModal = () => {
    setIsEditListModalClosing(true);
    setTimeout(() => {
      setIsEditListModalOpen(false);
      setIsEditListModalClosing(false);
      setSelectedList(null);
      setSearchQuery('');
      setSearchResults([]);
      setIsSearchResultsClosing(false);
    }, 300);
  };

  const handleSearchContent = (query) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      // If there are existing results, close them first
      if (searchResults.length > 0) {
        setIsSearchResultsClosing(true);
        setTimeout(() => {
          setIsSearchResultsClosing(false);
          setIsSearching(true);
          // Mock search results - in real app, this would be an API call
          setTimeout(() => {
            const mockResults = [
              { id: 1, title: 'Inception', type: 'Film', poster_url: 'https://image.tmdb.org/t/p/w200/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg' },
              { id: 2, title: 'The Matrix', type: 'Film', poster_url: 'https://image.tmdb.org/t/p/w200/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg' },
              { id: 3, title: '1984', type: 'Kitap', poster_url: 'https://covers.openlibrary.org/b/id/7222246-M.jpg' },
              { id: 4, title: 'Dune', type: 'Kitap', poster_url: 'https://covers.openlibrary.org/b/id/8739161-M.jpg' },
              { id: 5, title: 'Interstellar', type: 'Film', poster_url: 'https://image.tmdb.org/t/p/w200/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' }
            ].filter(item => 
              item.title.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(mockResults);
            setIsSearching(false);
          }, 300);
        }, 300);
      } else {
        setIsSearching(true);
        // Mock search results - in real app, this would be an API call
        setTimeout(() => {
          const mockResults = [
            { id: 1, title: 'Inception', type: 'Film', poster_url: 'https://image.tmdb.org/t/p/w200/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg' },
            { id: 2, title: 'The Matrix', type: 'Film', poster_url: 'https://image.tmdb.org/t/p/w200/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg' },
            { id: 3, title: '1984', type: 'Kitap', poster_url: 'https://covers.openlibrary.org/b/id/7222246-M.jpg' },
            { id: 4, title: 'Dune', type: 'Kitap', poster_url: 'https://covers.openlibrary.org/b/id/8739161-M.jpg' },
            { id: 5, title: 'Interstellar', type: 'Film', poster_url: 'https://image.tmdb.org/t/p/w200/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' }
          ].filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase())
          );
          setSearchResults(mockResults);
          setIsSearching(false);
        }, 300);
      }
    } else {
      // Close with animation
      if (searchResults.length > 0) {
        setIsSearchResultsClosing(true);
        setTimeout(() => {
          setSearchResults([]);
          setIsSearchResultsClosing(false);
          setIsSearching(false);
        }, 300);
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    }
  };

  const handleAddToList = (content) => {
    if (selectedList) {
      const updatedLists = customLists.map(list => {
        if (list.id === selectedList.id) {
          // Check if content already exists
          const exists = list.items.some(item => item.id === content.id);
          if (!exists) {
            return {
              ...list,
              items: [...list.items, content]
            };
          }
        }
        return list;
      });
      setCustomLists(updatedLists);
      setSelectedList(updatedLists.find(l => l.id === selectedList.id));
      setSearchQuery('');
      // Close with animation
      if (searchResults.length > 0) {
        setIsSearchResultsClosing(true);
        setTimeout(() => {
          setSearchResults([]);
          setIsSearchResultsClosing(false);
        }, 300);
      } else {
        setSearchResults([]);
      }
    }
  };

  const handleRemoveFromList = (contentId) => {
    if (selectedList) {
      const updatedLists = customLists.map(list => {
        if (list.id === selectedList.id) {
          return {
            ...list,
            items: list.items.filter(item => item.id !== contentId)
          };
        }
        return list;
      });
      setCustomLists(updatedLists);
      setSelectedList(updatedLists.find(l => l.id === selectedList.id));
    }
  };

  const handleUpdateList = (e) => {
    e.preventDefault();
    if (selectedList) {
      const updatedLists = customLists.map(list => {
        if (list.id === selectedList.id) {
          return {
            ...list,
            name: selectedList.name,
            description: selectedList.description
          };
        }
        return list;
      });
      setCustomLists(updatedLists);
      // Close with animation
      setIsEditListModalClosing(true);
      setTimeout(() => {
        setIsEditListModalOpen(false);
        setIsEditListModalClosing(false);
        setSelectedList(null);
        setSearchQuery('');
        setSearchResults([]);
        setIsSearchResultsClosing(false);
      }, 300);
    }
  };

  const handleDeleteList = () => {
    if (selectedList) {
      const updatedLists = customLists.filter(list => list.id !== selectedList.id);
      setCustomLists(updatedLists);
      // Close with animation
      setIsEditListModalClosing(true);
      setTimeout(() => {
        setIsEditListModalOpen(false);
        setIsEditListModalClosing(false);
        setSelectedList(null);
        setSearchQuery('');
        setSearchResults([]);
        setIsSearchResultsClosing(false);
      }, 300);
    }
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
                customLists.map((list) => (
                  <div 
                    key={list.id} 
                    className="custom-list-card"
                    onClick={() => handleEditList(list)}
                  >
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

      {/* Create List Modal */}
      {isCreateListModalOpen && (
        <div className={`create-list-modal-overlay ${isCreateListModalClosing ? 'closing' : ''}`} onClick={handleCloseCreateListModal}>
          <div className={`create-list-modal ${isCreateListModalClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="create-list-modal-header">
              <h2>Yeni Liste Oluştur</h2>
              <button 
                className="create-list-modal-close"
                onClick={handleCloseCreateListModal}
                aria-label="Kapat"
              >
                <FaTimes />
              </button>
            </div>
            <form className="create-list-modal-form" onSubmit={handleSubmitNewList}>
              <div className="form-group">
                <label htmlFor="list-name">Liste Adı</label>
                <input
                  id="list-name"
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="Örn: En İyi Bilimkurgu Filmlerim"
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label htmlFor="list-description">Açıklama (Opsiyonel)</label>
                <textarea
                  id="list-description"
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  placeholder="Liste hakkında kısa bir açıklama..."
                  rows="3"
                />
              </div>
              <div className="create-list-modal-actions">
                <button 
                  type="button" 
                  className="create-list-modal-cancel"
                  onClick={handleCloseCreateListModal}
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
      )}

      {/* Edit List Modal */}
      {isEditListModalOpen && selectedList && (
        <div className={`create-list-modal-overlay ${isEditListModalClosing ? 'closing' : ''}`} onClick={handleCloseEditListModal}>
          <div className={`create-list-modal edit-list-modal ${isEditListModalClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="create-list-modal-header">
              <h2>Listeyi Düzenle</h2>
              <button 
                className="create-list-modal-close"
                onClick={handleCloseEditListModal}
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
                        onChange={(e) => handleSearchContent(e.target.value)}
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
                            onClick={() => handleAddToList(result)}
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
                            onClick={() => handleRemoveFromList(item.id)}
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
                <form className="create-list-modal-form" onSubmit={handleUpdateList}>
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
                onClick={handleDeleteList}
              >
                <FaTrash />
                <span>Listeyi Sil</span>
              </button>
              <div className="action-buttons-group">
                <button 
                  type="button" 
                  className="create-list-modal-cancel"
                  onClick={handleCloseEditListModal}
                >
                  İptal
                </button>
                <button 
                  type="submit" 
                  className="create-list-modal-submit"
                  onClick={handleUpdateList}
                >
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
