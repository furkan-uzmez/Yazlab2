import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';
import Sidebar from './Sidebar/Sidebar';
import Feed from './Feed/Feed';
import RightPanel from './RightPanel/RightPanel';
import CommentPanel from './CommentPanel/CommentPanel';
import LogoutModal from './LogoutModal/LogoutModal';
import { allMockActivities } from './utils/mockData';
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
  const [commentPanelOpen, setCommentPanelOpen] = useState(false);
  const [commentPanelClosing, setCommentPanelClosing] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [panelComments, setPanelComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [likedComments, setLikedComments] = useState(new Set());
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = () => {
    setLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    setLogoutLoading(true);
    setTimeout(() => {
      // localStorage'dan token ve kullanıcı bilgilerini temizle
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Ana giriş sayfasına yönlendir
      navigate('/');
    }, 1300);
  };

  const handleCancelLogout = () => {
    setLogoutModalOpen(false);
  };

  const handleCommentClick = (activity, comments) => {
    setSelectedActivity(activity);
    setPanelComments(comments);
    setCommentPanelOpen(true);
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

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      const newComment = {
        id: panelComments.length + 1,
        userId: 999,
        userName: 'Sen',
        userAvatar: 'https://i.pravatar.cc/150?img=20',
        text: commentText,
        date: new Date(),
        likes: 0
      };
      setPanelComments([...panelComments, newComment]);
      setCommentText('');
      
      // Gönderinin yorum sayısını artır
      if (selectedActivity) {
        setSelectedActivity({
          ...selectedActivity,
          comments: (selectedActivity.comments || 0) + 1
        });
        
        // Activity card'daki yorum sayısını da güncelle
        setActivities(prevActivities => 
          prevActivities.map(activity => 
            activity.id === selectedActivity.id 
              ? { ...activity, comments: (activity.comments || 0) + 1 }
              : activity
          )
        );
      }
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
      // Simüle edilmiş API çağrısı - minimum süre skeleton loader için
      const minLoadingTime = isInitialLoad ? 1000 : 500;
      await new Promise(resolve => setTimeout(resolve, minLoadingTime));
      
      const itemsPerPage = 10;
      const startIndex = (pageNum - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const newActivities = allMockActivities.slice(startIndex, endIndex);
      
      if (newActivities.length === 0) {
        setHasMore(false);
      } else {
        setActivities(prev => [...prev, ...newActivities]);
        setPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
      loadingRefValue.current = false;
    }
  }, [activities.length]);

  useEffect(() => {
    // İlk yükleme - sadece bir kez
    fetchActivities(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRefValue.current) {
          fetchActivities(page);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadingRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [page, hasMore, loading, fetchActivities]);

  return (
    <div className="home-container">
      <Sidebar onLogout={handleLogout} />
      
      <Feed 
        activities={activities}
        loading={loading}
        initialLoading={initialLoading}
        hasMore={hasMore}
        onCommentClick={handleCommentClick}
        commentPanelOpen={commentPanelOpen}
        selectedActivity={selectedActivity}
        loadingRef={loadingRef}
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
        onClose={handleCloseCommentPanel}
        onCommentLike={handleCommentLike}
        onCommentSubmit={handleCommentSubmit}
        onCommentTextChange={setCommentText}
      />
      
      <LogoutModal
        isOpen={logoutModalOpen}
        isLoading={logoutLoading}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
      
      <BottomNav />
    </div>
  );
}

export default Home;
