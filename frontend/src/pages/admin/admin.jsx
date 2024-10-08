import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminTable from './component/AdminTable';
import AdminHeader from './component/AdminHeader';
import AddItem from './add';
import EditItem from './edit';
import Item from './edit_beta';
import Delete from './delete';
import axios from 'axios';
import AnalyticsGraphs from './component/AnalyticsGraphs';

const Admin = ({ url }) => {
  const pathname = window.location.pathname;
  const isAdminPage = pathname.startsWith('/admin');
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);


  // Formatting
  const formatAmount = (value) => {
    if (typeof value !== 'number' || isNaN(value)) {
      return 'Invalid amount';
    }

    const formattedAmount = `₱${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    return formattedAmount;
  };

  useEffect(() => {
    axios.get(`${url}/admin/equipment_type`)
      .then((response) => {
        setEquipmentTypes(response.data);
      })
      .catch((error) => {
        console.error('Error fetching equipment types:', error);
      });

    axios.get(`${url}/admin`)
      .then((response) => {
        setAnalyticsData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching analytics data:', error);
      });

  }, [url]);

  const equipmentType = (fk_idequipment_type) => {
    const equipmentType = equipmentTypes.find((type) => type.fk_idequipment_type === fk_idequipment_type);

    return equipmentType ? equipmentType.name : "Unknown Type";
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
  }

  // Collections and Columns

  const collectionMap = {
    '/admin/equipment': {
      collection: "equipment",
      columns: [
        { field: 'brand', label: 'Brand' },
        { field: 'model', label: 'Model' },
        { field: 'equipment_type', label: 'Type', cell: equipmentType },
        { field: 'availability', label: 'Availability', cell: availability },
        { field: 'unit_cost', label: 'Cost', cell: formatAmount }
      ]
    },
    '/admin/services': {
      collection: "services",
      columns: [
        { field: 'fk_idservice', label: 'ID' },
        { field: 'name', label: 'Name' }
      ]
    },
    '/admin/requests': {
      collection: "requests",
      columns: [
        { field: 'idrequests', label: 'ID' },
        { field: 'event_name', label: 'Name' },
        { field: 'requester_full_name', label: 'Requester' },
        { field: 'event_affiliation', label: 'Organization' },
        { field: 'event_start', label: 'Start' },
        { field: 'event_end', label: 'End' },
        { field: 'event_location', label: 'Location' },
        {
          field: 'equipment',
          label: 'Equipment',
          cell: (equipmentArray) => {
            return equipmentArray.join('\n');
          }
        },
        { field: 'services', label: 'Services' },
        {
          field: 'request_status',
          label: 'Status',
          cell: (status) => {
            const statusArray = ["Pending", "Approved", "Declined", "Done"];
            return statusArray[status];
          }
        }
      ]
    },
    '/admin/accounts': {
      collection: "accounts",
      columns: [
        { field: 'last_name', label: 'Lastname' },
        { field: 'first_name', label: 'Firstname' },
        { field: 'email', label: 'email' }
      ]
    },
    '/admin/organization': {
      collection: "organization",
      columns: [
        { field: 'acronym', label: 'Acronym' },
        { field: 'name', label: 'Name' },
        { field: 'program', label: 'Program' },
      ]
    },
    '/admin/college_office': {
      collection: "college_office",
      columns: [
        { field: 'fk_idcollegeoffice', label: 'ID' },
        { field: 'name', label: 'Name' },
        { field: 'type', label: 'Type' }
      ]
    },
  };

  const { collection, columns } = collectionMap[pathname] || {};

  return (
    <div >
      {isAdminPage && <AdminHeader />}
      {pathname === '/admin' && (
        <div style={mainStyle}>
          <h1>Dashboard</h1>
          {analyticsData ? (
            <AnalyticsGraphs analyticsData={analyticsData} />
          ) : (
            <p>Loading analytics...</p>
          )}
        </div>
      )}
      {collection && (
        <AdminTable url={url} collection={collection} columns={columns} />
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


const equipment_type = (value) => {
  const formattedAmount = `${value}`;
  return formattedAmount;
};

const mainStyle = {
  width: '80vw',
  marginLeft: '10vw'
}