import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminTable from './component/AdminTable';
import AdminHeader from './component/AdminHeader';
import AddItem from './add';
import EditItem from './edit';
import Item from './edit_beta';
import Delete from './delete';
import axios from 'axios';
import AnalyticsGraphs from './component/AnalyticsGraphs';
import MyCalendar from './component/CalendarRequests';

const Admin = ({ url }) => {
  const location = useLocation(); // Hook to track the pathname changes
  const pathname = location.pathname;
  const isAdminPage = pathname.startsWith('/admin');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [calendarData, setCalendarData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(true); // Track if user is authorized
  const [loading, setLoading] = useState(true); // State to track loading state

  useEffect(() => {
    const storedUserData = sessionStorage.getItem('userData');
    if (storedUserData) {
      const user = JSON.parse(storedUserData);
      setUserData(user);
      // Check if the user is an admin
      if (!user.admin) {
        setIsAuthorized(false); // Not authorized if admin field is false
      }
    } else {
      setIsAuthorized(false); // Not authorized if no userData exists
    }
  }, []);

  useEffect(() => {
    if (!isAuthorized) return;

    const fetchData = async () => {
      try {
        const requestsResponse = await axios.get(`${url}/requests`);
        setCalendarData(requestsResponse.data);
        
        const analyticsResponse = await axios.get(`${url}/admin`);
        setAnalyticsData(analyticsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        // You can set some state here to show error message to the user if needed
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, isAuthorized]);

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  const formatAmount = (value) => {
    if (typeof value !== 'number' || isNaN(value)) {
      return 'Invalid amount';
    }
    const formattedAmount = `₱${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    return formattedAmount;
  };

  const availability = (value) => {
    const isAvailable = value === 1;
    const availabilityStyle = {
      color: isAvailable ? 'green' : 'red',
      fontWeight: 'bold'
    };
    return (
      <div style={availabilityStyle}>
        {isAvailable ? "Available" : "Not Available"}
      </div>
    );
  };

  const formatDate = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    return (new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date));
  };

  const formatDateTime = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
    const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    return (
      <>
        {formattedTime}
        <br />
        {formattedDate}
      </>
    );
  };

  // Collections and Columns
  const collectionMap = {
    '/admin/equipment': {
      collection: "equipment",
      columns: [
        { field: 'idequipment', label: 'ID' },
        { field: 'brand', label: 'Brand' },
        { field: 'model', label: 'Model' },
        { field: 'equipment_type', label: 'Type' },
        { field: 'availability', label: 'Availability', cell: availability },
        { field: 'unit_cost', label: 'Cost', cell: formatAmount }
      ],
      parameters: { sort: ["equipment_type"], order: ["asc"] },
      controls: {
        sort: [
          { field: 'equipment_type', label: 'Type' },
          { field: 'brand', label: 'Brand' },
          { field: 'idequipment', label: 'ID' },
        ],
        filter: {
          field: 'availability', options: [{ 0: 'Not available' }, { 1: 'available' }]
        }
      }
    },
    '/admin/services': {
      collection: "services",
      columns: [
        { field: 'fk_idservice', label: 'ID' },
        { field: 'name', label: 'Name' }
      ],
      parameters: { sort: ["name"], order: ["asc"] }
    },
    '/admin/requests': {
      collection: "requests",
      columns: [
        { field: 'request_datetime', label: 'Timestamp', cell: formatDateTime },
        { field: 'event_name', label: 'Name' },
        { field: 'requester_full_name', label: 'Requester' },
        { field: 'event_affiliation', label: 'Organization' },
        { field: 'event_start', label: 'Start', cell: formatDate },
        { field: 'event_end', label: 'End', cell: formatDate },
        { field: 'event_location', label: 'Location' },
        {
          field: 'request_status',
          label: 'Status',
          cell: (status) => {
            const statusArray = ["Pending", "Approved", "Declined", "Done"];
            return statusArray[status];
          }
        }
      ],
      parameters: { sort: ["request_datetime"], order: ["desc"] },
      controls: {
        filter: { field: 'request_status', options: [{ 0: "Pending" }, { 1: "Approved" }, { 2: "Declined" }, { 3: "Done" }] },
        sort: [
          { field: 'request_datetime', label: 'timestamp' },
          { field: 'request_status', label: 'status' },
          { field: 'event_start', label: 'start' },
          { field: 'event_end', label: 'end' },
        ]
      }
    },
    '/admin/accounts': {
      collection: "accounts",
      columns: [
        { field: 'date_created', label: 'Date created', cell: formatDate },
        { field: 'last_name', label: 'Lastname' },
        { field: 'first_name', label: 'Firstname' },
        { field: 'email', label: 'Email' },
        { field: 'user_type', label: 'Type' },
      ],
      parameters: { sort: ["date_created"], order: ["desc"], exclude: "password" },
      controls: {
        sort: [
          { field: 'date_created', label: 'Date created' },
          { field: 'last_name', label: 'Lastname' },
          { field: 'first_name', label: 'Firstname' },
        ],
        filter: {
          field: 'user_type', options: [{ 'Student': 'Student' }, { 'Faculty': 'Faculty' }, { 'Staff': 'Staff' }]
        }
      }
    },
    '/admin/organization': {
      collection: "organization",
      columns: [
        { field: 'acronym', label: 'Acronym' },
        { field: 'name', label: 'Name' },
        { field: 'program', label: 'Program' },
      ],
      parameters: { sort: ["acronym"], order: ["asc"] },
      controls: {
        sort: [
          { field: 'acronym', label: 'Acronym' },
          { field: 'name', label: 'Name' },
          { field: 'idcollegeoffice', label: 'College' },
        ]
      }
    },
    '/admin/college_office': {
      collection: "college_office",
      columns: [
        { field: 'acronym', label: 'Acronym' },
        { field: 'name', label: 'Name' },
        {
          field: 'is_college', label: 'Type', cell: (is_college) => {
            return is_college ? "College" : "Office";
          }
        }
      ],
      parameters: { sort: ["name"], order: ["asc"] },
      controls: {
        sort: [
          { field: 'acronym', label: 'Acronym' },
          { field: 'name', label: 'Name' },
        ],
        filter: {
          field: 'is_college', options: [{ true: 'College' }, { false: 'Office' }]
        }
      }
    }
  };

  const { collection, columns, parameters, controls } = collectionMap[pathname] || {};
  return (
    <div >
      {isAdminPage && <AdminHeader />}
      {pathname === '/admin' && (
        <div style={mainStyle}>
          <h1>Dashboard</h1>
          
          <MyCalendar requestData={calendarData}/>

          {analyticsData ? (
            <AnalyticsGraphs analyticsData={analyticsData} />
          ) : (
            <p>Loading analytics...</p>
          )}
        </div>
      )}
      {collection && (
        <AdminTable url={url} collection={collection} columns={columns} parameters={parameters} properties={controls} />
      )}
      <Routes>
        <Route path="/:collection/add" element={<AddItem url={url + "/admin/"} />} />
        <Route path="/:collection/update/:id" element={<EditItem url={url + "/admin/"} />} />
        <Route path="/:collection/delete/:id" element={<Delete url={url + "/admin/"} />} />
        <Route path="/:collection/:id" element={<Item url={url + "/admin/"} collection={collection} columns={columns} />} />
      </Routes>
    </div>
  );
};

export default Admin;

const mainStyle = {
  width: '80vw',
  marginLeft: '10vw'
};
