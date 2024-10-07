import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup({ url }) {
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    status: 3,
    incident_report: null,
    username: '',
    password: '',
    confirm_password: '',
    user_type: 'Student', // Default value
    college: '', // Only for students
    program: '', // Only for students
    other_org: '', // Only for students
    office: '', // Only for faculty/staff
    position: '' // Only for faculty/staff
  });

  const [colleges, setColleges] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [otherOrgs, setOtherOrgs] = useState([]);
  const [isProgramDisabled, setIsProgramDisabled] = useState(true);

  useEffect(() => {
    axios.get(`${url}/get_data/college_office?type=college`)
      .then((response) => {
        setColleges(response.data); // Assuming the response contains item data
      })
      .catch((error) => {
        console.error('Error fetching item:', error);
      });
  }, [url]);

  const handleCollegeChange = (e) => {
    const selectedCollege = e.target.value;
    setFormData(prevData => ({
      ...prevData,
      college: selectedCollege,
      program: '', // Reset program when college changes
      other_org: '' // Reset other_org when college changes
    }));

    if (selectedCollege) {
      axios.get(`${url}/get_org/${selectedCollege}`)
        .then((response) => {
          setOrganizations(response.data);
          const programs = response.data.filter(org => org.program);
          const otherOrgs = response.data.filter(org => !org.program);

          setPrograms(programs);
          setOtherOrgs(otherOrgs);
          setIsProgramDisabled(programs.length === 0);
        })
        .catch((error) => {
          console.error('Error fetching item:', error);
        });
    } else {
      setOrganizations([]);
      setPrograms([]);
      setOtherOrgs([]);
      setIsProgramDisabled(true);
    }
  };

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = ['first_name', 'last_name', 'phone_number', 'email', 'username', 'password', 'confirm_password', 'user_type', 'college'];
    if (!isProgramDisabled) {
      requiredFields.push('program');
    }
    const emptyFields = requiredFields.filter(field => !formData[field]);

    if (emptyFields.length > 0) {
      alert(`Please fill in all the required fields!`);
      return;
    }

    if (formData.password !== formData.confirm_password) {
      alert("Password and Confirm Password do not match.");
      return;
    }

    axios.post(`${url}/signup`, formData)
      .then((response) => {
        console.log('User added successfully:', response.data);
        navigate('/login');
      })
      .catch((error) => {
    console.error('Error adding item:', error);
    if (error.response && error.response.data && error.response.data.message) {
      alert('Error creating account: \n' + error.response.data.message);
    } else {
      alert('Error creating account. Please try again later.');
    }
      });
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body">
              <h2 className="text-center">Sign Up</h2><br />
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input type="text" name="first_name" className="form-control" placeholder="First Name" value={formData.first_name} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <input type="text" name="middle_name" className="form-control" placeholder="Middle Name (optional)" value={formData.middle_name} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                  <input type="text" name="last_name" className="form-control" placeholder="Last Name" value={formData.last_name} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <input type="text" name="phone_number" className="form-control" placeholder="Phone Number" value={formData.phone_number} onChange={handleInputChange} required />
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
                  <input type="password" name="confirm_password" className="form-control" placeholder="Confirm Password" value={formData.confirm_password} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <select name="user_type" className="form-select" value={formData.user_type} onChange={handleInputChange} required>
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
                {formData.user_type === 'Student' && (
                  <>
                    <div className="mb-3">
                      <select name="college" className="form-select" value={formData.college} onChange={handleCollegeChange} required>
                        <option value="" disabled>Select College</option>
                        {colleges.map(college => (
                          <option key={college._id.$oid} value={college.fk_idcollegeoffice}>
                            {college.acronym || college.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <select
                        name="program"
                        className="form-select"
                        value={formData.program}
                        onChange={handleInputChange}
                        disabled={isProgramDisabled || programs.length === 0}
                        required={!isProgramDisabled}
                      >
                        <option value="" disabled>Select Program</option>
                        {programs.map(program => (
                          <option key={program._id.$oid} value={program.fk_org_id}>
                            {program.program}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <select
                        name="other_org"
                        className="form-select"
                        value={formData.other_org}
                        onChange={handleInputChange}
                        disabled={isProgramDisabled}
                      >
                        <option value="" disabled>Organization (optional)</option>
                        {otherOrgs.map(org => (
                          <option key={org._id.$oid} value={org.fk_org_id}>
                            {org.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
                {formData.user_type !== 'Student' && (
                  <>
                    <div className="mb-3">
                      <input type="text" name="office" className="form-control" placeholder="Office" value={formData.office} onChange={handleInputChange} required />
                    </div>
                    <div className="mb-3">
                      <input type="text" name="position" className="form-control" placeholder="Position" value={formData.position} onChange={handleInputChange} required />
                    </div>
                  </>
                )}
                <div className="mb-3 d-grid">
                  <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'orange' }} onClick={handleSubmit}>Sign Up</button>
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
