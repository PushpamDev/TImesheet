import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaClock, FaProjectDiagram, FaUsers, FaHome } from "react-icons/fa";
import "../styles/Sidebar.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = ({ userRole }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`d-flex ${collapsed ? "sidebar-collapsed" : "sidebar-expanded"}`} id="sidebar">
      <div className="sidebar bg-dark text-white p-3">
        {/* Sidebar Toggle Button */}
        <button className="btn btn-light mb-3" onClick={() => setCollapsed(!collapsed)}>
          <FaBars size={24} />
        </button>

        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/" className="nav-link text-white">
              <FaHome className="sidebar-icon" /> {!collapsed && " Dashboard"}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/daily-timesheet" className="nav-link text-white">
              <FaClock className="sidebar-icon" /> {!collapsed && " Daily Timesheet"}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/weekly-timesheet" className="nav-link text-white">
              <FaClock className="sidebar-icon" /> {!collapsed && " Weekly Timesheet"}
            </Link>
          </li>
          {userRole !== "Employee" && (
            <li className="nav-item">
              <Link to="/projects" className="nav-link text-white">
                <FaProjectDiagram className="sidebar-icon" /> {!collapsed && " Projects"}
              </Link>
            </li>
          )}
          {userRole === "Admin" && (
            <li className="nav-item">
              <Link to="/employees" className="nav-link text-white">
                <FaUsers className="sidebar-icon" /> {!collapsed && " Employees"}
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
