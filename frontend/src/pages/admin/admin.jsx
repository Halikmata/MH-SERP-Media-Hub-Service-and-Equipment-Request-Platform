import React, { useState, useEffect } from 'react';
import axios from 'axios';

import AdminTable from './component/AdminTable';

const Admin = () => {

  return (
    <div>
      <h1>Admin</h1>
      <AdminTable collection={"equipment"} not_include={["description"]}></AdminTable>
      <AdminTable collection={"services"} not_include={["idservice"]}></AdminTable>
      <AdminTable collection={"requests"}></AdminTable>
    </div>
  );
};

export default Admin;
