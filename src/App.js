import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import DailyTimesheet from "./pages/DailyTimesheet";
import WeeklyTimesheet from "./pages/WeeklyTimesheet";
import Projects from "./pages/Projects";
import Employees from "./pages/Employees";
import TimesheetEntry from "./components/TimesheetEntry";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <div className="d-flex">
        <Sidebar />
        <div className="container-fluid p-3">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/daily-timesheet" element={<DailyTimesheet />} />
            <Route path="/weekly-timesheet" element={<WeeklyTimesheet />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/timesheet-entry" element={<TimesheetEntry />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
