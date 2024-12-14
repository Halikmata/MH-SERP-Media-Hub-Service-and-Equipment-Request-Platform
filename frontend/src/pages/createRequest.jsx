import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SESSION_KEY = 'createRequestFormData';
const SESSION_TIMESTAMP_KEY = 'createRequestFormTimestamp';
const EXPIRATION_HOURS = 8; // Expire session storage after 8 hours

const CreateRequest = ({ url }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { equipment, service } = location.state || {}; // Get the equipment or service data from the state

  // Initialize form data from session storage or default values
  const [formData, setFormData] = useState(() => {
    const savedData = sessionStorage.getItem(SESSION_KEY);
    const savedTimestamp = sessionStorage.getItem(SESSION_TIMESTAMP_KEY);
    if (savedData && savedTimestamp) {
      const timeElapsed = (Date.now() - parseInt(savedTimestamp, 10)) / (1000 * 60 * 60); // Time in hours
      if (timeElapsed < EXPIRATION_HOURS) {
        return JSON.parse(savedData);
      }
    }
    return {
      organization: '',
      event: '',
      location: '',
      details: '',
      start_date: null,
      end_date: null
    };
  });

  useEffect(() => {
    // Save form data and timestamp to session storage whenever it changes
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(formData));
    sessionStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    // Reset session storage on submission
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_TIMESTAMP_KEY);
    navigate('/select_equipment', { state: { formData } });
  };

  const handleBack = () => {
    navigate('/myrequests'); // Navigate back to the Requests page
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 5);

  return (
    <Container className="mt-5">
      <h2 className="mb-4" style={{ color: '#FF5733' }}>Request Details</h2>
      <Card className="mb-4">
        <Card.Body>
          <h4 className="mb-3">Event Details</h4>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="organization">
                <Form.Label>Organizer/Contact Org</Form.Label>
                <Form.Control type="text" name="organization" value={formData.organization} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="event">
                <Form.Label>Event Name</Form.Label>
                <Form.Control type="text" name="event" value={formData.event} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="location">
                <Form.Label>Location</Form.Label>
                <Form.Control type="text" name="location" value={formData.location} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="details">
                <Form.Label>Details</Form.Label>
                <Form.Control as="textarea" rows={3} name="details" value={formData.details} onChange={handleChange} placeholder='(optional)' />
              </Form.Group>

              <Form.Group className="mb-3" controlId="start_date">
                <Form.Label>Start Date</Form.Label>
                <DatePicker selected={formData.start_date} onChange={date => setFormData({ ...formData, start_date: date })} dateFormat="dd/MM/yyyy" className="form-control" minDate={tomorrow} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="end_date">
                <Form.Label>End Date</Form.Label>
                <DatePicker selected={formData.end_date} onChange={date => setFormData({ ...formData, end_date: date })} dateFormat="dd/MM/yyyy" className="form-control" minDate={tomorrow} />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Row className="justify-content-center">
        <Col md={6} className="text-center">
          <Button variant="secondary" onClick={handleBack} style={{ backgroundColor: '#FF5733', borderColor: '#FF5733', marginRight: '10px', borderRadius: '30px' }}>Back</Button>
          <Button variant="primary" onClick={handleNext} style={{ backgroundColor: '#FF5733', borderColor: '#FF5733', borderRadius: '30px' }}>Next</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateRequest;
