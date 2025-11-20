import { FaList } from 'react-icons/fa';
import './CustomLists.css';

function CustomLists({ customLists, onEditList }) {
  return (
    <div className="profile-custom-lists-section">
      <h2 className="section-title">
        <FaList />
        <span>Özel Listelerim</span>
      </h2>
      <div className="custom-lists">
        {customLists.length > 0 ? (
          customLists.map((list) => (
            <div 
              key={list.id} 
              className="custom-list-card"
              onClick={() => onEditList(list)}
            >
              <div className="custom-list-card-header">
                <h3>{list.name}</h3>
              </div>
              <p>{list.description || 'Açıklama yok'}</p>
              <div className="custom-list-card-footer">
                <span className="list-count">{list.items?.length || 0} içerik</span>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-state">Henüz özel liste oluşturulmamış</p>
        )}
      </div>
    </div>
  );
}

export default CustomLists;

