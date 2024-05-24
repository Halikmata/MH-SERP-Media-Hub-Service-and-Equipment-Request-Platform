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
  const [open, setOpen] = useState({});

  const bgColorArray = ['#EB7F20','#4C7041','#EB4141','#878787']

  const userDataString = sessionStorage.getItem('userData');

  const status_array = ["Pending", "Approved", "Declined", "Done"];

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

  useEffect(() => {
    if (isLoggedIn) {
      getRequestsTable();
    }
  }, [isLoggedIn]);

  const toggleCollapse = (id) => {
    setOpen(prevOpen => ({ ...prevOpen, [id]: !prevOpen[id] }));
  };

  return (
    <div className='container mt-5'>
      <Link className='btn btn-primary' to="/request" style={{ backgroundColor: '#FF5733', borderColor: '#FF5733' }}>Create Request</Link>
      <h2 className="mt-4 mb-3" style={{ color: '#FF5733' }}>Your Requests</h2>
      <div className='row'>
        {requests.length === 0 && <div><br /><br /><p style={{textAlign:'center', margin:"15px"}}>No request found.</p></div>}
        {requests.map(item => (
          <div className='col-12 col-md-6 col-lg-4 mb-4' key={item._id || ""}>
            <Card>
              <Card.Header style={{ backgroundColor: bgColorArray[item.request_status], color: 'white', fontSize:'110%' }}>
                <b>{item.event_name || "Untitled Event"}</b>
                <Button
                  variant="link"
                  onClick={() => toggleCollapse(item._id)}
                  aria-controls={`collapse-${item._id}`}
                  aria-expanded={open[item._id]}
                  className="float-end text-white"
                >
                  {open[item._id] ? "Hide Details" : "Show Details"}
                </Button>
              </Card.Header>
              <Card.Body>
                <Table responsive="sm" size="sm">
                  <tbody>
                    <tr>
                      <td>Status:</td>
                      <td>{status_array[item.request_status] || "Unknown"}</td>
                    </tr>
                    <tr>
                      <td>Timestamp:</td>
                      <td>{item.request_datetime || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>Location:</td>
                      <td>{item.event_location || "N/A"}</td>
                    </tr>
                  </tbody>
                </Table>
                <Collapse in={open[item._id]}>
                  <div id={`collapse-${item._id}`}>
                    <Table responsive="sm" size="sm">
                      <tbody>
                        <tr>
                          <td>Details:</td>
                          <td>{item.event_details || "N/A"}</td>
                        </tr>
                        <tr>
                          <td>Start:</td>
                          <td>{item.event_start || "N/A"}</td>
                        </tr>
                        <tr>
                          <td>End:</td>
                          <td>{item.event_end || "N/A"}</td>
                        </tr>
                        <tr>
                          <td>Equipment:</td>
                          <td>
                            {item.equipment ? item.equipment.map((eq, index) => (
                              <React.Fragment key={index}>
                                {typeof eq === "object" ? JSON.stringify(eq) : eq}
                                <br />
                              </React.Fragment>
                            )) : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td>Service:</td>
                          <td>
                            {item.services ? item.services.map((ser, index) => (
                              <React.Fragment key={index}>
                                {typeof ser === "object" ? JSON.stringify(ser) : ser}
                                <br />
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
