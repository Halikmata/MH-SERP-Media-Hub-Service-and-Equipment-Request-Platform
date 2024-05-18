import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import logo from '../images/logo.png';
import './header.css';

function Header() {

  function handleLogOut() {
    document.cookie.split(";").forEach(cookie => {
        document.cookie = cookie.split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });
    sessionStorage.clear();
}


  return (
    <header style={headerStyle}>
      <Navbar bg="body" variant="tertiary" expand="lg">
        <Navbar.Brand as={Link} to="/">
          <img src={logo} alt="Logo" style={{ width: '50px', marginRight: '20px' }} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarSupportedContent" />
        <Navbar.Collapse id="navbarSupportedContent">
          <Nav className="mr-auto">
            <Nav.Link as={NavLink} to="/" exact>Home</Nav.Link>
            <Nav.Link as={NavLink} to="/myrequests">Requests</Nav.Link>
            <Nav.Link as={NavLink} to="/equipment">Equipment</Nav.Link>
            <Nav.Link as={NavLink} to="/services">Services</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
            <Nav.Link as={Link} to="/login">Log in</Nav.Link> {/* should disappear if logged in, and log out must pop up, vice versa */}
            <Nav.Link as={Link} onClick={handleLogOut} to="/logout">Log out</Nav.Link> {/* non-functional. please trigger /logout app route to remove cookie/session */}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
}

const headerStyle = {
  width: '100vw',
  boxShadow: '0 3px 5px 5px #88888888'
};

export default Header;
