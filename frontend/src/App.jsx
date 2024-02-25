import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Header from './includes/header.jsx';
import Home from './pages/home.jsx';
import Equipment from './pages/equipment';

function App() {

  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/equipment" element={<Equipment />} />
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