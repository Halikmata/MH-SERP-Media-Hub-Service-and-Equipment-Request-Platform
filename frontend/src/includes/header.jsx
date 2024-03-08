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
                <li style={menuItemStyle}><Link style={liStyle} to="/">Home</Link></li>
                <li style={menuItemStyle}><Link style={liStyle} to="/requests">Requests</Link></li>
                <li style={menuItemStyle}><Link style={liStyle} to="/equipment">Equipment</Link></li>
                <li style={menuItemStyle}><Link style={liStyle} to="/services">Services</Link></li>
                <li style={menuItemStyle}><Link style={liStyle} to="/about">About Us</Link></li>
              </ul>
            </nav>
          )}
          {menuVisible && (
            <div style={menuItemStyle} onClick={toggleMenu}>
              <Link style={linkStyle} to="/login">Log in</Link>
              <Link style={linkStyle} to="/signup">Sign Up</Link>
            </div>
          )}
        </div>
      ) : (
        <>
          <nav>
            <ul style={navStyle}>
              <li><NavLink exact to="/" style={liStyle} activestyle={activeStyle}>Home</NavLink></li>
              <li><NavLink to="/requests" style={liStyle} activestyle={activeStyle}>Requests</NavLink></li>
              <li><NavLink to="/equipment" style={liStyle} activestyle={activeStyle}>Equipment</NavLink></li>
              <li><NavLink to="/services" style={liStyle} activestyle={activeStyle}>Services</NavLink></li>
              <li><NavLink to="/about" style={liStyle} activestyle={activeStyle}>About Us</NavLink></li>
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
  height:'fit-content',
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
}

const menuItemStyle = { 
  width: '100%',
  height:'30px',
  display:'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border:'1px solid #22222222'
}

const activeStyle = {
  backgroundColor: 'orange',
  borderRadius:'10px'
}

export default Header;