import React, { useState, useEffect } from 'react';

function AdminTable({ collection, not_include = [] }) {
  not_include.push("_id")
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data based on collection
    fetchData();
  }, [collection]);

  const fakeUrl = 'http://127.0.0.1:3001';
  const backendUrl = 'http://127.0.0.1:5000';
  const url = backendUrl;

  const fetchData = () => {
    // Fetch data from API
    fetch(`${url}/${collection}`)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  };

  const handleCreate = () => {
    // Handle create functionality
  };

  const handleUpdate = (id) => {
    // Handle update functionality
  };

  const handleDelete = (id) => {
    // Handle delete functionality
  };

  const getFields = () => {
    // Get all unique fields from data
    const fields = new Set();
    data.forEach(item => {
      Object.keys(item).forEach(key => {
        if (!not_include.includes(key)) { // Check if the field is not in the not_include list
          fields.add(key);
        }
      });
    });
    return Array.from(fields);
  };

  return (
    <div>
      <h2>{collection}</h2>
      <button onClick={handleCreate}>Create</button>
      <table>
        <thead>
          <tr>
            {getFields().map(field => (
              <th key={field}>{field}</th>
            ))}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              {getFields().map(field => (
                <td key={field}>{item[field]}</td>
              ))}
              <td>
                <button onClick={() => handleUpdate(item.id)}>Update</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTable;
