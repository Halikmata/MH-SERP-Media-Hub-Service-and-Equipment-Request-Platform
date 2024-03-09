import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Services = () => {
  const [services, setServices] = useState([]);

  var fake_api = 'http://127.0.0.1:3001/services'
  var backend_api = 'http://127.0.0.1:5000/services'

  useEffect(() => {
    axios.get(backend_api)
      .then(response => {
        setServices(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h2>Service List</h2>
      <ul>
        {services.map(item => (
          <li>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Services;
