import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Equipment = () => {
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/equipment')
      .then(response => {
        setEquipment(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h2>Equipment List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Brand</th>
            <th>Model</th>
          </tr>
        </thead>
        <tbody>
          {equipment.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.brand}</td>
              <td>{item.model}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Equipment;
