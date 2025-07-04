import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './navbar.css'
import logo from '../../assets/Logo.png'


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const videoRef = useRef(null);

  const handleMenuToggle = () => {
    setIsMenuOpen(prevState => !prevState);
  };

  const handleLinkClick = () => {
    handleMenuToggle();
  };

  // Play video when the menu is opened
  useEffect(() => {
    if (isMenuOpen && videoRef.current) {
      videoRef.current.play();
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [isMenuOpen]);

  return (
    <>
      <nav className={`navbarr ${isMenuOpen ? 'open' : ''} share-tech`}>
        <div className="nav_container">
          <div className="logo">
            <img src={logo} className="logo" alt="" />
          </div>
          <div className="hamburger-menu" onClick={handleMenuToggle}>
            <div className="bar"></div>
          </div>
        </div>
        <div className={`links ${isMenuOpen ? 'show' : ''}`}>


          <ul className='share-tech'>
            <li className="nav_item share-tech">
              <Link
                to="/"
                className={location.pathname === '/' ? 'active_nav' : ''}
                onClick={handleLinkClick}
              >
                Home
              </Link>
            </li>
            
            <li className="nav_item ">
              <Link
                to="/about"
                className={location.pathname === '/about' ? 'active_nav' : ''}
                onClick={handleLinkClick}
              >
                About Us
              </Link>
            </li>
           
            <div className="contact-btn ">
              <Link 
              to="/contact" 
              onClick={handleLinkClick}
              className={`bg-[#77bfa3] text-[#fff5e1] font-bold py-2 px-4 rounded hover:bg-[#e65a4d] hover:text-[#ffebd0] transition-all duration-300`}>
                Contact Support
              </Link>
            </div>

          </ul>





        </div>
      </nav>
    </>
  );
};

export default Navbar;
