import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination } from 'react-bootstrap';

const Equipment = ({ url }) => {
  const [equipment, setEquipment] = useState([]);
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

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = equipment.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="container mt-5">
      <h2 className="mb-4" style={{ color: '#FF5733' }}>Equipment List</h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {currentItems.map(item => (
          <div key={item.id} className="col">
            <div className="card h-100" style={{ backgroundColor: '#FCEADE' }}>
              <div className="card-body">
                <h5 className="card-title">{item.brand} {item.model}</h5>
                <p className="card-text">{item.description}</p>
                <p className="card-text">Type: {item.equipment_type}</p>
                <p className="card-text">Location: {item.equipment_location}</p>
                {/* <p className="card-text">Unit Cost: {item.unit_cost}</p> */}
              </div>
            </div>
          </div>
        ))}
      </div>
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
