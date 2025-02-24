import React, { useState } from "react";
import { Table, Button, Card, Collapse, Form } from "react-bootstrap";
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp, FaFilter } from "react-icons/fa";
import "./WeeklyTimesheet.css";

const WeeklyTimesheet = () => {
  // Sample data for weekly timesheet
  const [weeklyEntries, setWeeklyEntries] = useState([
    {
      weekRange: "12/02/2025 - 18/02/2025",
      timesheets: [
        { id: 101, date: "12/02/2025", day: "Monday", totalHours: 8, status: "Approved" },
        { id: 102, date: "13/02/2025", day: "Tuesday", totalHours: 7, status: "Pending" },
        { id: 103, date: "14/02/2025", day: "Wednesday", totalHours: 6, status: "Approved" },
        { id: 104, date: "15/02/2025", day: "Thursday", totalHours: 5, status: "Pending" },
        { id: 105, date: "16/02/2025", day: "Friday", totalHours: 8, status: "Approved" },
      ],
    },
    {
      weekRange: "05/02/2025 - 11/02/2025",
      timesheets: [
        { id: 106, date: "05/02/2025", day: "Monday", totalHours: 7, status: "Approved" },
        { id: 107, date: "06/02/2025", day: "Tuesday", totalHours: 6, status: "Pending" },
        { id: 108, date: "07/02/2025", day: "Wednesday", totalHours: 8, status: "Approved" },
        { id: 109, date: "08/02/2025", day: "Thursday", totalHours: 7, status: "Pending" },
        { id: 110, date: "09/02/2025", day: "Friday", totalHours: 5, status: "Approved" },
      ],
    },
  ]);

  // State for filters
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Toggle collapse for a week
  const toggleWeek = (weekIndex) => {
    setExpandedWeek(expandedWeek === weekIndex ? null : weekIndex);
  };

  // Handle Delete Entry
  const handleDelete = (weekIndex, entryIndex) => {
    const updatedWeeks = [...weeklyEntries];
    updatedWeeks[weekIndex].timesheets.splice(entryIndex, 1);
    setWeeklyEntries(updatedWeeks);
  };

  // Filter function
  const applyFilters = (timesheet) => {
    // Convert date format for comparison (YYYY-MM-DD)
    const entryDate = timesheet.date.split("/").reverse().join("-");

    // Check date range filter
    const withinDateRange =
      (!dateFrom || entryDate >= dateFrom) && (!dateTo || entryDate <= dateTo);

    // Check status filter
    const matchesStatus = statusFilter === "" || timesheet.status === statusFilter;

    return withinDateRange && matchesStatus;
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">📅 Weekly Timesheet</h2>

      {/* Filters */}
      <Card className="p-3 shadow-sm filter-card">
        <h5>
          <FaFilter /> Filters
        </h5>
        <Form className="d-flex flex-wrap gap-3">
          {/* Status Filter */}
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Control as="select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
            </Form.Control>
          </Form.Group>

          {/* Date Range Filter */}
          <Form.Group>
            <Form.Label>From</Form.Label>
            <Form.Control type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>To</Form.Label>
            <Form.Control type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </Form.Group>
        </Form>
      </Card>

      {/* Collapsible Table */}
      <Table striped bordered hover className="mt-4 shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Week Range</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {weeklyEntries.map((week, weekIndex) => (
            <React.Fragment key={weekIndex}>
              {/* Week Row (Collapsible) */}
              <tr onClick={() => toggleWeek(weekIndex)} className="collapsible-header">
                <td>{week.weekRange}</td>
                <td className="text-center">
                  <Button variant="info" size="sm">
                    {expandedWeek === weekIndex ? <FaChevronUp /> : <FaChevronDown />}
                  </Button>
                </td>
              </tr>

              {/* Collapsible Content - Filtered Timesheet Details */}
              <tr>
                <td colSpan="2" style={{ padding: 0 }}>
                  <Collapse in={expandedWeek === weekIndex}>
                    <div>
                      <Table striped bordered className="m-0">
                        <thead className="table-secondary">
                          <tr>
                            <th>Timesheet ID</th>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Total Hours</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {week.timesheets.filter(applyFilters).map((entry, entryIndex) => (
                            <tr key={entry.id}>
                              <td>{entry.id}</td>
                              <td>{entry.date}</td>
                              <td>{entry.day}</td>
                              <td>{entry.totalHours} hrs</td>
                              <td>
                                <span className={entry.status === "Approved" ? "text-success" : "text-warning"}>
                                  {entry.status}
                                </span>
                              </td>
                              <td>
                                <Button variant="warning" size="sm" className="me-2">
                                  <FaEdit /> Edit
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(weekIndex, entryIndex)}>
                                  <FaTrash /> Delete
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Collapse>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default WeeklyTimesheet;
