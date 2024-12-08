import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination, Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaRegCheckCircle, FaRegStar, FaRegUser } from 'react-icons/fa'; // Import icons
import './home.css';
import Footer from '../includes/footer.jsx';

const Home = ({ url }) => {

  // related for whats_new
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [newsData, setNewsData] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState({});
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = newsData.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = pageNumber => setCurrentPage(pageNumber);
  
  useEffect(() => {
    axios.get(`${url}/whats_new`, { params: { column: "date", sort: 1 } })
      .then(response => setNewsData(response.data))
      .catch(error => console.error(error));
  }, [url]);

  const toggleDescription = (id) => {
    setShowFullDescription(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  // related for whats_new -- end
  
  const featureData = [
    {
      id: 1,
      icon: <FaRegCheckCircle size={40} />,
      title: "Easy Requests",
      description: "Request equipment and services with just a few clicks.",
    },
    {
      id: 2,
      icon: <FaRegStar size={40} />,
      title: "High Quality",
      description: "Our platform ensures only the best equipment and services for you.",
    },
    {
      id: 3,
      icon: <FaRegUser size={40} />,
      title: "User Friendly",
      description: "A simple and intuitive interface for everyone to use.",
    },
  ];

  const scrollToContent = () => {
    const content = document.getElementById("content");
    if (content) {
      content.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <Container className="text-center text-white d-flex align-items-center justify-content-center">
          <div className="hero-content">
            <h1 className="display-4 fw-bold animate__animated animate__fadeIn">Welcome to Media Hub</h1>
            <p className="lead animate__animated animate__fadeIn animate__delay-1s">
              Your one-stop platform for equipment and service requests at Palawan State University.
            </p>
            <Button
              variant="custom"
              className="mt-3 px-4 py-2 animate__animated animate__fadeIn animate__delay-2s"
              size="lg"
              onClick={scrollToContent}
            >
              Get Started
            </Button>
          </div>
        </Container>
      </section>

      {/* What's New Section */}
      <section id="content" className="news-section py-5">
        <Container>
          <Row>
            <Col xs={12}>
              <h2 className="text-center mb-5">What's New?</h2>
            </Col>
          </Row>
          <Row>
            {currentItems.map((newsItem) => (
              <Col key={newsItem._id} sm={12} md={6} lg={4} className="mb-4">
                <Card className="news-card shadow-lg h-100 animate__animated animate__fadeIn animate__delay-1s">
                  <Card.Body>
                    <Card.Title>{newsItem.title}</Card.Title>

                    <Card.Text>
                      {showFullDescription[newsItem.details] ? newsItem.details :` ${newsItem.details.substring(0, 50)}...`}
                      {newsItem.details.length > 50 ? (
                        <span
                        className="description-toggle"
                        onClick={() => toggleDescription(newsItem.details)}
                        >
                          {showFullDescription[newsItem.details] ? ' Show Less' : ' See More'}
                        </span>

                      ) : null }

                    </Card.Text>

                    <Card.Text>
                      <small className="text-muted">{newsItem.date}</small>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <Pagination className="justify-content-center mt-4 pagination-container">
            <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>&larr;</Pagination.Prev>
            {Array.from({ length: Math.ceil(newsData.length / itemsPerPage) }, (_, i) => (
              <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(newsData.length / itemsPerPage)}>&rarr;</Pagination.Next>
          </Pagination>
          
        </Container>

        
      </section>

      {/* Features Section */}
      <section className="features-section py-5 bg-light">
        <Container>
          <Row>
            <Col xs={12}>
              <h2 className="text-center mb-5">Our Features</h2>
            </Col>
          </Row>
          <Row>
            {featureData.map((feature) => (
              <Col key={feature.id} sm={12} md={4} className="mb-4">
                <Card className="feature-card shadow-lg text-center p-4">
                  <Card.Body>
                    <div className="feature-icon mb-3">{feature.icon}</div>
                    <Card.Title>{feature.title}</Card.Title>
                    <Card.Text>{feature.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section py-5">
        <Container>
          <Row>
            <Col xs={12}>
              <h2 className="text-center mb-5">What Our Users Say</h2>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={6} lg={4} className="mb-4">
              <Card className="testimonial-card shadow-lg p-4 text-center">
                <Card.Body>
                  <blockquote className="blockquote">
                    <p>"Media Hub has made it incredibly easy for our department to request the equipment we need for our evnets."</p>
                  </blockquote>
                  <footer className="blockquote-footer">Elsid</footer>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} md={6} lg={4} className="mb-4">
              <Card className="testimonial-card shadow-lg p-4 text-center">
                <Card.Body>
                  <blockquote className="blockquote">
                    <p>"The user interface is so easy to navigate, and I love the easy request process!"</p>
                  </blockquote>
                  <footer className="blockquote-footer">Emman</footer>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} md={6} lg={4} className="mb-4">
              <Card className="testimonial-card shadow-lg p-4 text-center">
                <Card.Body>
                  <blockquote className="blockquote">
                    <p>"Thanks to the quick and efficient equipment booking process!"</p>
                  </blockquote>
                  <footer className="blockquote-footer">Vince</footer>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

    </div>
  );
};

export default Home;
