import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import { useCookies } from 'react-cookie';
import { useNavigate, Link } from 'react-router-dom';
import NotLoggedIn from '../includes/notLoggedIn';



function Requests({ url }) {
	const [isLoggedIn, SetIsLoggedIn] = useState(false);
	const navigate = useNavigate();
	const [cookies] = useCookies(['presence']);
	const [requests, setRequest] = useState([]);
	
	async function get_requests_table() {
		const url_link = `${url}/requests`;

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
		get_requests_table();
	}, []);

	return (
		<div className='container mt-5'>
			<NotLoggedIn>Log in to make request</NotLoggedIn><br />
			<Link className='btn btn-primary' to="/request">Create Request</Link>
			<h2 className="mt-4 mb-3" style={{ color: '#FF5733' }}>Your Requests</h2>
			<div className='table-responsive'>
				<Table striped bordered hover style={{ maxWidth: '800px', margin: 'auto' }}>
					<thead>
						<tr>
							<th>Status</th>{/* foreign value */}
							<th>Event Affiliation</th>
							<th>Event Location</th>
							<th>Event Details</th>
							<th>Request Start</th>
							<th>Request End</th>
							<th>Equipments</th>
							<th>Service</th>
							<th>Organization</th>
							<th>Event</th>
						</tr>
					</thead>
					<tbody>
						{requests.map(item => {
							return (
								<tr key={item._id || "N/A"}>
									<td>{item.request_affiliation || "N/A"}</td>
									<td>{item.event_location || "N/A"}</td>
									<td>{item.event_details || "N/A"}</td>
									<td>{item.request_start || "N/A"}</td>
									<td>{item.request_end || "N/A"}</td>
									<td>{item.service || "N/A"}</td>
									<td>{item.organization || "N/A"}</td>
									<td>{item.event || "N/A"}</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			</div>
		</div>
	);
}

export default Requests;