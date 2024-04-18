import React from 'react';

const Home = () => {
  const newsData = [
    {
      id: 1,
      title: "New feature added!",
      description: "We've added a new feature that allows users to request equipment more easily.",
      date: "April 19, 2024"
    },
    {
      id: 2,
      title: "Service maintenance",
      description: "Scheduled maintenance will be performed on our servers on April 25, 2024. Expect some downtime during this period.",
      date: "April 18, 2024"
    },
    {
      id: 3,
      title: "Service outage resolved",
      description: "The recent service outage has been resolved. All services are now operating normally.",
      date: "April 16, 2024"
    }
  ];

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4" style={{ color: '#FF5733' }}>What's New?</h2>
      <div className="row">
        {newsData.map(newsItem => (
          <div key={newsItem.id} className="col-md-4 mb-4">
            <div className="card h-100" style={{ backgroundColor: '#FCEADE' }}>
              <div className="card-body">
                <h5 className="card-title">{newsItem.title}</h5>
                <p className="card-text">{newsItem.description}</p>
                <p className="card-text"><small className="text-muted">{newsItem.date}</small></p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 text-center">
        <h2>Media Hub's Services and Equipments Request Platform</h2>
        <p>Welcome to Media Hub's Services and Equipments Request Platform. This platform is designed to facilitate the request of services and equipment by students and faculty of Palawan State University. Whether you need equipment for your project or services for an event, you can easily make requests through this platform.</p>
        <p>Our platform offers a user-friendly interface, allowing you to browse available equipment, submit requests, and track the status of your requests. With a wide range of equipment and services available, you can find everything you need to support your academic and extracurricular activities.</p>
        <p>Have a question or need assistance? Our support team is here to help. Feel free to reach out to us if you have any inquiries or encounter any issues while using the platform.</p>
        <p>Thank you for choosing Media Hub's Services and Equipments Request Platform. We look forward to serving you!</p>
      </div>
    </div>
  );
};

export default Home;
