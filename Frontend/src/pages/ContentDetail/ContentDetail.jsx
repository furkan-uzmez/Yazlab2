import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaCalendarAlt, FaClock, FaBookOpen, FaUser, FaFilm, FaBook, FaCheck, FaPlus, FaTimes, FaList, FaEdit, FaTrash, FaPaperPlane } from 'react-icons/fa';
import BottomNav from '../../components/BottomNav';
import Sidebar from '../HomePage/Sidebar/Sidebar';
import LogoutModal from '../HomePage/LogoutModal/LogoutModal';
import ContentDetailSkeleton from '../../components/ContentDetailSkeleton';
import { formatTimeAgo } from '../HomePage/utils/utils';
import './ContentDetail.css';

function ContentDetail() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isInWatched, setIsInWatched] = useState(false);
  const [isInToWatch, setIsInToWatch] = useState(false);
  const [isInRead, setIsInRead] = useState(false);
  const [isInToRead, setIsInToRead] = useState(false);
  const [platformRating, setPlatformRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [customLists, setCustomLists] = useState([]);
  const [isListDropdownOpen, setIsListDropdownOpen] = useState(false);
  const [isLoadingLists, setIsLoadingLists] = useState(false);
  const [addingToListId, setAddingToListId] = useState(null);
  const dropdownRef = useRef(null);

  // Comments state
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showAllComments, setShowAllComments] = useState(false);

  // Get current user email and user_id
  useEffect(() => {
    const email = localStorage.getItem('email');
    setCurrentUserEmail(email);

    // Fetch current user's user_id
    if (email) {
      const fetchCurrentUser = async () => {
        try {
          const response = await fetch(
            `http://localhost:8000/user/search_by_email?query=${encodeURIComponent(email)}`
          );
          if (response.ok) {
            const data = await response.json();
            const userData = data.user || (Array.isArray(data.results) ? data.results[0] : data.results);
            if (userData && userData.user_id) {
              setCurrentUserId(userData.user_id);
            }
          }
        } catch (error) {
          console.error("Kullanıcı bilgisi alınamadı:", error);
        }
      };
      fetchCurrentUser();
    }
  }, []);

  // Fetch comments for this content
  useEffect(() => {
    if (!id || !currentUserEmail) return;

    const fetchComments = async () => {
      setIsLoadingComments(true);
      try {
        const contentId = typeof id === 'string' ? (isNaN(parseInt(id)) ? id : parseInt(id)) : id;
        const response = await fetch(
          `http://localhost:8000/interactions/get_comments_by_content?content_id=${contentId}&email=${currentUserEmail}`
        );

        if (response.ok) {
          const data = await response.json();
          const commentsData = data.comments || [];

          // Format comments
          const formattedComments = commentsData.map(c => ({
            id: c.comment_id,
            userId: c.user_id,
            userName: c.username,
            userAvatar: c.avatar_url || 'https://i.pravatar.cc/150?img=default',
            text: c.text,
            date: c.created_at,
            likes: c.like_count || 0,
            isLiked: c.is_liked_by_me > 0
          }));

          setComments(formattedComments);
        } else {
          console.error("Yorumlar yüklenemedi:", response.status);
        }
      } catch (error) {
        console.error("Yorum API hatası:", error);
      } finally {
        setIsLoadingComments(false);
      }
    };

    fetchComments();
  }, [id, currentUserEmail]);

  // Fetch content details from API
  useEffect(() => {
    const fetchContentDetails = async () => {
      if (!id || !type) return;

      setLoading(true);
      try {
        const username = localStorage.getItem("profileusername");
        let url = `http://localhost:8000/content/details?content_id=${encodeURIComponent(id)}&content_type=${type}`;
        if (username) {
          url += `&username=${encodeURIComponent(username)}`;
        }

        const response = await fetch(url);

        if (response.ok) {
          const data = await response.json();
          const contentData = data.content;
          const userStatus = data.user_status;

          if (userStatus) {
            if (type === 'movie') {
              setIsInWatched(userStatus.is_watched);
              setIsInToWatch(userStatus.is_to_watch);
            } else {
              setIsInRead(userStatus.is_watched); // Reusing is_watched for read
              setIsInToRead(userStatus.is_to_watch); // Reusing is_to_watch for to_read
            }
          }

          if (type === 'movie') {
            // Format movie data
            const formattedContent = {
              id: contentData.id,
              title: contentData.title,
              poster_path: contentData.poster_path ? `https://image.tmdb.org/t/p/w500${contentData.poster_path}` : null,
              release_date: contentData.release_date,
              vote_average: contentData.vote_average,
              overview: contentData.overview,
              runtime: contentData.runtime,
              genres: contentData.genres || [],
              tagline: contentData.tagline,
              budget: contentData.budget,
              revenue: contentData.revenue,
              status: contentData.status
            };

            setContent(formattedContent);
            setPlatformRating(contentData.vote_average || 0);
            setTotalRatings(0); // TMDB'den rating sayısı gelmiyorsa 0
          } else if (type === 'book') {
            // Format book data
            const imageLinks = contentData.imageLinks || {};
            const thumbnail = imageLinks.thumbnail || imageLinks.smallThumbnail || imageLinks.medium || null;

            const formattedContent = {
              id: contentData.id,
              title: contentData.title,
              subtitle: contentData.subtitle || '',
              poster_path: thumbnail ? thumbnail.replace('http:', 'https:') : null,
              release_date: contentData.publishedDate,
              vote_average: contentData.averageRating || 0,
              overview: contentData.description || '',
              pageCount: contentData.pageCount || 0,
              genres: contentData.categories || [],
              authors: contentData.authors || [],
              language: contentData.language || '',
              publisher: contentData.publisher || '',
              previewLink: contentData.previewLink || '',
              infoLink: contentData.infoLink || ''
            };

            setContent(formattedContent);
            setPlatformRating(contentData.averageRating || 0);
            setTotalRatings(contentData.ratingsCount || 0);
          }
        } else {
          console.error("İçerik detayları yüklenemedi:", response.status);
        }
      } catch (error) {
        console.error("İçerik detayları API hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContentDetails();
  }, [type, id]);


  // Mock custom lists - In real app, fetch from API
  useEffect(() => {
    setIsLoadingLists(true);
    // Simulate API call
    setTimeout(() => {
      const mockLists = [
        {
          list_id: 1,
          list_name: 'En İyi Bilimkurgu Filmlerim',
          name: 'En İyi Bilimkurgu Filmlerim',
          items: [
            { id: 1, title: 'Inception', type: 'Film' },
            { id: 2, title: 'The Matrix', type: 'Film' }
          ]
        },
        {
          list_id: 2,
          list_name: 'Okunacak Klasikler',
          name: 'Okunacak Klasikler',
          items: [
            { id: 3, title: '1984', type: 'Kitap' }
          ]
        },
        {
          list_id: 3,
          list_name: 'Favori Aksiyon Filmleri',
          name: 'Favori Aksiyon Filmleri',
          items: []
        }
      ];
      setCustomLists(mockLists);
      setIsLoadingLists(false);
    }, 300);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsListDropdownOpen(false);
      }
    };

    if (isListDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isListDropdownOpen]);

  const handleAddToList = (listId) => {
    if (!content) return;

    setAddingToListId(listId);

    // Simulate API call
    setTimeout(() => {
      const contentId = content.id || parseInt(id);
      const contentTitle = content.title;
      const contentType = type === 'movie' ? 'Film' : 'Kitap';

      // Check if content already exists in the list
      const list = customLists.find(l => l.list_id === listId);
      if (list && list.items) {
        const exists = list.items.some(item => item.id === contentId);
        if (exists) {
          alert('Bu içerik zaten listede!');
          setAddingToListId(null);
          return;
        }
      }

      // Add content to the list
      const updatedLists = customLists.map(list => {
        if (list.list_id === listId) {
          return {
            ...list,
            items: [...(list.items || []), {
              id: contentId,
              title: contentTitle,
              type: contentType
            }]
          };
        }
        return list;
      });

      setCustomLists(updatedLists);
      alert('İçerik listeye eklendi!');
      setIsListDropdownOpen(false);
      setAddingToListId(null);
    }, 500);
  };

  const handleLogout = () => setLogoutModalOpen(true);

  const handleConfirmLogout = () => {
    setLogoutLoading(true);
    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }, 1300);
  };

  const handleCancelLogout = () => {
    setLogoutModalOpen(false);
  };

  const handleRatingClick = (rating) => {
    setUserRating(rating);
    // In real app, save to API
  };

  const handleWatchedToggle = async () => {
    const listKey = type === 'movie' ? 'watched' : 'read';
    const isCurrentlyInList = type === 'movie' ? isInWatched : isInRead;

    // Optimistic update
    if (type === 'movie') {
      setIsInWatched(!isInWatched);
      if (!isCurrentlyInList && isInToWatch) setIsInToWatch(false);
    } else {
      setIsInRead(!isInRead);
      if (!isCurrentlyInList && isInToRead) setIsInToRead(false);
    }

    const username = localStorage.getItem("profileusername");
    if (!username) return;

    try {
      if (isCurrentlyInList) {
        // Remove from list
        // Note: We need content_id for removal, which we might not have if it's not in DB yet.
        // But if it's in the list, it MUST be in DB.
        // However, for safety, we should probably fetch the content_id first or handle this better.
        // For now, let's assume content.id is the DB id if it's numeric, or we need to rely on backend handling.
        // Actually, the backend remove expects 'content_id' (int). 
        // If we only have TMDB ID, we can't remove easily without searching first.
        // Let's skip removal implementation for now or try to send what we have.
        // Wait, if we just added it, we might not know the content_id.
        // Let's focus on ADDING first as per user request.
        console.warn("Removal not fully implemented yet");
      } else {
        // Add to list
        const response = await fetch("http://localhost:8000/list/add_item", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username,
            list_key: listKey,
            external_id: String(id), // TMDB/Google ID
            title: content.title,
            poster_url: content.poster_path,
            content_type: type,
            description: type === 'movie' ? content.overview : content.overview,
            release_year: type === 'movie' ? (content.release_date ? new Date(content.release_date).getFullYear() : null) : (content.release_date ? parseInt(content.release_date.substring(0, 4)) : null),
            duration_or_pages: type === 'movie' ? content.runtime : content.pageCount,
            api_source: type === 'movie' ? 'tmdb' : 'google_books'
          })
        });

        if (!response.ok) {
          // Revert optimistic update on error
          if (type === 'movie') setIsInWatched(isCurrentlyInList);
          else setIsInRead(isCurrentlyInList);
          console.error("Failed to add to list");
        }
      }
    } catch (error) {
      console.error("API Error:", error);
      // Revert
      if (type === 'movie') setIsInWatched(isCurrentlyInList);
      else setIsInRead(isCurrentlyInList);
    }
  };

  const handleToWatchToggle = async () => {
    const listKey = type === 'movie' ? 'toWatch' : 'toRead';
    const isCurrentlyInList = type === 'movie' ? isInToWatch : isInToRead;

    // Optimistic update
    if (type === 'movie') {
      setIsInToWatch(!isInToWatch);
      if (!isCurrentlyInList && isInWatched) setIsInWatched(false);
    } else {
      setIsInToRead(!isInToRead);
      if (!isCurrentlyInList && isInRead) setIsInRead(false);
    }

    const username = localStorage.getItem("profileusername");
    if (!username) return;

    try {
      if (isCurrentlyInList) {
        // Remove logic (skipped for now as per above)
        console.warn("Removal not fully implemented yet");
      } else {
        // Add to list
        const response = await fetch("http://localhost:8000/list/add_item", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username,
            list_key: listKey,
            external_id: String(id),
            title: content.title,
            poster_url: content.poster_path,
            content_type: type,
            description: type === 'movie' ? content.overview : content.overview,
            release_year: type === 'movie' ? (content.release_date ? new Date(content.release_date).getFullYear() : null) : (content.release_date ? parseInt(content.release_date.substring(0, 4)) : null),
            duration_or_pages: type === 'movie' ? content.runtime : content.pageCount,
            api_source: type === 'movie' ? 'tmdb' : 'google_books'
          })
        });

        if (!response.ok) {
          // Revert
          if (type === 'movie') setIsInToWatch(isCurrentlyInList);
          else setIsInToRead(isCurrentlyInList);
          console.error("Failed to add to list");
        }
      }
    } catch (error) {
      console.error("API Error:", error);
      // Revert
      if (type === 'movie') setIsInToWatch(isCurrentlyInList);
      else setIsInToRead(isCurrentlyInList);
    }
  };

  // Comments handlers
  const handleAddComment = async () => {
    if (!commentText.trim() || !currentUserEmail || !id) return;

    try {
      const contentId = typeof id === 'string' ? (isNaN(parseInt(id)) ? id : parseInt(id)) : id;
      const response = await fetch('http://localhost:8000/interactions/add_comment_by_content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email: currentUserEmail,
          content_id: String(contentId), // Ensure string for backend
          comment_text: commentText.trim(),
          title: content.title,
          poster_url: content.poster_path,
          content_type: type === 'movie' ? 'movie' : 'book'
        })
      });

      if (response.ok) {
        setCommentText('');
        setShowAllComments(false); // Reset to show first 5 comments
        // Refresh comments
        const commentsResponse = await fetch(
          `http://localhost:8000/interactions/get_comments_by_content?content_id=${contentId}&email=${currentUserEmail}`
        );
        if (commentsResponse.ok) {
          const data = await commentsResponse.json();
          const commentsData = data.comments || [];
          const formattedComments = commentsData.map(c => ({
            id: c.comment_id,
            userId: c.user_id,
            userName: c.username,
            userAvatar: c.avatar_url || 'https://i.pravatar.cc/150?img=default',
            text: c.text,
            date: c.created_at,
            likes: c.like_count || 0,
            isLiked: c.is_liked_by_me > 0
          }));
          setComments(formattedComments);
        }
      } else {
        console.error("Yorum eklenemedi:", response.status);
        alert("Yorum eklenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Yorum ekleme hatası:", error);
      alert("Yorum eklenirken bir hata oluştu.");
    }
  };

  const handleStartEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.text);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingText('');
  };

  const handleSaveEdit = async (commentId) => {
    if (!editingText.trim()) return;

    const username = localStorage.getItem("profileusername");
    if (!username) {
      alert("Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/interactions/update_comment', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment_id: commentId,
          username: username,
          new_text: editingText.trim()
        })
      });

      if (response.ok) {
        setEditingCommentId(null);
        setEditingText('');
        // Refresh comments
        const contentId = typeof id === 'string' ? (isNaN(parseInt(id)) ? id : parseInt(id)) : id;
        const commentsResponse = await fetch(
          `http://localhost:8000/interactions/get_comments_by_content?content_id=${contentId}&email=${currentUserEmail}`
        );
        if (commentsResponse.ok) {
          const data = await commentsResponse.json();
          const commentsData = data.comments || [];
          const formattedComments = commentsData.map(c => ({
            id: c.comment_id,
            userId: c.user_id,
            userName: c.username,
            userAvatar: c.avatar_url || 'https://i.pravatar.cc/150?img=default',
            text: c.text,
            date: c.created_at,
            likes: c.like_count || 0,
            isLiked: c.is_liked_by_me > 0
          }));
          setComments(formattedComments);
        }
      } else {
        const errorData = await response.json().catch(() => ({ detail: "Bilinmeyen hata" }));
        console.error("API Hatası:", errorData);
        alert(`Yorum güncellenemedi: ${errorData.detail || "Bilinmeyen hata"}`);
      }
    } catch (error) {
      console.error("Yorum güncelleme hatası:", error);
      alert("Yorum güncellenirken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) return;

    if (!currentUserEmail) {
      alert("Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/interactions/delete_comment', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment_id: commentId,
          user_email: currentUserEmail
        })
      });

      if (response.ok) {
        // Refresh comments
        const contentId = typeof id === 'string' ? (isNaN(parseInt(id)) ? id : parseInt(id)) : id;
        const commentsResponse = await fetch(
          `http://localhost:8000/interactions/get_comments_by_content?content_id=${contentId}&email=${currentUserEmail}`
        );
        if (commentsResponse.ok) {
          const data = await commentsResponse.json();
          const commentsData = data.comments || [];
          const formattedComments = commentsData.map(c => ({
            id: c.comment_id,
            userId: c.user_id,
            userName: c.username,
            userAvatar: c.avatar_url || 'https://i.pravatar.cc/150?img=default',
            text: c.text,
            date: c.created_at,
            likes: c.like_count || 0,
            isLiked: c.is_liked_by_me > 0
          }));
          setComments(formattedComments);
        }
      } else {
        const errorData = await response.json().catch(() => ({ detail: "Bilinmeyen hata" }));
        console.error("API Hatası:", errorData);
        alert(`Yorum silinemedi: ${errorData.detail || "Bilinmeyen hata"}`);
      }
    } catch (error) {
      console.error("Yorum silme hatası:", error);
      alert("Yorum silinirken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };




  if (loading) {
    return (
      <div className="content-detail-container">
        <Sidebar
          onLogout={handleLogout}
          isSearchMode={isSearchMode}
          onSearchModeChange={setIsSearchMode}
        />
        <div className="content-detail-content">
          <ContentDetailSkeleton />
        </div>
        <BottomNav
          onSearchClick={() => setIsSearchMode(true)}
          isSearchMode={isSearchMode}
        />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="content-detail-container">
        <Sidebar
          onLogout={handleLogout}
          isSearchMode={isSearchMode}
          onSearchModeChange={setIsSearchMode}
        />
        <div className="content-detail-empty">
          <p>İçerik bulunamadı</p>
        </div>
        <BottomNav
          onSearchClick={() => setIsSearchMode(true)}
          isSearchMode={isSearchMode}
        />
      </div>
    );
  }

  return (
    <div className="content-detail-container">
      <Sidebar
        onLogout={handleLogout}
        isSearchMode={isSearchMode}
        onSearchModeChange={setIsSearchMode}
      />
      <div className="content-detail-content">
        {/* Hero Section */}
        <div className="content-detail-hero">
          <div className="content-poster-wrapper">
            <img
              src={content.poster_path || '/placeholder.jpg'}
              alt={content.title}
              className="content-poster"
            />
          </div>
          <div className="content-info">
            <div className="content-header">
              <h1 className="content-title">{content.title}</h1>
              <div className="content-meta-row">
                <span className="content-year">
                  <FaCalendarAlt className="meta-icon" />
                  {new Date(content.release_date).getFullYear()}
                </span>
                {type === 'movie' && content.runtime && (
                  <span className="content-runtime">
                    <FaClock className="meta-icon" />
                    {content.runtime} dk
                  </span>
                )}
                {type === 'book' && content.pageCount && (
                  <span className="content-pages">
                    <FaBookOpen className="meta-icon" />
                    {content.pageCount} sayfa
                  </span>
                )}
              </div>
            </div>

            {/* Platform Rating */}
            <div className="platform-rating-section">
              <div className="platform-rating">
                <div className="platform-rating-value">
                  <FaStar className="star-icon" />
                  <span className="rating-number">{platformRating.toFixed(1)}</span>
                  <span className="rating-max">/10</span>
                </div>
                <div className="platform-rating-count">
                  {totalRatings.toLocaleString()} oy
                </div>
              </div>
            </div>

            {/* Genres */}
            <div className="content-genres">
              {content.genres && content.genres.map((genre, index) => (
                <span key={index} className="genre-badge">
                  {genre}
                </span>
              ))}
            </div>

            {/* Directors/Authors */}
            <div className="content-creators">
              {type === 'movie' && content.directors && (
                <div className="creator-item">
                  <FaFilm className="creator-icon" />
                  <span className="creator-label">Yönetmen:</span>
                  <span className="creator-names">{content.directors.join(', ')}</span>
                </div>
              )}
              {type === 'book' && content.authors && (
                <div className="creator-item">
                  <FaBook className="creator-icon" />
                  <span className="creator-label">Yazar:</span>
                  <span className="creator-names">{content.authors.join(', ')}</span>
                </div>
              )}
            </div>

            {/* User Actions */}
            <div className="content-actions">
              {/* Rating Component */}
              <div className="rating-section">
                <label className="rating-label">Puanınız:</label>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`rating-star ${userRating >= star ? 'active' : ''} ${hoveredRating >= star ? 'hovered' : ''}`}
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                    >
                      <FaStar />
                    </button>
                  ))}
                  {userRating > 0 && (
                    <span className="user-rating-value">{userRating}/10</span>
                  )}
                </div>
              </div>

              {/* Library Buttons and Custom List */}
              <div className="library-actions-row">
                {type === 'movie' ? (
                  <>
                    <button
                      type="button"
                      className={`library-btn ${isInWatched ? 'active' : ''}`}
                      onClick={handleWatchedToggle}
                    >
                      {isInWatched ? <FaCheck /> : <FaPlus />}
                      <span>{isInWatched ? 'İzledin' : 'İzledim'}</span>
                    </button>
                    <button
                      type="button"
                      className={`library-btn ${isInToWatch ? 'active' : ''}`}
                      onClick={handleToWatchToggle}
                    >
                      {isInToWatch ? <FaCheck /> : <FaPlus />}
                      <span>{isInToWatch ? 'Listemde' : 'İzlenecek'}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className={`library-btn ${isInRead ? 'active' : ''}`}
                      onClick={handleWatchedToggle}
                    >
                      {isInRead ? <FaCheck /> : <FaPlus />}
                      <span>{isInRead ? 'Okudun' : 'Okudum'}</span>
                    </button>
                    <button
                      type="button"
                      className={`library-btn ${isInToRead ? 'active' : ''}`}
                      onClick={handleToWatchToggle}
                    >
                      {isInToRead ? <FaCheck /> : <FaPlus />}
                      <span>{isInToRead ? 'Listemde' : 'Okunacak'}</span>
                    </button>
                  </>
                )}

                {/* Add to Custom List */}
                <div className="custom-list-dropdown-wrapper" ref={dropdownRef}>
                  <button
                    type="button"
                    className="custom-list-btn"
                    onClick={() => setIsListDropdownOpen(!isListDropdownOpen)}
                  >
                    <FaPlus />
                    <span>Özel Listeye Ekle</span>
                  </button>

                  {isListDropdownOpen && (
                    <div className="custom-list-dropdown">
                      {isLoadingLists ? (
                        <div className="dropdown-loading">
                          <div className="spinner-small"></div>
                          <span>Yükleniyor...</span>
                        </div>
                      ) : customLists.length === 0 ? (
                        <div className="dropdown-empty">
                          <FaList />
                          <span>Henüz özel listeniz yok</span>
                        </div>
                      ) : (
                        <div className="dropdown-list">
                          {customLists.map((list) => (
                            <button
                              key={list.list_id}
                              type="button"
                              className="dropdown-item"
                              onClick={() => handleAddToList(list.list_id)}
                              disabled={addingToListId === list.list_id}
                            >
                              {addingToListId === list.list_id ? (
                                <>
                                  <div className="spinner-small"></div>
                                  <span>Ekleniyor...</span>
                                </>
                              ) : (
                                <>
                                  <FaList />
                                  <span>{list.list_name || list.name}</span>
                                  {list.items && (
                                    <span className="item-count">({list.items.length})</span>
                                  )}
                                </>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cast Section */}
        {type === 'movie' && content.cast && content.cast.length > 0 && (
          <div className="content-cast">
            <h2 className="cast-title">Oyuncu Kadrosu</h2>
            <div className="cast-list">
              {content.cast.map((actor, index) => (
                <span key={index} className="cast-item">
                  {actor}
                  {index < content.cast.length - 1 && ', '}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Overview Section */}
        {content.overview && (
          <div className="content-overview">
            <h2 className="overview-title">Özet</h2>
            <p className="overview-text">{content.overview}</p>
          </div>
        )}

        {/* Comments Section */}
        <div className="content-comments-section">
          <div className="comments-section-header">
            <h2 className="comments-section-title">Yorumlar</h2>
            {comments.length > 0 && (
              <span className="comments-count">({comments.length})</span>
            )}
          </div>

          {/* Add Comment Form */}
          {currentUserEmail && (
            <div className="add-comment-form">
              <div className="comment-input-wrapper">
                <textarea
                  className="comment-input"
                  placeholder="Yorumunuzu yazın..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows="3"
                />
                <button
                  className="comment-submit-btn"
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                >
                  <FaPaperPlane />
                  <span>Gönder</span>
                </button>
              </div>
            </div>
          )}

          {/* Comments List */}
          <div className="comments-list">
            {isLoadingComments ? (
              <div className="comments-loading">
                <div className="spinner-small"></div>
                <span>Yorumlar yükleniyor...</span>
              </div>
            ) : comments.length === 0 ? (
              <div className="comments-empty">
                <p>Henüz yorum yok. İlk yorumu siz yapın!</p>
              </div>
            ) : (
              <>
                {(showAllComments ? comments : comments.slice(0, 5)).map((comment) => {
                  const isOwnComment = currentUserId && comment.userId === currentUserId;
                  const isEditing = editingCommentId === comment.id;

                  return (
                    <div key={comment.id} className="comment-item">
                      <img
                        src={comment.userAvatar || '/api/placeholder/40/40'}
                        alt={comment.userName}
                        className="comment-avatar"
                      />
                      <div className="comment-content">
                        <div className="comment-header">
                          <span className="comment-author">{comment.userName}</span>
                          <span className="comment-date">{formatTimeAgo(comment.date)}</span>
                          {isOwnComment && !isEditing && (
                            <div className="comment-actions">
                              <button
                                className="comment-edit-btn"
                                onClick={() => handleStartEdit(comment)}
                                title="Düzenle"
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="comment-delete-btn"
                                onClick={() => handleDeleteComment(comment.id)}
                                title="Sil"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="comment-body">
                          {isEditing ? (
                            <div className="comment-edit-wrapper">
                              <textarea
                                className="comment-edit-input"
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                rows="3"
                                autoFocus
                              />
                              <div className="comment-edit-actions">
                                <button
                                  className="comment-save-btn"
                                  onClick={() => handleSaveEdit(comment.id)}
                                  disabled={!editingText.trim()}
                                >
                                  <FaCheck />
                                </button>
                                <button
                                  className="comment-cancel-btn"
                                  onClick={handleCancelEdit}
                                >
                                  <FaTimes />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="comment-text">{comment.text}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {comments.length > 5 && !showAllComments && (
                  <button
                    className="show-more-comments-btn"
                    onClick={() => setShowAllComments(true)}
                  >
                    Daha fazlasını gör ({comments.length - 5} yorum daha)
                  </button>
                )}
                {showAllComments && comments.length > 5 && (
                  <button
                    className="show-less-comments-btn"
                    onClick={() => setShowAllComments(false)}
                  >
                    Daha az göster
                  </button>
                )}
              </>
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

export default ContentDetail;

