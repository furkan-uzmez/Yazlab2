import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Beams from '../components/Beams';
import { API_BASE } from '../utils/api';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showSplash, setShowSplash] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // --- 1. ADIM: LOGIN İSTEĞİ ---
      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), 
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        alert(errorData.detail || "E-posta veya şifre hatalı!");
        return;
      }

      const loginData = await loginResponse.json();
      console.log("Giriş başarılı:", loginData);
      
      // Token'ı kaydet (Varsa)
      if (loginData.access_token) {
          localStorage.setItem("token", loginData.access_token);
      }
      
      // E-postayı kaydet
      localStorage.setItem("email", formData.email);

      // --- 2. ADIM: KULLANICI DETAYLARINI ÇEKME ---
      const userUrl = `${API_BASE}/user/search_by_email?query=${encodeURIComponent(formData.email)}`;
      const userResponse = await fetch(userUrl);

      if (userResponse.ok) {
        const userDataRaw = await userResponse.json();
        console.log("Kullanıcı Verisi (Ham):", userDataRaw);

        // API yanıtını işle (results dizisi mi yoksa user objesi mi?)
        let userData = null;
        if (userDataRaw.user) {
            userData = userDataRaw.user;
        } else if (Array.isArray(userDataRaw.results) && userDataRaw.results.length > 0) {
            userData = userDataRaw.results[0];
        } else if (userDataRaw.results) {
            userData = userDataRaw.results;
        }

        if (userData) {
          // Profil bilgilerini kaydet
          localStorage.setItem("profileusername", userData.username);
          localStorage.setItem("profilebio", userData.bio || "");
          localStorage.setItem("profileimage_url", userData.avatar_url || "");

          // Takip, aktiviteler vb. için user_id'yi de kaydet
          if (userData.user_id !== undefined && userData.user_id !== null) {
            localStorage.setItem("user_id", String(userData.user_id));
          }
        }
      }
      
      // --- 3. ADIM: SPLASH EKRANINI GÖSTER ---
      setShowSplash(true);
      
      // --- 4. ADIM: 2.3 SANİYE SONRA YÖNLENDİRME ---
      setTimeout(() => {
        navigate('/home');
      }, 2300); 
    } catch (error) {
      console.error("İşlem hatası:", error);
      alert("Sunucuya bağlanılamadı!");
    }
  };


  return (
    <>
      {showSplash && (
        <div className="splash-screen">
          <img src="/readditlogo.png" alt="Readdit Logo" className="splash-logo" />
        </div>
      )}
      <div className="login-container">
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
        <div className="login-card">
        <h1 className="login-title">Giriş Yap</h1>
        <p className="login-subtitle">Hesabınıza giriş yapın</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">E-posta</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ornek@email.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>
          
          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Beni hatırla</span>
            </label>
            <Link to="/sifremi-unuttum" className="forgot-password-link">
              Şifremi unuttum
            </Link>
          </div>
          
          <button type="submit" className="btn-submit">
            Giriş Yap
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            Hesabınız yok mu?{' '}
            <Link to="/kayit-ol" className="link">
              Kayıt ol
            </Link>
          </p>
          <Link to="/" className="back-link">
            ← Ana sayfaya dön
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}

export default Login;

