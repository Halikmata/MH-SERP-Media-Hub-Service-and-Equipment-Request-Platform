import React, { useState, useEffect } from 'react';

const AdminTable = ({ url, collection, children }) => {
  const [data, setData] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchData();
  }, [collection]);

  const fetchData = () => {
    fetch(`${url}/${collection}`)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  };

  const handleCreate = () => {
    // Handle create functionality
  };

  const handleUpdate = id => {
    // Handle update functionality
  };

  const handleDelete = id => {
    // Handle delete functionality
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
      <button onClick={handleCreate}>Create</button>
      <table>
        <thead>
          <tr>
            {React.Children.map(children, child => (
              <th
                key={child.props.field}
                onClick={() => handleSort(child.props.field)}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{child}</span>
                  {sortBy === child.props.field && (
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
            <tr key={item.id}>
              {React.Children.map(children, child => (
                <td key={child.props.field}>
                  {item[child.props.field]}
                </td>
              ))}
              <td>
                <button onClick={() => handleUpdate(item.id)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
