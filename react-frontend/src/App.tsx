import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import './App.css';
import { LanguageProvider } from './contexts/LanguageContext';
import ServiceSoftwareDevResult from './pages/ServiceSoftwareDevResult';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import ServiceWebResult from './pages/ServiceWebresult';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/service/softwaredev_result" element={<ServiceSoftwareDevResult />} />
              <Route path="/service/web_result" element={<ServiceWebResult />} />
              <Route path="/admin/login" element={<Login />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
