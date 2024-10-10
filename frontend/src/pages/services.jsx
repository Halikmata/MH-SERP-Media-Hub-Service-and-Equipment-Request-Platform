import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import pc from '../images/Photo Coverage.png';
import sde from '../images/SDE.png';
import sr from '../images/Studio Recording.png';
import ss from '../images/Studio Shoot.png';
import vc from '../images/Video Coverage.png';
import ls from '../images/Live Streaming.png';
import "./services.css";

const serviceData = [
  {
    id: 1,
    name: 'Photo Coverage',
    imgSrc: pc,
    description: 'This service provides official photo coverage for your organization\'s event, including post-production editing and sorting of photos.',
  },
  {
    id: 2,
    name: 'Live Streaming',
    imgSrc: ls,
    description: 'Live streaming of events on Facebook via Media Hub\'s official page, your organization\'s page, or cross-posting.',
  },
  {
    id: 3,
    name: 'Live Production',
    imgSrc: ls,
    description: 'Similar to live streaming, focusing on live feeds for events with LED screens. Excludes operating the lights and sound system.',
  },
  {
    id: 4,
    name: 'Studio Recording',
    imgSrc: sr,
    description: 'Studio recording for voice-over, song, or music production, requiring Media Hub\'s sound engineers and producers.',
  },
  {
    id: 5,
    name: 'Studio Shooting',
    imgSrc: ss,
    description: 'Utilize the Media Hub studio for photo shoots, including post-production sorting and editing of photos.',
  },
  {
    id: 6,
    name: 'SDE (Same Day Edit)',
    imgSrc: sde,
    description: 'Same-day-edit service, often for larger events involving external entities. Requires extensive planning and volunteers.',
  },
  {
    id: 7,
    name: 'Video Coverage',
    imgSrc: vc,
    description: 'Provides video coverage and a single video output for an event. Consult with Media Hub management for multiple outputs.',
  }
];

const Services = ({ url }) => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios.get(`${url}/services`)
      .then(response => {
        setServices(response.data);
      })
      .catch(error => console.error(error));
  }, [url]);

  const handleRequestClick = (service) => {
    navigate('/request', { state: { service } });
  };

  return (
    <div className="container services-container mt-5">
      <h2 className="text-center mb-4">Our Services</h2>
      <div className="row">
        {serviceData.map(service => (
          <div key={service.id} className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="service-card">
              <img src={service.imgSrc} alt={service.name} className="service-image rounded-top" />
              <div className="service-card-body">
                <h5 className="service-title">{service.name}</h5>
                <p className="service-description">{service.description}</p>
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
      <footer className="text-center mt-4">
        <p>&copy; PSU Media Hub</p>
      </footer>
    </div>
  );
}

export default Services;
