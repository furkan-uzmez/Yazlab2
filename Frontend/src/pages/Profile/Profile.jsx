import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';
import Sidebar from '../HomePage/Sidebar/Sidebar';
import LogoutModal from '../HomePage/LogoutModal/LogoutModal';
import CreateListModal from './components/CreateListModal/CreateListModal';
import EditListModal from './components/EditListModal/EditListModal';
import EditProfileModal from './components/EditProfileModal/EditProfileModal';
import AddContentModal from './components/AddContentModal/AddContentModal';
import ProfileHeader from './sections/ProfileHeader/ProfileHeader';
import LibraryTabs from './sections/LibraryTabs/LibraryTabs';
import CustomLists from './sections/CustomLists/CustomLists';
import RecentActivities from './sections/RecentActivities/RecentActivities';
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
  
 // ... (diğer state'ler) ...

  // Mock profile user - now using state (BAŞLANGIÇ DEĞERİNİ GÜNCELLEYİN)
  const [profileUser, setProfileUser] = useState(null); // Başlangıçta null olsun, veri gelince dolsun
  const [loadingProfile, setLoadingProfile] = useState(true); // Yükleniyor durumu

// --- YENİ: KULLANICI VERİSİNİ ÇEKME (API) ---
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoadingProfile(true);
      try {
        let url = '';
        let isOwnProfileView = !userId; // URL'de userId yoksa kendi profilimizdir

        if (isOwnProfileView) {
            // Kendi profilimiz: Email ile ara
            const email = localStorage.getItem('email');
            if (!email) {
                setLoadingProfile(false);
                return;
            }
            // API: /user/search_by_email?query=...
            url = `http://localhost:8000/user/search_by_email?query=${encodeURIComponent(email)}`;
        } else {
            // Başkasının profili: Username ile ara
            // DÜZELTME BURADA: '/get_user' yerine '/search' kullanıldı
            url = `http://localhost:8000/user/search?query=${encodeURIComponent(userId)}`;
        }

        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          
          // API'den gelen veri yapısını kontrol et (results bir dizi olabilir)
          let userData = null;

          if (data.user) {
            userData = data.user;
          } else if (Array.isArray(data.results) && data.results.length > 0) {
            // /user/search endpoint'i bir liste döndürür, ilk elemanı alıyoruz
            userData = data.results[0]; 
          } else if (data.results) {
            userData = data.results;
          }

          if (userData) {
             setProfileUser({
                 user_id: userData.user_id,
                 username: userData.username,
                 email: userData.email,
                 avatar_url: userData.avatar_url || `https://i.pravatar.cc/150?img=${userData.user_id || 1}`, 
                 bio: userData.bio || 'Henüz bir biyografi eklenmemiş.'
             });
          } else {
             console.error("API yanıtında kullanıcı verisi bulunamadı.");
             setProfileUser(null);
          }
        } else {
          console.error("Kullanıcı profili alınamadı:", response.status);
          setProfileUser(null);
        }
      } catch (error) {
        console.error("Profil yükleme hatası:", error);
        setProfileUser(null);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  // Library tabs
  const [activeLibraryTab, setActiveLibraryTab] = useState('watched');
  const [isTabTransitioning, setIsTabTransitioning] = useState(false);
  
  // Create list modal
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);
  const [isCreateListModalClosing, setIsCreateListModalClosing] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  
  // Edit profile modal
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isEditProfileModalClosing, setIsEditProfileModalClosing] = useState(false);

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
  
  // Library data - now using state
  const [libraryData, setLibraryData] = useState({
    watched: [
      { id: 27205, title: 'Inception', poster_url: 'https://image.tmdb.org/t/p/w200/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg' },
      { id: 603, title: 'The Matrix', poster_url: 'https://image.tmdb.org/t/p/w200/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg' },
      { id: 157336, title: 'Interstellar', poster_url: 'https://image.tmdb.org/t/p/w200/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
      { id: 155, title: 'The Dark Knight', poster_url: 'https://image.tmdb.org/t/p/w200/qJ2tW6WMUDux911r6m7haRef0WH.jpg' }
    ],
    toWatch: [
      { id: 438631, title: 'Dune', poster_url: 'https://image.tmdb.org/t/p/w200/d5NXSklXo0qyIhbkgX2r5Y5D3vT.jpg' },
      { id: 335984, title: 'Blade Runner 2049', poster_url: 'https://image.tmdb.org/t/p/w200/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg' }
    ],
    read: [
      { id: 'OL82565W', title: '1984', poster_url: 'https://covers.openlibrary.org/b/id/7222246-M.jpg' },
      { id: 'OL82566W', title: 'Dune', poster_url: 'https://covers.openlibrary.org/b/id/8739161-M.jpg' },
      { id: 'OL82567W', title: 'The Lord of the Rings', poster_url: 'https://covers.openlibrary.org/b/id/6979861-M.jpg' }
    ],
    toRead: [
      { id: 'OL82568W', title: 'Foundation', poster_url: 'https://covers.openlibrary.org/b/id/8739162-M.jpg' },
      { id: 'OL82569W', title: 'Brave New World', poster_url: 'https://covers.openlibrary.org/b/id/7222247-M.jpg' }
    ]
  });

  // Add content modal state
  const [isAddContentModalOpen, setIsAddContentModalOpen] = useState(false);
  const [isAddContentModalClosing, setIsAddContentModalClosing] = useState(false);
  const [addContentType, setAddContentType] = useState(null);

  // Follow/Followers modal state
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [isFollowersModalClosing, setIsFollowersModalClosing] = useState(false);
  const [isFollowersModalOpening, setIsFollowersModalOpening] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [isFollowingModalClosing, setIsFollowingModalClosing] = useState(false);
  const [isFollowingModalOpening, setIsFollowingModalOpening] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [loadingFollowing, setLoadingFollowing] = useState(false);

  const handleAddContentClick = (type) => {
    setAddContentType(type);
    setIsAddContentModalOpen(true);
  };

  const handleCloseAddContentModal = () => {
    setIsAddContentModalClosing(true);
    setTimeout(() => {
      setIsAddContentModalOpen(false);
      setIsAddContentModalClosing(false);
      setAddContentType(null);
    }, 300);
  };

  const handleAddContent = (content) => {
    if (!addContentType) return;

    setLibraryData(prev => {
      const newData = { ...prev };
      const targetArray = newData[addContentType];
      
      // Check if content already exists
      const exists = targetArray.some(item => item.id === content.id);
      if (!exists) {
        newData[addContentType] = [...targetArray, {
          id: content.id,
          title: content.title,
          poster_url: content.poster_url
        }];
      }
      
      return newData;
    });
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

  const handleFollowersClick = async () => {
    if (!profileUser?.email) return;
    
    setShowFollowersModal(true);
    setLoadingFollowers(true);
    
    // Açılış animasyonu için kısa bir gecikme
    setTimeout(() => {
      setIsFollowersModalOpening(true);
    }, 10);
    
    try {
      const response = await fetch(`http://localhost:8000/user/${encodeURIComponent(profileUser.email)}/followers`);
      if (response.ok) {
        const data = await response.json();
        setFollowersList(data.followers || []);
      }
    } catch (error) {
      console.error('Takipçiler alınamadı:', error);
      setFollowersList([]);
    } finally {
      setLoadingFollowers(false);
    }
  };

  const handleFollowingClick = async () => {
    if (!profileUser?.email) return;
    
    setShowFollowingModal(true);
    setLoadingFollowing(true);
    
    // Açılış animasyonu için kısa bir gecikme
    setTimeout(() => {
      setIsFollowingModalOpening(true);
    }, 10);
    
    try {
      const response = await fetch(`http://localhost:8000/user/${encodeURIComponent(profileUser.email)}/following`);
      if (response.ok) {
        const data = await response.json();
        setFollowingList(data.following || []);
      }
    } catch (error) {
      console.error('Takip edilenler alınamadı:', error);
      setFollowingList([]);
    } finally {
      setLoadingFollowing(false);
    }
  };

  const handleCloseFollowersModal = () => {
    setIsFollowersModalClosing(true);
    setIsFollowersModalOpening(false);
    setTimeout(() => {
      setShowFollowersModal(false);
      setIsFollowersModalClosing(false);
    }, 300);
  };

  const handleCloseFollowingModal = () => {
    setIsFollowingModalClosing(true);
    setIsFollowingModalOpening(false);
    setTimeout(() => {
      setShowFollowingModal(false);
      setIsFollowingModalClosing(false);
    }, 300);
  };

  const handleUserClick = (username) => {
    navigate(`/profile/${username}`);
    setShowFollowersModal(false);
    setShowFollowingModal(false);
  };

  const handleUnfollow = async (e, userId) => {
    e.stopPropagation(); // Modal'ın kapanmasını engelle
    
    const currentUserId = profileUser?.user_id;
    if (!currentUserId || !userId) return;

    try {
      const response = await fetch('http://localhost:8000/user/unfollow', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          follower_id: currentUserId,
          followed_id: userId
        })
      });

      if (response.ok) {
        // Listeden kaldır
        setFollowingList(prevList => prevList.filter(user => user.user_id !== userId));
        // Sayıyı güncelle
        setFollowingCount(prev => Math.max(0, prev - 1));
      } else {
        console.error('Takipten çıkma başarısız');
      }
    } catch (error) {
      console.error('Takipten çıkma hatası:', error);
    }
  };

  const handleRemoveFollower = async (e, followerId) => {
    e.stopPropagation(); // Modal'ın kapanmasını engelle
    
    const currentUserId = profileUser?.user_id;
    if (!currentUserId || !followerId) return;

    try {
      const response = await fetch('http://localhost:8000/user/unfollow', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          follower_id: followerId, // Takipçinin user_id'si
          followed_id: currentUserId // Sizin user_id'niz
        })
      });

      if (response.ok) {
        // Listeden kaldır
        setFollowersList(prevList => prevList.filter(user => user.user_id !== followerId));
        // Sayıyı güncelle
        setFollowersCount(prev => Math.max(0, prev - 1));
      } else {
        console.error('Takipçiyi çıkarma başarısız');
      }
    } catch (error) {
      console.error('Takipçiyi çıkarma hatası:', error);
    }
  };

  const handleListsClick = () => {
    const customListsSection = document.getElementById('custom-lists-section');
    if (customListsSection) {
      customListsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleEditProfile = () => {
    setIsEditProfileModalOpen(true);
  };

  const handleCloseEditProfileModal = () => {
    setIsEditProfileModalClosing(true);
    setTimeout(() => {
      setIsEditProfileModalOpen(false);
      setIsEditProfileModalClosing(false);
    }, 300);
  };

  const handleSubmitEditProfile = (formData) => {
    // Update profile user state
    setProfileUser(prev => ({
      ...prev,
      username: formData.username,
      email: formData.email,
      bio: formData.bio,
      avatar_url: formData.avatar_url || prev.avatar_url
    }));
    // In real app, this would be an API call
    // Close with animation
    setIsEditProfileModalClosing(true);
    setTimeout(() => {
      setIsEditProfileModalOpen(false);
      setIsEditProfileModalClosing(false);
    }, 300);
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

  // --- DÜZELTME BURADA: Yükleniyor Kontrolü Ekleyin ---
  if (loadingProfile) {
    return (
      <div className="profile-container">
        <Sidebar 
          onLogout={handleLogout}
          isSearchMode={isSearchMode}
          onSearchModeChange={setIsSearchMode}
        />
        <div className="profile-loading">
          <div className="loading-spinner"></div> {/* CSS'inizde spinner varsa */}
          <p style={{color: 'white', textAlign: 'center', marginTop: '20px'}}>Profil Yükleniyor...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  // Eğer yükleme bitti ama kullanıcı bulunamadıysa (profileUser hala null ise)
  if (!profileUser) {
     return (
      <div className="profile-container">
        <Sidebar onLogout={handleLogout} />
        <div className="profile-error" style={{color: 'white', textAlign: 'center', marginTop: '50px'}}>
           <h2>Kullanıcı Bulunamadı</h2>
           <button onClick={() => navigate('/home')} style={{marginTop: '10px', padding: '10px'}}>Ana Sayfaya Dön</button>
        </div>
        <BottomNav />
      </div>
    );
  }
  // --- DÜZELTME SONU ---


  return (
    <div className="profile-container">
      <Sidebar 
        onLogout={handleLogout}
        isSearchMode={isSearchMode}
        onSearchModeChange={setIsSearchMode}
      />
      <div className="profile-content">
        {/* Profile Header */}
        <ProfileHeader
          profileUser={profileUser}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          customLists={customLists}
          libraryData={libraryData}
          recentActivities={recentActivities}
          onEditProfile={handleEditProfile}
          onCreateList={handleCreateList}
          onFollow={handleFollow}
          onFollowersClick={handleFollowersClick}
          onFollowingClick={handleFollowingClick}
          onListsClick={handleListsClick}
        />

        {/* Library Tabs */}
        <LibraryTabs
          activeTab={activeLibraryTab}
          onTabChange={handleTabChange}
          isTabTransitioning={isTabTransitioning}
          libraryData={libraryData}
          isOwnProfile={isOwnProfile}
          onAddContentClick={handleAddContentClick}
        />

        {/* Custom Lists */}
        {isOwnProfile && (
          <CustomLists
            customLists={customLists}
            onEditList={handleEditList}
          />
        )}

        {/* Recent Activities */}
        <RecentActivities
          recentActivities={recentActivities}
        />
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
      <CreateListModal
        isOpen={isCreateListModalOpen}
        isClosing={isCreateListModalClosing}
        onClose={handleCloseCreateListModal}
        onSubmit={handleSubmitNewList}
        listName={newListName}
        setListName={setNewListName}
        listDescription={newListDescription}
        setListDescription={setNewListDescription}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        isClosing={isEditProfileModalClosing}
        onClose={handleCloseEditProfileModal}
        onSubmit={handleSubmitEditProfile}
        profileUser={profileUser}
        setProfileUser={setProfileUser}
      />

      {/* Edit List Modal */}
      <EditListModal
        isOpen={isEditListModalOpen}
        isClosing={isEditListModalClosing}
        onClose={handleCloseEditListModal}
        selectedList={selectedList}
        setSelectedList={setSelectedList}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        isSearching={isSearching}
        isSearchResultsClosing={isSearchResultsClosing}
        onSearchContent={handleSearchContent}
        onAddToList={handleAddToList}
        onRemoveFromList={handleRemoveFromList}
        onUpdateList={handleUpdateList}
        onDeleteList={handleDeleteList}
      />

      {/* Add Content Modal */}
      <AddContentModal
        isOpen={isAddContentModalOpen}
        isClosing={isAddContentModalClosing}
        onClose={handleCloseAddContentModal}
        contentType={addContentType}
        onAddContent={handleAddContent}
      />

      {/* Takipçiler Modal */}
      {showFollowersModal && (
        <div className={`follow-modal-overlay ${isFollowersModalOpening && !isFollowersModalClosing ? 'active' : ''}`} onClick={handleCloseFollowersModal}>
          <div className={`follow-modal ${isFollowersModalClosing ? 'closing' : isFollowersModalOpening ? 'opening' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="follow-modal-header">
              <h2>Takipçiler</h2>
            </div>
            <div className="follow-modal-content">
              {loadingFollowers ? (
                <div className="follow-modal-loading">Yükleniyor...</div>
              ) : followersList.length > 0 ? (
                <div className="follow-modal-list">
                  {followersList.map((user, index) => (
                    <div 
                      key={index} 
                      className="follow-modal-user-item"
                      onClick={() => handleUserClick(user.username)}
                    >
                      <img 
                        src={user.avatar_url || `https://i.pravatar.cc/150?img=${index + 1}`}
                        alt={user.username}
                        className="follow-modal-user-avatar"
                      />
                      <span className="follow-modal-username">{user.username}</span>
                      <button 
                        className="follow-modal-remove-btn"
                        onClick={(e) => handleRemoveFollower(e, user.user_id)}
                      >
                        Takipçiyi Çıkar
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="follow-modal-empty">Henüz takipçi yok</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Takip Edilenler Modal */}
      {showFollowingModal && (
        <div className={`follow-modal-overlay ${isFollowingModalOpening && !isFollowingModalClosing ? 'active' : ''}`} onClick={handleCloseFollowingModal}>
          <div className={`follow-modal ${isFollowingModalClosing ? 'closing' : isFollowingModalOpening ? 'opening' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="follow-modal-header">
              <h2>Takip Edilenler</h2>
            </div>
            <div className="follow-modal-content">
              {loadingFollowing ? (
                <div className="follow-modal-loading">Yükleniyor...</div>
              ) : followingList.length > 0 ? (
                <div className="follow-modal-list">
                  {followingList.map((user, index) => (
                    <div 
                      key={index} 
                      className="follow-modal-user-item"
                      onClick={() => handleUserClick(user.username)}
                    >
                      <img 
                        src={user.avatar_url || `https://i.pravatar.cc/150?img=${index + 1}`}
                        alt={user.username}
                        className="follow-modal-user-avatar"
                      />
                      <span className="follow-modal-username">{user.username}</span>
                      <button 
                        className="follow-modal-unfollow-btn"
                        onClick={(e) => handleUnfollow(e, user.user_id)}
                      >
                        Takipten Çık
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="follow-modal-empty">Henüz kimseyi takip etmiyor</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
