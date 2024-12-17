import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination, Card, Row, Col } from 'react-bootstrap';
import ImageDisplay from '../includes/imagedisplay';
import cart from '../images/cart.png';
import './equipment.css';
import Footer from '../includes/footer.jsx';

const Equipment = ({ url }) => {
  const [equipment, setEquipment] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [currentSort, setCurrentSort] = useState('equipment_type');
  const [currentOrder, setCurrentOrder] = useState('1');
  const [currentType, setCurrentType] = useState('All');
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState({});
  const [types, setTypes] = useState([]);
  const [error, setError] = useState(null);

  // Fetch equipment data
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await axios.get(`${url}/equipment`, {
          params: {
            column: currentSort,
            sort: currentOrder,
            column_instance: currentType === 'All' ? null : currentType,
          },
        });
        setEquipment(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load equipment. Please try again later.');
      }
    };
    fetchEquipment();
  }, [url, currentSort, currentOrder, currentType]);

  // Fetch distinct types when the sort column is equipment_type
  useEffect(() => {
    if (currentSort === 'equipment_type') {
      const fetchTypes = async () => {
        try {
          const response = await axios.get(`${url}/equipment/distinct`, {
            params: { column: currentSort },
          });
          setTypes(response.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchTypes();
    }
  }, [url, currentSort]);

  // Load selected equipment from session storage
  useEffect(() => {
    const storedIds = sessionStorage.getItem('selectedEquipmentIds');
    if (storedIds) {
      setSelectedEquipmentIds(JSON.parse(storedIds));
    }
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = equipment.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleRequestClick = (item) => {
    setSelectedEquipmentIds((prevIds) => {
      const updatedIds = prevIds.includes(item.idequipment)
        ? prevIds.filter((id) => id !== item.idequipment)
        : [...prevIds, item.idequipment];
      sessionStorage.setItem('selectedEquipmentIds', JSON.stringify(updatedIds));
      return updatedIds;
    });
  };

  const handleCartClick = () => {
    const selectedItems = equipment.filter((item) =>
      selectedEquipmentIds.includes(item.idequipment)
    );
    if (selectedItems.length > 0) {
      const itemDetails = selectedItems
        .map((item) => `Brand: ${item.brand}, Model: ${item.model}`)
        .join('\n');
      alert(`Selected Equipment:\n${itemDetails}`);
    } else {
      alert('No equipment selected.');
    }
  };

  const toggleDescription = (id) => {
    setShowFullDescription((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const paginationRange = (currentPage, totalPages) => {
    const totalButtons = 5;
    const halfRange = Math.floor(totalButtons / 2);
    let startPage = Math.max(1, currentPage - halfRange);
    let endPage = Math.min(totalPages, currentPage + halfRange);

    if (endPage - startPage < totalButtons - 1) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + totalButtons - 1);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - totalButtons + 1);
      }
    }

    const range = [];
    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }
    return range;
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-start mb-4">
        {currentSort === 'equipment_type' && (
          <div className="me-3">
            <select
              className="form-select short-select"
              onChange={(e) => setCurrentType(e.target.value)}
              value={currentType}
            >
              <option value="All">All</option>
              {types.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="me-3">
          <select
            className="form-select short-select"
            onChange={(e) => setCurrentSort(e.target.value)}
          >
            <option value="equipment_type">Type</option>
            <option value="brand">Brand</option>
            <option value="model">Model</option>
          </select>
        </div>
        <div className="me-3">
          <select
            className="form-select short-select"
            onChange={(e) => setCurrentOrder(e.target.value)}
          >
            <option value="1">Ascending</option>
            <option value="-1">Descending</option>
          </select>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {currentItems.length === 0 ? (
        <div className="text-center mt-4">No equipment available for the selected filters.</div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {currentItems.map((item) => (
            <Col key={item.idequipment}>
              <Card className={`equipment-card ${selectedEquipmentIds.includes(item.idequipment) ? 'selected' : ''}`}>
                <ImageDisplay imageName={item.idequipment} />
                <Card.Body>
                  <Card.Title>
                    {item.brand ? (
                      item.brand
                    ) : item.model ? (
                      item.model
                    ) : item.type ? (
                      item.type
                    ) : (
                      'Not Specified'
                    )}
                  </Card.Title>
                  <Card.Text>
                    {showFullDescription[item.idequipment]
                      ? item.description
                      : `${item.description.substring(0, 50)}${item.description.length > 50 ? '...' : ''}`}
                    {item.description.length > 50 && (
                      <span
                        className="description-toggle"
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
                      {selectedEquipmentIds.includes(item.idequipment) ? 'Remove' : 'Request'}
                    </button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Pagination className="justify-content-center mt-4 pagination-container">
        <Pagination.Prev
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &larr;
        </Pagination.Prev>
        {paginationRange(currentPage, Math.ceil(equipment.length / itemsPerPage)).map((i) => (
          <Pagination.Item key={i} active={i === currentPage} onClick={() => paginate(i)}>
            {i}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(equipment.length / itemsPerPage)}
        >
          &rarr;
        </Pagination.Next>
      </Pagination>

      <div className="cart-icon" onClick={handleCartClick} aria-label="View Cart">
        <img src={cart} alt="Shopping Cart Icon" />
        {selectedEquipmentIds.length > 0 && (
          <span className="cart-badge">{selectedEquipmentIds.length}</span>
        )}
      </div>
    </div>
  );
};

export default Equipment;
