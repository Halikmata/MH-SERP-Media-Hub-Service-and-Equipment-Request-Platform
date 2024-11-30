import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook } from 'react-icons/fa';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <Container>
        <Row>
          <Col className="text-center py-3">
            <p className="mb-0">&copy; 2024 Media Hub | All Rights Reserved</p>
            <a href="https://www.facebook.com/psupalawan1965" target="_blank" rel="noopener noreferrer">
              Palawan State University
            </a>
            <div className="social-icons mt-3">
              {/* Facebook Redirect Icon */}
              <a href="https://www.facebook.com/mediahub2023" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaFacebook size={30} color="#3b5998" />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
