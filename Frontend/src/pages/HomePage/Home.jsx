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

  const handleCommentClick = async (activity) => {
    setSelectedActivity(activity);
    setCommentPanelOpen(true);
    setPanelComments([]); 
// --- DEBUG 1: Tıkladığım aktivitenin ID'si ne? ---
    console.log("Tıklanan Aktivite ID:", activity.id); 
    console.log("Tıklanan Aktivite Tipi:", typeof activity.id);
    try {
      const userEmail = localStorage.getItem("email");
      
      const response = await fetch(`http://localhost:8000/interactions/get_all_comments?email=${userEmail}`);
     
      if (response.ok) {
        const data = await response.json();
        const allComments = data.comments || [];

        // 1. Sadece SEÇİLİ İÇERİĞE (activity_id) ait yorumları filtrele
        // Backend'de 'activity_id' olarak geliyor
        // Frontend'de activity.id olarak tutuluyor
        const relatedComments = allComments.filter(
            comment => String(comment.activity_id) === String(activity.id)
        );

        // 2. Yorumları Frontend formatına dönüştür (Mapping)
        const formattedComments = relatedComments.map(c => ({
            id: c.comment_id, // Backend: comment_id -> Frontend: id
            userId: c.username, // ID yerine username kullanıyoruz (veya c.user_id varsa onu)
            userName: c.username, // Backend: username -> Frontend: userName
            userAvatar: c.avatar_url || 'https://i.pravatar.cc/150?img=default', // Backend: avatar_url -> Frontend: userAvatar
            text: c.text,
            date: c.created_at,
            likes: c.like_count,
            isLiked: c.is_liked_by_me > 0
        }));
        
        setPanelComments(formattedComments);

        const newLikedSet = new Set();
        formattedComments.forEach(c => {
            if (c.isLiked) {
                newLikedSet.add(c.id);
            }
        });
        setLikedComments(newLikedSet);

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


      if (response.ok) {
        const data = await response.json(); 
        const realCommentId = data.new_comment_id; // <-- Backend'den gelen ID
        // --- BAŞARILI ---
        // 1. Yorumu yerel state'e (panelComments) ekle (Anında görünmesi için)
        const newComment = {
          id: realCommentId, // Geçici ID
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

  // --- AKTİVİTE BEĞENME FONKSİYONU ---
  const handleActivityLike = async (activityId) => {
    try {
      const userEmail = localStorage.getItem("email");
      // Eğer user_id'yi localStorage'da tutuyorsanız onu kullanın,
      // tutmuyorsanız email'den bulmanız gerekebilir veya backend'iniz email kabul etmeli.
      // Sizin API'niz şu an 'user_id: int' bekliyor.
      // Bu yüzden localStorage'dan user_id'yi almalısınız.
      const username = localStorage.getItem("profileusername"); 

      console.log('activity',activityId)

      if (!username) {
        console.error("Kullanıcı adı bulunamadı.");
        return;
      }

      const response = await fetch("http://localhost:8000/feed/like_review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activity_id: activityId,
          username: username // Backend int bekliyor
        }),
      });

      if (response.ok) {
        setActivities(prevActivities => 
          prevActivities.map(activity => {
            if (activity.id === activityId) {
              // Mevcut durumu tersine çevir
              const isLikedNow = !activity.isLiked; 
              
              return {
                ...activity,
                // Beğendiyse (+1), Vazgeçtiyse (-1)
                likes: activity.likes + (isLikedNow ? 1 : -1),
                // Durumu güncelle (Mavi/Gri olması için)
                isLiked: isLikedNow 
              };
            }
            return activity;
          })
        );
      } else {
        console.error("Beğeni işlemi başarısız");
      }
    } catch (error) {
      console.error("Beğeni API hatası:", error);
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      const username = localStorage.getItem("profileusername");
      if (!username) return;

      // 1. Tıklama anındaki durumu al (State'den değil, o anki Set'ten)
      // React Strict Mode'da bile bu değer o an için sabittir.
      const isCurrentlyLiked = likedComments.has(commentId);
      const willLike = !isCurrentlyLiked;
      const changeAmount = willLike ? 1 : -1;

      // 2. Önce UI'ı güncelle (Optimistic Update)
      // Bu sayede kullanıcı anında tepki görür
      setLikedComments(prev => {
          const newSet = new Set(prev);
          if (willLike) newSet.add(commentId);
          else newSet.delete(commentId);
          return newSet;
      });

      setPanelComments(prevComments =>
        prevComments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes: Math.max(0, (comment.likes || 0) + changeAmount)
            };
          }
          return comment;
        })
      );

      // 3. Sonra API isteğini gönder (Arka planda)
      const response = await fetch("http://localhost:8000/interactions/like_comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment_id: commentId,
          username: username
        }),
      });

      if (!response.ok) {
        // HATA OLURSA: Değişiklikleri geri al (Rollback)
        console.error("Beğeni API hatası, geri alınıyor...");
        
        setLikedComments(prev => {
            const newSet = new Set(prev);
            if (willLike) newSet.delete(commentId); // Eklendiyse sil
            else newSet.add(commentId); // Silindiyse ekle
            return newSet;
        });

        setPanelComments(prevComments =>
          prevComments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                likes: Math.max(0, (comment.likes || 0) - changeAmount) // Tersi işlem
              };
            }
            return comment;
          })
        );
      }

    } catch (error) {
      console.error("Yorum beğeni hatası:", error);
      // Hata durumunda rollback (yukarıdaki ile aynı mantık) yapılabilir
    }
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
        return;
      }

      const url = `http://localhost:8000/feed/search?email=${userEmail}`;

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
          likes: item.like_count,
          comments: item.comment_count,
          isLiked: item.is_liked_by_me > 0
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
        onLike={handleActivityLike}
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