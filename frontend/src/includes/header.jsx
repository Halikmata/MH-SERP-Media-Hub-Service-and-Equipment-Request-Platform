import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../images/logo.webp';
import './header.css';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userDataString = sessionStorage.getItem('userData');

  useEffect(() => {
    if (userDataString) {
      setIsLoggedIn(true);
    }
  }, [userDataString]);

  function handleLogOut() {
    document.cookie.split(";").forEach(cookie => {
      document.cookie = cookie.split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });
    sessionStorage.clear();
    setIsLoggedIn(false);
    navigate('/login');
  }

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo-container">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
        </div>

        {/* Hamburger Icon */}
        <div className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className={`nav-links ${isMenuOpen ? 'show' : ''}`}>
          <NavLink to="/" exact activeClassName="active" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
          <NavLink to="/myrequests" activeClassName="active" onClick={() => setIsMenuOpen(false)}>Requests</NavLink>
          <NavLink to="/equipment" activeClassName="active" onClick={() => setIsMenuOpen(false)}>Equipment</NavLink>
          <NavLink to="/services" activeClassName="active" onClick={() => setIsMenuOpen(false)}>Services</NavLink>
        </nav>

        {/* Login/Logout Button */}
        <div className="auth-container">
          {isLoggedIn ? (
            <button className="auth-button logout" onClick={handleLogOut}>
              Log out
            </button>
          ) : (
            <Link to="/login" className="auth-button login">
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
