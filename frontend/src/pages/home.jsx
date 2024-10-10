import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './Home.css'; // Optional: External stylesheet for additional customization

const Home = () => {
  const newsData = [
    {
      id: 1,
      title: "New Feature Added!",
      description: "We've added a new feature that allows users to request equipment more easily.",
      date: "April 19, 2024"
    },
    {
      id: 2,
      title: "Service Maintenance",
      description: "Scheduled maintenance will be performed on our servers on April 25, 2024. Expect some downtime during this period.",
      date: "April 18, 2024"
    },
    {
      id: 3,
      title: "Service Outage Resolved",
      description: "The recent service outage has been resolved. All services are now operating normally.",
      date: "April 16, 2024"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section" style={heroSectionStyle}>
        <Container className="text-center text-white d-flex align-items-center justify-content-center">
          <div>
            <h1 className="display-4 fw-bold">Welcome to Media Hub</h1>
            <p className="lead">Your one-stop platform for equipment and service requests at Palawan State University</p>
            <Button variant="primary" className="mt-3 px-4 py-2" size="lg">
              Get Started
            </Button>
          </div>
        </Container>
      </section>

      {/* What's New Section */}
      <section className="news-section py-5">
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} md={10}>
              <h2 className="text-center mb-5" style={{ color: '#333' }}>What's New?</h2>
              <Row>
                {newsData.map(newsItem => (
                  <Col key={newsItem.id} md={4} className="mb-4">
                    <Card className="news-card shadow-sm h-100">
                      <Card.Body>
                        <Card.Title className="news-title">{newsItem.title}</Card.Title>
                        <Card.Text>{newsItem.description}</Card.Text>
                        <Card.Text><small className="text-muted">{newsItem.date}</small></Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Platform Info Section */}
      <section className="info-section py-5 bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} md={10} className="text-center">
              <h2 className="mb-4">Why Choose Media Hub?</h2>
              <p className="lead">Media Hub offers a user-friendly platform to help students and faculty request equipment and services for projects and events. Our platform ensures an easy request process, seamless tracking, and wide equipment availability to support academic and extracurricular needs.</p>
              <p>Need assistance? Reach out to our support team, and we'll be happy to help!</p>
              <Button variant="outline-primary" className="mt-3 px-4 py-2" size="lg">
                Learn More
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

// Inline styles for hero section
const heroSectionStyle = {
  backgroundImage: 'url(/bg.jpg)',  // Make sure the bg.jpg is in your public folder
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh',
  color: 'white'
};

export default Home;
