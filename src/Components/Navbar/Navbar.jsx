import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './navbar.css'
import logo from '../../assets/react.svg'


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
            <li className="nav_item share-tech">
              <Link
                to="/services"
                className={location.pathname === '/services' ? 'active_nav' : ''}
                onClick={handleLinkClick}
              >
                Services
              </Link>
            </li>
            <li className="nav_item">
              <Link
                to="/blogs"
                className={location.pathname === '/blogs' ? 'active_nav' : ''}
                onClick={handleLinkClick}
              >
                Blogs
              </Link>
            </li>
            <li className="nav_item ">
              <Link
                to="/about"
                className={location.pathname === '/about' ? 'active_nav' : ''}
                onClick={handleLinkClick}
              >
                About Me
              </Link>
            </li>
            <li className="nav_item ">
              <Link
                to="/projects"
                className={location.pathname === '/projects' ? 'active_nav' : ''}
                onClick={handleLinkClick}
              >
                Projects
              </Link>
            </li>
            <div className="contact-btn ">
              <Link 
              to="/contact" 
              onClick={handleLinkClick}
              className={`bg-[#77bfa3] text-[#fff5e1] font-bold py-2 px-4 rounded hover:bg-[#e65a4d] hover:text-[#ffebd0] transition-all duration-300`}>
                Contact Me
              </Link>
            </div>

          </ul>





        </div>
      </nav>
    </>
  );
};

export default Navbar;
