import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Login() {

    const user_form_input = {
        username: '',
        password: '',
        session_const: false
    };

    const [formData, setFormData] = useState(user_form_input)

    const [buttonColor, setButtonColor] = useState('orange');

    function handleInputChangeSession(e){
        const { name, value, type, checked } = e.target;

        function formData_value(prevData){
            return {
                ...prevData,
                [name]: type === 'checkbox' ? checked : value
            };
        }

        setFormData(prevData => (formData_value(prevData))); // react is declarative by nature
    }

    function handleInputChange(e){
        const { name, value } = e.target;

        function formData_value(prevData){
            return {
                ...prevData,
                [name]: value
            };
        }

        setFormData(prevData => (formData_value(prevData)));
    }

    function handleButtonHover(){
        return setButtonColor('tomato');
    }

    function handleButtonLeave(){
        return setButtonColor('orange');
    }

    async function handleSubmit(e){
        e.preventDefault()

        const url = 'http://localhost:5000/login';

        const headers = {
            "Content-type": "application/json"
        };

        const options = {
            headers: headers,
            withCredentials: true
        };

        try {
            const response = await axios.post(url, formData, options);
            console.log(response.data);
        } catch (error) {
            console.error("Error: ", error); // will remove log
        }
        
    }


    return (
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-md-6'>
                    <div className='card mt-5'>
                        <div className='card-body'>
                            <h2 className='text-center'>Log In</h2>

                            <form onSubmit={handleSubmit}>
                                <div className='mb-3'>
                                    <input type="text" name="username" className="form-control" placeholder="Username"
                                    value={formData.username} onChange={handleInputChange} required />
                                </div>

                                <div className='mb-3'>
                                    <input type="password" name="password" className="form-control" placeholder="Password"
                                    value={formData.password} onChange={handleInputChange} required />
                                </div>

                                <div className='mb-3'>
                                    <input type="checkbox" name="session_const" checked={formData.session_const} onChange={handleInputChangeSession} />
                                    Remember Me
                                </div>

                                <div className='mb-3 d-grid'>
                                    <button
                                        type='submit'
                                        className='btn btn-primary'
                                        style={{ backgroundColor: buttonColor }}
                                        onMouseEnter={handleButtonHover}
                                        onMouseLeave={handleButtonLeave}
                                        >Log In</button>
                                </div>

                            </form>
                            <p className="text-center">Don't have an account?<Link to="/signup">Sign up</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) // return
} // function login

export default Login;