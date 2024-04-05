import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../images/logo.png';

function Header() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);

      if (window.innerWidth < 768) {
        setMenuVisible(false);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setMenuVisible(prevState => !prevState);
  };

  return (
    <header style={headerStyle}>
      {!menuVisible && (
        <div style={{ display: 'flex', margin: '0 30px' }}>
          <img src={logo} style={{ width: '50px' }} alt="Logo" />
        </div>
      )}
      {isSmallScreen ? (
        <div style={{ display: 'flex', flexDirection: 'column', width: menuVisible ? '100%' : 'auto' }}>
          <button onClick={toggleMenu}>Menu</button>
          {menuVisible && (
            <nav>
              <ul style={{ ...menuStyle, ...navStyle }} onClick={toggleMenu}>
                <li style={menuItemStyle}><NavLink style={liStyle} to="/">Home</NavLink></li>
                <li style={menuItemStyle}><NavLink style={liStyle} to="/requests">Requests</NavLink></li>
                <li style={menuItemStyle}><NavLink style={liStyle} to="/equipment">Equipment</NavLink></li>
                <li style={menuItemStyle}><NavLink style={liStyle} to="/services">Services</NavLink></li>
                <li style={menuItemStyle}><NavLink style={liStyle} to="/about">About Us</NavLink></li>
              </ul>
            </nav>
          )}
          {menuVisible && (
            <div style={menuItemStyle} onClick={toggleMenu}>
              <Link to="/signup" style={linkStyle}>Sign Up</Link>
              <Link to="/login" style={linkStyle}>Log in</Link>
            </div>
          )}
        </div>
      ) : (
        <>
          <nav>
            <ul style={navStyle}>
              <li><NavLink to="/" style={liStyle}>Home</NavLink></li>
              <li><NavLink to="/requests" style={liStyle}>Requests</NavLink></li>
              <li><NavLink to="/equipment" style={liStyle}>Equipment</NavLink></li>
              <li><NavLink to="/services" style={liStyle}>Services</NavLink></li>
              <li><NavLink to="/about" style={liStyle}>About Us</NavLink></li>
            </ul>
          </nav>
          {!isSmallScreen && (
            <div>
              <Link to="/signup" style={linkStyle}>Sign Up</Link>
              <Link to="/login" style={linkStyle}>Log in</Link>
            </div>
          )}
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
  height: 'fit-content',
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

const menuStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const menuItemStyle = {
  width: '100%',
  height: '30px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border:'1px solid #22222222'
}
export default Header;
