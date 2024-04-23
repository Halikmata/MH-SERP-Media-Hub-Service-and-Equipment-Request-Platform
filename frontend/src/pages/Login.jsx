import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';



function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    session_const: false
  });

  const [buttonColor, setButtonColor] = useState('orange'); // Initial button color

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleInputChangeSession = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleButtonHover = () => {
    // Change button color on hover
    setButtonColor('tomato');
  };

  const handleButtonLeave = () => {
    // Restore button color when hover ends
    setButtonColor('orange');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/login', formData, {
      headers: {
        "Content-type":"application/json"
      },
      withCredentials: true
    })
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
      console.error("Error:", error);
    });
    console.log(formData);
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body">
              <h2 className="text-center">Log In</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input type="text" name="username" className="form-control" placeholder="Username" value={formData.username} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <input type="password" name="password" className="form-control" placeholder="Password" value={formData.password} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                
                  <input type="checkbox" name="session_const" checked={formData.session_const} onChange={handleInputChangeSession} />
                  Remember me
                
                </div>
                <div className="mb-3 d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ backgroundColor: buttonColor }} // Apply dynamic button color
                    onMouseEnter={handleButtonHover} // Change color on hover
                    onMouseLeave={handleButtonLeave} // Restore color on leave
                  >
                    Log In
                  </button>
                </div>
              </form>
              <p className="text-center">Don't have an account? <Link to="/signup">Sign up</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
