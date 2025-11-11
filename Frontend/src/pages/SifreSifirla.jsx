import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Beams from '../components/Beams';
import './SifreSifirla.css';

function SifreSifirla() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Şifreler eşleşmiyor!');
      return;
    }

    try {
      // Token'ı URL'den al (eğer varsa)
      const token = searchParams.get('token');
      
      // Backend'e şifre sıfırlama isteği gönder
      const response = await fetch("http://localhost:8000/auth/reset_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token || '',
          new_password: formData.password
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const errorData = await response.json();
        alert(errorData.detail || "Şifre sıfırlama başarısız!");
      }
    } catch (error) {
      console.error("Şifre sıfırlama isteği başarısız:", error);
      alert("Sunucuya bağlanılamadı!");
    }
  };

  if (submitted) {
    return (
      <div className="sifre-sifirla-container">
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
        <div className="sifre-sifirla-card">
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h1 className="success-title">Şifre Başarıyla Sıfırlandı</h1>
            <p className="success-text">
              Şifreniz başarıyla güncellendi. Yeni şifrenizle giriş yapabilirsiniz.
            </p>
            <Link to="/login" className="btn-submit">
              Giriş Sayfasına Git
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sifre-sifirla-container">
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
      <div className="sifre-sifirla-card">
        <h1 className="sifre-sifirla-title">Şifre Sıfırla</h1>
        <p className="sifre-sifirla-subtitle">
          Yeni şifrenizi belirleyin
        </p>
        
        <form onSubmit={handleSubmit} className="sifre-sifirla-form">
          <div className="form-group">
            <label htmlFor="password">Yeni Şifre</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength="6"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Yeni Şifre Tekrar</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength="6"
            />
          </div>
          
          <button type="submit" className="btn-submit">
            Şifreyi Sıfırla
          </button>
        </form>
        
        <div className="sifre-sifirla-footer">
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

export default SifreSifirla;

