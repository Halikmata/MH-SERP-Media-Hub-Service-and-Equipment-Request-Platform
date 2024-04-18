import React from 'react';
import AdminTable from './component/AdminTable';
import AdminHeader from './component/AdminHeader';
import Column from './component/Column';
import EditItemPage from './edit';

const Admin = ({ url }) => {
  const pathname = window.location.pathname;

  const isAdminPage = pathname.startsWith('/admin');

  // Determine which collection is being accessed based on the URL path
  let collection;
  if (pathname.startsWith('/admin/equipment')) {
    collection = "equipment";
  } else if (pathname.startsWith('/admin/services')) {
    collection = "services";
  } else if (pathname.startsWith('/admin/requests')) {
    collection = "requests";
  }

  return (
    <div>
      {isAdminPage && <AdminHeader />}
      {pathname === '/admin' && <h1>Dashboard</h1>}
      {collection === "equipment" && (
        <AdminTable url={url} collection={"equipment"}>
          <Column field="brand">Brand</Column>
          <Column field="model">Model</Column>
          <Column field="equipment_type">Type</Column>
          <Column field="availability">Availability</Column>
          <Column field="unit_cost">Cost</Column>
        </AdminTable>
      )}
      {collection === "services" && (
        <AdminTable url={url} collection={"services"}>
          <Column field="idservice">ID</Column>
          <Column field="name">Name</Column>
        </AdminTable>
      )}
      {collection === "requests" && (
        <AdminTable url={url} collection={"requests"}>
          <Column field="idrequests">ID</Column>
          <Column field="event_name">Name</Column>
          <Column field="requester_full_name">Requester</Column>
          <Column field="event_affiliation">Organization</Column>
          <Column field="request_start">Start</Column>
          <Column field="request_end">End</Column>
          <Column field="event_location">Location</Column>
          <Column field="requester_status">Status</Column>
        </AdminTable>
      )}
    </div>
  );
};

export default Admin;
