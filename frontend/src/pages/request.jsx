import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './request.css';

const Requests = () => {
  const [requests, setRequest] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [formData, setFormData] = useState({
    organization: '',
    event: '',
  });

  const fakeUrl = 'http://127.0.0.1:3001';
  const backendUrl = 'http://127.0.0.1:5000';
  const url = backendUrl;

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
    axios.get(url + '/equipment/available')
      .then(response => {
        setEquipment(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedEquipment(prevSelected => [...prevSelected, value]);
    } else {
      setSelectedEquipment(prevSelected =>
        prevSelected.filter(item => item !== value)
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requestData = {
      organization: formData.organization,
      event: formData.event,
      equipment: selectedEquipment
    };

    axios.post(url + '/requests/add', requestData)
      .then(response => {
        console.log('Request created successfully:', response.data);
        setFormData({ organization: '', event: '' });
        setSelectedEquipment([]);
      })
      .catch(error => {
        console.error('Error creating request:', error);
      });
  };

  return (
    <div>
      <h2>Request Details</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="organization">Organization</label>
        <input type='text' name='organization' value={formData.organization} onChange={handleChange} /><br />
        <label htmlFor="event">Event</label>
        <input type='text' name='event' value={formData.event} onChange={handleChange} />
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
            {equipment.map(item => (
              <tr key={item._id}>
                <td>{item.idequipment}</td>
                <td>{item.brand}</td>
                <td>{item.model}</td>
                <td>{item.equipment_type}</td>
                <td>
                  <input
                    type="checkbox"
                    value={item.idequipment}
                    onChange={handleCheckboxChange}
                    checked={selectedEquipment.includes(item.idequipment)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="submit">NEXT</button>
      </form>
    </div>
  );
};

export default Requests;
