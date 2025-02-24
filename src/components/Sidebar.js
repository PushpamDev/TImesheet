import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaClock, FaProjectDiagram, FaUsers, FaHome } from "react-icons/fa";
import "./styles/Sidebar.css"; // Fixed import path for CSS
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`d-flex ${collapsed ? "sidebar-collapsed" : "sidebar-expanded"}`} id="sidebar">
      <div className="sidebar bg-dark text-white p-3">
        <button className="btn btn-light mb-3" onClick={() => setCollapsed(!collapsed)}>
          <FaBars />
        </button>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/" className="nav-link text-white">
              <FaHome /> {!collapsed && " Dashboard"}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/daily-timesheet" className="nav-link text-white">
              <FaClock /> {!collapsed && " Daily Timesheet"}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/weekly-timesheet" className="nav-link text-white">
              <FaClock /> {!collapsed && " Weekly Timesheet"}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/projects" className="nav-link text-white">
              <FaProjectDiagram /> {!collapsed && " Projects"}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/employees" className="nav-link text-white">
              <FaUsers /> {!collapsed && " Employees"}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
