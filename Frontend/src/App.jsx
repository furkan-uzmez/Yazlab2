import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnaGiris from './pages/AnaGiris';
import Login from './pages/Login';
import KayitOl from './pages/KayitOl';
import SifremiUnuttum from './pages/SifremiUnuttum';
import SifreSifirla from './pages/SifreSifirla';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Movies from './pages/Movies';
import Books from './pages/Books';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AnaGiris />} />
        <Route path="/login" element={<Login />} />
        <Route path="/kayit-ol" element={<KayitOl />} />
        <Route path="/sifremi-unuttum" element={<SifremiUnuttum />} />
        <Route path="/sifre-sifirla" element={<SifreSifirla />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile/:userId?" element={<Profile />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/books" element={<Books />} />
        <Route path="/search" element={<Home />} />
        <Route path="/review/:reviewId" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
