import React from 'react'

function renderSelectCell(value, options, handleChange) {

  return (
    <select value={value} className="form-select" onChange={(e) => handleChange(e.target.value)}>
      {Object.entries(options).map(([index, option]) => (
        <option key={index} value={index}>
          {option}
        </option>
      ))}
    </select>
  );
}

export default renderSelectCell
