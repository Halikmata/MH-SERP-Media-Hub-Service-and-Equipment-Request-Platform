import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header style={headerStyle}>
      <h2>LOGO</h2>
      <h2>PSU Media Hub</h2>
      <nav>
        <ul style={navStyle}>
        <li><Link style={liStyle} to="/">Home</Link></li>
          <li><Link style={liStyle} to="/request">Request</Link></li>
          <li><Link style={liStyle} to="/equipment">Equipment</Link></li>
          <li><Link style={liStyle} to="/services">Services</Link></li>
          <li><Link style={liStyle} to="/about">About US</Link></li>
        </ul>
      </nav>
    </header>
  );
}

const headerStyle = {
  background: '#333',
  color: '#fff',
  textAlign: 'center',
  padding: '10px'
}

const navStyle = {
  listStyle: 'none',
  display: 'flex',
  justifyContent: 'center',
  color: '#fff'
}

const liStyle = {
    color: '#fff',
    margin: '5px 10px',
}

export default Header;
