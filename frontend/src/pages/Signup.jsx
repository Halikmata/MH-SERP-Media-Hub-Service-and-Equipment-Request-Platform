import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css'; // Import CSS file for styling

function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    status: 3,
    incidentReport: null,
    username: '',
    password: '',
    confirmPassword: '',
    userType: 'Student', // Default value
    college: '', // Only for students
    program: '', // Only for students
    office: '', // Only for faculty/staff
    position: '' // Only for faculty/staff
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (to be implemented in backend)
    console.log(formData);
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} required />
        <input type="text" name="middleName" placeholder="Middle Name" value={formData.middleName} onChange={handleInputChange} />
        <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} required />
        <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleInputChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange} required />
        <select name="userType" value={formData.userType} onChange={handleInputChange}>
          <option value="Student">Student</option>
          <option value="Faculty">Faculty</option>
          <option value="Staff">Staff</option>
        </select>
        {formData.userType === 'Student' && (
          <>
            <input type="text" name="college" placeholder="College" value={formData.college} onChange={handleInputChange} />
            <input type="text" name="program" placeholder="Program" value={formData.program} onChange={handleInputChange} />
          </>
        )}
        {formData.userType !== 'Student' && (
          <>
            <input type="text" name="office" placeholder="Office" value={formData.office} onChange={handleInputChange} />
            <input type="text" name="position" placeholder="Position" value={formData.position} onChange={handleInputChange} />
          </>
        )}
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  );
}

export default Signup;
