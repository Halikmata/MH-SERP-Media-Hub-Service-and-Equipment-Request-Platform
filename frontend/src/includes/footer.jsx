import React, { useState } from 'react';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './footer.css';

const Footer = () => {
  // State for modal visibility
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showUserAgreementModal, setShowUserAgreementModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Modal toggle handlers
  const handlePrivacyPolicyClick = () => setShowPrivacyModal(true);
  const handleClosePrivacyPolicy = () => setShowPrivacyModal(false);

  const handleUserAgreementClick = () => setShowUserAgreementModal(true);
  const handleCloseUserAgreement = () => setShowUserAgreementModal(false);

  const handleTermsClick = () => setShowTermsModal(true);
  const handleCloseTerms = () => setShowTermsModal(false);

  return (
    <footer className="footer">
      <Container>
        <Row className="justify-content-between align-items-center">
          {/* Left Side: Logo or Brand Name */}
          <Col xs={12} sm={6} md={4} className="footer-logo">
            <span className="logo-text">MH-SERP</span>
          </Col>

          {/* Middle: Footer Links */}
          <Col xs={12} sm={6} md={4} className="footer-links">
            <ul>
              <li onClick={handlePrivacyPolicyClick}>Privacy Policy</li>
              <li onClick={handleUserAgreementClick}>User Agreement</li>
              <li onClick={handleTermsClick}>Terms & Conditions</li>
            </ul>
          </Col>

          {/* Right Side: Social Media Icons */}
          <Col xs={12} sm={12} md={4} className="footer-social">
            <a href="https://www.facebook.com/mediahub2023" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
          </Col>
        </Row>
      </Container>

      {/* Privacy Policy Modal */}
      <Modal show={showPrivacyModal} onHide={handleClosePrivacyPolicy}>
        <Modal.Header closeButton>
          <Modal.Title>Privacy Policy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Effective Date: [Current Date]</h5>
          <p>
            <strong>Media Hub Service and Equipment Request Platform (MH-SERP)</strong> is committed to protecting your privacy. This Privacy Policy outlines the data collection, usage, and security practices for users of our platform.
          </p>

          <h6>1. Information We Collect</h6>
          <ul>
            <li>
              <strong>Personal Information:</strong> When you register, we may collect your name, email, contact number, college/department affiliation, and role (e.g., student, volunteer).
            </li>
            <li>
              <strong>Usage Information:</strong> We track interactions within the platform, such as equipment requests, event scheduling, and platform preferences.
            </li>
            <li>
              <strong>Device and Access Information:</strong> We collect technical information like device type, IP address, and login timestamps for security purposes.
            </li>
          </ul>

          <h6>2. How We Use Your Information</h6>
          <ul>
            <li>To process equipment and service requests.</li>
            <li>To notify you about scheduling and confirmation details for events.</li>
            <li>To manage volunteer assignments and availability.</li>
            <li>To improve the functionality, efficiency, and security of MH-SERP.</li>
          </ul>

          <h6>3. Data Sharing and Disclosure</h6>
          <ul>
            <li>With University Library Staff for request approvals and inventory management.</li>
            <li>With Media Hub Volunteers for event scheduling and equipment coordination.</li>
            <li>To fulfill legal obligations if required by law or court order.</li>
          </ul>

          <h6>4. Data Security</h6>
          <p>We implement technical and administrative measures to protect your information, such as encrypted data storage and secure login protocols.</p>

          <h6>5. Data Retention</h6>
          <p>We retain personal information for as long as necessary to support MH-SERP’s functionality and for auditing purposes.</p>

          <h6>6. Your Rights</h6>
          <p>You may access, update, or delete your personal information at any time by contacting support. Additionally, you may opt out of non-essential notifications in your account settings.</p>

          <h6>7. Contact Us</h6>
          <p>
            For questions regarding this Privacy Policy, contact us at <a href="mailto:mediahub@psu.palawan.edu.ph">mediahub@psu.palawan.edu.ph</a>.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePrivacyPolicy}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* User Agreement Modal */}
      <Modal show={showUserAgreementModal} onHide={handleCloseUserAgreement}>
        <Modal.Header closeButton>
          <Modal.Title>User Agreement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Effective Date: [Current Date]</h5>
          <p>
            This User Agreement governs the terms under which you may access and use MH-SERP. By registering and using our platform, you agree to the following terms.
          </p>

          <h6>1. Use of the Platform</h6>
          <ul>
            <li>Only students, faculty, and staff of Palawan State University may use MH-SERP.</li>
            <li>The platform is solely for requesting equipment and service support from Media Hub.</li>
            <li>Users must provide accurate and up-to-date information.</li>
            <li>Users with unresolved incident reports are restricted from making requests.</li>
          </ul>

          <h6>2. User Responsibilities</h6>
          <ul>
            <li>Users must not misuse or abuse MH-SERP for purposes outside of its intended function.</li>
            <li>Users are responsible for the proper use of borrowed equipment and are liable for damage or loss.</li>
            <li>Requests must respect scheduling deadlines and allow a five-day lead time for event planning.</li>
          </ul>

          <h6>3. Liability and Disclaimers</h6>
          <p>MH-SERP is not liable for missed schedules, equipment unavailability, or damages resulting from misuse.</p>

          <h6>4. Account Security</h6>
          <p>Users are responsible for the confidentiality of their accounts.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUserAgreement}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Terms & Conditions Modal */}
      <Modal show={showTermsModal} onHide={handleCloseTerms}>
        <Modal.Header closeButton>
          <Modal.Title>Terms & Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Effective Date: [Current Date]</h5>
          <p>These Terms and Conditions apply to all users of MH-SERP.</p>

          <h6>1. Definitions</h6>
          <ul>
            <li><strong>"User":</strong> Students, faculty, or staff using the platform.</li>
            <li><strong>"MH-SERP":</strong> Media Hub Service and Equipment Request Platform.</li>
          </ul>

          <h6>2. Request Procedures</h6>
          <ul>
            <li>Requests must be submitted digitally and at least five days before events.</li>
            <li>Requests are reviewed and approved by the University Librarian's office.</li>
          </ul>

          <h6>3. Amendments</h6>
          <p>Changes to the Terms will be communicated, and continued use indicates acceptance.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseTerms}>Close</Button>
        </Modal.Footer>
      </Modal>
    </footer>
  );
};

export default Footer;
