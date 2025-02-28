import React, { useState, useEffect, useCallback } from "react";
import { Button, Form, Card, Table, Spinner, Modal } from "react-bootstrap";
import { FaPlay, FaStop, FaTrash, FaEdit } from "react-icons/fa";
import "../styles/DailyTimesheet.css";

const API_URL = "https://timesheet-backend-k4ny.onrender.com";

// Format time to HH:MM:SS
const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const DailyTimesheet = () => {
  const [entries, setEntries] = useState([]);
  const [task, setTask] = useState("");
  const [project, setProject] = useState("");
  const [projects, setProjects] = useState([]);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editEntry, setEditEntry] = useState(null);

  // Fetch timesheet entries for the logged-in employee
  const fetchEntries = useCallback(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.employee_id) {
      console.error("No user or employee ID found in localStorage");
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`${API_URL}/timesheet/daily?employee_id=${storedUser.employee_id}`)
      .then((res) => res.json())
      .then((data) => setEntries(data))
      .catch((err) => console.error("Error fetching timesheets:", err))
      .finally(() => setLoading(false));
  }, []);

  // Fetch project list
  useEffect(() => {
    fetch(`${API_URL}/projects`)
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  useEffect(() => {
    if (isTimerRunning) {
      const timer = setInterval(() => setElapsedTime((prev) => prev + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isTimerRunning]);

  const handleStartStopTimer = () => {
    if (!task || !project) {
      alert("Please enter task and project before starting the timer.");
      return;
    }
    if (isTimerRunning) {
      const duration = Math.floor((new Date() - startTime) / 1000);
      const storedUser = JSON.parse(localStorage.getItem("user"));

      const newEntry = {
        task,
        project,
        time_started: startTime.toLocaleTimeString(),
        duration,
        date: new Date().toISOString().split("T")[0],
        employee_id: storedUser.employee_id, // Assign employee ID
      };

      fetch(`${API_URL}/timesheet/daily`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      })
        .then((res) => res.json())
        .then((data) => setEntries((prev) => [...prev, data]))
        .catch((err) => console.error("Error saving timesheet:", err));

      setIsTimerRunning(false);
      setTask("");
      setProject("");
      setElapsedTime(0);
    } else {
      setStartTime(new Date());
      setElapsedTime(0);
      setIsTimerRunning(true);
    }
  };

  const handleDeleteEntry = (id) => {
    fetch(`${API_URL}/timesheet/daily/${id}`, {
      method: "DELETE",
    })
      .then(() => setEntries((prev) => prev.filter((entry) => entry.id !== id)))
      .catch((err) => console.error("Error deleting entry:", err));
  };

  // Open Edit Modal
  const handleEditClick = (entry) => {
    setEditEntry(entry);
    setShowEditModal(true);
  };

  // Handle Edit Form Submission
  const handleEditSubmit = () => {
    if (!editEntry.task || !editEntry.project) {
      alert("Task and Project cannot be empty!");
      return;
    }

    fetch(`${API_URL}/timesheet/daily/${editEntry.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editEntry),
    })
      .then((res) => res.json())
      .then(() => {
        setEntries((prev) =>
          prev.map((entry) => (entry.id === editEntry.id ? editEntry : entry))
        );
        setShowEditModal(false);
      })
      .catch((err) => console.error("Error updating entry:", err));
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">🕒 Daily Timesheet</h2>

      <Card className="p-3 shadow-sm">
        <Form>
          <Form.Group className="mt-2">
            <Form.Label>Task Description</Form.Label>
            <Form.Control type="text" value={task} onChange={(e) => setTask(e.target.value)} placeholder="Enter task description..." />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>Project</Form.Label>
            <Form.Control as="select" value={project} onChange={(e) => setProject(e.target.value)}>
              <option value="">Select Project</option>
              {projects.map((proj) => (
                <option key={proj.id} value={proj.name}>{proj.name}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <div className="d-flex align-items-center mt-3">
            <Button onClick={handleStartStopTimer} variant={isTimerRunning ? "danger" : "success"} className="btn-lg shadow-sm">
              {isTimerRunning ? <FaStop /> : <FaPlay />} {isTimerRunning ? " Stop Timer" : " Start Timer"}
            </Button>
            {isTimerRunning && <span className="ms-3 live-timer">{formatTime(elapsedTime)}</span>}
          </div>
        </Form>
      </Card>

      {loading ? (
        <Spinner animation="border" className="d-block mx-auto mt-4" />
      ) : (
        <Table striped bordered hover responsive className="mt-4">
          <thead>
            <tr>
              <th>#</th>
              <th>Task</th>
              <th>Project</th>
              <th>Time Started</th>
              <th>Duration</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.length > 0 ? (
              entries.map((entry, index) => (
                <tr key={entry.id}>
                  <td>{index + 1}</td>
                  <td>{entry.task}</td>
                  <td>{entry.project}</td>
                  <td>{entry.time_started}</td>
                  <td>{formatTime(entry.duration)}</td>
                  <td>{entry.date}</td>
                  <td>
                    <Button variant="warning" size="sm" onClick={() => handleEditClick(entry)} className="me-2">
                      <FaEdit />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteEntry(entry.id)}>
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No entries found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default DailyTimesheet;
