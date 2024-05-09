import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; //react-bootstrap


import { useCookies } from 'react-cookie';

import Header from './includes/header.jsx';
import Home from './pages/home.jsx';
import Equipment from './pages/equipment.jsx';
import Requests from './pages/request.jsx';
import Services from './pages/services.jsx';
import Admin from './pages/admin/admin.jsx';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';

function App(){
    const [cookies, removeCookie] = useCookies(['presence']);
    let navigate = useNavigate();
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/admin');

    const fakeUrl = 'http://127.0.0.1:3001';
    const backendUrl = 'http://127.0.0.1:5000';
    const url = backendUrl;
    
    return (
        <div>
            {!isAdminPage && <Header />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/equipment" element={<Equipment url={url} />} />
                <Route path="/requests" element={<Requests url={url} />} />
                <Route path="/services" element={<Services url={url}/>} />
                <Route path="/signup" element={<Signup url={url} />} />
                <Route path="/login" element={<Login url={url} />} />
                <Route path="/admin/*" element={<Admin url={url} />} />
                <Route path="/logout" element={<Login url={url} />} />
            </Routes>
        </div>
    );
}

function MainApp(){
    return (
        <Router>
            <App/>
        </Router>
    );
}

export default MainApp

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