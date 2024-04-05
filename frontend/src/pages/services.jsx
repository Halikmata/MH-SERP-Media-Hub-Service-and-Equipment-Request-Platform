import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Services = ({url}) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios.get(url + '/services')
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
