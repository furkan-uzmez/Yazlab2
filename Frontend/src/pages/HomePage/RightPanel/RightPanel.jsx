import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaUserFriends, FaStar } from 'react-icons/fa';
import './RightPanel.css';

function RightPanel({ followedUsers, onFollowUser }) {
  const navigate = useNavigate();
  const [following, setFollowing] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [limit, setLimit] = useState(5);
  const [showAll, setShowAll] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = localStorage.getItem("email");
        if (!email) return;

        // 1. Get Current User ID
        const userRes = await fetch(`http://localhost:8000/user/search_by_email?query=${email}`);
        if (userRes.ok) {
          const userData = await userRes.json();
          // The API returns { message: "...", results: { user_id: ..., ... } }
          const userId = userData.results.user_id;
          setCurrentUserId(userId);

          // 2. Get Recommendations
          if (userId) {
            const recRes = await fetch(`http://localhost:8000/user/recommendations?user_id=${userId}`);
            if (recRes.ok) {
              const recData = await recRes.json();
              setRecommendations(recData);
            }
          }
        }

        // 3. Get Following (Existing logic)
        const url = `http://localhost:8000/user/${email}/followers`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setFollowing(data.followers);
        }
      } catch (err) {
        console.error("API hatası:", err);
      }
    };

    fetchData();
  }, []);

  const handleFollowClick = async (targetUserId, isCurrentlyFollowed) => {
    if (!currentUserId) return;

    try {
      const endpoint = isCurrentlyFollowed ? "/user/unfollow" : "/user/follow";
      const method = isCurrentlyFollowed ? "DELETE" : "POST";

      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          follower_id: currentUserId,
          followed_id: targetUserId
        }),
      });

      if (response.ok) {
        // Update parent state (UI)
        onFollowUser(targetUserId);
      } else {
        console.error("Takip işlemi başarısız");
      }
    } catch (error) {
      console.error("Takip API hatası:", error);
    }
  };

  const handleShowMoreFollowing = () => {
    if (showAll) {
      // Daha az göster - animasyonlu kapanış
      setIsClosing(true);
      setTimeout(() => {
        setLimit(5);
        setShowAll(false);
        setIsClosing(false);
      }, 300); // Animasyon süresi kadar bekle
    } else {
      // Daha fazla göster - tüm listeyi göster
      setLimit(following.length);
      setShowAll(true);
    }
  };

  return (
    <aside className="right-panel">
      <div className="right-panel-content">

        <div className="right-panel-section">
          <h3 className="right-panel-title">
            <FaUserFriends className="right-panel-title-icon" />
            {/* API'den takipçi listesini çekiyoruz, "Takip Ettiklerin" değil */}
            Takipçilerin
          </h3>
          <div className="right-panel-list">

            {/* --- 2. DÜZELTME: Doğru veri anahtarlarını (keys) kullan --- */}
            {following.slice(0, limit).map((user, index) => {
              // Kapanış animasyonu için: 5'ten fazla olan öğeler kapanırken animasyonlu
              const shouldAnimateClose = isClosing && index >= 5;
              return (
                <div
                  key={user.username}
                  className={`right-panel-item ${shouldAnimateClose ? 'closing' : ''}`}
                  style={{
                    animationDelay: shouldAnimateClose
                      ? `${(index - 5) * 0.03}s`
                      : `${index * 0.05}s`
                  }}
                > {/* key='id' -> 'username' */}
                  <img
                    src={user.avatar_url || '/default-avatar.png'} // src='avatar' -> 'avatar_url'
                    alt={user.username}   // alt='name' -> 'username'
                    className="right-panel-avatar"
                  />
                  <div className="right-panel-item-info">
                    <span className="right-panel-item-name">{user.username}</span> {/* 'name' -> 'username' */}
                  </div>
                </div>
              );
            })}
            {/* --- DÜZELTME SONU --- */}

            {following.length > 5 && (
              <button
                className="right-panel-show-more-btn"
                onClick={handleShowMoreFollowing}
              >
                {showAll ? '− Daha az göster' : '+ Daha fazla göster'}
              </button>
            )}
          </div>
        </div>
        {/* --- DİNAMİK BÖLÜM SONU --- */}


        {/* "Senin İçin Önerilenler" */}
        <div className="right-panel-section">
          <h3 className="right-panel-title">
            <FaStar className="right-panel-title-icon" />
            Senin İçin Önerilenler
          </h3>
          <div className="right-panel-list">
            {recommendations.map((user) => {
              const isFollowed = followedUsers.has(user.id);
              return (
                <div key={user.id} className="right-panel-item">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="right-panel-avatar"
                    onClick={() => navigate(`/profile/${user.name}`)}
                    style={{ cursor: 'pointer' }}
                  />
                  <div className="right-panel-item-info">
                    <span
                      className="right-panel-item-name"
                      onClick={() => navigate(`/profile/${user.name}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      {user.name}
                    </span>
                    <span className="right-panel-item-details">{user.followers}</span>
                    <span className="right-panel-item-mutual">{user.mutual}</span>
                  </div>
                  <button
                    className={`right-panel-follow-text-btn ${isFollowed ? 'followed' : ''}`}
                    onClick={() => handleFollowClick(user.id, isFollowed)}
                  >
                    {isFollowed ? 'Takip Ediliyor' : 'Takip Et'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default RightPanel;