import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

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

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${url}/get_data/college_office?type=college`)
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

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary w-100" style={{ backgroundColor: "orange" }}>
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
    </div>
  );
}

export default Signup;
