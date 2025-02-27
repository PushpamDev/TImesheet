import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import DailyTimesheet from "./pages/DailyTimesheet";
import WeeklyTimesheet from "./pages/WeeklyTimesheet";
import Projects from "./pages/Projects";
import Employees from "./pages/Employees";
import TimesheetEntry from "./components/TimesheetEntry";
import Login from "./pages/Login";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <div className="d-flex">
        {user && <Sidebar userRole={user.role} />} 
        <div className="container-fluid p-3">
          <Routes>
            {!user ? (
              <Route path="*" element={<Login setUser={setUser} />} />
            ) : (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/daily-timesheet" element={<DailyTimesheet />} />
                <Route path="/weekly-timesheet" element={<WeeklyTimesheet />} />
                {user.role !== "Employee" && <Route path="/projects" element={<Projects />} />}
                {user.role === "Admin" && <Route path="/employees" element={<Employees />} />}
                <Route path="/timesheet-entry" element={<TimesheetEntry />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
