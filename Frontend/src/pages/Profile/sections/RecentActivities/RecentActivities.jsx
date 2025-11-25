import { useState, useMemo } from 'react';
import { FaStar, FaEdit, FaComment } from 'react-icons/fa';
import ActivityCard from '../../../HomePage/ActivityCard/ActivityCard';
import { formatTimeAgo } from '../../../HomePage/utils/utils';
import './RecentActivities.css';

function RecentActivities({ recentActivities = [], libraryData = {}, profileUser = null }) {
  const [activeTab, setActiveTab] = useState('activities');

  // Aktiviteleri kategorilere ayır
  const categorizedActivities = useMemo(() => {
    const categories = {
      posts: [],       // Gönderilerim - Kullanıcının kendi rating ve review aktiviteleri (activity card'lar)
      activities: []   // Son Aktiviteler - Tüm aktiviteler (rating, review, comment)
    };

    if (!recentActivities || !Array.isArray(recentActivities) || recentActivities.length === 0) {
      return categories;
    }

    const profileUserId = profileUser?.user_id;

    recentActivities.forEach(activity => {
      if (!activity || !activity.type) return;
      
      const activityType = activity.type; // 'rating', 'review', 'comment'

      // Tüm aktiviteler "Son Aktiviteler" tab'ına eklenir
      categories.activities.push(activity);

      // "Gönderilerim" tab'ına sadece kullanıcının kendi rating ve review aktiviteleri eklenir
      // (Comment'ler gönderi değil, başkasının gönderisine yapılan yorumlardır)
      if (activityType === 'rating' || activityType === 'review') {
        // Profil sayfasındaki kullanıcının aktivitelerini gösteriyoruz zaten
        // O yüzden tüm rating ve review aktiviteleri o kullanıcıya aittir
        categories.posts.push(activity);
      }
    });

    return categories;
  }, [recentActivities, profileUser]);

  // Backend formatını ActivityCard formatına dönüştür
  const convertToActivityCardFormat = (activity) => {
    const contentType = activity.content_type === 'movie' ? 'Film' : 'Kitap';
    const actionText = activity.type === 'rating' 
      ? 'bir içeriğe puan verdi' 
      : activity.type === 'review' 
        ? 'bir içerik hakkında yorum yaptı'
        : 'bir gönderiye yorum yaptı';

    return {
      id: activity.activity_id,
      type: activity.review_text && activity.rating_score ? 'rating_and_review' : activity.type,
      userName: activity.activity_user_username,
      userAvatar: activity.activity_user_avatar || `https://i.pravatar.cc/150?img=${activity.activity_id}`,
      actionText: actionText,
      date: activity.created_at,
      contentTitle: activity.content_title,
      contentPoster: activity.content_poster || 'https://via.placeholder.com/200x300/1a1a1a/ffffff?text=No+Image',
      contentType: contentType,
      contentId: activity.content_id,
      rating: activity.rating_score,
      reviewText: activity.review_text,
      isLiked: activity.is_liked_by_me > 0,
      likes: activity.like_count || 0,
      comments: activity.comment_count || 0
    };
  };

  const getCurrentActivities = () => {
    return categorizedActivities[activeTab] || [];
  };

  const tabs = [
    { id: 'posts', label: 'Gönderilerim', icon: FaEdit },
    { id: 'activities', label: 'Son Aktiviteler', icon: FaStar }
  ];

  const currentActivities = getCurrentActivities();

  return (
    <div className="profile-activities-section">
      <h2 className="section-title">
        <FaStar />
        <span>Son Aktiviteler</span>
      </h2>
      
      {/* Tab Navigation */}
      <div className="activities-tabs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const count = categorizedActivities[tab.id]?.length || 0;
          return (
            <button
              key={tab.id}
              className={`activity-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon />
              <span>{tab.label}</span>
              {count > 0 && <span className="tab-count">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Activities List */}
      {activeTab === 'posts' ? (
        // Gönderilerim tab'ında ActivityCard kullan
        <div className="activities-posts-list">
          {currentActivities.length > 0 ? (
            currentActivities.map((activity, index) => {
              const cardActivity = convertToActivityCardFormat(activity);
              return (
                <div key={activity.activity_id || index} className="activity-card-wrapper">
                  <ActivityCard 
                    activity={cardActivity}
                    onCommentClick={() => {}}
                    onLike={() => {}}
                    isCommentPanelOpen={false}
                  />
                </div>
              );
            })
          ) : (
            <p className="empty-state">Henüz gönderi yok</p>
          )}
        </div>
      ) : (
        // Son Aktiviteler tab'ında liste formatı
        <div className="activities-list">
          {currentActivities.length > 0 ? (
            currentActivities.map((activity, index) => (
              <div key={activity.activity_id || index} className="activity-item">
                <div className={`activity-icon ${activity.type === 'rating' ? 'rating-icon' : activity.type === 'review' ? 'review-icon' : 'comment-icon'}`}>
                  {activity.type === 'rating' ? <FaStar /> : activity.type === 'review' ? <FaEdit /> : <FaComment />}
                </div>
                <div className="activity-content">
                  <p className="activity-text">
                    {activity.type === 'rating'
                      ? `${activity.content_title} için ${activity.rating_score} puan verdi`
                      : activity.type === 'review'
                        ? `${activity.content_title} hakkında yorum yaptı`
                        : `${activity.original_post_owner_username}'in ${activity.content_title} gönderisine yorum yaptı: "${activity.comment_text}"`}
                  </p>
                  <span className="activity-date">
                    {formatTimeAgo(activity.created_at)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-state">Bu kategoride henüz aktivite yok</p>
          )}
        </div>
      )}
    </div>
  );
}

export default RecentActivities;

