import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Beams from '../components/Beams';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // 1. Backend'inize (FastAPI) login isteği atın
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // formData state'i, backend'in beklediği {email, password}
        // formatıyla zaten uyumlu
        body: JSON.stringify(formData), 
      });

      // 2. Başarılı (2xx) cevabı kontrol et
      if (response.ok) {
        const data = await response.json();
        // data = {"message": "Login successful"}
        
        // ÖNEMLİ: Gerçekte, backend'in burada bir JWT token 
        // döndürmesi ve sizin bunu localStorage'a kaydetmeniz gerekir.
        console.log("Giriş başarılı:", data);

        // Ana sayfaya yönlendir
        navigate('/home'); 

      } else {
        // 3. Hatalı (4xx, 5xx) cevabı (örn: 401 Yetkisiz) yakala
        const errorData = await response.json();
        // errorData = {"detail": "Invalid email or password"}
        alert(errorData.detail || "E-posta veya şifre hatalı!");
      }

    } catch (error) {
      // 4. Sunucuya ulaşılamazsa (Network error) hatayı yakala
      console.error("Giriş isteği başarısız:", error);
      alert("Sunucuya bağlanılamadı!");
    }
  };

  return (
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
  );
}

export default Login;

