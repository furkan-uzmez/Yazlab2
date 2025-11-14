import { useNavigate } from 'react-router-dom';
import { FaUserFriends, FaStar } from 'react-icons/fa';
import './RightPanel.css';

function RightPanel({ followedUsers, onFollowUser }) {
  const navigate = useNavigate();

  const handleShowMoreFollowing = () => {
    navigate('/profile');
  };

  return (
    <aside className="right-panel">
      <div className="right-panel-content">
        {/* Takip Ettiklerin */}
        <div className="right-panel-section">
          <h3 className="right-panel-title">
            <FaUserFriends className="right-panel-title-icon" />
            Takip Ettiklerin
          </h3>
          <div className="right-panel-list">
            {[
              { id: 1, name: 'Mehmet Demir', avatar: 'https://i.pravatar.cc/150?img=12' },
              { id: 2, name: 'Ayşe Kaya', avatar: 'https://i.pravatar.cc/150?img=15' },
              { id: 3, name: 'Can Özkan', avatar: 'https://i.pravatar.cc/150?img=20' },
              { id: 4, name: 'Zeynep Yıldız', avatar: 'https://i.pravatar.cc/150?img=25' },
              { id: 5, name: 'Ali Çelik', avatar: 'https://i.pravatar.cc/150?img=30' },
              { id: 6, name: 'Fatma Yılmaz', avatar: 'https://i.pravatar.cc/150?img=33' },
              { id: 7, name: 'Mustafa Kaya', avatar: 'https://i.pravatar.cc/150?img=36' }
            ].slice(0, 5).map((user) => (
              <div key={user.id} className="right-panel-item">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="right-panel-avatar"
                />
                <div className="right-panel-item-info">
                  <span className="right-panel-item-name">{user.name}</span>
                </div>
              </div>
            ))}
            <button 
              className="right-panel-show-more-btn"
              onClick={handleShowMoreFollowing}
            >
              + Daha fazla göster
            </button>
          </div>
        </div>

        {/* Senin İçin Önerilenler */}
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

