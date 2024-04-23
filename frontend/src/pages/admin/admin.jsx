import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminTable from './component/AdminTable';
import AdminHeader from './component/AdminHeader';
import AddItem from './add'; // Import AddItem component

const Admin = ({ url }) => {
  const pathname = window.location.pathname;

  const isAdminPage = pathname.startsWith('/admin');

  const collectionMap = {
    '/admin/equipment': {
      collection: "equipment",
      columns: [
        { field: 'brand', label: 'Brand' },
        { field: 'model', label: 'Model' },
        { field: 'equipment_type', label: 'Type' },
        { field: 'availability', label: 'Availability' },
        { field: 'unit_cost', label: 'Cost', cell: formatAmount }
      ]
    },
    '/admin/services': {
      collection: "services",
      columns: [
        { field: 'idservice', label: 'ID' },
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
        { field: 'request_start', label: 'Start' },
        { field: 'request_end', label: 'End' },
        { field: 'event_location', label: 'Location' },
        {
          field: 'requester_status',
          label: 'Status',
          cell: renderSelectCell,
          options: ['approved', 'pending', 'declined']
        }
      ]
    },
    '/admin/accounts': {
      collection: "accounts",
      columns: [
        { field: 'last_name', label: 'Lastname' },
        { field: 'first_name', label: 'Firstname' },
        { field: 'gmail', label: 'email' }
      ]
    },
    '/admin/organization': {
      collection: "organization",
      columns: [
        { field: 'acronym', label: 'Acronym' },
        { field: 'name', label: 'Name' },
      ]
    },
    '/admin/college_office': {
      collection: "college_office",
      columns: [
        { field: 'fk_idcollegeoffice', label: 'ID' },
        { field: 'name', label: 'Name' },
      ]
    },
  };

  const { collection, columns } = collectionMap[pathname] || {};

  return (
    <div >
      {isAdminPage && <AdminHeader />}
      {pathname === '/admin' && <h1>Dashboard</h1>}
      {collection && (
        <AdminTable url={url} collection={collection} columns={columns} />
      )}
      <Routes>
        <Route path="/:collection/add" element={<AddItem url={url + "/admin/"} />} />
      </Routes>
    </div>
  );
};

export default Admin;


const formatAmount = (value) => {
  const formattedAmount = `${value} php`;
  return formattedAmount;
};



const renderSelectCell = (value, options) => {
  return (
    <select value={value}>
      {options.map((option, index) => (
        <option key={index} value={option}>{option}</option>
      ))}
    </select>
  );
};
