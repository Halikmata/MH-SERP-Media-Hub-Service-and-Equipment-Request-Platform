import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Table } from 'react-bootstrap';

const Requests = ({ url }) => {
  const [requests, setRequest] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [formData, setFormData] = useState({
    organization: '',
    event: '',
    location: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    axios.get(`${url}/requests`)
      .then(response => {
        setRequest(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios.get(`${url}/equipment/available`)
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
      location: formData.location,
      start_date: formData.start_date,
      end_date: formData.end_date,
      equipment: selectedEquipment
    };

    axios.post(`${url}/requests/add`, requestData)
      .then(response => {
        console.log('Request created successfully:', response.data);
        setFormData({ organization: '', event: '', location: '', start_date: '', end_date: '' });
        setSelectedEquipment([]);
      })
      .catch(error => {
        console.error('Error creating request:', error);
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4" style={{ color: '#FF5733' }}>Request Details</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="organization">
          <Form.Label>Organization</Form.Label>
          <Form.Control type="text" name="organization" value={formData.organization} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="event">
          <Form.Label>Event</Form.Label>
          <Form.Control type="text" name="event" value={formData.event} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="location">
          <Form.Label>Location</Form.Label>
          <Form.Control type="text" name="location" value={formData.location} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="start_date">
          <Form.Label>Start Date</Form.Label>
          <Form.Control type="date" name="start_date" value={formData.start_date} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="end_date">
          <Form.Label>End Date</Form.Label>
          <Form.Control type="date" name="end_date" value={formData.end_date} onChange={handleChange} required />
        </Form.Group>
        <h2 className="mt-4 mb-3" style={{ color: '#FF5733' }}>Equipment List</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Type</th>
              <th>Request</th>
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
                  <Form.Check
                    type="checkbox"
                    id={item.idequipment}
                    value={item.idequipment}
                    label=""
                    onChange={handleCheckboxChange}
                    checked={selectedEquipment.includes(item.idequipment)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button variant="primary" type="submit" className="custom-submit-btn">Submit</Button>
      </Form>
    </div>
  );
};

export default Requests;
