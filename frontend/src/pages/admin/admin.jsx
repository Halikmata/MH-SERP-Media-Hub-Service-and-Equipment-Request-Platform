import React from 'react';
import AdminTable from './component/AdminTable';
import Column from './component/Column';
import TSTable from './component/TSTable';

const Admin = ({ url }) => {

  const equipment_columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'idequipment',
      },
      {
        Header: 'Brand',
        accessor: (row) => row.brand,
        Cell: ({ cell }) => renderName(cell),
      },
      {
        Header: 'Model',
        accessor: (row) => row.model,
        Cell: ({ cell }) => renderAge(cell),
      },
    ],
    []
  );

  return (
    <div>
      <h1>Admin</h1>
      <AdminTable url={url} collection={"equipment"}>
        <Column field="brand">Brand</Column>
        <Column field="model">Model</Column>
        <Column field="equipment_type">Type</Column>
        <Column field="availability">Availability</Column>
        <Column field="unit_cost">Cost</Column>
      </AdminTable>
      <AdminTable url={url} collection={"services"}>
        <Column field="idservice">ID</Column>
        <Column field="name">Name</Column>
      </AdminTable>
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

      {/* <TSTable url={url} collection={"equipment"} columns={equipment_columns}></TSTable> */}

    </div>
  );
};

export default Admin;
