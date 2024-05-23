import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Home = () => {
  const newsData = [
    {
      id: 1,
      title: "New feature added!",
      description: "We've added a new feature that allows users to request equipment more easily.",
      date: "April 19, 2024"
    },
    {
      id: 2,
      title: "Service maintenance",
      description: "Scheduled maintenance will be performed on our servers on April 25, 2024. Expect some downtime during this period.",
      date: "April 18, 2024"
    },
    {
      id: 3,
      title: "Service outage resolved",
      description: "The recent service outage has been resolved. All services are now operating normally.",
      date: "April 16, 2024"
    }
  ];

  return (
    <div
      style={{
        backgroundImage: `url(/bg.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <Container className="mt-0">
        <Row className="justify-content-center">
          <Col xs={12} md={8}>
            <h2 className="text-center mb-4" style={{ color: '#FF5733' }}>What's New?</h2>
            <Row>
              {newsData.map(newsItem => (
                <Col key={newsItem.id} md={4} className="mb-4">
                  <Card style={{ backgroundColor: '#FCEADE' }}>
                    <Card.Body>
                      <Card.Title>{newsItem.title}</Card.Title>
                      <Card.Text>{newsItem.description}</Card.Text>
                      <Card.Text><small className="text-muted">{newsItem.date}</small></Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
        <Row className="mt-5 justify-content-center">
          <Col xs={12} md={8}>
            <div className="text-center">
              <h2>Media Hub's Services and Equipments Request Platform</h2>
              <p>Welcome to Media Hub's Services and Equipments Request Platform. This platform is designed to facilitate the request of services and equipment by students and faculty of Palawan State University. Whether you need equipment for your project or services for an event, you can easily make requests through this platform.</p>
              <p>Our platform offers a user-friendly interface, allowing you to browse available equipment, submit requests, and track the status of your requests. With a wide range of equipment and services available, you can find everything you need to support your academic and extracurricular activities.</p>
              <p>Have a question or need assistance? Our support team is here to help. Feel free to reach out to us if you have any inquiries or encounter any issues while using the platform.</p>
              <p>Thank you for choosing Media Hub's Services and Equipments Request Platform. We look forward to serving you!</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
