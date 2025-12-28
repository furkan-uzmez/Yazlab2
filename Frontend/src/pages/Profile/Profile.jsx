import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import BottomNav from '../../components/BottomNav';
import Sidebar from '../HomePage/Sidebar/Sidebar';
import LogoutModal from '../HomePage/LogoutModal/LogoutModal';
import CommentPanel from '../HomePage/CommentPanel/CommentPanel';
import CreateListModal from './components/CreateListModal/CreateListModal';
import EditListModal from './components/EditListModal/EditListModal';
import EditProfileModal from './components/EditProfileModal/EditProfileModal';
import AddContentModal from './components/AddContentModal/AddContentModal';
import ProfileHeader from './sections/ProfileHeader/ProfileHeader';
import LibraryTabs from './sections/LibraryTabs/LibraryTabs';
import CustomLists from './sections/CustomLists/CustomLists';
import RecentActivities from './sections/RecentActivities/RecentActivities';
import './Profile.css';
import { API_BASE } from '../../utils/api';

function Profile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Mock data - Frontend only
  const storedUsername = localStorage.getItem('profileusername');
  const isOwnProfile = !userId || (userId === storedUsername);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  // ... (diğer state'ler) ...

  // Mock profile user - now using state (BAŞLANGIÇ DEĞERİNİ GÜNCELLEYİN)
  const [profileUser, setProfileUser] = useState(null); // Başlangıçta null olsun, veri gelince dolsun
  const [loadingProfile, setLoadingProfile] = useState(true); // Yükleniyor durumu
  //const [customLists, setCustomLists] = useState([]); // <-- BOŞ BAŞLIYOR
  const [loadingLists, setLoadingLists] = useState(false); // Yükleme durumu

  // ... (diğer state'ler)

  // ... (diğer state'ler) ...

  // 1. Library data state'ini BOŞ olarak başlatın
  const [libraryData, setLibraryData] = useState({
    watched: [],
    toWatch: [],
    read: [],
    toRead: []
  });
  const [loadingLibrary, setLoadingLibrary] = useState(false); // Yükleniyor state'i

  // ... (fetchUserProfile useEffect'i aynı kalsın) ...

  // 2. KÜTÜPHANE VERİSİNİ ÇEKEN YENİ useEffect
  useEffect(() => {
    const fetchLibraryData = async () => {
      setLoadingLibrary(true);

      // Kullanıcı adını belirle
      let targetUsername = userId;
      if (!targetUsername) {
        targetUsername = localStorage.getItem("profileusername");
      }

      if (!targetUsername) {
        setLoadingLibrary(false);
        return;
      }

      try {
        // API isteği
        const response = await fetch(`${API_BASE}/list/get_library?username=${encodeURIComponent(targetUsername)}`);

        if (response.ok) {
          const data = await response.json();
          // Backend'den gelen veri zaten doğru formatta:
          // { "watched": [...], "read": [...], ... }

          // State'i güncelle
          setLibraryData({
            watched: data.watched || [],
            toWatch: data.toWatch || [],
            read: data.read || [],
            toRead: data.toRead || []
          });
        } else {
          console.error("Kütüphane yüklenemedi:", response.status);
        }
      } catch (error) {
        console.error("Kütüphane API hatası:", error);
      } finally {
        setLoadingLibrary(false);
      }
    };

    fetchLibraryData();
  }, [userId]); // userId değişince tekrar çalışır

  // ... (CustomLists useEffect'i ve diğerleri aynı kalsın) ...

  // --- YENİ: KULLANICI VERİSİNİ ÇEKME (API) ---
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoadingProfile(true);
      try {
        let url = '';
        const storedUsername = localStorage.getItem('profileusername');
        let isOwnProfileView = !userId || (userId === storedUsername);

        if (isOwnProfileView) {
          // Kendi profilimiz: Email ile ara
          const email = localStorage.getItem('email');
          if (!email) {
            setLoadingProfile(false);
            return;
          }
          // API: /user/search_by_email?query=...
          url = `${API_BASE}/user/search_by_email?query=${encodeURIComponent(email)}`;
        } else {
          // Başkasının profili: Username ile ara
          // Viewer ID ekle (takip durumunu kontrol etmek için)
          const currentUserId = localStorage.getItem('user_id');
          url = `${API_BASE}/user/search?query=${encodeURIComponent(userId)}`;
          if (currentUserId) {
            url += `&viewer_id=${currentUserId}`;
          }
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
              avatar_url: userData.avatar_url,
              bio: userData.bio || 'Henüz bir biyografi eklenmemiş.',
              followers_count: userData.followers_count || 0,
              following_count: userData.following_count || 0,
              is_following: userData.is_following || false // API'den gelen takip durumu
            });
            // Takip durumunu güncelle (sadece başkasının profili ise)
            if (!isOwnProfileView) {
              setIsFollowing(userData.is_following || false);
            }
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



  useEffect(() => {
    const fetchUserLists = async () => {
      setLoadingLists(true);

      let targetUsername = userId;
      if (!targetUsername) {
        targetUsername = localStorage.getItem("profileusername");
      }

      if (!targetUsername) {
        setLoadingLists(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/list/get_lists?username=${encodeURIComponent(targetUsername)}`);

        if (response.ok) {
          const data = await response.json();
          const apiLists = data.lists || [];

          // --- DÜZELTME BURADA: STANDART LİSTELERİ FİLTRELE ---
          // Bu listeler zaten LibraryTabs içinde gösteriliyor, 
          // CustomLists içinde tekrar göstermemek için filtreliyoruz.
          const standardListNames = ["İzledim", "İzlenecek", "Okudum", "Okunacak"];

          const customListsOnly = apiLists.filter(list =>
            !standardListNames.includes(list.name)
          );
          // ----------------------------------------------------

          const formattedLists = customListsOnly.map(list => ({
            id: list.list_id,
            name: list.name,
            description: list.description,
            items: [], // İçerik detayları için ayrı istek gerekebilir
            itemCount: list.item_count
          }));

          setCustomLists(formattedLists);
        } else {
          console.error("Listeler yüklenemedi:", response.status);
        }
      } catch (error) {
        console.error("Liste API hatası:", error);
      } finally {
        setLoadingLists(false);
      }
    };

    fetchUserLists();
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

    // Önce frontend state'ini güncelle (anında yansısın)
    setLibraryData(prev => {
      const newData = { ...prev };
      const targetArray = newData[addContentType];

      // Aynı içerik zaten varsa yeniden ekleme
      const exists = targetArray.some(item => item.id === content.id);
      if (!exists) {
        newData[addContentType] = [
          ...targetArray,
          {
            id: content.id,
            title: content.title,
            poster_url: content.poster_url
          }
        ];
      }

      return newData;
    });

    // Ardından veritabanına da kaydet
    const username = profileUser?.username || localStorage.getItem('profileusername');
    if (!username) {
      console.error('Kütüphane kaydı için kullanıcı adı bulunamadı');
      return;
    }

    // Liste tipine göre içerik türünü belirle
    const contentType =
      addContentType === 'watched' || addContentType === 'toWatch'
        ? 'movie'
        : 'book';

    const apiSource = contentType === 'movie' ? 'tmdb' : 'google_books';

    fetch(`${API_BASE}/list/add_item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        list_key: addContentType,
        external_id: content.id,
        title: content.title,
        poster_url: content.poster_url,
        content_type: contentType,
        description: content.description,
        release_year: content.release_year,
        duration_or_pages: content.duration_or_pages,
        api_source: apiSource
      })
    }).catch((error) => {
      console.error('Kütüphane kaydı API hatası:', error);
    });
  };

  const handleRemoveContent = async (content, listKey) => {
    // Onay iste
    const confirmed = window.confirm(`${content.title} adlı içeriği listeden kaldırmak istediğine emin misin?`);
    if (!confirmed) {
      return;
    }

    // Önce frontend state'ini güncelle (anında yansısın)
    setLibraryData(prev => {
      const newData = { ...prev };
      newData[listKey] = newData[listKey].filter(item => item.id !== content.id);
      return newData;
    });

    // Ardından veritabanından da kaldır
    const username = profileUser?.username || localStorage.getItem('profileusername');
    if (!username) {
      console.error('Kütüphane kaldırma için kullanıcı adı bulunamadı');
      return;
    }

    // get_user_library'den dönen verilerde id zaten content_id olarak geliyor
    // Bu yüzden content.id'yi direkt kullanabiliriz
    try {
      const response = await fetch(`${API_BASE}/list/remove_item`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          list_key: listKey,
          content_id: content.id
        })
      });

      if (!response.ok) {
        console.error('Kütüphane kaldırma API hatası:', response.status);
        // Hata durumunda state'i geri al (optimistic update'i geri al)
        setLibraryData(prev => {
          const newData = { ...prev };
          newData[listKey] = [...newData[listKey], content];
          return newData;
        });
      }
    } catch (error) {
      console.error('Kütüphane kaldırma hatası:', error);
      // Hata durumunda state'i geri al
      setLibraryData(prev => {
        const newData = { ...prev };
        newData[listKey] = [...newData[listKey], content];
        return newData;
      });
    }
  };

  // Mock custom lists - now using state
  const [customLists, setCustomLists] = useState([
    {
      id: 1, name: 'En İyi Bilimkurgu Filmlerim', description: 'Favori bilimkurgu filmlerim', items: [
        { id: 1, title: 'Inception', type: 'Film', poster_url: 'https://image.tmdb.org/t/p/w200/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg' },
        { id: 2, title: 'The Matrix', type: 'Film', poster_url: 'https://image.tmdb.org/t/p/w200/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg' }
      ]
    },
    {
      id: 2, name: 'Okunacak Klasikler', description: 'Mutlaka okumam gereken klasik eserler', items: [
        { id: 3, title: '1984', type: 'Kitap', poster_url: 'https://covers.openlibrary.org/b/id/7222246-M.jpg' }
      ]
    }
  ]);

  // Recent activities state
  const [recentActivities, setRecentActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // Yorum paneli state'leri (Home.jsx ile aynı mantık)
  const [commentPanelOpen, setCommentPanelOpen] = useState(false);
  const [commentPanelClosing, setCommentPanelClosing] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [panelComments, setPanelComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [likedComments, setLikedComments] = useState(new Set());
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchRecentActivities = async () => {
      if (!profileUser?.user_id) return;

      setLoadingActivities(true);
      try {
        const currentUserId = localStorage.getItem('user_id');
        let url = `${API_BASE}/feed/user_activities?user_id=${profileUser.user_id}`;

        if (currentUserId) {
          url += `&viewer_id=${currentUserId}`;
        }

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setRecentActivities(data.activities || []);
        } else {
          console.error("Aktiviteler yüklenemedi:", response.status);
        }
      } catch (error) {
        console.error("Aktivite API hatası:", error);
      } finally {
        setLoadingActivities(false);
      }
    };

    if (profileUser?.user_id) {
      fetchRecentActivities();
    }
  }, [profileUser?.user_id]);

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

  // --- Profil sayfası: Gönderilerim için yorum panelini aç ---
  const handleCommentClick = async (activity) => {
    setSelectedActivity(activity);
    setCommentPanelOpen(true);
    setPanelComments([]);

    try {
      const userEmail = localStorage.getItem('email');
      if (!userEmail) {
        console.error('Kullanıcı girişi yapılmamış.');
        return;
      }

      const response = await fetch(
        `${API_BASE}/interactions/get_all_comments?email=${userEmail}`
      );

      if (response.ok) {
        const data = await response.json();
        const allComments = data.comments || [];
        const fetchedCurrentUserId = data.current_user_id || null;
        setCurrentUserId(fetchedCurrentUserId);

        // Sadece seçilen aktiviteye ait yorumları filtrele
        const relatedComments = allComments.filter(
          (comment) => String(comment.activity_id) === String(activity.id)
        );

        // Yorumları CommentPanel için uygun formata dönüştür
        const formattedComments = relatedComments.map((c) => ({
          id: c.comment_id,
          userId: c.user_id,
          userName: c.username,
          userAvatar: c.avatar_url || '/default-avatar.png',
          text: c.text,
          date: c.created_at,
          likes: c.like_count,
          isLiked: c.is_liked_by_me > 0
        }));

        setPanelComments(formattedComments);

        const newLikedSet = new Set();
        formattedComments.forEach((c) => {
          if (c.isLiked) {
            newLikedSet.add(c.id);
          }
        });
        setLikedComments(newLikedSet);
      } else {
        console.error('Yorumlar yüklenemedi:', response.status);
      }
    } catch (error) {
      console.error('Yorum API hatası:', error);
    }
  };

  const handleCloseCommentPanel = () => {
    setCommentPanelClosing(true);
    setTimeout(() => {
      setCommentPanelOpen(false);
      setCommentPanelClosing(false);
      setSelectedActivity(null);
      setPanelComments([]);
      setCommentText('');
    }, 400);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.trim() || !selectedActivity) return;

    try {
      const userEmail = localStorage.getItem('email');
      if (!userEmail) {
        console.error('Kullanıcı girişi yapılmamış.');
        return;
      }

      const response = await fetch(`${API_BASE}/interactions/add_comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_email: userEmail,
          activity_id: selectedActivity.id,
          comment_text: commentText
        })
      });

      if (response.ok) {
        // Input alanını temizle
        setCommentText('');

        // Yorumları veritabanından yeniden yükle (güncel veriler için)
        const refreshResponse = await fetch(
          `${API_BASE}/interactions/get_all_comments?email=${userEmail}`
        );

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          const allComments = refreshData.comments || [];

          const relatedComments = allComments.filter(
            (comment) => String(comment.activity_id) === String(selectedActivity.id)
          );

          const formattedComments = relatedComments.map((c) => ({
            id: c.comment_id,
            userId: c.user_id,
            userName: c.username,
            userAvatar: c.avatar_url || '/default-avatar.png',
            text: c.text,
            date: c.created_at,
            likes: c.like_count,
            isLiked: c.is_liked_by_me > 0
          }));

          setPanelComments(formattedComments);

          const newLikedSet = new Set();
          formattedComments.forEach((c) => {
            if (c.isLiked) {
              newLikedSet.add(c.id);
            }
          });
          setLikedComments(newLikedSet);
        }

        // Aktivitenin yorum sayısını artır (hem kart hem backend aktivite datası)
        setSelectedActivity((prev) =>
          prev
            ? {
              ...prev,
              comments: (prev.comments || 0) + 1
            }
            : prev
        );

        setRecentActivities((prev) =>
          prev.map((activity) =>
            activity.activity_id === selectedActivity.id
              ? { ...activity, comment_count: (activity.comment_count || 0) + 1 }
              : activity
          )
        );
      } else {
        const errorData = await response.json();
        console.error('Yorum eklenemedi:', errorData.detail);
        alert('Yorum eklenirken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Yorum API hatası:', error);
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      const username = localStorage.getItem('profileusername');
      if (!username) return;

      const isCurrentlyLiked = likedComments.has(commentId);
      const willLike = !isCurrentlyLiked;
      const changeAmount = willLike ? 1 : -1;

      // Optimistic UI
      setLikedComments((prev) => {
        const newSet = new Set(prev);
        if (willLike) newSet.add(commentId);
        else newSet.delete(commentId);
        return newSet;
      });

      setPanelComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? {
              ...comment,
              likes: Math.max(0, (comment.likes || 0) + changeAmount)
            }
            : comment
        )
      );

      const response = await fetch(`${API_BASE}/interactions/like_comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment_id: commentId,
          username: username
        })
      });

      if (!response.ok) {
        console.error('Beğeni API hatası, geri alınıyor...');

        setLikedComments((prev) => {
          const newSet = new Set(prev);
          if (willLike) newSet.delete(commentId);
          else newSet.add(commentId);
          return newSet;
        });

        setPanelComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId
              ? {
                ...comment,
                likes: Math.max(0, (comment.likes || 0) - changeAmount)
              }
              : comment
          )
        );
      }
    } catch (error) {
      console.error('Yorum beğeni hatası:', error);
    }
  };

  const handleCommentEdit = (commentId, newText) => {
    setPanelComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? {
            ...comment,
            text: newText
          }
          : comment
      )
    );
  };

  const handleCommentDelete = (commentId) => {
    setPanelComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId)
    );

    if (selectedActivity) {
      setSelectedActivity({
        ...selectedActivity,
        comments: Math.max(0, (selectedActivity.comments || 0) - 1)
      });

      setRecentActivities((prev) =>
        prev.map((activity) =>
          activity.activity_id === selectedActivity.id
            ? { ...activity, comment_count: Math.max(0, (activity.comment_count || 0) - 1) }
            : activity
        )
      );
    }
  };

  const handleFollow = async () => {
    // Aynı anda birden fazla istek atılmasını engelle
    if (isFollowLoading) return;

    // Takipten çıkarken kullanıcıdan onay iste
    if (isFollowing) {
      const confirmed = window.confirm("Bu kullanıcıyı takipten çıkarmak istediğine emin misin?");
      if (!confirmed) {
        return;
      }
    }

    const currentUserId = localStorage.getItem('user_id');
    const targetUserId = profileUser?.user_id;

    if (!currentUserId || !targetUserId) {
      console.error("Kullanıcı ID'leri eksik:", { currentUserId, targetUserId });
      return;
    }

    const endpoint = isFollowing ? 'unfollow' : 'follow';
    const method = isFollowing ? 'DELETE' : 'POST';

    setIsFollowLoading(true);

    try {
      const response = await fetch(`${API_BASE}/user/${endpoint}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          follower_id: parseInt(currentUserId),
          followed_id: targetUserId
        })
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
        // Takipçi sayısını güncelle
        setProfileUser(prev => ({
          ...prev,
          followers_count: isFollowing
            ? Math.max(0, prev.followers_count - 1)
            : prev.followers_count + 1
        }));
      } else {
        console.error("Takip işlemi başarısız:", response.status);
      }
    } catch (error) {
      console.error("Takip API hatası:", error);
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleFollowersClick = async () => {
    if (!profileUser?.email) return;
    if (!isOwnProfile && !isFollowing) return;

    setShowFollowersModal(true);
    setLoadingFollowers(true);

    // Açılış animasyonu için kısa bir gecikme
    setTimeout(() => {
      setIsFollowersModalOpening(true);
    }, 10);

    try {
      const response = await fetch(`${API_BASE}/user/${encodeURIComponent(profileUser.email)}/followers`);
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
    if (!isOwnProfile && !isFollowing) return;

    setShowFollowingModal(true);
    setLoadingFollowing(true);

    // Açılış animasyonu için kısa bir gecikme
    setTimeout(() => {
      setIsFollowingModalOpening(true);
    }, 10);

    try {
      const response = await fetch(`${API_BASE}/user/${encodeURIComponent(profileUser.email)}/following`);
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
      const response = await fetch(`${API_BASE}/user/unfollow`, {
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
      const response = await fetch(`${API_BASE}/user/unfollow`, {
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

  const handleSubmitEditProfile = async (formData) => {
    const currentUsername = profileUser?.username || localStorage.getItem('profileusername');
    if (!currentUsername) return;

    try {
      const response = await fetch(`${API_BASE}/user/update_profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          current_username: currentUsername,
          new_username: formData.username,
          new_bio: formData.bio,
          avatar_url: formData.avatar_url
        })
      });

      if (response.ok) {
        // Update profile user state
        setProfileUser(prev => ({
          ...prev,
          username: formData.username,
          email: formData.email,
          bio: formData.bio,
          avatar_url: formData.avatar_url || prev.avatar_url
        }));

        // Update local storage if username changed
        if (formData.username && formData.username !== currentUsername) {
          localStorage.setItem('profileusername', formData.username);
        }

        // Close with animation
        setIsEditProfileModalClosing(true);
        setTimeout(() => {
          setIsEditProfileModalOpen(false);
          setIsEditProfileModalClosing(false);
        }, 300);
      } else {
        const errorData = await response.json();
        alert(`Profil güncellenemedi: ${errorData.detail || 'Bilinmeyen hata'}`);
      }
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      alert('Profil güncellenirken bir hata oluştu.');
    }
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

  const handleSubmitNewList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    const username = profileUser?.username || localStorage.getItem('profileusername');
    if (!username) {
      console.error('Liste oluşturma için kullanıcı adı bulunamadı');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/list/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          name: newListName,
          description: newListDescription
        })
      });

      if (response.ok) {
        const data = await response.json();

        // Add to custom lists state
        const newList = {
          id: data.list_id,
          name: data.name,
          description: data.description,
          items: [],
          itemCount: 0
        };

        setCustomLists([...customLists, newList]);

        // Close with animation
        setIsCreateListModalClosing(true);
        setTimeout(() => {
          setIsCreateListModalOpen(false);
          setIsCreateListModalClosing(false);
          setNewListName('');
          setNewListDescription('');
        }, 300);
      } else {
        const errorData = await response.json();
        alert(`Liste oluşturulamadı: ${errorData.detail || 'Bilinmeyen hata'}`);
      }
    } catch (error) {
      console.error('Liste oluşturma hatası:', error);
      alert('Liste oluşturulurken bir hata oluştu.');
    }
  };

  const handleDeleteList = async (listId) => {
    // If listId is provided (direct delete), use it. Otherwise use selectedList (modal delete)
    const targetList = listId ? customLists.find(l => l.id === listId) : selectedList;
    if (!targetList) return;

    const confirmed = window.confirm(`${targetList.name} adlı listeyi silmek istediğine emin misin?`);
    if (!confirmed) return;

    const username = profileUser?.username || localStorage.getItem('profileusername');
    if (!username) return;

    try {
      const response = await fetch(`${API_BASE}/list/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          list_id: targetList.id
        })
      });

      if (response.ok) {
        // Remove from state
        setCustomLists(customLists.filter(list => list.id !== targetList.id));

        // Close modal if open
        if (isEditListModalOpen) {
          setIsEditListModalClosing(true);
          setTimeout(() => {
            setIsEditListModalOpen(false);
            setIsEditListModalClosing(false);
            setSelectedList(null);
          }, 300);
        }
      } else {
        alert('Liste silinemedi');
      }
    } catch (error) {
      console.error('Liste silme hatası:', error);
      alert('Liste silinirken bir hata oluştu');
    }
  };

  const handleEditList = async (list) => {
    setSelectedList(list);
    setIsEditListModalOpen(true);

    // Fetch list items from API
    try {
      const response = await fetch(`${API_BASE}/list/items/${list.id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedList(prev => ({
          ...prev,
          items: data.items || []
        }));
      }
    } catch (error) {
      console.error("Liste içerikleri yüklenemedi:", error);
    }
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

  const handleSearchContent = (query, type = 'movie') => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      // If there are existing results, close them first
      if (searchResults.length > 0) {
        setIsSearchResultsClosing(true);
        setTimeout(() => {
          setIsSearchResultsClosing(false);
          setIsSearching(true);
          fetchSearchResults(query, type);
        }, 300);
      } else {
        setIsSearching(true);
        fetchSearchResults(query, type);
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

  const fetchSearchResults = async (query, type) => {
    try {
      const response = await fetch(`${API_BASE}/content/search?query=${encodeURIComponent(query)}&api_type=${type}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddToList = async (content) => {
    if (selectedList) {
      const username = profileUser?.username || localStorage.getItem('profileusername');
      if (!username) return;

      try {
        const response = await fetch(`${API_BASE}/list/add_item`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: username,
            list_key: selectedList.name, // Not used when list_id is present
            list_id: selectedList.id,
            external_id: content.id,
            title: content.title,
            poster_url: content.poster_url,
            content_type: content.type === 'Film' ? 'movie' : 'book',
            api_source: content.type === 'Film' ? 'tmdb' : 'google_books'
          })
        });

        if (response.ok) {
          // Update local state
          const updatedLists = customLists.map(list => {
            if (list.id === selectedList.id) {
              const exists = list.items.some(item => item.id === content.id);
              if (!exists) {
                return {
                  ...list,
                  items: [...list.items, content],
                  itemCount: (list.itemCount || 0) + 1
                };
              }
            }
            return list;
          });
          setCustomLists(updatedLists);
          setSelectedList(prev => ({
            ...prev,
            items: [...(prev.items || []), content]
          }));

          setSearchQuery('');
          if (searchResults.length > 0) {
            setIsSearchResultsClosing(true);
            setTimeout(() => {
              setSearchResults([]);
              setIsSearchResultsClosing(false);
            }, 300);
          } else {
            setSearchResults([]);
          }
        } else {
          alert("İçerik eklenemedi");
        }
      } catch (error) {
        console.error("Ekleme hatası:", error);
      }
    }
  };

  const handleRemoveFromList = async (contentId) => {
    if (selectedList) {
      const username = profileUser?.username || localStorage.getItem('profileusername');
      if (!username) return;

      try {
        const response = await fetch(`${API_BASE}/list/remove_item`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: username,
            list_key: selectedList.name,
            list_id: selectedList.id,
            content_id: contentId
          })
        });

        if (response.ok) {
          const updatedLists = customLists.map(list => {
            if (list.id === selectedList.id) {
              return {
                ...list,
                items: list.items.filter(item => item.id !== contentId),
                itemCount: Math.max(0, (list.itemCount || 0) - 1)
              };
            }
            return list;
          });
          setCustomLists(updatedLists);
          setSelectedList(prev => ({
            ...prev,
            items: prev.items.filter(item => item.id !== contentId)
          }));
        } else {
          alert("İçerik kaldırılamadı");
        }
      } catch (error) {
        console.error("Kaldırma hatası:", error);
      }
    }
  };

  const handleUpdateList = async (e) => {
    e.preventDefault();
    if (selectedList) {
      try {
        const response = await fetch(`${API_BASE}/list/update`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            list_id: selectedList.id,
            name: selectedList.name,
            description: selectedList.description
          })
        });

        if (response.ok) {
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
        } else {
          alert("Liste güncellenemedi");
        }
      } catch (error) {
        console.error("Güncelleme hatası:", error);
      }
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
          <p style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>Profil Yükleniyor...</p>
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
        <div className="profile-error" style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>
          <h2>Kullanıcı Bulunamadı</h2>
          <button onClick={() => navigate('/home')} style={{ marginTop: '10px', padding: '10px' }}>Ana Sayfaya Dön</button>
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
          isFollowLoading={isFollowLoading}
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

        {isOwnProfile || isFollowing ? (
          <>
            <div className="profile-main">
              <LibraryTabs
                activeTab={activeLibraryTab}
                onTabChange={handleTabChange}
                isTransitioning={isTabTransitioning}
                libraryData={libraryData}
                isOwnProfile={isOwnProfile}
                onAddContentClick={handleAddContentClick}
                onRemoveContent={handleRemoveContent}
              />

              <CustomLists
                customLists={customLists}
                isOwnProfile={isOwnProfile}
                onEditList={handleEditList}
                onDeleteList={handleDeleteList}
              />
            </div>

            <div className="profile-sidebar">
              <RecentActivities
                recentActivities={recentActivities}
                libraryData={libraryData}
                profileUser={profileUser}
                onCommentClick={handleCommentClick}
                commentPanelOpen={commentPanelOpen}
                selectedActivity={selectedActivity}
              />
            </div>
          </>
        ) : (
          <div className="private-account-message">
            <h2>Bu Hesap Gizli</h2>
            <p>Bu kullanıcının paylaşımlarını görmek için takip etmelisin.</p>
          </div>
        )}
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
                        src={user.avatar_url || '/default-avatar.png'}
                        alt={user.username}
                        className="follow-modal-user-avatar"
                      />
                      <span className="follow-modal-username">{user.username}</span>
                      {isOwnProfile && (
                        <button
                          className="follow-modal-remove-btn"
                          onClick={(e) => handleRemoveFollower(e, user.user_id)}
                        >
                          Takipçiyi Çıkar
                        </button>
                      )}
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
        <div
          className={`follow-modal-overlay ${isFollowingModalOpening && !isFollowingModalClosing ? 'active' : ''
            }`}
          onClick={handleCloseFollowingModal}
        >
          <div
            className={`follow-modal ${isFollowingModalClosing ? 'closing' : isFollowingModalOpening ? 'opening' : ''
              }`}
            onClick={(e) => e.stopPropagation()}
          >
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
                        src={user.avatar_url || '/default-avatar.png'}
                        alt={user.username}
                        className="follow-modal-user-avatar"
                      />
                      <span className="follow-modal-username">{user.username}</span>
                      {isOwnProfile && (
                        <button
                          className="follow-modal-unfollow-btn"
                          onClick={(e) => handleUnfollow(e, user.user_id)}
                        >
                          Takipten Çık
                        </button>
                      )}
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

      {/* Yorum Paneli - Gönderilerim için */}
      <CommentPanel
        isOpen={commentPanelOpen}
        isClosing={commentPanelClosing}
        selectedActivity={selectedActivity}
        comments={panelComments}
        likedComments={likedComments}
        commentText={commentText}
        currentUserId={currentUserId}
        onClose={handleCloseCommentPanel}
        onCommentLike={handleCommentLike}
        onCommentSubmit={handleCommentSubmit}
        onCommentTextChange={setCommentText}
        onCommentEdit={handleCommentEdit}
        onCommentDelete={handleCommentDelete}
      />
    </div>
  );
}

export default Profile;
