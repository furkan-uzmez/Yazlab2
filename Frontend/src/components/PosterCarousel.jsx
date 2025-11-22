import './PosterCarousel.css';

const PosterCarousel = () => {
  // Örnek poster verileri (gerçek uygulamada API'den gelebilir)
  const posters = [
    {
      id: 1,
      title: 'Inception',
      poster: 'https://image.tmdb.org/t/p/w780/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
      type: 'Film'
    },
    {
      id: 2,
      title: '1984',
      poster: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
      type: 'Kitap'
    },
    {
      id: 3,
      title: 'The Matrix',
      poster: 'https://image.tmdb.org/t/p/w780/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
      type: 'Film'
    },
    {
      id: 4,
      title: 'Interstellar',
      poster: 'https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      type: 'Film'
    },
    {
      id: 5,
      title: 'The Dark Knight',
      poster: 'https://image.tmdb.org/t/p/w780/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      type: 'Film'
    },
    {
      id: 6,
      title: 'Suç ve Ceza',
      poster: 'https://covers.openlibrary.org/b/id/8739161-L.jpg',
      type: 'Kitap'
    },
    {
      id: 7,
      title: 'The Shawshank Redemption',
      poster: 'https://image.tmdb.org/t/p/w780/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
      type: 'Film'
    },
    {
      id: 8,
      title: 'Pulp Fiction',
      poster: 'https://image.tmdb.org/t/p/w780/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
      type: 'Film'
    },
    {
      id: 9,
      title: 'Fight Club',
      poster: 'https://image.tmdb.org/t/p/w780/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
      type: 'Film'
    },
    {
      id: 10,
      title: 'The Godfather',
      poster: 'https://image.tmdb.org/t/p/w780/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
      type: 'Film'
    },
    {
      id: 11,
      title: 'Savaş ve Barış',
      poster: 'https://covers.openlibrary.org/b/id/8739161-L.jpg',
      type: 'Kitap'
    },
    {
      id: 12,
      title: 'Forrest Gump',
      poster: 'https://image.tmdb.org/t/p/w780/saHP97rTPS5eLmrLQEcANmKrsFl.jpg',
      type: 'Film'
    },
    {
      id: 13,
      title: 'The Lord of the Rings',
      poster: 'https://image.tmdb.org/t/p/w780/56zTpe2xvaA4alU51sRWPoKPYZy.jpg',
      type: 'Film'
    },
    {
      id: 14,
      title: 'Harry Potter',
      poster: 'https://image.tmdb.org/t/p/w780/wuMc08IPKEatf9rnMNXvIDxqP4W.jpg',
      type: 'Film'
    },
    {
      id: 15,
      title: 'Dune',
      poster: 'https://image.tmdb.org/t/p/w780/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
      type: 'Film'
    }
  ];

  // Infinite scroll için posterleri çoğalt (seamless loop için)
  const duplicatedPosters = [...posters, ...posters, ...posters];

  return (
    <section className="poster-carousel-section">
      <div className="poster-carousel-container">
        {/* İlk Akış - Sağa Doğru */}
        <div className="poster-track-wrapper track-1">
          <div className="poster-track">
            {duplicatedPosters.map((poster, index) => (
              <div key={`track1-${poster.id}-${index}`} className="poster-item">
                <div className="poster-image-wrapper">
                  <img 
                    src={poster.poster} 
                    alt={poster.title}
                    className="poster-image"
                    loading="lazy"
                    onError={(e) => {
                      console.error('Poster image failed to load:', poster.poster);
                      e.target.style.display = 'none';
                    }}
                    onLoad={(e) => {
                      // Görsel yüklendiğinde container'ı doldurduğundan emin ol
                      e.target.style.width = '100%';
                      e.target.style.height = '100%';
                      e.target.style.objectFit = 'cover';
                    }}
                  />
                  <div className="poster-overlay">
                    <div className="poster-type-badge">
                      {poster.type}
                    </div>
                  </div>
                </div>
                <div className="poster-title">{poster.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* İkinci Akış - Sola Doğru */}
        <div className="poster-track-wrapper track-2">
          <div className="poster-track">
            {duplicatedPosters.map((poster, index) => (
              <div key={`track2-${poster.id}-${index}`} className="poster-item">
                <div className="poster-image-wrapper">
                  <img 
                    src={poster.poster} 
                    alt={poster.title}
                    className="poster-image"
                    loading="lazy"
                    onError={(e) => {
                      console.error('Poster image failed to load:', poster.poster);
                      e.target.style.display = 'none';
                    }}
                    onLoad={(e) => {
                      // Görsel yüklendiğinde container'ı doldurduğundan emin ol
                      e.target.style.width = '100%';
                      e.target.style.height = '100%';
                      e.target.style.objectFit = 'cover';
                    }}
                  />
                  <div className="poster-overlay">
                    <div className="poster-type-badge">
                      {poster.type}
                    </div>
                  </div>
                </div>
                <div className="poster-title">{poster.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PosterCarousel;

