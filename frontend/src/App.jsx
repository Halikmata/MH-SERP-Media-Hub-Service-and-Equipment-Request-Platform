import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; //react-bootstrap

import Header from './includes/header.jsx';
import Home from './pages/home.jsx';
import Equipment from './pages/equipment';
import Requests from './pages/request.jsx';
import Services from './pages/services.jsx';
import Admin from './pages/admin/admin.jsx';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  return (
    <div>
      {!isAdminPage && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/services" element={<Services />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

function MainApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default MainApp;


/*
App.jsx
header
body
  switch:
    if logged in:  
      home
    else:
      landing
    equipment
    services
    about
footer



equipment.jsx
  for i in equipment:
    card
      image
      brand
      model
      description

  pagination

*/
/*
App.jsx
header
body
  switch:
    if logged in:  
      home
    else:
      landing
    equipment
    services
    about
footer



equipment.jsx
  for i in equipment:
    card
      image
      brand
      model
      description

  pagination

*/