import React, { useState, useEffect } from 'react';
import axios from 'axios';

import AdminTable from './component/AdminTable';

const Admin = ({url}) => {

  return (
    <div>
      <h1>Admin</h1>
      <AdminTable url={url} collection={"equipment"} not_include={["description"]}></AdminTable>
      <AdminTable url={url} collection={"services"} not_include={["idservice"]}></AdminTable>
      <AdminTable url={url} collection={"requests"}></AdminTable>
    </div>
  );
};

export default Admin;
