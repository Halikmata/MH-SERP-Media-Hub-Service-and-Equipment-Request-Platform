import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Table, Dropdown } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useCookies } from 'react-cookie';
import NotLoggedIn from '../includes/notLoggedIn';


const RequestPage = ({ url }) => {
  const [cookies] = useCookies(['presence']);
  const [requests, setRequest] = useState([]);
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [formData, setFormData] = useState({
    organization: '',
    event: '',
    location: '',
    start_date: null,
    end_date: null
  });

  const userDataString = sessionStorage.getItem('userData');
  const userData = JSON.parse(userDataString);

  const { first_name, middle_name, last_name } = userData;

  let requester_full_name = first_name;
  if (middle_name) {
    requester_full_name += ' ' + middle_name.charAt(0);
  }
  requester_full_name += ' ' + last_name;


  useEffect(() => {

    axios.get(`${url}/requests`, {
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
      event_name: formData.event,
      event_location: formData.location,
      event_start: formData.start_date,
      event_end: formData.end_date,
      requester_full_name: requester_full_name,
      requester_email: userData.email,
      requester_phone_number: userData.phone_number,
      requester_status: userData.status,
      equipment: selectedEquipment,

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
      navigate('/myrequests');
  };

  return (
    <div className="container mt-5">
      <NotLoggedIn>Log in to make request</NotLoggedIn><br />
      <Link className='btn btn-primary' to="/myrequests">View My Requests</Link>
      <h2 className="mb-4" style={{ color: '#FF5733' }}>Request Details</h2>
      <Form onSubmit={handleSubmit}>
        <div className='w-50'>
          <Form.Group className="mb-3" controlId="organization">
            <Form.Label>Organizer/Contact Org</Form.Label>
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
            <br />
            <DatePicker selected={formData.start_date} onChange={date => setFormData({ ...formData, start_date: date })} dateFormat="dd/MM/yyyy" className="form-control" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="end_date">
            <Form.Label>End Date</Form.Label>
            <br />
            <DatePicker selected={formData.end_date} onChange={date => setFormData({ ...formData, end_date: date })} dateFormat="dd/MM/yyyy" className="form-control" />
          </Form.Group>
        </div>

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
        <div className="text-center">
          <Button variant="primary" type="submit" className="custom-submit-btn" style={{ backgroundColor: '#FF5733', borderColor: '#FF5733' }}>Submit</Button>
        </div>
        <br /><br />
      </Form>
    </div>
  );
};

export default RequestPage;
