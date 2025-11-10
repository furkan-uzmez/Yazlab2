import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { HiOutlineBookOpen, HiOutlineStar, HiOutlineUserGroup, HiOutlineChatAlt2, HiMenu, HiX } from 'react-icons/hi';
import Beams from '../components/Beams';
import SplitText from '../components/SplitText';
import BlurText from '../components/BlurText';
import GooeyNav from '../components/GooeyNav';
import GradualBlur from '../components/GradualBlur';
import TextPressure from '../components/TextPressure';
import './AnaGiris.css';

function AnaGiris() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };

  const handleBlurAnimationComplete = () => {
    console.log('Animation completed!');
  };

  const scrollToHakkimizda = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const hakkimizdaSection = document.querySelector('.hakkimizda-section');
    if (hakkimizdaSection) {
      hakkimizdaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToIletisim = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const iletisimSection = document.querySelector('#iletisim');
    if (iletisimSection) {
      iletisimSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const gooeyNavItems = [
    { label: 'Anasayfa', href: '#home' },
    { label: 'Hakkında', href: '#hakkimizda' },
    { label: 'İletişim', href: '#iletisim' }
  ];


  return (
    <div className="ana-giris-container">
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
      
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <a href="#home" onClick={scrollToTop} className="navbar-logo">
            Readdit
          </a>
          <div className="gooey-nav-wrapper desktop-nav">
            <GooeyNav
              items={gooeyNavItems}
              particleCount={15}
              particleDistances={[90, 10]}
              particleR={100}
              initialActiveIndex={0}
              animationTime={600}
              timeVariance={300}
              colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            />
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'mobile-menu-open' : ''}`} onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <span className="mobile-menu-title">Menü</span>
              <button 
                className="mobile-menu-close"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <HiX />
              </button>
            </div>
            <div className="mobile-menu-items">
              <a 
                href="#home" 
                onClick={(e) => { scrollToTop(e); setMobileMenuOpen(false); }}
                className="mobile-menu-item"
              >
                <span className="menu-item-number">01</span>
                <span className="menu-item-text">Anasayfa</span>
              </a>
              <a 
                href="#hakkimizda" 
                onClick={(e) => { scrollToHakkimizda(e); setMobileMenuOpen(false); }}
                className="mobile-menu-item"
              >
                <span className="menu-item-number">02</span>
                <span className="menu-item-text">Hakkında</span>
              </a>
              <a 
                href="#iletisim" 
                onClick={(e) => { scrollToIletisim(e); setMobileMenuOpen(false); }}
                className="mobile-menu-item"
              >
                <span className="menu-item-number">03</span>
                <span className="menu-item-text">İletişim</span>
              </a>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <div className="ana-giris-hero">
        <div className="hero-content-wrapper">
          <div className="ana-giris-title-wrapper">
            <TextPressure
              text="Readdit"
              flex={true}
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              italic={true}
              textColor="#ffffff"
              strokeColor="#ff0000"
              minFontSize={24}
              className="ana-giris-title"
            />
          </div>
          <BlurText
            text="Kendi kitap ve film dünyanı oluştur, puanla, yorum yap ve arkadaşlarınla paylaş. Hepsi tek bir sosyal kütüphanede."
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleBlurAnimationComplete}
            className="ana-giris-subtitle"
            threshold={0}
            rootMargin="0px"
          />
          <div className="ana-giris-buttons">
            <Link to="/login" className="btn btn-primary">
              Giriş Yap
            </Link>
            <Link to="/kayit-ol" className="btn btn-secondary">
              Kayıt Ol
            </Link>
          </div>
          
          {/* Scroll Down Indicator */}
          <div className="scroll-down-indicator" onClick={scrollToHakkimizda}>
            <span className="scroll-down-text">Aşağı Kaydır</span>
            <div className="scroll-down-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
        
      </div>
      
      {/* GradualBlur - Fixed at bottom of viewport */}
      <GradualBlur
        target="page"
        position="bottom"
        height="6rem"
        strength={2}
        divCount={5}
        curve="bezier"
        exponential={true}
        opacity={1}
      />

      {/* Nasıl Çalışır Bölümü */}
      <section className="how-it-works-section">
        <div className="how-it-works-container">
          <SplitText
            text="Nasıl Çalışır?"
            className="section-main-title"
            delay={50}
            duration={0.8}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 50, scale: 0.8 }}
            to={{ opacity: 1, y: 0, scale: 1 }}
            threshold={0.1}
            rootMargin="0px"
            textAlign="center"
            tag="h2"
          />
          <BlurText
            text="Readdit ile kitap ve film dünyanı keşfetmek çok kolay"
            delay={100}
            animateBy="words"
            direction="top"
            className="section-subtitle"
            threshold={0.1}
            rootMargin="0px"
          />
          <div className="steps-container">
            <div className="step-item">
              <div className="step-icon-wrapper">
                <div className="step-number">01</div>
                <div className="step-icon">
                  <HiOutlineUserGroup />
                </div>
              </div>
              <div className="step-content">
                <SplitText
                  text="Hesap Oluştur"
                  className="step-title"
                  delay={50}
                  duration={0.6}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 30 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.2}
                  rootMargin="0px"
                  textAlign="left"
                  tag="h3"
                />
                <BlurText
                  text="Hızlı ve kolay kayıt işlemiyle hemen başlayın."
                  delay={80}
                  animateBy="words"
                  direction="top"
                  className="step-description"
                  threshold={0.2}
                  rootMargin="0px"
                />
              </div>
            </div>

            <div className="step-item">
              <div className="step-icon-wrapper">
                <div className="step-number">02</div>
                <div className="step-icon">
                  <HiOutlineBookOpen />
                </div>
              </div>
              <div className="step-content">
                <SplitText
                  text="Kütüphaneni Oluştur"
                  className="step-title"
                  delay={50}
                  duration={0.6}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 30 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.2}
                  rootMargin="0px"
                  textAlign="left"
                  tag="h3"
                />
                <BlurText
                  text="Okuduğun kitapları ve izlediğin filmleri ekle."
                  delay={80}
                  animateBy="words"
                  direction="top"
                  className="step-description"
                  threshold={0.2}
                  rootMargin="0px"
                />
              </div>
            </div>

            <div className="step-item">
              <div className="step-icon-wrapper">
                <div className="step-number">03</div>
                <div className="step-icon">
                  <HiOutlineStar />
                </div>
              </div>
              <div className="step-content">
                <SplitText
                  text="Puanla ve Yorum Yap"
                  className="step-title"
                  delay={50}
                  duration={0.6}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 30 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.2}
                  rootMargin="0px"
                  textAlign="left"
                  tag="h3"
                />
                <BlurText
                  text="Deneyimlerini paylaş ve toplulukla etkileşime geç."
                  delay={80}
                  animateBy="words"
                  direction="top"
                  className="step-description"
                  threshold={0.2}
                  rootMargin="0px"
                />
              </div>
            </div>

            <div className="step-item">
              <div className="step-icon-wrapper">
                <div className="step-number">04</div>
                <div className="step-icon">
                  <HiOutlineChatAlt2 />
                </div>
              </div>
              <div className="step-content">
                <SplitText
                  text="Keşfet ve Paylaş"
                  className="step-title"
                  delay={50}
                  duration={0.6}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 30 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.2}
                  rootMargin="0px"
                  textAlign="left"
                  tag="h3"
                />
                <BlurText
                  text="Arkadaşlarının kütüphanelerini keşfet ve yeni içerikler bul."
                  delay={80}
                  animateBy="words"
                  direction="top"
                  className="step-description"
                  threshold={0.2}
                  rootMargin="0px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hakkında Section */}
      <div id="hakkimizda" className="hakkimizda-section">
        <div className="hakkimizda-header">
          <SplitText
            text="Readdit Hakkında"
            className="hakkimizda-main-title"
            delay={50}
            duration={0.8}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 50, scale: 0.8 }}
            to={{ opacity: 1, y: 0, scale: 1 }}
            threshold={0.1}
            rootMargin="0px"
            textAlign="center"
            tag="h2"
          />
          <BlurText
            text="Kitap ve film severlerin buluşma noktası. Keşfet, paylaş, bağlan."
            delay={100}
            animateBy="words"
            direction="top"
            className="hakkimizda-header-subtitle"
            threshold={0.1}
            rootMargin="0px"
          />
        </div>

        <div className="hakkimizda-features-grid">
          <div className="hakkimizda-feature-card">
            <div className="feature-icon">
              <HiOutlineBookOpen />
            </div>
            <SplitText
              text="Dijital Kütüphane"
              className="feature-title"
              delay={50}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.2}
              rootMargin="0px"
              textAlign="center"
              tag="h3"
            />
            <BlurText
              text="Kendi kitap ve film koleksiyonunuzu oluşturun. Tüm favorilerinizi tek bir yerde toplayın."
              delay={80}
              animateBy="words"
              direction="top"
              className="feature-text"
              threshold={0.2}
              rootMargin="0px"
            />
          </div>

          <div className="hakkimizda-feature-card">
            <div className="feature-icon">
              <HiOutlineStar />
            </div>
            <SplitText
              text="Puanlama & Yorum"
              className="feature-title"
              delay={50}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.2}
              rootMargin="0px"
              textAlign="center"
              tag="h3"
            />
            <BlurText
              text="İçerikleri puanlayın ve detaylı yorumlar yazın. Deneyimlerinizi toplulukla paylaşın."
              delay={80}
              animateBy="words"
              direction="top"
              className="feature-text"
              threshold={0.2}
              rootMargin="0px"
            />
          </div>

          <div className="hakkimizda-feature-card">
            <div className="feature-icon">
              <HiOutlineUserGroup />
            </div>
            <SplitText
              text="Sosyal Etkileşim"
              className="feature-title"
              delay={50}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.2}
              rootMargin="0px"
              textAlign="center"
              tag="h3"
            />
            <BlurText
              text="Arkadaşlarınızla bağlantı kurun, kütüphanelerini keşfedin ve yeni içerikler bulun."
              delay={80}
              animateBy="words"
              direction="top"
              className="feature-text"
              threshold={0.2}
              rootMargin="0px"
            />
          </div>
        </div>

        <div className="hakkimizda-main-content">
          <div className="hakkimizda-content-left">
            <SplitText
              text="Misyonumuz"
              className="hakkimizda-title"
              delay={50}
              duration={0.8}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 50, scale: 0.8 }}
              to={{ opacity: 1, y: 0, scale: 1 }}
              threshold={0.2}
              rootMargin="0px"
              textAlign="left"
              tag="h2"
            />
            <BlurText
              text="Readdit, kitap ve film severlerin bir araya gelerek kendi dijital kütüphanelerini oluşturabildiği, puanlama ve yorum yapabildiği ve başkalarıyla etkileşime girebildiği sosyal bir web platformudur."
              delay={100}
              animateBy="words"
              direction="top"
              className="hakkimizda-text"
              threshold={0.2}
              rootMargin="0px"
            />
            <BlurText
              text="Amaç; sadece içerik tüketmek değil, paylaşarak keşfetmek."
              delay={80}
              animateBy="words"
              direction="top"
              className="hakkimizda-quote"
              threshold={0.2}
              rootMargin="0px"
            />
          </div>

          <div className="hakkimizda-content-right">
            <SplitText
              text="Vizyonumuz"
              className="hakkimizda-title"
              delay={50}
              duration={0.8}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 50, scale: 0.8 }}
              to={{ opacity: 1, y: 0, scale: 1 }}
              threshold={0.2}
              rootMargin="0px"
              textAlign="right"
              tag="h2"
            />
            <BlurText
              text="Okuyan, izleyen ve paylaşan bir topluluk oluşturmak. Kütüphaneleri yalnızca raflarda değil, insanlar arasında bağ kuran dijital bir köprü haline getirmek."
              delay={100}
              animateBy="words"
              direction="top"
              className="hakkimizda-text"
              threshold={0.2}
              rootMargin="0px"
            />
            <BlurText
              text="Herkesin kendi hikayesini paylaşabileceği ve başkalarından ilham alabileceği bir platform olmak."
              delay={80}
              animateBy="words"
              direction="top"
              className="hakkimizda-text"
              threshold={0.2}
              rootMargin="0px"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer id="iletisim" className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Readdit</h3>
            <p className="footer-text">
              Kitap ve film severlerin buluşma noktası. Kendi kütüphanenizi oluşturun, paylaşın ve keşfedin.
            </p>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Hızlı Linkler</h3>
            <ul className="footer-links">
              <li>
                <a href="#home" onClick={scrollToTop}>Anasayfa</a>
              </li>
              <li>
                <a href="#hakkimizda" onClick={scrollToHakkimizda}>Hakkında</a>
              </li>
              <li>
                <Link to="/login">Giriş Yap</Link>
              </li>
              <li>
                <Link to="/kayit-ol">Kayıt Ol</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">İletişim</h3>
            <div className="footer-contact">
              <p className="footer-text">
                <strong>E-posta:</strong> info@readdit.com
              </p>
              <p className="footer-text">
                <strong>Telefon:</strong> +90 (555) 123 45 67
              </p>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="footer-copyright">
                © 2025 Readdit. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default AnaGiris;

