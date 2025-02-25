import React, { useState, useEffect } from "react";
import { Table, Button, Form, Card, Accordion } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlay, FaStop, FaChevronDown, FaChevronUp } from "react-icons/fa";
import "../styles/DailyTimesheet.css"; // Custom styles

const API_URL = "t-imesheet.vercel.app";

const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const getCurrentWeekDays = () => {
  const today = new Date();
  const currentDay = today.getDay();
  const maxDays = currentDay === 0 ? 5 : currentDay === 6 ? 5 : currentDay;
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

  const days = [];
  for (let i = 0; i < maxDays; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    days.push({
      date,
      label: date.toLocaleDateString("en-US", { weekday: "long", day: "2-digit", month: "short" }),
    });
  }

  return days.reverse();
};

const DailyTimesheet = () => {
  const [entries, setEntries] = useState([]);
  const [task, setTask] = useState("");
  const [project, setProject] = useState("");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [editId, setEditId] = useState(null);
  const [filterProject, setFilterProject] = useState("");
  const [expandedDays, setExpandedDays] = useState({});

  const weekDays = getCurrentWeekDays();

  // Fetch timesheet entries from API with error handling
  useEffect(() => {
    fetch(`${API_URL}/timesheet/daily`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setEntries(data))
      .catch((err) => console.error("Error fetching timesheets:", err));
  }, []);

  useEffect(() => {
    let timer;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  const handleStartStopTimer = () => {
    if (isTimerRunning) {
      const endTime = new Date();
      const duration = Math.floor((endTime - startTime) / 1000);
      const newEntry = {
        task,
        project,
        duration,
        time_started: startTime.toLocaleTimeString(),
        date: new Date().toISOString().split("T")[0],
      };

      if (editId !== null) {
        fetch(`${API_URL}/timesheet/daily/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEntry),
        })
          .then((res) => res.json())
          .then(() => {
            setEntries(entries.map((entry) => (entry.id === editId ? { ...entry, ...newEntry } : entry)));
            setEditId(null);
          })
          .catch((err) => console.error("Error updating timesheet entry:", err));
      } else {
        fetch(`${API_URL}/timesheet/daily`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEntry),
        })
          .then((res) => res.json())
          .then((data) => setEntries([...entries, data]))
          .catch((err) => console.error("Error adding timesheet entry:", err));
      }

      setIsTimerRunning(false);
      setTask("");
      setProject("");
    } else {
      setStartTime(new Date());
      setElapsedTime(0);
      setIsTimerRunning(true);
    }
  };

  const handleEdit = (id) => {
    const entry = entries.find((e) => e.id === id);
    setTask(entry.task);
    setProject(entry.project);
    setEditId(id);
    setIsTimerRunning(false);
  };

  const handleDelete = (id) => {
    fetch(`${API_URL}/timesheet/daily/${id}`, { method: "DELETE" })
      .then(() => setEntries(entries.filter((entry) => entry.id !== id)))
      .catch((err) => console.error("Error deleting entry:", err));
  };

  const toggleDay = (day) => {
    setExpandedDays((prev) => ({ ...prev, [day]: !prev[day] }));
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
              <option value="Project A">Project A</option>
              <option value="Project B">Project B</option>
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

      <Accordion className="mt-4">
        {weekDays.map((day, index) => {
          const dayEntries = entries.filter((entry) => entry.date === day.date.toISOString().split("T")[0]);
          return (
            <Card key={index} className="mb-2">
              <Card.Header>
                <Button variant="link" className="text-dark fw-bold" onClick={() => toggleDay(day.label)}>
                  {day.label} {expandedDays[day.label] ? <FaChevronUp /> : <FaChevronDown />}
                </Button>
              </Card.Header>
              {expandedDays[day.label] && (
                <Card.Body>
                  <Table striped bordered hover>
                    <thead className="table-dark">
                      <tr>
                        <th>Task</th>
                        <th>Project</th>
                        <th>Time Started</th>
                        <th>Duration</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dayEntries.map((entry) => (
                        <tr key={entry.id}>
                          <td>{entry.task}</td>
                          <td>{entry.project}</td>
                          <td>{entry.time_started}</td>
                          <td>{formatTime(entry.duration)}</td>
                          <td>
                            <Button onClick={() => handleEdit(entry.id)}><FaEdit /></Button>
                            <Button onClick={() => handleDelete(entry.id)}><FaTrash /></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              )}
            </Card>
          );
        })}
      </Accordion>
    </div>
  );
};

export default DailyTimesheet;
