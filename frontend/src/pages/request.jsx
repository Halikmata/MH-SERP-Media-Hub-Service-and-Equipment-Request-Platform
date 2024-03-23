import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './request.css';


const Requests = () => {
  const [requests, setRequest] = useState([]);
  const [equipment, setEquipment] = useState([]);

  var fake_url = 'http://127.0.0.1:3001'
  var backend_url = 'http://127.0.0.1:5000'

  var url = fake_url

  useEffect(() => {
    axios.get(url + '/requests')
      .then(response => {
        setRequest(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

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
      <h2>Requests List</h2>
      <table>
        <thead>
          <tr>
            <th>Event</th>
            <th>Requester</th>
            <th>Event Affiliation</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            <th>Equipment</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(item => (
            <tr key={item.id} rowspan={item.equipment.count}>
              <td>{item.event_name}</td>
              <td>{item.requester_affiliation}</td>
              <td>{item.event_affiliation}</td>
              <td>{item.request_start}</td>
              <td>{item.request_end}</td>
              <td>{item.request_status}</td>
              <td>{item.equipment}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br /><br />
      <h2>Equipment List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Brand</th>
            <th>Model</th>
            <th>Type</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {equipment.reduce((acc, item) => {
            const existingItem = acc.find(e => e.brand === item.brand && e.model === item.model);
            if (existingItem) {
              existingItem.quantity += 1;
            } else {
              const newItem = { ...item, quantity: 1 };
              acc.push(newItem);
            }
            return acc;
          }, []).map(item => (
            <tr key={item.id}>
              <td>{item.idequipment}</td>
              <td>{item.brand}</td>
              <td>{item.model}</td>
              <td>{item.equipment_type}</td>
              <td>
                max:{item.quantity} |
                <input type="number"
                  min = '0'
                  max = {item.quantity}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button>NEXT</button>
    </div>
  );
};

export default Requests;
