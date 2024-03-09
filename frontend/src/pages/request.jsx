import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Requests = () => {
  const [requests, setRequest] = useState([]);

  var fake_api = 'http://127.0.0.1:3001/requests'
  var backend_api = 'http://127.0.0.1:5000/requests'

  useEffect(() => {
    axios.get(backend_api)
      .then(response => {
        setRequest(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h2>Requests List</h2>
      <table>
        <thead>
          <tr>
            <th>Event</th>
            <th>Requester</th>
            <th>Event Affiliation</th>
            <th>Details</th>
            <th>Location</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(item => (
            <tr key={item.id}>
              <td>{item.event_name}</td>
              <td>{item.requester_affiliation}</td>
              <td>{item.event_affiliation}</td>
              <td>{item.event_details}</td>
              <td>{item.event_location}</td>
              <td>{item.request_start}</td>
              <td>{item.request_end}</td>
              <td>{item.request_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Requests;
