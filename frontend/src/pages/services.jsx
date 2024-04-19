import React, { useState, useEffect } from 'react';
import axios from 'axios';
import img1 from '../images/mhpic1.png';
import "./services.css"

const Services = ({ url }) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios.get(url + '/services')
      .then(response => {
        setServices(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div className="container">
      <div>
        <h2>Service List</h2>
        {/* <ul>
          {services.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul> */}
      </div>
      <main className="main">
        <section className="photo-coverage">
            <p className="text-start fs-3">Photo Coverage</p>
            <img src={img1} className="rounded" alt="..."></img>
            <p>This is a photo coverage</p>
        </section>
        <section className="photo-coverage">
            <p className="text-start fs-3">Photo Coverage</p>
            <img src={img1} className="rounded" alt="..."></img>
            <p>This is a photo coverage</p>
        </section>
        <section className="video-coverage">
            <p className="fs-3">Video Coverage</p>
            <img src={img1} className="rounded" alt="..."></img>
            <p>This is a video coverage</p>
        </section>
        <section className="same-day-edit">
          <p className="fs-3">SDE (Same Day Edit)</p>
          <img src={img1} className="rounded" alt="..."></img>
          <p>This is a same day edit</p>
        </section>
      </main>
      <footer className="footer">
        <p>&copy; PSU Media Hub</p>
      </footer> 
    </div>
  );
}

export default Services;