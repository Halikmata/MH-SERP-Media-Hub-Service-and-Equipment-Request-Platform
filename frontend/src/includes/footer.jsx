import React, { useState } from 'react';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import { FaFacebook } from 'react-icons/fa';
import './footer.css';

const Footer = () => {
  // State for modal visibility
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showUserAgreementModal, setShowUserAgreementModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false); // New state for Terms and Conditions

  // Toggle the privacy policy modal
  const handlePrivacyPolicyClick = () => setShowPrivacyModal(true);
  const handleClosePrivacyPolicy = () => setShowPrivacyModal(false);

  // Toggle the user agreement modal
  const handleUserAgreementClick = () => setShowUserAgreementModal(true);
  const handleCloseUserAgreement = () => setShowUserAgreementModal(false);

  // Toggle the terms and conditions modal
  const handleTermsClick = () => setShowTermsModal(true);
  const handleCloseTerms = () => setShowTermsModal(false);

  return (
    <footer className="footer-section">
      <Container>
        <Row>
          <Col className="text-center py-3">
            {/* Legal Links at the top with separators */}
            <div className="footer-links mb-3">
              <a href="/privacy-policy" onClick={(e) => { e.preventDefault(); handlePrivacyPolicyClick(); }} rel="noopener noreferrer">
                Privacy Policy
              </a>
              <span className="separator"> | </span>
              <a href="/user-agreement" onClick={(e) => { e.preventDefault(); handleUserAgreementClick(); }} rel="noopener noreferrer">
                User Agreement
              </a>
              <span className="separator"> | </span>
              <a href="/terms-conditions" onClick={(e) => { e.preventDefault(); handleTermsClick(); }} rel="noopener noreferrer">
                Terms and Conditions
              </a>
            </div>

            <p className="mb-2">&copy; 2024 Media Hub | All Rights Reserved</p>
            <a href="https://www.facebook.com/psupalawan1965" target="_blank" rel="noopener noreferrer">
              Palawan State University
            </a>
            <div className="social-icons mt-3">
              <a href="https://www.facebook.com/mediahub2023" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaFacebook size={30} color="#3b5998" />
              </a>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Privacy Policy Modal */}
      <Modal show={showPrivacyModal} onHide={handleClosePrivacyPolicy} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Privacy Policy</Modal.Title>
        </Modal.Header>
        <Modal.Body className="privacy-policy-body">
          <h5>Effective Date: [Current Date]</h5>
          <p><strong>Media Hub Service and Equipment Request Platform (MH-SERP)</strong> is committed to protecting your privacy. This Privacy Policy outlines the data collection, usage, and security practices for users of our platform.</p>

          <h6>1. Information We Collect</h6>
          <ul>
            <li><strong>Personal Information:</strong> When you register, we may collect your name, email, contact number, college/department affiliation, and role (e.g., student, volunteer).</li>
            <li><strong>Usage Information:</strong> We track interactions within the platform, such as equipment requests, event scheduling, and platform preferences.</li>
            <li><strong>Device and Access Information:</strong> We collect technical information like device type, IP address, and login timestamps for security purposes.</li>
          </ul>

          <h6>2. How We Use Your Information</h6>
          <ul>
            <li>To process equipment and service requests.</li>
            <li>To notify you about scheduling and confirmation details for events.</li>
            <li>To manage volunteer assignments and availability.</li>
            <li>To improve the functionality, efficiency, and security of MH-SERP.</li>
          </ul>

          <h6>3. Data Sharing and Disclosure</h6>
          <p>Your information will only be shared:</p>
          <ul>
            <li>With the University Library Staff: For request approvals and inventory management.</li>
            <li>With Media Hub Volunteers: To coordinate event scheduling and equipment availability.</li>
            <li>To Fulfill Legal Obligations: If required by law or court order.</li>
          </ul>

          <h6>4. Data Security</h6>
          <p>We implement technical and administrative measures to protect your information, such as encrypted data storage and secure login protocols. While we strive to maintain data integrity, no system is completely secure.</p>

          <h6>5. Data Retention</h6>
          <p>We retain personal information for as long as necessary to support MH-SERP’s functionality and for auditing purposes, unless deletion is requested by you.</p>

          <h6>6. Your Rights</h6>
          <p>You may access, update, or delete your personal information at any time by contacting our support team. Additionally, you may opt out of non-essential notifications in your account settings.</p>

          <h6>7. Contact Us</h6>
          <p>If you have questions regarding this Privacy Policy, please contact us at <a href="mailto:mediahub@psu.palawan.edu.ph">mediahub@psu.palawan.edu.ph</a>.</p>
        </Modal.Body>
      </Modal>

      {/* User Agreement Modal */}
      <Modal show={showUserAgreementModal} onHide={handleCloseUserAgreement} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>User Agreement</Modal.Title>
        </Modal.Header>
        <Modal.Body className="user-agreement-body">
          <h5>Effective Date: [Current Date]</h5>
          <p>This User Agreement governs the terms under which you may access and use MH-SERP. By registering and using our platform, you agree to the following terms.</p>

          <h6>1. Use of the Platform</h6>
          <ul>
            <li><strong>Eligibility:</strong> Only students, faculty, and staff of Palawan State University (Palawan SU) may use MH-SERP.</li>
            <li><strong>Purpose:</strong> This platform is solely for requesting equipment and service support from Media Hub.</li>
            <li><strong>Accuracy of Information:</strong> Users must provide accurate and up-to-date information, including availability and equipment requests, to prevent conflicts.</li>
            <li><strong>Prohibition for Outstanding IRs:</strong> Users and organizations with unresolved Incident Reports (IRs) are prohibited from submitting requests until the issue is settled.</li>
          </ul>

          <h6>2. User Responsibilities</h6>
          <ul>
            <li><strong>Proper Usage:</strong> Users agree not to misuse or abuse MH-SERP for purposes outside of its intended function.</li>
            <li><strong>Equipment Care:</strong> Users are responsible for the proper use of borrowed equipment. In the event of damage or loss, users must either replace the equipment with an equivalent model or pay for its repair costs.</li>
            <li><strong>Scheduling and Requests:</strong> Users must respect scheduling deadlines and allow a minimum of five days' lead time for event planning.</li>
          </ul>

          <h6>3. Liability and Disclaimers</h6>
          <ul>
            <li><strong>No Guarantees:</strong> MH-SERP aims to streamline processes, but we cannot guarantee volunteer availability for every request.</li>
            <li><strong>Limitation of Liability:</strong> MH-SERP, the Media Hub, and Palawan SU shall not be held liable for missed schedules, equipment unavailability, or any damages resulting from usage or misuse of the platform.</li>
          </ul>

          <h6>4. Account Security</h6>
          <p>Users are responsible for maintaining the confidentiality of their account and password. Any suspicious activity should be reported immediately to Media Hub’s Office or contact us at <a href="mailto:mediahub@psu.palawan.edu.ph">mediahub@psu.palawan.edu.ph</a>.</p>
        </Modal.Body>
      </Modal>

      {/* Terms and Conditions Modal */}
      <Modal show={showTermsModal} onHide={handleCloseTerms} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Terms and Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body className="terms-body">
          <h5>Effective Date: [Current Date]</h5>
          <p>These Terms and Conditions apply to all users of MH-SERP. By accessing or registering on MH-SERP, you agree to comply with these terms.</p>

          <h6>1. Definitions</h6>
          <ul>
            <li><strong>"User"</strong> refers to students, faculty, or staff at Palawan SU using the MH-SERP platform.</li>
            <li><strong>"MH-SERP"</strong> refers to the Media Hub Service and Equipment Request Platform.</li>
          </ul>

          <h6>2. Request Procedures</h6>
          <ul>
            <li><strong>Request Process:</strong> Users must submit a digital request form, providing details such as event type, required equipment, and staff requirements.</li>
            <li><strong>Request Timing:</strong> Requests must be submitted a minimum of five days before the event.</li>
            <li><strong>Approval Process:</strong> The University Librarian's office reviews and approves requests.</li>
          </ul>

          <h6>3. Equipment and Availability</h6>
          <ul>
            <li><strong>Inventory:</strong> Users can view available equipment on MH-SERP; availability is subject to prior reservations and may change.</li>
            <li><strong>Loss or Damage:</strong> Users may be responsible for the replacement or repair costs if equipment is lost or damaged during an event.</li>
          </ul>

          <h6>4. Volunteer Coordination</h6>
          <ul>
            <li><strong>Scheduling:</strong> MH-SERP assigns volunteers based on their availability; users cannot directly request specific volunteers.</li>
            <li><strong>Conflict Management:</strong> Volunteers are not required to prioritize requests over academic responsibilities.</li>
          </ul>

          <h6>5. Amendments</h6>
          <p>MH-SERP reserves the right to modify these Terms and Conditions. Users will be notified of any changes through the platform, and continued use after updates indicates acceptance.</p>

          <h6>6. Violations</h6>
          <p>Failure to adhere to these Terms may result in restricted access to MH-SERP or disciplinary action.</p>
        </Modal.Body>
      </Modal>
    </footer>
  );
};

export default Footer;
