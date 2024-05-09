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
    <div className="container mt-4">
      <h2>{collection}</h2>
      <Link to={`${location.pathname}/add`} className="btn btn-primary mb-2">Add</Link>
      <table className="table">
        <thead className="thead-dark">
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
              {columns.map(({ field, cell }) => (
                <td key={field}>
                  {cell ? cell(item[field]) : item[field]}
                </td>
              ))}
              <td>
                <Link to={`${location.pathname}/update/${item._id}`} className="btn btn-sm btn-info mr-2">Edit</Link>
                <Link to={`${location.pathname}/delete/${item._id}`} className="btn btn-sm btn-danger">Delete</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
