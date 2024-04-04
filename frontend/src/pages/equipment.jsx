import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './request.css';

const Equipment = ({url}) => {
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    axios.get(url + '/equipment')
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
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map(item => (
              <tr key={item._id}>
                <td>{item.idequipment}</td>
                <td>{item.brand}</td>
                <td>{item.model}</td>
                <td>{item.equipment_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
};

export default Equipment;
