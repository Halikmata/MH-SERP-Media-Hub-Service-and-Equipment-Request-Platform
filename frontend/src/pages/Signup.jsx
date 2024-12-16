import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

function Signup({ url }) {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    status: 3,
    incident_report: null,
    username: "",
    password: "",
    confirm_password: "",
    user_type: "", // Default empty
    college: "", // For students
    program: "", // For students
    other_org: "", // For students
    office: "", // For staff/faculty
    position: "", // For staff/faculty
  });

  const [colleges, setColleges] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [otherOrgs, setOtherOrgs] = useState([]);
  const [isProgramDisabled, setIsProgramDisabled] = useState(true);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${url}/get_data/college_office?is_college=true`)
      .then((response) => setColleges(response.data))
      .catch((error) => console.error("Error fetching colleges:", error));
  }, [url]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Reset fields based on user type
    if (name === "user_type") {
      setFormData((prevData) => ({
        ...prevData,
        college: "",
        program: "",
        other_org: "",
        office: "",
        position: "",
      }));
    }
  };

  const handleCollegeChange = (e) => {
    const selectedCollege = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      college: selectedCollege,
      program: "",
      other_org: "",
    }));

    if (selectedCollege) {
      axios
        .get(`${url}/get_org/${selectedCollege}`)
        .then((response) => {
          const programs = response.data.filter((org) => org.program);
          const otherOrgs = response.data.filter((org) => !org.program);

          setPrograms(programs);
          setOtherOrgs(otherOrgs);
          setIsProgramDisabled(programs.length === 0);
        })
        .catch((error) => console.error("Error fetching organizations:", error));
    } else {
      setOrganizations([]);
      setPrograms([]);
      setOtherOrgs([]);
      setIsProgramDisabled(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    const requiredFields = ["first_name", "last_name", "phone_number", "email", "username", "password", "confirm_password", "user_type"];
    if (formData.user_type === "Student") {
      requiredFields.push("college");
      if (!isProgramDisabled) requiredFields.push("program");
    } else {
      requiredFields.push("office", "position");
    }

    const emptyFields = requiredFields.filter((field) => !formData[field]);
    if (emptyFields.length > 0) {
      alert(`Please fill in all the required fields!`);
      return;
    }

    if (formData.password !== formData.confirm_password) {
      alert("Password and Confirm Password do not match.");
      return;
    }

    // API Call
    axios
      .post(`${url}/signup`, formData)
      .then(() => {
        alert("Signup successful!");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error during signup:", error);
        alert(
          error.response?.data?.message || "Error creating account. Please try again later."
        );
      });
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body">
              <h2 className="text-center">Sign Up</h2>
              <br />
              <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <input
                  type="text"
                  name="first_name"
                  className="form-control mb-3"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="middle_name"
                  className="form-control mb-3"
                  placeholder="Middle Name (optional)"
                  value={formData.middle_name}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="last_name"
                  className="form-control mb-3"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="phone_number"
                  className="form-control mb-3"
                  placeholder="Phone Number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  className="form-control mb-3"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="username"
                  className="form-control mb-3"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  className="form-control mb-3"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="password"
                  name="confirm_password"
                  className="form-control mb-3"
                  placeholder="Confirm Password"
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  required
                />
                <select
                  name="user_type"
                  className="form-select mb-3"
                  value={formData.user_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>Select User Type</option>
                  <option value="Student">Student</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Staff">Staff</option>
                </select>

                {/* Student Fields */}
                {formData.user_type === "Student" && (
                  <>
                    <select
                      name="college"
                      className="form-select mb-3"
                      value={formData.college}
                      onChange={handleCollegeChange}
                      required
                    >
                      <option value="" disabled>Select College</option>
                      {colleges.map((college) => (
                        <option key={college._id.$oid} value={college.fk_idcollegeoffice}>
                          {college.acronym || college.name}
                        </option>
                      ))}
                    </select>
                    <select
                      name="program"
                      className="form-select mb-3"
                      value={formData.program}
                      onChange={handleInputChange}
                      disabled={isProgramDisabled || programs.length === 0}
                      required={!isProgramDisabled}
                    >
                      <option value="" disabled>Select Program</option>
                      {programs.map((program) => (
                        <option key={program._id.$oid} value={program.fk_org_id}>
                          {program.program}
                        </option>
                      ))}
                    </select>
                    <select
                      name="other_org"
                      className="form-select mb-3"
                      value={formData.other_org}
                      onChange={handleInputChange}
                      disabled={isProgramDisabled}
                    >
                      <option value="" disabled>Organization (optional)</option>
                      {otherOrgs.map((org) => (
                        <option key={org._id.$oid} value={org.fk_org_id}>
                          {org.name}
                        </option>
                      ))}
                    </select>
                  </>
                )}

                {/* Faculty/Staff Fields */}
                {formData.user_type !== "Student" && (
                  <>
                    <input
                      type="text"
                      name="office"
                      className="form-control mb-3"
                      placeholder="Office"
                      value={formData.office}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="text"
                      name="position"
                      className="form-control mb-3"
                      placeholder="Position"
                      value={formData.position}
                      onChange={handleInputChange}
                      required
                    />
                  </>
                )}
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="terms"
                    checked={isTermsAccepted}
                    onChange={(e) => setIsTermsAccepted(e.target.checked)}
                  />
                  <label htmlFor="terms" className="form-check-label">
                    I accept the <button
                      type="button"
                      className="btn btn-link p-0"
                      onClick={() => setIsTermsOpen(true)}
                    >
                    Terms and Conditions
                    </button>
                  </label>
                </div>
                {/* Submit Button */}
                <button type="submit" className="btn btn-primary w-100" style={{ backgroundColor: "orange" }} disabled={!isTermsAccepted}>
                  Sign Up
                </button>
              </form>
              <p className="text-center mt-3">
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Terms and Conditions Modal */}
      {isTermsOpen && (
        <div
          className="agreement-modal-overlay"
          onClick={() => setIsTermsOpen(false)}
        >
          <div
            className="agreement-modal-box"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <button
              className="btn-close"
              onClick={() => setIsTermsOpen(false)}
              style={{ position: "absolute", top: 10, right: 10 }}
            >
              &times;
            </button>
            <h2><strong>AGREEMENTS</strong></h2>
            <p>
            <br />
            <h3><strong>Privacy Policy</strong></h3>
            <br />
            <strong>Effective Date: November 30, 2024</strong><br />
            Media Hub Service and Equipment Request Platform (MH-SERP) is committed to protecting your privacy. This Privacy Policy outlines the data collection, usage, and security practices for users of our platform.<br />
            <br />
            <strong>1. Information We Collect</strong> <br /> <br />
  
                <p className="indented">
                  <strong>Personal Information:</strong> When you register, we may collect your name, email, contact number, college/department affiliation, and role (e.g., student, volunteer).
                </p>
                <p className="indented">
                  <strong>Usage Information:</strong> We track interactions within the platform, such as equipment requests, event scheduling, and platform preferences.
                </p>
                <p className="indented">
                  <strong>Device and Access Information:</strong> We collect technical information like device type, IP address, and login timestamps for security purposes. 
                </p> <br /> <br />
                
            <strong>2. How We Use Your Information</strong> <br /> <br />
                
                <p className="indented">
                  To process equipment and service requests.
                </p>
                <p className="indented">
                  To notify you about scheduling and confirmation details for events.
                </p>
                <p className="indented">
                  To manage volunteer assignments and availability.
                </p>
                <p className="indented">
                To improve the functionality, efficiency, and security of MH-SERP.
                </p> <br /> <br />
                
            <strong>3. Data Sharing and Disclosure</strong> <br /> <br />
                
            Your information will only be shared: <br /> <br />
                
                <p className="indented">
                  <strong>With the University Library Staff:</strong> For request approvals and inventory management.
                </p>
                <p className="indented">
                  <strong>With Media Hub Volunteers:</strong> To coordinate event scheduling and equipment availability.
                </p>
                <p className="indented">
                  <strong>To Fulfill Legal Obligations:</strong> If required by law or court order.
                </p> <br /> <br />
                
            <strong>4. Data Security</strong> <br /> <br />
                
            We implement technical and administrative measures to protect your information, such as encrypted data storage and secure login protocols. While we strive to maintain data integrity, no system is completely secure. <br /> <br />
                
            <strong>5. Data Retention</strong> <br /> <br />
                
            We retain personal information for as long as necessary to support MH-SERP’s functionality and for auditing purposes, unless deletion is requested by you. <br /> <br />
                
            <strong>6. Your Rights</strong> <br /> <br />
                
            You may access, update, or delete your personal information at any time by contacting our support team. Additionally, you may opt out of non-essential notifications in your account settings. <br /> <br />
                
            <strong>7. Contact Us</strong> <br /> <br />
                
            If you have questions regarding this Privacy Policy, please contact us at <a href="mailto:mediahub@psu.palawan.edu.ph" className="email-link">mediahub@psu.palawan.edu.ph</a>. <br /> <br />
                
            <h3><strong>User Agreement</strong></h3> <br />
                
            <strong>Effective Date: 11/30/2024</strong> <br /> <br />
                
            This User Agreement governs the terms under which you may access and use MH-SERP. By registering and using our platform, you agree to the following terms. <br /> <br />
                
            <strong>1. Use of the Platform</strong> <br /> <br />
                
                <p className="indented">
                  <strong>Eligibility:</strong> Only students, faculty, and staff of Palawan State University (Palawan SU) may use MH-SERP.
                </p>
                <p className="indented">
                  <strong>Purpose:</strong> This platform is solely for requesting equipment and service support from Media Hub.
                </p>
                <p className="indented">
                  <strong>Accuracy of Information:</strong> Users must provide accurate and up-to-date information, including availability and equipment requests, to prevent conflicts.
                </p>
                <p className="indented">
                  <strong>Prohibition for Outstanding IRs:</strong> Users and organizations with unresolved Incident Reports (IRs) are prohibited from submitting requests until the issue is settled.
                </p> <br /> <br />
                
            <strong>2. User Responsibilities</strong> <br /> <br />

                <p className="indented">
                  <strong>Proper Usage:</strong> Users agree not to misuse or abuse MH-SERP for purposes outside of its intended function.
                </p>
                <p className="indented">
                  <strong>Equipment Care:</strong> Users are responsible for the proper use of borrowed equipment. In the event of damage or loss, users must either replace the equipment with an equivalent model or pay for its repair costs.
                </p>
                <p className="indented">
                Scheduling and Requests: Users must respect scheduling deadlines and allow a minimum of five days' lead time for event planning.
                </p> <br /> <br />

            <strong>3. Liability and Disclaimers</strong> <br /> <br />

                <p className="indented">
                  <strong>No Guarantees:</strong> MH-SERP aims to streamline processes, but we cannot guarantee volunteer availability for every request.
                </p>
                <p className="indented">
                  <strong>Limitation of Liability:</strong> MH-SERP, the Media Hub, and Palawan SU shall not be held liable for missed schedules, equipment unavailability, or any damages resulting from usage or misuse of the platform.
                </p> <br /> <br />

            <strong>4. Account Security</strong> <br /> <br />
                
                Users are responsible for maintaining the confidentiality of their account and password. Any suspicious activity should be reported immediately to Media Hub’s Office or contact us at <a href="mailto:mediahub@psu.palawan.edu.ph" className="email-link">mediahub@psu.palawan.edu.ph</a>. <br /> <br />

            <h3><strong>Terms and Conditions</strong></h3> <br />

            <strong>Effective Date: 11/30/2024</strong> <br /> <br />

            These Terms and Conditions apply to all users of MH-SERP. By accessing or registering on MH-SERP, you agree to comply with these terms. <br /> <br />

            <strong>1. Definitions</strong> <br /> <br />
                <p className="indented">
                  <strong>"User"</strong> refers to students, faculty, or staff at Palawan SU using the MH-SERP platform.
                </p>
                <p className="indented">
                  <strong>"MH-SERP"</strong> refers to the Media Hub Service and Equipment Request Platform.
                </p> <br /> <br />

            <strong>2. Request Procedures</strong> <br /> <br />
                <p className="indented">
                  <strong>Request Process:</strong> Users must submit a digital request form, providing details such as event type, required equipment, and staff requirements.
                </p>
                <p className="indented">
                  <strong>Request Timing:</strong> Requests must be submitted a minimum of five days before the event.
                </p>
                <p className="indented">
                  <strong>Approval Process:</strong> The University Librarian's office reviews and approves requests.
                </p> <br /> <br />

            <strong>3. Equipment and Availability</strong> <br /> <br />
                <p className="indented">
                  <strong>Inventory:</strong> Users can view available equipment on MH-SERP; availability is subject to prior reservations and may change.
                </p>
                <p className="indented">
                  <strong>Loss or Damage:</strong> Users may be responsible for the replacement or repair costs if equipment is lost or damaged during an event.
                </p> <br /> <br />

            <strong>4. Volunteer Coordination</strong> <br /> <br />
                <p className="indented">
                  <strong>Scheduling:</strong> MH-SERP assigns volunteers based on their availability; users cannot directly request specific volunteers.
                </p>
                <p className="indented">
                  <strong>Conflict Management:</strong> Volunteers are not required to prioritize requests over academic responsibilities.
                </p> <br /> <br />

            <strong>5. Amendments</strong> <br /> <br />
                
            MH-SERP reserves the right to modify these Terms and Conditions. Users will be notified of any changes through the platform, and continued use after updates indicates acceptance. <br /> <br />
            
            <strong>6. Violations</strong> <br /> <br />
            
            Failure to adhere to these Terms may result in restricted access to MH-SERP or disciplinary action.

            </p> <br /> <br />
            
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;
