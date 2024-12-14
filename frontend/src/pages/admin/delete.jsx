import React from 'react';
import {useState, useEffect} from 'react';
import { Alert, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function Delete({url}) {
    const { collection, id } = useParams();
    const [originalData, setOriginalData] = useState({});
    const navigate = useNavigate();
    
    useEffect(() => {
      axios.get(`${url}${collection}/update/${id}`)
      .then((response) => {
          setOriginalData(response.data)
      })
      .catch((error) => {
          console.error('Error fetching item:', error);
      })
    }, [url])

    function activity_log() {
      const userData = JSON.parse(sessionStorage.getItem('userData'))
      const get_date = new Date()
      const todays_date = `${get_date.getMonth() + 1}-${get_date.getDate()}-${get_date.getFullYear()}`
      const todays_time = `${get_date.getHours().toString().padStart(2, '0')}:${get_date.getMinutes().toString().padStart(2, '0')}`

      const activity_report = {
        username: userData.username,
        collection: collection,
        action: "Deleted an Instance",
        timestamp: `${todays_date} || ${todays_time}`,
        details: originalData
      }

      const newURL = url.includes("admin/") ? url.replace("admin/", "") : url
      axios.post(`${newURL}/activity_log/create`, activity_report) // specific app route to manage object id and date.
      .then(response => {
        console.log('Action Logged successfully:', response.data)
      })
      .catch(error => {
        console.error('Error creating a report for activity log:', error)
      })
  }

    const onConfirm = async () => {
        try {
          const response = await axios.delete(`${url}${collection}/delete/${id}`);
    
          if (response.status === 201) {
            console.log('Item deleted successfully!');
            activity_log()
            navigate(`/admin/${collection}`); 
          } else {
            console.error('Error deleting item:', response.data.message);
          }
        } catch (error) {
          console.error('Error deleting item:', error);
        }
      };

      function onCancel(){
        navigate(`/admin/${collection}`);
    }

  return (
    <Alert variant="danger">
      <Alert.Heading>Are you sure you want to delete this item?</Alert.Heading>
      <p>This action cannot be undone. Please confirm whether you want to proceed with the deletion.</p>
      <div className="d-flex justify-content-end">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm}>Confirm Deletion</Button>
      </div>
    </Alert>
  );
}

export default Delete;
