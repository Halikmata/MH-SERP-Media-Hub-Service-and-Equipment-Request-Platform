import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination, Card, Row, Col, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ImageDisplay from '../includes/imagedisplay';

const Equipment = ({ url }) => {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Number of items per page
  const [columnList, setColumnList] = useState([]);
  const [currentSort, setCurrentSort] = useState("equipment_type");
  const [currentOrder, setCurrentOrder] = useState("1");

  function updateOrder(order) { // 1 = Ascending, -1 = Descending
    setCurrentOrder(order);
  }

  function updateSort(item) {
    setCurrentSort(item);
  }

  useEffect(() => { // List of attributes
    axios.get(`${url}/equipment/attributes`)
      .then(response => {
        setColumnList(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [url, currentSort, currentOrder]);

  useEffect(() => {
    axios.get(`${url}/equipment?`, {
      params: {
        column: currentSort,
        sort: currentOrder,
      },
    })
      .then(response => {
        setEquipment(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [url, currentSort, currentOrder]);

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

  const handleRequestClick = (item) => {
    navigate('/request', { state: { equipment: item } });
  };

  return (
    <div className="container mt-5">
      {/* Sorting Options - Aligned to the side */}
      <div className="d-flex justify-content-start mb-4">
        <div className="me-3">
          <select
            className="form-select"
            style={{
              backgroundColor: 'transparent', // Removing fill color
              color: '#333', // Text color
              borderColor: '#FF5733', // Border color matching theme
              width: 'auto',
            }}
            onChange={(e) => updateSort(e.target.value)}
          >
            {columnList.map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="me-3">
          <select
            className="form-select"
            style={{
              backgroundColor: 'transparent', // Removing fill color
              color: '#333', // Text color
              borderColor: '#FF5733', // Border color matching theme
              width: 'auto',
            }}
            onChange={(e) => updateOrder(e.target.value)}
          >
            <option value="1">Ascending</option>
            <option value="-1">Descending</option>
          </select>
        </div>
      </div>

      <h2 className="text-center mb-4" style={{ color: '#FF5733' }}>Equipment List</h2><br />
      <Row xs={1} md={2} lg={3} className="g-4">
        {currentItems.map(item => (
          <Col key={item.id}>
            <Card style={{ border: 'none', position: 'relative', paddingTop: "20px", margin: '10px' }}>
              <div style={{ textAlign: 'center', justifyItems: 'center' }}>
                <ImageDisplay imageName={item.idequipment} />
                <br />
                <div style={{ width: '100%', display: "grid", justifyItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', alignSelf: 'center' }}>
                    <span className={`badge ${item.availability === "1" ? 'bg-success' : 'bg-secondary'}`}
                      style={{ borderRadius: '50%', width: '15px', height: '15px' }}>
                    </span>
                    <span style={{ marginLeft: '10px', color: '#666' }}>
                      {item.availability === "1" ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              </div>
              <Card.Body style={{ height: '12rem' }}>
                <Card.Title style={{ color: '#333', fontSize: '1.2rem', fontWeight: 'bold' }}>{item.brand} {item.model}</Card.Title>
                <Card.Text style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{item.description}</Card.Text>
                <Card.Text style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Type: <b>{equipmentTypes[item.equipment_type]}</b></Card.Text>
                <Card.Text style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Location: <b>{item.equipment_location}</b></Card.Text>
              </Card.Body>
              <div className="d-grid">
                <button className="btn btn-primary"
                  style={{
                    backgroundColor: '#FF5733',
                    borderColor: '#FF5733',
                    width: '100%',
                  }}
                  onClick={() => handleRequestClick(item)}
                >
                  Request Now
                </button>
              </div>
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