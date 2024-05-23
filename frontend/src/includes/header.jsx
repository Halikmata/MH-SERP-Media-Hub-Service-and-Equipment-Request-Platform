import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import logo from '../images/logo.png';
import './header.css';

function Header() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const userDataString = sessionStorage.getItem('userData');
  useEffect(() => {
    if (userDataString) {
      setIsLoggedIn(true);
    }
  }, [userDataString, navigate]);

  function handleLogOut() {
    document.cookie.split(";").forEach(cookie => {
      document.cookie = cookie.split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });
    sessionStorage.clear();
    setIsLoggedIn(false);
  }


  return (
    <header style={headerStyle}>
      <div className="centered">
        <Navbar bg="body" variant="tertiary" expand="lg">
          <Navbar.Brand as={Link} to="/">
            <img src={logo} alt="Logo" style={{ width: '50px', marginRight: '20px' }} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarSupportedContent" />
          <Navbar.Collapse id="navbarSupportedContent">
            <Nav className="mr-auto">
              <Nav.Link as={NavLink} to="/" exact activeClassName="active">Home</Nav.Link>
              <Nav.Link as={NavLink} to="/myrequests" activeClassName="active">Requests</Nav.Link>
              <Nav.Link as={NavLink} to="/equipment" activeClassName="active">Equipment</Nav.Link>
              <Nav.Link as={NavLink} to="/services" activeClassName="active">Services</Nav.Link>
            </Nav>
            <Nav>
              {isLoggedIn ? (
                <Nav.Link as={Link} onClick={handleLogOut} to="/logout">Log out</Nav.Link>
              ) : (
                <Nav.Link as={Link} to="/login">Log in</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    </header>
  );
}

const headerStyle = {
  width: '100vw',
  boxShadow: '0 3px 5px 5px #88888888'
};

export default Header;
