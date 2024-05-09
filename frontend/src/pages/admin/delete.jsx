import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function Delete({url}) {
    const { collection, id } = useParams();
    const navigate = useNavigate();


    const onConfirm = async () => {
        try {
          const response = await axios.delete(`${url}${collection}/delete/${id}`);
    
          if (response.status === 201) {
            console.log('Item deleted successfully!');
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
