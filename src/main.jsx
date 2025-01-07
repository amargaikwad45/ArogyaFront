import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Browser, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar.jsx';
import Footer from './Components/Footer/Footer.jsx'
const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

createRoot(document.getElementById('root')).render(
  <Browser>
  <Navbar/>
    <Routes>
      
      <Route path='/' element={<App/>}></Route>

    </Routes>
    <ScrollToTop/>
    <Footer/>
  </Browser>
)
