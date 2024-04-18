import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body">
              <h2 className="text-center">Sign Up</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input type="text" name="firstName" className="form-control" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <input type="text" name="middleName" className="form-control" placeholder="Middle Name" value={formData.middleName} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                  <input type="text" name="lastName" className="form-control" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <input type="text" name="phoneNumber" className="form-control" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <input type="email" name="email" className="form-control" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <input type="text" name="username" className="form-control" placeholder="Username" value={formData.username} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <input type="password" name="password" className="form-control" placeholder="Password" value={formData.password} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <input type="password" name="confirmPassword" className="form-control" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <select name="userType" className="form-select" value={formData.userType} onChange={handleInputChange}>
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Staff">Staff</option>  
                  </select>
                </div>
                {formData.userType === 'Student' && (
                  <>
                    <div className="mb-3">
                      <input type="text" name="college" className="form-control" placeholder="College" value={formData.college} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <input type="text" name="program" className="form-control" placeholder="Program" value={formData.program} onChange={handleInputChange} />
                    </div>
                  </>
                )}
                {formData.userType !== 'Student' && (
                  <>
                    <div className="mb-3">
                      <input type="text" name="office" className="form-control" placeholder="Office" value={formData.office} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <input type="text" name="position" className="form-control" placeholder="Position" value={formData.position} onChange={handleInputChange} />
                    </div>
                  </>
                )}
                <div className="mb-3 d-grid">
                  <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'orange' }}>Sign Up</button>
                </div>
              </form>
              <p className="text-center">Already have an account? <Link to="/login">Log in</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
