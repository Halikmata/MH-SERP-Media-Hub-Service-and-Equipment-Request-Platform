import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import { useCookies } from 'react-cookie';
import { useNavigate, Link } from 'react-router-dom';

function Requests({ url }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const [cookies] = useCookies(['presence']);
    const [requests, setRequests] = useState([]);

    const userDataString = sessionStorage.getItem('userData');

    const status_array = ["pending", "approved", "declined"];

    // Check for userData and redirect if not found
    useEffect(() => {
        if (!userDataString) {
            navigate('/login?from=request');
        } else {
            setIsLoggedIn(true);
        }
    }, [userDataString, navigate]);

    function getRequestsTable() {
        if (!userDataString) return;

        const userData = JSON.parse(userDataString);
        const urlLink = `${url}/requests/${userData.email}`;
        const headers = {
            "Content-type": "application/json",
            "Authorization": "Bearer " + cookies.presence
        };

        const options = {
            headers: headers,
            withCredentials: true
        };

        axios.get(urlLink, options)
            .then(response => {
                setRequests(response.data);
            })
            .catch(error => {
                console.error("Error: ", error);
            });
    }

    async function get_requests_table_beta() {
		const url_link = `${url}/myrequests`;

		const headers = {
			"Content-type": "application/json",
			"Authorization": "Bearer " + cookies.presence
		};

		const options = {
			headers: headers,
			withCredentials: true
		};

		try {
			const response = await axios.get(url_link, options);
			//console.log(response.data);
			setRequest(response.data);

		} catch (error) {
			console.error("Error: ", error);
			navigate('/login') // if session is invalid.
		}
	}

    useEffect(() => {
        if (isLoggedIn) {
            getRequestsTable();
        }
    }, [isLoggedIn]);

    return (
        <div className='container mt-5'>
            <Link className='btn btn-primary' to="/request">Create Request</Link>
            <h2 className="mt-4 mb-3" style={{ color: '#FF5733' }}>Your Requests</h2>
            <div className='table-responsive'>
                <Table striped bordered hover style={{ maxWidth: '800px', margin: 'auto' }}>
                    <thead>
                        <tr>
                            <th>Name</th>{/* foreign value */}
                            <th>Status</th>{/* foreign value */}
                            <th>Timestamp</th>{/* foreign value */}
                            <th>Event Location</th>
                            <th>Event Details</th>
                            <th>Event Start</th>
                            <th>Event End</th>
                            <th>Equipments</th>
                            <th>Service</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(item => (
                            <tr key={item._id || ""}>
                                <td>{item.event_name || ""}</td>
                                <td>{status_array[item.request_status] || ""}</td>
                                <td>{item.request_datetime || ""}</td>
                                <td>{item.event_location || ""}</td>
                                <td>{item.event_details || ""}</td>
                                <td>{item.event_start || ""}</td>
                                <td>{item.event_end || ""}</td>
                                <td>
                                    {item.equipment ? item.equipment.map((eq, index) => (
                                        <React.Fragment key={index}>
                                            {typeof eq === "object" ? JSON.stringify(eq) : eq}
                                            <br />
                                        </React.Fragment>
                                    )) : ""}
                                </td>
                                <td>{item.services || ""}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}

export default Requests;
