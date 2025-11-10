import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnaGiris from './pages/AnaGiris';
import Login from './pages/Login';
import KayitOl from './pages/KayitOl';
import SifremiUnuttum from './pages/SifremiUnuttum';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AnaGiris />} />
        <Route path="/login" element={<Login />} />
        <Route path="/kayit-ol" element={<KayitOl />} />
        <Route path="/sifremi-unuttum" element={<SifremiUnuttum />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile/:userId?" element={<Home />} />
        <Route path="/movies" element={<Home />} />
        <Route path="/books" element={<Home />} />
        <Route path="/search" element={<Home />} />
        <Route path="/review/:reviewId" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
