import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CreateRequest = ({ url }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    organization: '',
    event: '',
    location: '',
    details: '',
    start_date: null,
    end_date: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    navigate('/select_equipment', { state: { formData } });
  };

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
                <DatePicker selected={formData.start_date} onChange={date => setFormData({ ...formData, start_date: date })} dateFormat="dd/MM/yyyy" className="form-control" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="end_date">
                <Form.Label>End Date</Form.Label>
                <DatePicker selected={formData.end_date} onChange={date => setFormData({ ...formData, end_date: date })} dateFormat="dd/MM/yyyy" className="form-control" />
              </Form.Group>
            </Col>
          </Row>
          <div className="text-center">
            <Button variant="primary" onClick={handleNext} style={{ backgroundColor: '#FF5733', borderColor: '#FF5733', borderRadius: '30px' }}>Next</Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateRequest;
