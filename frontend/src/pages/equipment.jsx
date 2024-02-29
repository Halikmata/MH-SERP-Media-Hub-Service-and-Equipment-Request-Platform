import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Equipment = () => {
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/equipment')
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
            <th>Description</th>
            <th>Type</th>
            <th>Location</th>
            <th>Unit Cost</th>
          </tr>
        </thead>
        <tbody>
          {equipment.map(item => (
            <tr key={item.id}>
              <td>{item.idequipment}</td>
              <td>{item.brand}</td>
              <td>{item.model}</td>
              <td>{item.description}</td>
              <td>{item.equipment_type}</td>
              <td>{item.equipment_location}</td>
              <td>{item.unit_cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Equipment;
