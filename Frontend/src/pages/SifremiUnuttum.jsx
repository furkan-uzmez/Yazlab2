import { useState } from 'react';
import { Link } from 'react-router-dom';
import Beams from '../components/Beams';
import './SifremiUnuttum.css';

function SifremiUnuttum() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Şifre sıfırlama isteği:', email);
    setSubmitted(true);
    // Buraya şifre sıfırlama işlemi eklenecek
  };

  if (submitted) {
    return (
      <div className="sifremi-unuttum-container">
        <div className="beams-background">
          <Beams
            beamWidth={2}
            beamHeight={15}
            beamNumber={12}
            lightColor="#ffffff"
            speed={2}
            noiseIntensity={1.75}
            scale={0.2}
            rotation={35}
          />
        </div>
        <div className="sifremi-unuttum-card">
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h1 className="success-title">E-posta Gönderildi</h1>
            <p className="success-text">
              Şifre sıfırlama bağlantısı <strong>{email}</strong> adresine gönderildi.
              Lütfen e-posta kutunuzu kontrol edin.
            </p>
            <Link to="/login" className="btn-submit">
              Giriş Sayfasına Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sifremi-unuttum-container">
      <div className="beams-background">
        <Beams
          beamWidth={2}
          beamHeight={15}
          beamNumber={12}
          lightColor="#ffffff"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={35}
        />
      </div>
      <div className="sifremi-unuttum-card">
        <h1 className="sifremi-unuttum-title">Şifremi Unuttum</h1>
        <p className="sifremi-unuttum-subtitle">
          E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim
        </p>
        
        <form onSubmit={handleSubmit} className="sifremi-unuttum-form">
          <div className="form-group">
            <label htmlFor="email">E-posta</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              required
            />
          </div>
          
          <button type="submit" className="btn-submit">
            Şifre Sıfırlama Bağlantısı Gönder
          </button>
        </form>
        
        <div className="sifremi-unuttum-footer">
          <Link to="/login" className="back-link">
            ← Giriş sayfasına dön
          </Link>
          <Link to="/" className="back-link">
            ← Ana sayfaya dön
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SifremiUnuttum;

