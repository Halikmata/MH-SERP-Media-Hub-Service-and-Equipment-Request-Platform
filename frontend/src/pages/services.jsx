import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "./services.css";

const Services = ({ url }) => {
  const [imageSrc, setImageSrc] = useState({});
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [services, setServices] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState({});
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = services.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = pageNumber => setCurrentPage(pageNumber);

  useEffect(() => {
    axios.get(`${url}/services`)
      .then(response => setServices(response.data))
      .catch(error => console.error(error));
  }, [url]);


  useEffect(() => {
    const loadImages = async () => {
      const imgDir = {}; // Create a new object to store image paths
  
      const promises = services.map(async (service) => {
        const module = await import(service.imgSrc);
        imgDir[service.imgSrc] = module.default;
      });
  
      await Promise.all(promises);
      setImageSrc(imgDir);
    };
  
    loadImages(); // Call the async function
  }, [services]);


  const toggleDescription = (id) => {
    setShowFullDescription(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  const handleRequestClick = (service) => {
    navigate('/request', { state: { service } });
  };

  return (
    <div className="container services-container mt-5">
      <h2 className="text-center mb-4">Our Services</h2>
      <div className="row">
        {currentItems.map(service => (
          <div key={service.fk_idservice} className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="service-card">  {/* style={{ width: "100%" , height: "200px" }}, the classname config does not work with the new img import for some reason */}
              <img src={imageSrc[service.imgSrc]} style={{ width: "100%" , height: "200px" }} alt={service.name} className="service-image rounded-top"/>
              <div className="service-card-body">
                <h5 className="service-title">{service.name}</h5>

                <p className="service-description">
                  {showFullDescription[service.description] ? service.description :` ${service.description.substring(0, 100)}${service.description.length > 100 ? '...' : ''}`}
                  {service.description.length > 100 ? (
                    <span
                    className="description-toggle"
                    onClick={() => toggleDescription(service.description)}
                    >
                      {showFullDescription[service.description] ? ' Show Less' : ' See More'}
                    </span>

                  ) : null }
                </p>

                <button 
                  className="btn btn-primary custom-btn w-100 mt-3"
                  onClick={() => handleRequestClick(service)}
                >
                  Request Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination className="justify-content-center mt-4 pagination-container">
        <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>&larr;</Pagination.Prev>
        {Array.from({ length: Math.ceil(services.length / itemsPerPage) }, (_, i) => (
          <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(services.length / itemsPerPage)}>&rarr;</Pagination.Next>
      </Pagination>
    </div>
  );
}

export default Services;
