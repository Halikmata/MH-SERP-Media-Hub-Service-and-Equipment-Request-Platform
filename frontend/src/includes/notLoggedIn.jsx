import React from 'react'
import { Link } from 'react-router-dom';

function NotLoggedIn({ children }) {

  return (
    <div>
      <h2>{children}</h2>
      <Link className='btn btn-primary' to="/login">Go to log in</Link>
    </div>
  );
};

export default NotLoggedIn;