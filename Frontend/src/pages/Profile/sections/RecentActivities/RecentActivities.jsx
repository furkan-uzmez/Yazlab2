import { FaStar, FaEdit } from 'react-icons/fa';
import './RecentActivities.css';

function RecentActivities({ recentActivities }) {
  return (
    <div className="profile-activities-section">
      <h2 className="section-title">
        <FaStar />
        <span>Son Aktiviteler</span>
      </h2>
      <div className="activities-list">
        {recentActivities.length > 0 ? (
          recentActivities.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className={`activity-icon ${activity.type === 'rating' ? 'rating-icon' : 'review-icon'}`}>
                {activity.type === 'rating' ? <FaStar /> : <FaEdit />}
              </div>
              <div className="activity-content">
                <p className="activity-text">
                  {activity.type === 'rating' 
                    ? `${activity.content_title} için ${activity.rating_score} puan verdi`
                    : `${activity.content_title} hakkında yorum yaptı`}
                </p>
                <span className="activity-date">
                  {new Date(activity.created_at).toLocaleDateString('tr-TR')}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-state">Henüz aktivite yok</p>
        )}
      </div>
    </div>
  );
}

export default RecentActivities;

