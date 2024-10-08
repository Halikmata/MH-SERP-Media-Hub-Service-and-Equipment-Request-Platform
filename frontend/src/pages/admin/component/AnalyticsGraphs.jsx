// AnalyticsGraphs.js
import './AnalyticsGraphs.css';
import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, ArcElement, BarElement, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, ArcElement, BarElement, Tooltip, Legend);

const AnalyticsGraphs = ({ analyticsData }) => {
  const { equipments_month, top_5_requesters, top_5_services } = analyticsData;

  const equipmentData = {
    labels: equipments_month.map(item => item._id),
    datasets: [
      {
        label: 'Usage Count',
        data: equipments_month.map(item => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }
    ]
  };

  const requesterData = {
    labels: top_5_requesters.map(item => item._id),
    datasets: [
      {
        label: 'Total Requests',
        data: top_5_requesters.map(item => item.total_requests),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
      }
    ]
  };

  const serviceData = {
    labels: top_5_services.map(item => item._id),
    datasets: [
      {
        label: 'Service Count',
        data: top_5_services.map(item => item.count),
        backgroundColor: ['#FF9F40', '#FF6384', '#36A2EB', '#4BC0C0', '#9966FF']
      }
    ]
  };

  return (
    <div className='chart-grid'>
      <div className='chart chart_wide'>
        <h2>Equipment Usage This Month</h2>
        <Bar data={equipmentData} options={{ responsive: true }} />
      </div>

      <div className='chart'>
        <h2>Top 5 Requesters</h2>
        <Pie data={requesterData} options={{ responsive: true }} />
      </div>

      <div className='chart'>
        <h2>Top 5 Services</h2>
        <Pie data={serviceData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default AnalyticsGraphs;
