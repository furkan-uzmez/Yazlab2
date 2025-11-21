import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaCalendarAlt, FaClock, FaBookOpen, FaUser, FaFilm, FaBook, FaCheck, FaPlus, FaTimes, FaList } from 'react-icons/fa';
import BottomNav from '../../components/BottomNav';
import Sidebar from '../HomePage/Sidebar/Sidebar';
import LogoutModal from '../HomePage/LogoutModal/LogoutModal';
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

  // Mock data - In real app, fetch from API
  useEffect(() => {
    setTimeout(() => {
      if (type === 'movie') {
        const mockMovies = [
          {
            id: 1,
            title: 'Inception',
            poster_path: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
            release_date: '2010-07-16',
            vote_average: 8.8,
            overview: 'Dom Cobb, yetenekli bir hırsız ve aynı zamanda zihin hırsızıdır. Rüyaların içine girerek insanların bilinçaltından sırları çalma konusunda uzmanlaşmıştır. Ancak bu yeteneği, onu ailesinden uzaklaştırmış ve kaçak durumuna düşürmüştür. Bir gün, Saito adında güçlü bir işadamından bir teklif alır: İmkansız görünen bir görev - fikir yerleştirme (inception). Eğer bu görevi başarıyla tamamlarsa, suçlu geçmişi silinecek ve çocuklarına kavuşabilecektir. Cobb, ekibini toplar ve hedefin rüyasına girerek, onun zihnine bir fikir yerleştirmeye çalışır. Ancak bu görev, rüya içinde rüya katmanları oluşturmayı gerektirir ve her katman daha tehlikeli hale gelir. Cobb\'un geçmişi ve karısı Mal\'ın hayaleti de bu görevi zorlaştırır. Film, gerçeklik ve rüya arasındaki çizgiyi bulanıklaştırarak, izleyiciyi derin bir psikolojik yolculuğa çıkarır.',
            genre_ids: [28, 878],
            genres: ['Aksiyon', 'Bilimkurgu'],
            directors: ['Christopher Nolan'],
            runtime: 148,
            platformRating: 8.8,
            totalRatings: 12543
          },
          {
            id: 2,
            title: 'The Matrix',
            poster_path: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
            release_date: '1999-03-31',
            vote_average: 8.7,
            overview: 'Thomas Anderson, gündüzleri bir yazılım şirketinde programcı olarak çalışan, geceleri ise "Neo" adıyla bilinen bir bilgisayar korsanıdır. Bir gün, "Matrix" adı verilen gerçekliğin aslında bir simülasyon olduğunu keşfeder. Morpheus adında gizemli bir lider, Neo\'ya iki seçenek sunar: Mavi hapı alıp normal hayatına devam edebilir veya kırmızı hapı alıp Matrix\'in gerçek doğasını öğrenebilir. Neo kırmızı hapı seçer ve gerçek dünyanın aslında makineler tarafından kontrol edilen bir distopya olduğunu öğrenir. İnsanlar, makinelerin enerji kaynağı olarak kullanılmaktadır ve Matrix, onların zihinlerini kontrol altında tutan bir simülasyondur. Neo, kendisini "Seçilmiş Kişi" (The One) olarak keşfeder ve Matrix\'i yok etmek için bir savaşa girer. Film, gerçeklik, özgür irade ve teknolojinin insanlık üzerindeki etkisi gibi derin temaları ele alır.',
            genre_ids: [28, 878],
            genres: ['Aksiyon', 'Bilimkurgu'],
            directors: ['Lana Wachowski', 'Lilly Wachowski'],
            runtime: 136,
            platformRating: 8.7,
            totalRatings: 9876
          }
        ];
        const found = mockMovies.find(m => m.id === parseInt(id));
        if (found) {
          setContent(found);
          setPlatformRating(found.platformRating);
          setTotalRatings(found.totalRatings);
        }
      } else if (type === 'book') {
        const mockBooks = [
          {
            id: 1,
            title: '1984',
            poster_path: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
            release_date: '1949-06-08',
            vote_average: 9.1,
            overview: '1984, distopik bir gelecekte geçen, totaliter bir rejimin kontrolü altındaki bir dünyayı anlatır. Winston Smith, Okyanusya\'da yaşayan ve Büyük Birader\'in gözetimi altında çalışan bir devlet memurudur. Her hareketi izlenmekte, her düşüncesi kontrol edilmektedir. Winston, bu totaliter sistemden nefret eder ve gizlice bir günlük tutmaya başlar. Julia adında bir kadınla tanışır ve ikisi birlikte sisteme karşı gelmeye başlarlar. Ancak düşünce polisi onları yakalar ve Winston, işkence yoluyla sistemin gerçekliğini kabul etmeye zorlanır. Roman, totaliter rejimlerin tehlikelerini, gerçekliğin manipülasyonunu ve bireysel özgürlüğün önemini güçlü bir şekilde ele alır. Orwell\'in bu eseri, modern dünyada hala geçerliliğini koruyan bir uyarı niteliğindedir.',
            genre_ids: [1, 5, 10],
            genres: ['Roman', 'Fantastik', 'Klasik'],
            authors: ['George Orwell'],
            pageCount: 328,
            platformRating: 9.1,
            totalRatings: 15234
          },
          {
            id: 2,
            title: 'Suç ve Ceza',
            poster_path: 'https://covers.openlibrary.org/b/id/7222247-L.jpg',
            release_date: '1866-01-01',
            vote_average: 9.2,
            overview: 'Suç ve Ceza, St. Petersburg\'da yaşayan eski bir öğrenci olan Rodion Raskolnikov\'un hikayesini anlatır. Raskolnikov, ahlaki değerlerden bağımsız olarak "üstün insanlar"ın suç işleyebileceğine inanır ve bu teorisini test etmek için bir tefeci kadını öldürür. Ancak cinayetten sonra, beklediği özgürlük yerine ağır bir vicdan azabı ve psikolojik çöküntü yaşar. Polis müfettişi Porfiry Petrovich, Raskolnikov\'dan şüphelenir ve onu zekice sorgular. Bu süreçte Raskolnikov, Sonya adında genç bir kadınla tanışır ve onun aracılığıyla kurtuluş yolunu bulur. Roman, suç, ceza, pişmanlık ve kefaret temalarını derinlemesine işler ve insan ruhunun karmaşıklığını gözler önüne serer. Dostoyevski\'nin bu başyapıtı, psikolojik gerilim ve ahlaki sorgulama açısından edebiyat tarihinin en önemli eserlerinden biridir.',
            genre_ids: [1, 10, 20],
            genres: ['Roman', 'Klasik', 'Edebiyat'],
            authors: ['Fyodor Dostoyevsky'],
            pageCount: 671,
            platformRating: 9.2,
            totalRatings: 13456
          }
        ];
        const found = mockBooks.find(b => b.id === parseInt(id));
        if (found) {
          setContent(found);
          setPlatformRating(found.platformRating);
          setTotalRatings(found.totalRatings);
        }
      }
      setLoading(false);
    }, 500);
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

  const handleWatchedToggle = () => {
    if (type === 'movie') {
      setIsInWatched(!isInWatched);
      if (isInToWatch) setIsInToWatch(false);
    } else {
      setIsInRead(!isInRead);
      if (isInToRead) setIsInToRead(false);
    }
    // In real app, update API
  };

  const handleToWatchToggle = () => {
    if (type === 'movie') {
      setIsInToWatch(!isInToWatch);
      if (isInWatched) setIsInWatched(false);
    } else {
      setIsInToRead(!isInToRead);
      if (isInRead) setIsInRead(false);
    }
    // In real app, update API
  };



  if (loading) {
    return (
      <div className="content-detail-container">
        <Sidebar 
          onLogout={handleLogout}
          isSearchMode={isSearchMode}
          onSearchModeChange={setIsSearchMode}
        />
        <div className="content-detail-loading">
          <div className="spinner"></div>
          <p>Yükleniyor...</p>
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
                      <span>{isInWatched ? 'İzledim' : 'İzledim'}</span>
                    </button>
                    <button
                      type="button"
                      className={`library-btn ${isInToWatch ? 'active' : ''}`}
                      onClick={handleToWatchToggle}
                    >
                      {isInToWatch ? <FaCheck /> : <FaPlus />}
                      <span>{isInToWatch ? 'İzlenecek' : 'İzlenecek'}</span>
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
                        <span>{isInRead ? 'Okudum' : 'Okudum'}</span>
                      </button>
                      <button
                        type="button"
                        className={`library-btn ${isInToRead ? 'active' : ''}`}
                        onClick={handleToWatchToggle}
                      >
                        {isInToRead ? <FaCheck /> : <FaPlus />}
                        <span>{isInToRead ? 'Okunacak' : 'Okunacak'}</span>
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

        {/* Overview Section */}
        {content.overview && (
          <div className="content-overview">
            <h2 className="overview-title">Özet</h2>
            <p className="overview-text">{content.overview}</p>
          </div>
        )}
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

