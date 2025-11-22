import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';
import Sidebar from './Sidebar/Sidebar';
import Feed from './Feed/Feed';
import RightPanel from './RightPanel/RightPanel';
import CommentPanel from './CommentPanel/CommentPanel';
import LogoutModal from './LogoutModal/LogoutModal';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const loadingRef = useRef(null);
  const loadingRefValue = useRef(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  
  // ... (Diğer state'ler aynı kalacak: commentPanelOpen, selectedActivity vb.) ...
  const [commentPanelOpen, setCommentPanelOpen] = useState(false);
  const [commentPanelClosing, setCommentPanelClosing] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [panelComments, setPanelComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [likedComments, setLikedComments] = useState(new Set());
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  // ... (Handler fonksiyonları aynı kalacak: handleLogout, handleCommentClick vb.) ...
  const handleLogout = () => setLogoutModalOpen(true);
  const handleConfirmLogout = () => {
    setLogoutLoading(true);
    setTimeout(() => {
      // localStorage'dan token ve kullanıcı bilgilerini temizle
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('profileimage_url');
      localStorage.removeItem('profileusername');
      localStorage.removeItem('profilebio'); 
      // Ana giriş sayfasına yönlendir
      navigate('/');
    }, 1300);
  };

  const handleCancelLogout = () => {
    setLogoutModalOpen(false);
  };

  // --- YORUMLARI GÖSTERME FONKSİYONU (GÜNCELLENDİ) ---
  const handleCommentClick = async (activity) => {
    // 1. Paneli aç ve seçili aktiviteyi ayarla
    setSelectedActivity(activity);
    setCommentPanelOpen(true);
    setPanelComments([]); // Önceki yorumları temizle (Yükleniyor hissi için)

    try {
      // 2. API'den TÜM yorumları çek (Burası optimize edilebilir)
      // İdealde: `.../get_comments?content_id=${activity.contentId}` olmalıydı.
      // Ancak eldeki API ile tümünü çekip filtreleyeceğiz.
      const response = await fetch("http://localhost:8000/interactions/get_all_comments");
      
      if (response.ok) {
        const data = await response.json();
        const allComments = data.comments || [];

        // 3. Sadece SEÇİLİ İÇERİĞE ait yorumları filtrele
        // activity.contentId (Frontend'deki ID) === comment.content_id (API'deki ID)
        const relatedComments = allComments.filter(
            comment => comment.content_id === activity.contentId
        );

        // 4. Yorumları Frontend formatına dönüştür (Mapping)
        const formattedComments = relatedComments.map(c => ({
            id: c.review_id,
            userId: c.username, // Veya c.user_id varsa onu kullanın
            userName: c.username,
            userAvatar: c.avatar_url || 'https://i.pravatar.cc/150?img=default',
            text: c.text,
            date: c.created_at,
            likes: 0 // API'den gelmiyorsa 0
        }));

        // 5. Filtrelenmiş yorumları panele yükle
        setPanelComments(formattedComments);

      } else {
        console.error("Yorumlar yüklenemedi:", response.status);
      }
    } catch (error) {
      console.error("Yorum API hatası:", error);
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
    }, 400); // Animasyon süresi ile eşleşmeli
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim() || !selectedActivity) return;

    try {
      const userEmail = localStorage.getItem("email");
      if (!userEmail) {
        console.error("Kullanıcı girişi yapılmamış.");
        return;
      }

      // --- API İSTEĞİ ---
      const response = await fetch("http://localhost:8000/interactions/add_comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_email: userEmail,
          content_id: selectedActivity.contentId, // <-- DİKKAT: contentId'nin activity objesinde olduğundan emin olun
          comment_text: commentText
        }),
      });

      console.log("Username", localStorage.getItem("username"));

      if (response.ok) {
        // --- BAŞARILI ---
        // 1. Yorumu yerel state'e (panelComments) ekle (Anında görünmesi için)
        const newComment = {
          id: Date.now(), // Geçici ID
          userId: 999, // Veya userEmail'den gelen bilgi
          userName: localStorage.getItem('profileusername'), // Veya localStorage'dan username
          userAvatar: localStorage.getItem('profileimage_url'), // Veya localStorage'dan avatar
          text: commentText,
          date: new Date(),
          likes: 0
        };
        setPanelComments([...panelComments, newComment]);
        
        // 2. Input alanını temizle
        setCommentText('');
        
        // 3. Aktivitedeki yorum sayısını artır
        setActivities(prevActivities => 
          prevActivities.map(activity => 
            activity.id === selectedActivity.id 
              ? { ...activity, comments: (activity.comments || 0) + 1 }
              : activity
          )
        );

      } else {
        const errorData = await response.json();
        console.error("Yorum eklenemedi:", errorData.detail);
        alert("Yorum eklenirken bir hata oluştu.");
      }

    } catch (error) {
      console.error("Yorum API hatası:", error);
    }
  };

  const handleCommentLike = (commentId) => {
    setLikedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handleCommentEdit = (commentId, newText) => {
    setPanelComments(prevComments =>
      prevComments.map(comment =>
        comment.id === commentId
          ? { ...comment, text: newText }
          : comment
      )
    );
  };

  const handleCommentDelete = (commentId) => {
    setPanelComments(prevComments =>
      prevComments.filter(comment => comment.id !== commentId)
    );
    
    // Gönderinin yorum sayısını azalt
    if (selectedActivity) {
      setSelectedActivity({
        ...selectedActivity,
        comments: Math.max(0, (selectedActivity.comments || 0) - 1)
      });
      
      // Activity card'daki yorum sayısını da güncelle
      setActivities(prevActivities => 
        prevActivities.map(activity => 
          activity.id === selectedActivity.id 
            ? { ...activity, comments: Math.max(0, (activity.comments || 0) - 1) }
            : activity
        )
      );
    }
  };

  const handleFollowUser = (userId) => {
    setFollowedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  // --- API'DEN VERİ ÇEKME FONKSİYONU (GÜNCELLENDİ) ---
  const fetchActivities = useCallback(async (pageNum) => {
    if (loadingRefValue.current) return;
    
    loadingRefValue.current = true;
    const isInitialLoad = pageNum === 1 && activities.length === 0;
    
    if (isInitialLoad) {
      setInitialLoading(true);
    } else {
      setLoading(true);
    }
    
    try {
      // 1. Kullanıcının email'ini localStorage'dan al
      // (Login.js'de kaydetmiş olmalısınız)
      const userEmail = localStorage.getItem("email"); 
      
      if (!userEmail) {
        console.error("Email bulunamadı, lütfen giriş yapın.");
        // navigate('/login'); // İsterseniz login'e yönlendirebilirsiniz
        return;
      }

      // 2. API URL'ini oluştur (Sizin paylaştığınız örnekteki gibi)
      // Not: 'search' kelimesi API tanımınızda var mı kontrol edin, 
      // önceki konuşmamızda kaldırmanızı önermiştim ama URL'nizde duruyorsa kalsın.
      const url = `http://localhost:8000/feed/${userEmail}/search?email=${userEmail}`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP Hatası: ${response.status}`);
      }

      const data = await response.json();
      const apiFeedItems = data.feed || [];

      if (apiFeedItems.length === 0) {
        setHasMore(false);
      } else {
        // 3. API Verisini Frontend Formatına Dönüştür
        // ActivityCard'ın beklediği prop isimleri farklı olduğu için bu dönüşüm şart.
        const formattedActivities = apiFeedItems.map(item => ({
          id: item.activity_id,
          userId: item.activity_user_username,
          userName: item.activity_user_username,
          userAvatar: item.activity_user_avatar,
          type: item.type,
          // actionText'i tipe göre oluştur
          actionText: item.type === 'rating' 
            ? `bir ${item.content_type === 'movie' ? 'filmi' : 'kitabı'} oyladı`
            : `bir ${item.content_type === 'movie' ? 'film' : 'kitap'} hakkında yorum yaptı`,
          contentTitle: item.content_title,
          contentType: item.content_type === 'movie' ? 'Film' : 'Kitap',
          // Poster URL'ini kontrol et - null, undefined veya boş string ise null olarak işaretle
          contentPoster: item.content_poster && item.content_poster.trim() !== '' ? item.content_poster : null,
          contentId: item.content_id,
          rating: item.rating_score,
          reviewText: item.review_text,
          date: item.created_at,
          likes: 0,
          comments: 0
        }));

        setActivities(prev => [...prev, ...formattedActivities]);
        setPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      setHasMore(false); 
    } finally {
      setLoading(false);
      setInitialLoading(false);
      loadingRefValue.current = false;
    }
  }, [activities.length]);

  // ... (useEffect'ler ve return kısmı aynı kalacak) ...
  
  useEffect(() => {
    fetchActivities(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // ... (Scroll observer kodu aynı) ...
    if (!hasMore || loading) return;
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !loadingRefValue.current) {
          fetchActivities(page);
        }
      }, { threshold: 0.1 });
    const currentRef = loadingRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, [page, hasMore, loading, fetchActivities]);

  return (
    <div className="home-container">
      {/* ... (JSX yapısı tamamen aynı) ... */}
      <Sidebar 
        onLogout={handleLogout}
        isSearchMode={isSearchMode}
        onSearchModeChange={setIsSearchMode}
      />
      
      <Feed 
        activities={activities}
        loading={loading}
        initialLoading={initialLoading}
        hasMore={hasMore}
        onCommentClick={handleCommentClick}
        commentPanelOpen={commentPanelOpen}
        selectedActivity={selectedActivity}
        loadingRef={loadingRef}
        followedUsers={followedUsers}
      />
      
      <RightPanel 
        followedUsers={followedUsers}
        onFollowUser={handleFollowUser}
      />
      
      <CommentPanel
        isOpen={commentPanelOpen}
        isClosing={commentPanelClosing}
        selectedActivity={selectedActivity}
        comments={panelComments}
        likedComments={likedComments}
        commentText={commentText}
        currentUserId={999}
        onClose={handleCloseCommentPanel}
        onCommentLike={handleCommentLike}
        onCommentSubmit={handleCommentSubmit}
        onCommentTextChange={setCommentText}
        onCommentEdit={handleCommentEdit}
        onCommentDelete={handleCommentDelete}
      />
      
      <LogoutModal
        isOpen={logoutModalOpen}
        isLoading={logoutLoading}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
      
      <BottomNav 
        onSearchClick={() => setIsSearchMode(true)}
        isSearchMode={isSearchMode}
      />
    </div>
  );
}

export default Home;