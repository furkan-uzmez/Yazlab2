import { useState } from 'react';
import { Link } from 'react-router-dom';
import Beams from '../components/Beams';
import './KayitOl.css';

function KayitOl() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Şifreler eşleşmiyor!');
      return;
    }
    console.log('Kayıt:', formData);
    // Buraya kayıt işlemi eklenecek
  };

  return (
    <div className="kayit-container">
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
      <div className="kayit-card">
        <h1 className="kayit-title">Kayıt Ol</h1>
        <p className="kayit-subtitle">Yeni hesap oluşturun</p>
        
        <form onSubmit={handleSubmit} className="kayit-form">
          <div className="form-group">
            <label htmlFor="name">Ad Soyad</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Adınız Soyadınız"
              required
            />
          </div>
          
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
              minLength="6"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Şifre Tekrar</label>
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
            Kayıt Ol
          </button>
        </form>
        
        <div className="kayit-footer">
          <p>
            Zaten hesabınız var mı?{' '}
            <Link to="/login" className="link">
              Giriş yap
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

export default KayitOl;

