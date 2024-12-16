import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./AdminTable.css";

const AdminTable = ({ url, collection, columns, parameters = {}, properties = {} }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [sortField, setSortField] = useState(parameters.sort ? parameters.sort[0] : "");
  const [sortOrder, setSortOrder] = useState(parameters.order ? parameters.order[0] : "asc");

  const [filters, setFilters] = useState(() => {
    if (properties.filter && properties.filter.field) {
      return { [properties.filter.field]: null };
    }
    return {};
  });

  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    setSortField(parameters.sort ? parameters.sort[0] : "");
    setSortOrder(parameters.order ? parameters.order[0] : "asc");
  }, [parameters, collection]);

  
  useEffect(() => {
    fetchData();
  }, [collection, sortField, sortOrder, filters, page]);

  const fetchData = () => {
    setLoading(true);
    setError(null);

    const filterParam =
      properties.filter && properties.filter.field && filters[properties.filter.field]
        ? [`filter_${properties.filter.field}=${filters[properties.filter.field]}`]
        : [];

    const params = new URLSearchParams({
      ...parameters,
      sort: sortField,
      order: sortOrder,
      page,
      limit: 10,
      search: searchQuery,
      ...filterParam.reduce((acc, param) => {
        const [key, value] = param.split("=");
        acc[key] = value;
        return acc;
      }, {}),
    });

    fetch(`${url}/admin/${collection}?${params.toString()}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data");
        return response.json();
      })
      .then((result) => {
        setData(result.data);
        setTotalPages(Math.ceil(result.total / result.limit));
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  };

  const handleFilterChange = (filterField, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterField]: value,
    }));
    setPage(1);
  };

  const clearFilter = () => {
    setFilters({ [properties.filter.field]: null });
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    setPage(1);
    fetchData();
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="container mt-4">
      <h2>{collection.charAt(0).toUpperCase() + collection.slice(1)}</h2>
      <Link to={`${location.pathname}/add`} className="btn btn-primary mb-2">
        Add New
      </Link>

      {/* Search Bar */}
      {/* <div className="d-flex mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button className="btn btn-primary ms-2" onClick={handleSearchSubmit}>
          Search
        </button>
      </div> */}

      <div className="row mb-3">
        {properties.sort && properties.sort.length > 0 && (
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-6">
                <label className="form-label">Sort By:</label>
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                  className="form-select"
                >
                  {properties.sort.map(({ field, label }) => (
                    <option key={field} value={field}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Order:</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="form-select"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {properties.filter && properties.filter.field && (
          <div className="col-md-6">
            <label className="form-label me-2">Filter By {properties.filter.field}:</label>
            <div className="d-flex align-items-center flex-wrap">
              {properties.filter.options.map((option, index) => {
                const value = Object.keys(option)[0];
                const label = option[value];
                return (
                  <div key={value} className="form-check form-check-inline me-2">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="filter"
                      value={value}
                      checked={filters[properties.filter.field] === value}
                      onChange={() => handleFilterChange(properties.filter.field, value)}
                    />
                    <label className="form-check-label">{label}</label>
                  </div>
                );
              })}
              <button className="btn btn-secondary ms-3" onClick={clearFilter}>
                Clear Filter
              </button>
            </div>
          </div>
        )}
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            {columns.map(({ field, label }) => (
              <th key={field}>{label}</th>
            ))}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id} onClick={() => navigate(`${location.pathname}/update/${item._id}`)}>
              {columns.map(({ field, cell }) => (
                <td key={field}>{cell ? cell(item[field]) : item[field]}</td>
              ))}
              <td>
                <Link to={`${location.pathname}/delete/${item._id}`}
                  className="btn btn-danger btn-sm"
                  onClick={(e) => e.stopPropagation()}>
                  Delete
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setPage(page - 1)}>
              Previous
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <li key={pageNumber} className={`page-item ${pageNumber === page ? "active" : ""}`}>
              <button className="page-link" onClick={() => setPage(pageNumber)}>
                {pageNumber}
              </button>
            </li>
          ))}
          <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setPage(page + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

AdminTable.propTypes = {
  url: PropTypes.string.isRequired,
  collection: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      cell: PropTypes.func,
    })
  ).isRequired,
  parameters: PropTypes.object,
  properties: PropTypes.object,
};

export default AdminTable;
