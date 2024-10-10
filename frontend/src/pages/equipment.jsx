import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ImageDisplay from '../includes/imagedisplay';
import cart from '../images/cart.png';
import './equipment.css'; //

const Equipment = ({ url }) => {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [columnList, setColumnList] = useState([]);
  const [currentSort, setCurrentSort] = useState("equipment_type");
  const [currentOrder, setCurrentOrder] = useState("1");
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState({});

  const updateOrder = (order) => setCurrentOrder(order);
  const updateSort = (item) => setCurrentSort(item);

  useEffect(() => {
    axios.get(`${url}/equipment/attributes`)
      .then(response => setColumnList(response.data))
      .catch(error => console.error(error));
  }, [url]);

  useEffect(() => {
    axios.get(`${url}/equipment`, { params: { column: currentSort, sort: currentOrder } })
      .then(response => setEquipment(response.data))
      .catch(error => console.error(error));
  }, [url, currentSort, currentOrder]);

  useEffect(() => {
    const storedIds = sessionStorage.getItem('selectedEquipmentIds');
    if (storedIds) {
      setSelectedEquipmentIds(JSON.parse(storedIds));
    }
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = equipment.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleRequestClick = (item) => {
    setSelectedEquipmentIds(prevIds => {
      const updatedIds = prevIds.includes(item.idequipment)
        ? prevIds.filter(id => id !== item.idequipment)
        : [...prevIds, item.idequipment];
      sessionStorage.setItem('selectedEquipmentIds', JSON.stringify(updatedIds));
      return updatedIds;
    });
  };

  const handleCartClick = () => {
    const selectedItems = equipment.filter(item => selectedEquipmentIds.includes(item.idequipment));
    if (selectedItems.length > 0) {
      const itemDetails = selectedItems.map(item => `Brand: ${item.brand}, Model: ${item.model}`).join('\n');
      alert(itemDetails);
    } else {
      alert('No equipment selected.');
    }
  };

  const toggleDescription = (id) => {
    setShowFullDescription(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-start mb-4">
        <select className="form-select me-3" style={{ width: '150px' }} onChange={(e) => updateSort(e.target.value)}>
          {columnList.map(item => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <select className="form-select" style={{ width: '150px' }} onChange={(e) => updateOrder(e.target.value)}>
          <option value="1">Ascending</option>
          <option value="-1">Descending</option>
        </select>
      </div>

      <h2 className="text-center mb-4">Equipment List</h2>

      <Row xs={1} md={2} lg={3} className="g-4">
        {currentItems.map(item => (
          <Col key={item.id}>
            <Card className={`equipment-card ${selectedEquipmentIds.includes(item.idequipment) ? 'selected' : ''}`}>
              <ImageDisplay imageName={item.idequipment} />
              <Card.Body className="d-flex flex-column justify-content-between">
                <Card.Title>{item.brand} {item.model}</Card.Title>
                <Card.Text>
                  {showFullDescription[item.idequipment]
                    ? item.description
                    : `${item.description.substring(0, 50)}...`}
                  {item.description.length > 50 && (
                    <span
                      style={{ color: '#FF5733', cursor: 'pointer' }}
                      onClick={() => toggleDescription(item.idequipment)}
                    >
                      {showFullDescription[item.idequipment] ? ' Show Less' : ' See More'}
                    </span>
                  )}
                </Card.Text>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span className={`badge ${item.availability === 1 ? 'bg-success' : 'bg-secondary'}`}>
                    {item.availability === 1 ? 'Available' : 'Unavailable'}
                  </span>
                  <button
                    className={`btn ${selectedEquipmentIds.includes(item.idequipment) ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => handleRequestClick(item)}
                  >
                    {selectedEquipmentIds.includes(item.idequipment) ? 'Remove' : 'Add'}
                  </button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Pagination className="justify-content-center mt-4">
        <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
        {Array.from({ length: Math.ceil(equipment.length / itemsPerPage) }, (_, i) => (
          <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(equipment.length / itemsPerPage)} />
      </Pagination>

      <div className="cart-icon" onClick={handleCartClick}>
        <img src={cart} alt="Cart" />
      </div>
    </div>
  );
};

export default Equipment;
