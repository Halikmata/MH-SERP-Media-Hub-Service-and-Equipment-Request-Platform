import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import logo from '../images/logo.png';
import './header.css';

function Header() {
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
            <Nav.Link as={NavLink} to="/requests">Requests</Nav.Link>
            <Nav.Link as={NavLink} to="/equipment">Equipment</Nav.Link>
            <Nav.Link as={NavLink} to="/services">Services</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
            <Nav.Link as={Link} to="/login">Log in</Nav.Link> {/* should disappear if logged in, and log out must pop up, vice versa */}
            <Nav.Link as={Link} to="/logout">Log out</Nav.Link> {/* non-functional. please trigger /logout app route to remove cookie/session */}
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
