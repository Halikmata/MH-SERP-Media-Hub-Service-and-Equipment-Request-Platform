import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AdminTable = ({ url, collection, columns, children }) => {
  const [data, setData] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const location = useLocation();

  useEffect(() => {
    fetchData();
  }, [collection]);

  const fetchData = () => {
    fetch(`${url}/${collection}`)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  };

  const handleSort = field => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortBy && a[sortBy] && b[sortBy]) {
      if (sortOrder === "asc") {
        return a[sortBy].localeCompare(b[sortBy]);
      } else {
        return b[sortBy].localeCompare(a[sortBy]);
      }
    }
    return 0;
  });

  return (
    <div>
      <h2>{collection}</h2>
      <Link to={`${location.pathname}/add`}>Add</Link>
      <table>
        <thead>
          <tr>
            {columns.map(({ field, label }) => (
              <th
                key={field}
                onClick={() => handleSort(field)}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{label}</span>
                  {sortBy === field && (
                    <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                  )}
                </div>
              </th>
            ))}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map(item => (
            <tr key={item._id}>
              {columns.map(({ field, cell, options }) => (
                <td key={field}>
                  {cell ? cell(item[field], options) : item[field]}
                </td>
              ))}
              <td>
                <Link to={`${location.pathname}/edit/${item._id}`}>Edit</Link>
                <Link to={`${location.pathname}/delete/${item._id}`}>Delete</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
