import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';

function Header() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header style={headerStyle}>
      <div style={{ display: 'flex', margin: '0 30px' }}>
        <img src={logo} style={{ width: '50px' }} alt="Logo" />
      </div>
      {isSmallScreen ? (
        <div>
          <button style={linkStyle}>Menu</button>
        </div>
      ) : (
        <>
        <nav>
          <ul style={navStyle}>
            <li><Link style={liStyle} to="/">Home</Link></li>
            <li><Link style={liStyle} to="/requests">Requests</Link></li>
            <li><Link style={liStyle} to="/equipment">Equipment</Link></li>
            <li><Link style={liStyle} to="/services">Services</Link></li>
            <li><Link style={liStyle} to="/about">About Us</Link></li>
          </ul>
        </nav>
        <div>
          <a style={linkStyle}>Log in</a>
          <a style={linkStyle}>Sign Up</a>
        </div>
        </>
      )}
    </header>
  );
}

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100vw',
  minHeight: '60px',
  textAlign: 'center',
  padding: '0',
  boxShadow: '0 3px 5px 5px #88888888'
};

const navStyle = {
  listStyle: 'none',
  display: 'flex',
  flex: '1',
  justifyContent: 'space-between',
};

const liStyle = {
  textDecoration: 'none',
  margin: '5px 10px',
  color: '#000000',
};

const linkStyle = {
  textDecoration: 'none',
  margin: '0 10px',
  color: '#000000',
};

export default Header;
