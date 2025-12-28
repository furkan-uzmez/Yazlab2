import { useState } from 'react';
import { Link } from 'react-router-dom';
import Beams from '../components/Beams';
import { API_BASE } from '../utils/api';
import './SifremiUnuttum.css';

function SifremiUnuttum() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Backend'inize (FastAPI) e-posta gönderme isteği atın
      const response = await fetch(`${API_BASE}/auth/send_forget_password_email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // 'email' state'ini backend'in beklediği JSON formatında gönder
        body: JSON.stringify({ email: email }), 
      });

      // 2. Başarılı (2xx) cevabı kontrol et
      if (response.ok) {
        // E-posta başarıyla gönderildiyse "Gönderildi" ekranını göster
        setSubmitted(true);
      
      } else {
        // 3. Hatalı (5xx) cevabı (örn: "Failed to send email") yakala
        const errorData = await response.json();
        alert(errorData.detail || "E-posta gönderilemedi!");
      }

    } catch (error) {
      // 4. Sunucuya ulaşılamazsa (Network error) hatayı yakala
      console.error("Şifre sıfırlama isteği başarısız:", error);
      alert("Sunucuya bağlanılamadı!");
    }
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%' }}>
              <Link to="/login" className="btn-submit" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
                Giriş Sayfasına Dön
              </Link>
            </div>
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

