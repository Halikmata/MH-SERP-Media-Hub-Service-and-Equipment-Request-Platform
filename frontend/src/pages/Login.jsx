import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const fromValue = queryParams.get('from');

    const initialFormData = {
        username_email: '',
        password: '',
        remember_me: false
    };

    const [formData, setFormData] = useState(initialFormData);
    const [buttonColor, setButtonColor] = useState('orange');
    const [cookies, setCookie, removeCookie] = useCookies(['presence']);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        verifyPresence();
    }, []);

    const verifyPresence = async () => {
        if (cookies.presence) {
            const url = 'http://localhost:5000/verify_presence';
            const headers = {
                "Content-type": "application/json",
                "Authorization": `Bearer ${cookies.presence}`
            };
            const options = { headers, withCredentials: true };

            try {
                const response = await axios.get(url, options);
                if (response.data.msg === true) {
                    navigate('/');
                } else {
                    removeCookie('presence');
                }
            } catch (error) {
                console.error("Error verifying presence:", error);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleButtonHover = () => {
        setButtonColor('tomato');
    };

    const handleButtonLeave = () => {
        setButtonColor('orange');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = 'http://localhost:5000/login';
        const headers = { "Content-type": "application/json" };
        const options = { headers, withCredentials: true };

        try {
            const response = await axios.post(url, formData, options);
            if (response.data.msg === true) {
                sessionStorage.setItem('userData', JSON.stringify(response.data.user));
                navigate('/');
            }
        } catch (error) {
            console.error("Login error:", error);
            if (error.response && error.response.status === 401) {
                alert("Incorrect credentials. Please try again.");
            }
        }
    };

    return (
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-md-6'>
                    <div className='card mt-5'>
                        <div className='card-body'>
                            <h2 className='text-center'>{fromValue === 'request' ? 'Log in to make a request' : 'Log In'}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className='mb-3'>
                                    <input
                                        type="text"
                                        name="username_email"
                                        className="form-control"
                                        placeholder="Username or email"
                                        value={formData.username_email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className='mb-3'>
                                    <div className="input-group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            className="form-control"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            onClick={toggleShowPassword}
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                </div>
                                <div className='mb-3'>
                                    <input
                                        type="checkbox"
                                        name="remember_me"
                                        checked={formData.remember_me}
                                        onChange={handleInputChange}
                                    />
                                    <label className="form-check-label ms-2">Remember Me</label>
                                </div>
                                <div className='mb-3 d-grid'>
                                    <button
                                        type='submit'
                                        className='btn btn-primary'
                                        style={{ backgroundColor: buttonColor }}
                                        onMouseEnter={handleButtonHover}
                                        onMouseLeave={handleButtonLeave}
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
