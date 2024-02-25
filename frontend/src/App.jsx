import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Equipment from './pages/equipment';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('api'); // Assumes your Flask backend serves data at /api/data
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <h1>Data from API</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item.name}</li>
          // Assuming your API returns an array of objects with a 'name' property
        ))}
      </ul>

      <Equipment></Equipment>

    </div>
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