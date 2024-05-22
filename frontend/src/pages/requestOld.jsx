import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Accordion, Table, Dropdown, Container, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useCookies } from 'react-cookie';

const RequestPage = ({ url }) => {
  const [cookies] = useCookies(['presence']);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [services, setServices] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectAll, setSelectAll] = useState(true);

  const [formData, setFormData] = useState({
    organization: '',
    event: '',
    location: '',
    details: '',
    start_date: null,
    end_date: null
  });

  useEffect(() => {
    axios.get(`${url}/equipment_type`)
      .then(response => {
        setEquipmentTypes(response.data);
        setSelectedTypes(response.data.map(type => type.fk_idequipment_type));
      })
      .catch(error => {
        console.error(error);
      });
  }, [url]);

  useEffect(() => {
    axios.get(`${url}/equipment/available`)
      .then(response => {
        setEquipment(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [url]);

  useEffect(() => {
    axios.get(`${url}/services`)
      .then(response => {
        setServices(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [url]);

  const userDataString = sessionStorage.getItem('userData');
  let requester_full_name = '';

  if (!userDataString) {
    navigate('/login?from=request');
  } else {
    const userData = JSON.parse(userDataString);
    const { first_name, middle_name, last_name } = userData;
    requester_full_name = `${first_name} ${middle_name ? middle_name.charAt(0) + ' ' : ''}${last_name}`;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedEquipment(prevSelected => checked ? [...prevSelected, value] : prevSelected.filter(item => item !== value));
  };

  const handleServiceChange = (e) => {
    const { value, checked } = e.target;
    setSelectedServices(prevSelected => checked ? [...prevSelected, value] : prevSelected.filter(item => item !== value));
  };

  const handleFilterChange = (e) => {
    const { value, checked } = e.target;
    setSelectedTypes(prevSelectedTypes => checked ? [...prevSelectedTypes, value] : prevSelectedTypes.filter(type => type !== value));
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTypes([]);
    } else {
      setSelectedTypes(equipmentTypes.map(type => type.fk_idequipment_type));
    }
    setSelectAll(!selectAll);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = JSON.parse(userDataString);
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
        setFormData({ organization: '', event: '', location: '', start_date: null, end_date: null });
        setSelectedEquipment([]);
      })
      .catch(error => {
        console.error('Error creating request:', error);
      });

    navigate('/myrequests');
  };

  const groupEquipmentByType = (equipment) => {
    return equipment.reduce((acc, eq) => {
      const type = eq.equipment_type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(eq);
      return acc;
    }, {});
  };

  const groupedEquipment = groupEquipmentByType(equipment);

  return (
    <Container className="mt-5">
      <Link className='btn btn-primary mb-3' to="/myrequests">View My Requests</Link>
      <h2 className="mb-4" style={{ color: '#FF5733' }}>Request Details</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
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

            <Form.Group className="mb-3" controlId="details">
              <Form.Label>Details</Form.Label>
              <Form.Control type="text" name="details" value={formData.details} onChange={handleChange} placeholder='(optional)' />
            </Form.Group>

            <Form.Group className="mb-3" controlId="start_date">
              <Form.Label>Start Date</Form.Label>
              <DatePicker selected={formData.start_date} onChange={date => setFormData({ ...formData, start_date: date })} dateFormat="dd/MM/yyyy" className="form-control" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="end_date">
              <Form.Label>End Date</Form.Label>
              <DatePicker selected={formData.end_date} onChange={date => setFormData({ ...formData, end_date: date })} dateFormat="dd/MM/yyyy" className="form-control" />
            </Form.Group>
          </Col>
        </Row>

        <h2 className="mt-4 mb-3" style={{ color: '#FF5733' }}>Equipment List</h2>
        <Row className="mb-3">
          <Col>
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                Filter by Equipment Type
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Form.Check
                  type="checkbox"
                  id="select-all"
                  label="Select All"
                  onChange={handleSelectAll}
                  checked={selectAll}
                />
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
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>

        <Accordion defaultActiveKey="0">
          {equipmentTypes.map((type, idx) => (
            selectedTypes.includes(type.fk_idequipment_type) && (
              <Accordion.Item eventKey={idx.toString()} key={type.fk_idequipment_type}>
                <Accordion.Header>{type.name}</Accordion.Header>
                <Accordion.Body>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Brand</th>
                        <th>Model</th>
                        <th>Add</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedEquipment[type.fk_idequipment_type]?.map(item => (
                        <tr key={item.idequipment}>
                          <td>{item.idequipment}</td>
                          <td>{item.brand}</td>
                          <td>{item.model}</td>
                          <td>
                            <Form.Check
                              type="checkbox"
                              id={item.idequipment}
                              value={item.idequipment}
                              onChange={handleCheckboxChange}
                              checked={selectedEquipment.includes(item.idequipment)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Accordion.Body>
              </Accordion.Item>
            )
          ))}
        </Accordion>

        <h2 className="mt-4 mb-3" style={{ color: '#FF5733' }}>Service List</h2>
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
          <Button variant="primary" type="submit" className="custom-submit-btn" style={{ backgroundColor: '#FF5733', borderColor: '#FF5733' }}>Submit</Button>
        </div>
      </Form>
    </Container>
  );
};

export default RequestPage;
