import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './includes/header.jsx';
import Home from './pages/home.jsx';
import Equipment from './pages/equipment';
import Requests from './pages/request.jsx';

function App() {

  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/requests" element={<Requests />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

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