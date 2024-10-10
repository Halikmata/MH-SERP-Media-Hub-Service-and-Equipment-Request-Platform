import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Card, Collapse } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import { useCookies } from 'react-cookie';
import { useNavigate, Link } from 'react-router-dom';
import './request.css';

function Requests({ url }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [cookies] = useCookies(['presence']);
  const [requests, setRequests] = useState([]);
  const [openCardId, setOpenCardId] = useState(null); // Track the open card's ID
  const bgColorArray = ['#EB7F20', '#4C7041', '#EB4141', '#878787'];
  const statusArray = ["Pending", "Approved", "Declined", "Done"];
  const userDataString = sessionStorage.getItem('userData');

  useEffect(() => {
    if (!userDataString) {
      navigate('/login?from=request');
    } else {
      setIsLoggedIn(true);
    }
  }, [userDataString, navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      const userData = JSON.parse(userDataString);
      axios.get(`${url}/requests/${userData.email}`, {
        headers: {
          "Content-type": "application/json",
          "Authorization": "Bearer " + cookies.presence
        },
        withCredentials: true
      })
        .then(response => setRequests(response.data))
        .catch(error => console.error("Error: ", error));
    }
  }, [isLoggedIn, cookies, url, userDataString]);

  const toggleCollapse = (id) => {
    // If the same card is clicked, close it, otherwise open the new card
    setOpenCardId(prevOpenCardId => (prevOpenCardId === id ? null : id));
  };

  return (
    <div className='container mt-5'>
      <Link className='btn custom-btn mb-4' to="/request">Create Request</Link>
      <h2 className="text-center mb-4">Your Requests</h2>
      <div className='row'>
        {requests.length === 0 && (
          <div className="text-center mt-4">
            <p>No request found.</p>
          </div>
        )}
        {requests.map((item) => (
          <div className='col-12 col-md-6 col-lg-4 mb-4' key={item._id}>
            <Card className="request-card h-100">
              <Card.Header style={{ backgroundColor: bgColorArray[item.request_status], color: '#FFF' }}>
                <b>{item.event_name || "Untitled Event"}</b>
                <Button
                  variant="link"
                  onClick={() => toggleCollapse(item._id)}
                  aria-controls={`collapse-${item._id}`}
                  aria-expanded={openCardId === item._id} // Check if this card is currently open
                  className="float-end text-white"
                >
                  {openCardId === item._id ? "Hide Details" : "Show Details"}
                </Button>
              </Card.Header>
              <Card.Body className="d-flex flex-column">
                <Table responsive="sm" size="sm" className="mb-2">
                  <tbody>
                    <tr><td>Status:</td><td>{statusArray[item.request_status] || "Unknown"}</td></tr>
                    <tr><td>Timestamp:</td><td>{item.request_datetime || "N/A"}</td></tr>
                    <tr><td>Location:</td><td>{item.event_location || "N/A"}</td></tr>
                  </tbody>
                </Table>
                <Collapse in={openCardId === item._id}>
                  <div id={`collapse-${item._id}`}>
                    <Table responsive="sm" size="sm">
                      <tbody>
                        <tr><td>Details:</td><td>{item.event_details || "N/A"}</td></tr>
                        <tr><td>Start:</td><td>{item.event_start || "N/A"}</td></tr>
                        <tr><td>End:</td><td>{item.event_end || "N/A"}</td></tr>
                        <tr>
                          <td>Equipment:</td>
                          <td>
                            {item.equipment ? item.equipment.map((eq, index) => (
                              <React.Fragment key={index}>
                                {typeof eq === "object" ? JSON.stringify(eq) : eq}<br />
                              </React.Fragment>
                            )) : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td>Service:</td>
                          <td>
                            {item.services ? item.services.map((ser, index) => (
                              <React.Fragment key={index}>
                                {typeof ser === "object" ? JSON.stringify(ser) : ser}<br />
                              </React.Fragment>
                            )) : "N/A"}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Collapse>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Requests;
