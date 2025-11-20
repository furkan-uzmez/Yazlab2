import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaUserFriends, FaStar } from 'react-icons/fa';
import './RightPanel.css';

function RightPanel({ followedUsers, onFollowUser }) {
  const navigate = useNavigate();
  const [following, setFollowing] = useState([]);
  const [limit, setLimit] = useState(5);
  const [showAll, setShowAll] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const email = localStorage.getItem("email"); // Giriş yapmış kullanıcının email'i
        if (!email) {
          console.error("Kullanıcı email'i bulunamadı.");
          return;
        }

        const url = `http://localhost:8000/user/${email}/followers`;

        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            
            // --- 1. DÜZELTME: Verinin tamamını değil, 'followers' dizisini state'e ata
            setFollowing(data.followers); 
            
        } else {
            console.error("Takip edilenler alınamadı:", res.status);
        }
      } catch (err) {
        console.error("Takip API hatası:", err);
      }
    };

    fetchFollowing();
  }, []); // Boş dizi [], bu effect'in sadece bileşen ilk yüklendiğinde çalışmasını sağlar

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
                    src={user.avatar_url} // src='avatar' -> 'avatar_url'
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


        {/* "Senin İçin Önerilenler" (Bu bölüm zaten props ile doğru çalışıyor) */}
        <div className="right-panel-section">
          <h3 className="right-panel-title">
            <FaStar className="right-panel-title-icon" />
            Senin İçin Önerilenler
          </h3>
          <div className="right-panel-list">
            {[
              { id: 101, name: 'Elif Şahin', avatar: 'https://i.pravatar.cc/150?img=35', followers: '1.2K takipçi', mutual: '3 ortak takipçi' },
              { id: 102, name: 'Burak Arslan', avatar: 'https://i.pravatar.cc/150?img=40', followers: '856 takipçi', mutual: '5 ortak takipçi' },
              { id: 103, name: 'Selin Aydın', avatar: 'https://i.pravatar.cc/150?img=45', followers: '2.1K takipçi', mutual: '2 ortak takipçi' },
              { id: 104, name: 'Emre Doğan', avatar: 'https://i.pravatar.cc/150?img=50', followers: '3.5K takipçi', mutual: '7 ortak takipçi' }
            ].map((user) => {
              // 'followedUsers' prop'u "Önerilenler" listesini kontrol etmek için kullanılıyor
              const isFollowed = followedUsers.has(user.id); 
              return (
                <div key={user.id} className="right-panel-item">
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="right-panel-avatar"
                  />
                  <div className="right-panel-item-info">
                    <span className="right-panel-item-name">{user.name}</span>
                    <span className="right-panel-item-details">{user.followers}</span>
                    <span className="right-panel-item-mutual">{user.mutual}</span>
                  </div>
                  <button 
                    className={`right-panel-follow-text-btn ${isFollowed ? 'followed' : ''}`}
                    // 'onFollowUser' prop'u "Önerilenler" listesindeki butonu kontrol ediyor
                    onClick={() => onFollowUser(user.id)} 
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