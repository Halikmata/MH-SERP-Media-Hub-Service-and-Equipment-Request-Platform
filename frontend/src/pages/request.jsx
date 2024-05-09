import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Table, Dropdown } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useCookies } from 'react-cookie';
//import { verify_login } from '../../utils.js'
import { useNavigate } from 'react-router-dom';



function Requests({ url }) {
	const [isLoggedIn, SetIsLoggedIn] = useState(false);

	const navigate = useNavigate();
	const [cookies] = useCookies(['presence']);

	const [requests, setRequest] = useState([]);
	const [equipment, setEquipment] = useState([]);
	const [equipmentTypes, setEquipmentTypes] = useState([]);
	const [selectedTypes, setSelectedTypes] = useState([]);
	const [selectedEquipment, setSelectedEquipment] = useState([]);
	const [formData, setFormData] = useState({
		organization: '',
		event: '',
		location: '',
		start_date: null,
		end_date: null,
	});


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
		//verify_login(cookies,navigate);

		get_requests_table();
	}, []);

	function handleChange(e) {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	}

	function handleCheckboxChange(e) {
		const { value, checked } = e.target;

		if (checked) {
			setSelectedEquipment(prevSelected => [...prevSelected, value]);
		} else {
			setSelectedEquipment(prevSelected => prevSelected.filter(item => item !== value));
		}
	}

	function handleFilterChange(e) {
		const { value, checked } = e.target;

		if (checked) {
			setSelectedTypes((prevSelectedTypes) => [...prevSelectedTypes, value]);
		} else {
			setSelectedTypes((prevSelectedTypes) => prevSelectedTypes.filter((type) => type !== value));
		}
	}

	async function handleSubmit(e) {
		e.preventDefault();

		const requestData = {
			organization: formData.organization,
			event_name: formData.event,
			event_location: formData.location,
			request_start: formData.start_date,
			request_end: formData.end_date,
			equipment: selectedEquipment
		};

		axios.post(`${url}/requests/add`, requestData)
			.then(response => {
				console.log('Request created successfully:', response.data);
				setFormData({ organization: '', event_name: '', event_location: '', request_start: null, request_end: null });
				setSelectedEquipment([]);
			})
			.catch(error => {
				console.error('Error creating request:', error);
			});

		const url = `${url}/requests/add`;

		const headers = {
			"Content-type": "application/json",
			"Authorization": "Bearer " + cookies.presence
		};

		const options = {
			headers: headers
		}

		try {
			const response = await axios.get(url, options);
			console.log(response.data);
		} catch (error) {
			console.error("Error: ", error);
		}
	}


	return (
		<div className='container mt-5'>
			<h2 className="mb-4" style={{ color: '#FF5733' }}>Request Details</h2>
			<Form onSubmit={handleSubmit}>
				{/* Organization */}
				<Form.Group className="mb-3" controlId="organization">
					<Form.Label>Organization</Form.Label>
					<Form.Control type="text" name="organization" value={formData.organization} onChange={handleChange} required />
				</Form.Group>

				{/* Event */}
				<Form.Group className="mb-3" controlId="event">
					<Form.Label>Event</Form.Label>
					<Form.Control type="text" name="event" value={formData.event} onChange={handleChange} required />
				</Form.Group>

				{/* Location */}
				<Form.Group className="mb-3" controlId="location">
					<Form.Label>Location</Form.Label>
					<Form.Control type="text" name="location" value={formData.location} onChange={handleChange} required />
				</Form.Group>

				{/* Start Date */}
				<Form.Group className="mb-3" controlId="start_date">
					<Form.Label>Start Date</Form.Label>
					<br />
					<DatePicker selected={formData.start_date} onChange={date => setFormData({ ...formData, start_date: date })} dateFormat="dd/MM/yyyy" className="form-control" />
				</Form.Group>

				{/* End Date */}
				<Form.Group className="mb-3" controlId="end_date">
					<Form.Label>End Date</Form.Label>
					<br />
					<DatePicker selected={formData.end_date} onChange={date => setFormData({ ...formData, end_date: date })} dateFormat="dd/MM/yyyy" className="form-control" />
				</Form.Group>

				<h2 className="mt-4 mb-3" style={{ color: '#FF5733' }}>Your Requests</h2>
				<br />

				<Dropdown>
					<Dropdown.Toggle variant="secondary" id="dropdown-basic">
						Select Equipment Types
					</Dropdown.Toggle>

					<Dropdown.Menu>
						<Form>
							{equipmentTypes.map((type) => (
								<Form.Check
									key={type.fk_idequipment_type}
									type="checkbox"
									id={type.fk_idequipment_type}
									label={type.name}
									value={type.fk_idequipment_type}
									onChange={handleFilterChange}
									checked={selectedTypes.includes(type.fk_idequipment_type)}
								/>
							))}
						</Form>
					</Dropdown.Menu>

				</Dropdown>

				<br />
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
								{/* <th>Equipments</th> */}
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
				<br />

				{/* Submit Button */}
				<div className='text-center'>
					<Button variant="primary" type="submit" className="custom-submit-btn" style={{ backgroundColor: '#FF5733', borderColor: '#FF5733' }}>Submit</Button>
				</div>

				<br /><br />
			</Form>
		</div>
	);
}

export default Requests;