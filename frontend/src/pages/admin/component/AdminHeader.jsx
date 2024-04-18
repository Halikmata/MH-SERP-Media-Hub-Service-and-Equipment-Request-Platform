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
            <Nav.Link as={NavLink} to="/admin/accounts">Accounts</Nav.Link>
            <Nav.Link as={NavLink} to="/admin/organization">Organization</Nav.Link>
            <Nav.Link as={NavLink} to="/admin/college_office">College/Office</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>


    // <div class="d-flex align-items-start" style={{ height: '100vh' }}>
    //   <div className="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
    //     <NavLink className="nav-link disabled" id="v-pills-home-tab" to="/admin" role="tab" aria-controls="v-pills-home" aria-selected="true"><img src={logo} alt="Logo" style={{ width: '50px', marginRight: '20px' }} /></NavLink>
    //     <NavLink className="nav-link" id="v-pills-home-tab" to="/admin/requests" role="tab" aria-controls="v-pills-home" aria-selected="true">Requests</NavLink>
    //     <NavLink className="nav-link" id="v-pills-profile-tab" to="/admin/equipment" role="tab" aria-controls="v-pills-profile" aria-selected="false">Equipment</NavLink>
    //     <NavLink className="nav-link" id="v-pills-disabled-tab" to="/admin/services" role="tab" aria-controls="v-pills-disabled" aria-selected="false" disabled>Services</NavLink>
    //     <NavLink className="nav-link" id="v-pills-messages-tab" to="/admin/accounts" role="tab" aria-controls="v-pills-messages" aria-selected="false">Accounts</NavLink>
    //     <NavLink className="nav-link" id="v-pills-settings-tab" to="/admin/organization" role="tab" aria-controls="v-pills-settings" aria-selected="false">Organization</NavLink>
    //     <NavLink className="nav-link" id="v-pills-settings-tab" to="/admin/college_office" role="tab" aria-controls="v-pills-settings" aria-selected="false">College/Office</NavLink>
    //   </div>
    //   {/* <div className="tab-content" id="v-pills-tabContent">
    //     <div className="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab" tabIndex="0">...</div>
    //     <div className="tab-pane fade" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab" tabIndex="0">...</div>
    //     <div className="tab-pane fade" id="v-pills-disabled" role="tabpanel" aria-labelledby="v-pills-disabled-tab" tabIndex="0">...</div>
    //     <div className="tab-pane fade" id="v-pills-messages" role="tabpanel" aria-labelledby="v-pills-messages-tab" tabIndex="0">...</div>
    //     <div className="tab-pane fade" id="v-pills-settings" role="tabpanel" aria-labelledby="v-pills-settings-tab" tabIndex="0">...</div>
    //   </div> */}
    // </div>
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
