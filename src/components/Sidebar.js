import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaClock, FaProjectDiagram, FaUsers, FaHome } from "react-icons/fa";
import "../styles/Sidebar.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = ({ userRole }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation(); // Get current URL path

  // Handle window resize to check if mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {!isMobile ? (
        // Desktop Sidebar
        <div className={`d-flex ${collapsed ? "sidebar-collapsed" : "sidebar-expanded"}`} id="sidebar">
          <div className="sidebar bg-dark text-white p-3">
            {/* Sidebar Toggle Button */}
            <button className="btn btn-light mb-3" onClick={() => setCollapsed(!collapsed)}>
              <FaBars size={24} />
            </button>

            <ul className="nav flex-column">
              <li className="nav-item">
                <Link to="/" className={`nav-link text-white ${location.pathname === "/" ? "active" : ""}`}>
                  <FaHome className="sidebar-icon" /> {!collapsed && " Dashboard"}
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/daily-timesheet" className={`nav-link text-white ${location.pathname === "/daily-timesheet" ? "active" : ""}`}>
                  <FaClock className="sidebar-icon" /> {!collapsed && " Daily Timesheet"}
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/weekly-timesheet" className={`nav-link text-white ${location.pathname === "/weekly-timesheet" ? "active" : ""}`}>
                  <FaClock className="sidebar-icon" /> {!collapsed && " Weekly Timesheet"}
                </Link>
              </li>
              {userRole !== "Employee" && (
                <li className="nav-item">
                  <Link to="/projects" className={`nav-link text-white ${location.pathname === "/projects" ? "active" : ""}`}>
                    <FaProjectDiagram className="sidebar-icon" /> {!collapsed && " Projects"}
                  </Link>
                </li>
              )}
              {userRole === "Admin" && (
                <li className="nav-item">
                  <Link to="/employees" className={`nav-link text-white ${location.pathname === "/employees" ? "active" : ""}`}>
                    <FaUsers className="sidebar-icon" /> {!collapsed && " Employees"}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      ) : (
        // Mobile Bottom Navbar
        <div id="mobile-sidebar">
          <Link to="/" className={`nav-item ${location.pathname === "/" ? "active" : ""}`}>
            <FaHome className="sidebar-icon" />
          </Link>
          <Link to="/daily-timesheet" className={`nav-item ${location.pathname === "/daily-timesheet" ? "active" : ""}`}>
            <FaClock className="sidebar-icon" />
          </Link>
          <Link to="/weekly-timesheet" className={`nav-item ${location.pathname === "/weekly-timesheet" ? "active" : ""}`}>
            <FaClock className="sidebar-icon" />
          </Link>
          {userRole !== "Employee" && (
            <Link to="/projects" className={`nav-item ${location.pathname === "/projects" ? "active" : ""}`}>
              <FaProjectDiagram className="sidebar-icon" />
            </Link>
          )}
          {userRole === "Admin" && (
            <Link to="/employees" className={`nav-item ${location.pathname === "/employees" ? "active" : ""}`}>
              <FaUsers className="sidebar-icon" />
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default Sidebar;
