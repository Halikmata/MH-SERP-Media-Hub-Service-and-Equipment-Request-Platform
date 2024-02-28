import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header style={headerStyle}>
      <nav>
        <ul style={navStyle}>
          <li><Link style={liStyle} to="/">Home</Link></li>
          <li><Link style={liStyle} to="/request">Request</Link></li>
          <li><Link style={liStyle} to="/equipment">Equipment</Link></li>
          <li><Link style={liStyle} to="/services">Services</Link></li>
          <li><Link style={liStyle} to="/about">About Us</Link></li>
        </ul>
      </nav>
    </header>
  );
}

const headerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width:'100vw',
  minHeight: '60px',
  textAlign: 'center',
  padding: '0',
  boxShadow: '0 3px 5px 5px #88888888'
}

const navStyle = {
  listStyle: 'none',
  display: 'flex',
  justifyContent: 'center',
}

const liStyle = {
  textDecoration: 'none',
  margin: '5px 10px',
  color: '#000000',
}

export default Header;
