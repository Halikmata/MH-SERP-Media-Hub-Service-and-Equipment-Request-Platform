import React, { useState, useEffect } from 'react';
import axios from 'axios';
import pc from '../images/Photo Coverage.png';
import sde from '../images/SDE.png';
import sr from '../images/Studio Recording.png';
import ss from '../images/Studio Shoot.png';
import vc from '../images/Video Coverage.png';
import ls from '../images/Live Streaming.png';
import "./services.css"

const serviceData = [
  {
    id: 1,
    name: 'Photo Coverage',
    imgSrc: pc,
    description: 'Photo coverage- This service provides official photo coverage for your organization\'s event including the post-production process like editing and sorting of photos.',
    bgColor:"#FFFFFF"
  },
  {
    id: 2,
    name: 'Live Streaming',
    imgSrc: ls,
    description: 'Live streaming- Live streaming of events on Facebook via Media Hub\'s official page, your organization\'s page, or cross-posting. This includes pre-production tasks creation of resources, setting up of equipment, and testing. Like the SDE, this is also rarely available as it requires a thorough discussion with the volunteers and heads of operation.',
    bgColor:"#FFFFFF"
  },
  {
    id: 3,
    name: 'Live Production',
    imgSrc: ls,
    description: 'Live production- Similar to live streaming but focuses on live feeding for events that include the use of LED screens. This service does not include operating the lights and sound system.',
    bgColor:"#FFFFFF"
  },
  {
    id: 4,
    name: 'Studio Recording',
    imgSrc: sr,
    description: 'Studio recording- This can be recording for a voice-over, song, or music production. This service requires the assistance of Media Hub\'s sound engineers and producers so expect a minimum of 7 days required notice for this.',
    bgColor:"#FFFFFF"
  },
  {
    id: 5,
    name: 'Studio Shooting',
    imgSrc: ss,
    description: 'Studio shoot- Allows your organization to utilize the studio of Media Hub for your photo shoot. This also includes the post production process like sorting and editing of photos.',
    bgColor:"#FFFFFF"
  },
  {
    id: 6,
    name: 'SDE (Same Day Edit)',
    imgSrc: sde,
    description: 'SDE- This service comes with the video coverage and requires a minimum of four Media Hub volunteers. This is a same-day-edit service and is considered as rarely available for small events. It is usually offered on events participated by large outside entities like government offices or big organizations as this service require a thorough discussion with the volunteers.',
    bgColor:"#FFFFFF"
  },
  {
    id: 7,
    name: 'Video Coverage',
    imgSrc: vc,
    description: 'Video coverage- This service provides video coverage for your event as well as a single video output for an overall edit. Should you require multiple outputs, kindly consult the manager of Media Hub, Ms. Yna Liao, for the details.',
    bgColor:"#FFFFFF"
  }
];

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
  }, [url]);

  return (
    <div className="container">
      <div>
        <h2>Service List</h2>
      </div>
      <main className="main">
        {serviceData.map(service => (
          <section key={service.id} className="service-section" style={{backgroundColor:service.bgColor}}>
            <p className="text-start fs-3">{service.name}</p>
            <img src={service.imgSrc} className="service-image rounded" alt={service.name}></img>
            <p>{service.description}</p>
          </section>
        ))}
      </main>
      <footer className="footer">
        <p>&copy; PSU Media Hub</p>
      </footer>
    </div>
  );
}

export default Services;
