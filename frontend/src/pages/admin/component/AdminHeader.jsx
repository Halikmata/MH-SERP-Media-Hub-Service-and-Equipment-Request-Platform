import React from 'react'
import { Navbar, Nav } from 'react-bootstrap';
import logo from '../../../images/logo.png';
import { Link, NavLink, useLocation } from 'react-router-dom';

function AdminHeader() {
  return (
    <header style={headerStyle}>
      <Navbar bg="body" variant="tertiary" expand="lg">
        <Navbar.Brand as={Link} to="/admin">
          <img src={logo} alt="Logo" style={{ width: '50px', marginRight: '20px' }} />
          <h2>Admin</h2>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarSupportedContent" />
        <Navbar.Collapse id="navbarSupportedContent">
          <Nav className="mr-auto">
            <Nav.Link as={NavLink} to="/admin/requests">Requests</Nav.Link>
            <Nav.Link as={NavLink} to="/admin/equipment">Equipment</Nav.Link>
            <Nav.Link as={NavLink} to="/admin/services">Services</Nav.Link>
            <Nav.Link as={NavLink} to="/admin/users">Users</Nav.Link>
            <Nav.Link as={NavLink} to="/admin/organization">Organization</Nav.Link>
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

export default AdminHeader

// import React from 'react';
// import { Link, NavLink } from 'react-router-dom';
// import { Navbar, Nav } from 'react-bootstrap';
// import logo from '../images/logo.png';
// import './header.css';

// function Header() {
//   return (
//     <header style={headerStyle}>
//       <Navbar bg="body" variant="tertiary" expand="lg">
//         <Navbar.Brand as={Link} to="/">
//           <img src={logo} alt="Logo" style={{ width: '50px', marginRight: '20px' }} />
//         </Navbar.Brand>
//         <Navbar.Toggle aria-controls="navbarSupportedContent" />
//         <Navbar.Collapse id="navbarSupportedContent">
//           <Nav className="mr-auto">
//             <Nav.Link as={NavLink} to="/" exact>Home</Nav.Link>
//             <Nav.Link as={NavLink} to="/requests">Requests</Nav.Link>
//             <Nav.Link as={NavLink} to="/equipment">Equipment</Nav.Link>
//             <Nav.Link as={NavLink} to="/services">Services</Nav.Link>
//           </Nav>
//           <Nav>
//             <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
//             <Nav.Link as={Link} to="/login">Log in</Nav.Link>
//           </Nav>
//         </Navbar.Collapse>
//       </Navbar>
//     </header>
//   );
// }



// export default Header;
