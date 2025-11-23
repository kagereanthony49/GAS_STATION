// src/components/Sidebar.jsx

import React from 'react'
import adminImage from '../assets/admin-profile.svg'
import '../styles/Sidebar.css'

const Sidebar = ({ onNavigate }) => {
  // Each of these would typically navigate to a new page/modal
  const handleActionClick = (action) => {
    onNavigate?.(action)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-profile">
        <img src={adminImage} alt="Administrator" className="admin-image" />
        <h3>Admin Name</h3>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li onClick={() => handleActionClick('Edit Employee Credentials')}>
            EDIT EMPLOYEE CREDENTIALS
          </li>
          <li onClick={() => handleActionClick('Add New Employee')}>
            ADD NEW EMPLOYEE
          </li>
          <li onClick={() => handleActionClick('Quick Actions')}>
            QUICK ACTIONS
          </li>
          <li onClick={() => handleActionClick('View Reports')}>
            VIEW REPORTS
          </li>
          <li>
            <a href="mailto:gasproadmin@gmail.com">CONTACT US</a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;