import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../../../images/logo.webp';
import './AdminHeader.css';

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
    document.cookie.split(";").forEach((cookie) => {
      document.cookie =
        cookie.split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });
    sessionStorage.clear();
    setIsLoggedIn(false);
    setIsMenuOpen(false); // Close menu on logout
    navigate('/login');
  }

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo-container">
          <Link to="/admin">
            <img src={logo} alt="Logo" className="logo" />
            <strong>Admin</strong>
          </Link>
        </div>

        {/* Hamburger Icon */}
        <div className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className={`nav-links ${isMenuOpen ? 'show' : ''}`}>
          <NavLink
            to="/admin/requests"
            className={({ isActive }) => (isActive ? 'active' : '')}
            onClick={() => setIsMenuOpen(false)}
          >
            Requests
          </NavLink>
          <NavLink
            to="/admin/equipment"
            className={({ isActive }) => (isActive ? 'active' : '')}
            onClick={() => setIsMenuOpen(false)}
          >
            Equipment
          </NavLink>
          <NavLink
            to="/admin/services"
            className={({ isActive }) => (isActive ? 'active' : '')}
            onClick={() => setIsMenuOpen(false)}
          >
            Services
          </NavLink>
          <NavLink
            to="/admin/accounts"
            className={({ isActive }) => (isActive ? 'active' : '')}
            onClick={() => setIsMenuOpen(false)}
          >
            Accounts
          </NavLink>
          <NavLink
            to="/admin/organization"
            className={({ isActive }) => (isActive ? 'active' : '')}
            onClick={() => setIsMenuOpen(false)}
          >
            Organization
          </NavLink>
          <NavLink
            to="/admin/college_office"
            className={({ isActive }) => (isActive ? 'active' : '')}
            onClick={() => setIsMenuOpen(false)}
          >
            College/Office
          </NavLink>
          

          {/* Login/Logout Button */}
          <div className="auth-container">
            {isLoggedIn ? (
              <button className="auth-button logout" onClick={handleLogOut}>
                Log out
              </button>
            ) : (
              <Link
                to="/login"
                className="auth-button login"
                onClick={() => setIsMenuOpen(false)}
              >
                Log in
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
