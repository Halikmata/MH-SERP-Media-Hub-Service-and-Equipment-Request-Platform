import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Table, Dropdown } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

function Requests({ url }) {
	const [isLoggedIn, SetIsLoggedIn] = useState(false);

	const navigate = useNavigate();
	const [cookies] = useCookies(['presence']);

	

	const [services,setServices] = useState([]);
	const [equipment, setEquipment] = useState([]);
	const [requests, setRequest] = useState([]);
	const [formData, setFormData] = useState({
		organization: '',
		event: '',
		location: '',
		services: '',
		equipment: [],
		start_date: null,
		end_date: null,
	});

	async function get_foreign_key() {
		const url_link = `${url}/requests/add`;

		const headers = {
			"Content-type": "application/json",
			"Authorization": "Bearer " + cookies.presence
		};

		const options = {
			headers: headers,
			withCredentials: true
		};

		const response = await axios.get(url_link, options);
		const f_dict = response.data
		
		setServices(f_dict['services']);
		setEquipment(f_dict['equipment']);
	}

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
			setRequest(response.data);

		} catch (error) {
			navigate('/login');
		}
		get_foreign_key();
	}

	useEffect(() => {
		get_requests_table();
	}, []);

	function handleChange(e) {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	}

	async function handleSubmit(e) {
		e.preventDefault();

		const requestData = {
			token: cookies.presence,
			organization: formData.organization,
			event_name: formData.event,
			event_location: formData.location,
			service: formData.services,
			equipment: formData.equipment,
			request_start: formData.start_date,
			request_end: formData.end_date
		};

		if (formData.services == "" && formData.equipment == []) {
			// edit a html element that tells that both shouldn't be empty.
			return
		}
		
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

				{/* Services */}
				<Form.Group className="mb-3" controlId="services">
					<Form.Label>Services</Form.Label>
					<Form.Select type="text" name="services" value={formData.services} onChange={handleChange}>{/* required */}
					<option value=""> - None - </option>
						{services.map(item => {
							return (
								<option value={item.fk_idservice} key={item.fk_idservice}>{item.name || "N/A"}</option>
							);
						})}
					</Form.Select>
				</Form.Group>

				{/* Equipments */}
				<Form.Group className="mb-3" controlId="equipment">
					<Form.Label>Equipments</Form.Label>
					<Form.Select type="text" name="equipment" value={formData.equipment} onChange={handleChange} multiple>{/* required */}
					{/* <option value="" > - None - </option> */}
						{equipment.map(item => {
							return (
								<option value={item.idequipment} key={item.idequipment}>{item.description || "N/A"}</option>
							);
						})}
					</Form.Select>
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

				{/* Submit Button */}
				<div className='text-center'>
					<Button variant="primary" type="submit" className="custom-submit-btn" style={{ backgroundColor: '#FF5733', borderColor: '#FF5733' }}>Submit</Button>
				</div>

				<h2 className="mt-4 mb-3" style={{ color: '#FF5733' }}>Your Requests</h2>
				<br />

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
										{/* <td>{item.equipment || "N/A"}</td> */}
										{/* <td>
											{item.equipment.map(x => {
												return x + " ";
											})}
										</td> */}
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

				

				<br /><br />
			</Form>
		</div>
	);
}

export default Requests;