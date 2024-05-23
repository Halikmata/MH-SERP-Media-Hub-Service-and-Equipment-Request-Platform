import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Table, Container, Card } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

const SelectServices = ({ url }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, selectedEquipment } = location.state;
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    axios.get(`${url}/services`)
      .then(response => {
        setServices(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [url]);

  const handleServiceChange = (e) => {
    const { value, checked } = e.target;
    setSelectedServices(prevSelected => checked ? [...prevSelected, value] : prevSelected.filter(item => item !== value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userDataString = sessionStorage.getItem('userData');
    if (!userDataString) {
      navigate('/login?from=request');
      return;
    }

    const userData = JSON.parse(userDataString);
    const requester_full_name = `${userData.first_name} ${userData.middle_name ? userData.middle_name.charAt(0) + ' ' : ''}${userData.last_name}`;

    const requestData = {
      event_affiliation: formData.organization,
      event_name: formData.event,
      event_location: formData.location,
      event_details: formData.details,
      event_start: formData.start_date,
      event_end: formData.end_date,
      requester_full_name,
      requester_email: userData.email,
      requester_phone_number: userData.phone_number,
      requester_status: userData.status,
      request_status: 0,
      equipment: selectedEquipment,
      services: selectedServices
    };

    axios.post(`${url}/requests/add`, requestData)
      .then(response => {
        console.log('Request created successfully:', response.data);
        navigate('/myrequests');
      })
      .catch(error => {
        console.error('Error creating request:', error);
      });
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4" style={{ color: '#FF5733' }}>Select Services</h2>
      <Card className="mb-4">
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Add</th>
              </tr>
            </thead>
            <tbody>
              {services.map(item => (
                <tr key={item.fk_idservice}>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>
                    <Form.Check
                      type="checkbox"
                      id={item.fk_idservice}
                      value={item.fk_idservice}
                      onChange={handleServiceChange}
                      checked={selectedServices.includes(item.fk_idservice)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="text-center">
            <Button variant="primary" onClick={handleSubmit} style={{ backgroundColor: '#FF5733', borderColor: '#FF5733', borderRadius: '30px' }}>Submit</Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SelectServices;
