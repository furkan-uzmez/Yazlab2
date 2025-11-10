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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', formData);
    // Buraya login işlemi eklenecek
    navigate('/home');
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

