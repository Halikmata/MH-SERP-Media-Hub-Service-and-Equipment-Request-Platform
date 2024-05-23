import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination, Card, Row, Col } from 'react-bootstrap';
import ImageDisplay from '../includes/imagedisplay';

const Equipment = ({ url }) => {
  const [equipment, setEquipment] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Number of items per page

  useEffect(() => {
    axios.get(`${url}/equipment`)
      .then(response => {
        setEquipment(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios.get(`${url}/equipment_type`)
      .then(response => {
        if (Array.isArray(response.data)) {
          const typesObject = response.data.reduce((acc, curr) => {
            acc[curr.fk_idequipment_type] = curr.name;
            return acc;
          }, {});
          setEquipmentTypes(typesObject);
        } else {
          console.error('Expected array but got', response.data);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, [url]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = equipment.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4" style={{ color: '#FF5733' }}>Equipment List</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {currentItems.map(item => (
          <Col key={item.id}>
            <Card className="h-100" style={{ border: 'none' }}>
              <div style={{ textAlign: 'center' }}>
                <ImageDisplay imageName={item.idequipment} />
              </div>
              <Card.Body style={{ height: '18rem' }}>
                <Card.Title style={{ color: '#333', fontSize: '1.2rem', fontWeight: 'bold' }}>{item.brand} {item.model}</Card.Title>
                <Card.Text style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{item.description}</Card.Text>
                <Card.Text style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Type: <b>{equipmentTypes[item.equipment_type]}</b></Card.Text>
                <Card.Text style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Location: <b>{item.equipment_location}</b></Card.Text>
                <div className="d-grid">
                  <button className="btn btn-primary" style={{ backgroundColor: '#FF5733', borderColor: '#FF5733', width: '100%' }}>Request Now</button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Pagination className="justify-content-center mt-4" style={{ color: '#FF5733' }}>
        <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
        {Array.from({ length: Math.ceil(equipment.length / itemsPerPage) }, (_, i) => (
          <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(equipment.length / itemsPerPage)} />
      </Pagination>
    </div>
  );
};

export default Equipment;
