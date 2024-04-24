import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Table, Dropdown } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useCookies } from 'react-cookie';

const Requests = ({ url }) => {
  const [cookies] = useCookies(['presence']);
  const [requests, setRequest] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [formData, setFormData] = useState({
    organization: '',
    event: '',
    location: '',
    start_date: null,
    end_date: null,
  });

  
  useEffect(() => {
    
    axios.get(`${url}/requests`,{
      headers: {
        'Authorization': 'Bearer ' + cookies.presence
      }
    })
      .then(response => {
        setRequest(response.data);
      })
      .catch(error => {
        if (error.response) {
           // The request was made and the server responded with a status code
           // that falls out of the range of 2xx
           console.error(error.response.data);
           console.error(error.response.status);
           console.error(error.response.headers);
        } else if (error.request) {
           // The request was made but no response was received
           console.error(error.request);
        } else {
           // Something happened in setting up the request that triggered an Error
           console.error('Error', error.message);
        }
        console.error(error.config);
       });


       // if token invalid or not exists (session)
       // redirect back to log in
       //
       
  }, []);

  useEffect(() => {
    axios.get(`${url}/equipment_type`)
      .then(response => {
        setEquipmentTypes(response.data);
        setSelectedTypes(response.data.map(type => type.fk_idequipment_type));
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

  const handleFilterChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedTypes((prevSelectedTypes) => [...prevSelectedTypes, value]);
    } else {
      setSelectedTypes((prevSelectedTypes) =>
        prevSelectedTypes.filter((type) => type !== value)
      );
    }
  }

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
        setFormData({ organization: '', event: '', location: '', start_date: null, end_date: null });
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

        {/* Organization */}
        <Form.Group className="mb-3" controlId="organization">
          <Form.Label>Organization</Form.Label>
          <Form.Control type="text" name="organization" value={formData.organization} onChange={handleChange} required />
        </Form.Group>

        {/* Event */}
        <Form.Group className="mb-3" controlId="event">
          <Form.Label>Event</Form.Label>
          <Form.Control type="text" name="event" value={formData.event} onChange={handleChange} required />
        </Form.Group>

        {/* Location */}
        <Form.Group className="mb-3" controlId="location">
          <Form.Label>Location</Form.Label>
          <Form.Control type="text" name="location" value={formData.location} onChange={handleChange} required />
        </Form.Group>

        {/* Start Date */}
        <Form.Group className="mb-3" controlId="start_date">
          <Form.Label>Start Date</Form.Label>
          <br />
          <DatePicker selected={formData.start_date} onChange={date => setFormData({ ...formData, start_date: date })} dateFormat="dd/MM/yyyy" className="form-control" />
        </Form.Group>

        {/* End Date */}
        <Form.Group className="mb-3" controlId="end_date">
          <Form.Label>End Date</Form.Label>
          <br />
          <DatePicker selected={formData.end_date} onChange={date => setFormData({ ...formData, end_date: date })} dateFormat="dd/MM/yyyy" className="form-control" />
        </Form.Group>

        <h2 className="mt-4 mb-3" style={{ color: '#FF5733' }}>Equipment List</h2>
        <br />
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            Select Equipment Types
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Form>
              {equipmentTypes.map((type) => (
                <Form.Check
                  key={type.fk_idequipment_type}
                  type="checkbox"
                  id={type.fk_idequipment_type}
                  label={type.name}
                  value={type.fk_idequipment_type}
                  onChange={handleFilterChange}
                  checked={selectedTypes.includes(type.fk_idequipment_type)}
                />
              ))}
            </Form>
          </Dropdown.Menu>
        </Dropdown>
        <br />
        <div className="table-responsive">
          <Table striped bordered hover style={{ maxWidth: '800px', margin: 'auto' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Type</th>
                <th>Add</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map(item => {
                if (selectedTypes.includes(item.equipment_type)) {
                  const typeName = equipmentTypes.find(type => type.fk_idequipment_type === item.equipment_type)?.name;
                  return (
                    <tr key={item._id}>
                      <td>{item.idequipment}</td>
                      <td>{item.brand}</td>
                      <td>{item.model}</td>
                      <td>{typeName}</td>
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
                  );
                } else {
                  return null;
                }
              })}
            </tbody>
          </Table>
        </div>
        <br />
        {/* Submit Button */}
        <div className="text-center">
          <Button variant="primary" type="submit" className="custom-submit-btn" style={{ backgroundColor: '#FF5733', borderColor: '#FF5733' }}>Submit</Button>
        </div>
        <br /><br />
      </Form>
    </div>
  );
};

export default Requests;
