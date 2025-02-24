import React, { useState, useEffect } from "react";
import { Table, Button, Form, Card, Accordion } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlay, FaStop, FaFilter, FaChevronDown, FaChevronUp } from "react-icons/fa";
import "../styles/DailyTimesheet.css"; // Custom styles

const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// Get the current week's working days in descending order (e.g., Friday → Monday)
const getCurrentWeekDays = () => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 (Sunday) to 6 (Saturday)

  // If today is Saturday or Sunday, show only past week (Friday-Monday)
  const maxDays = currentDay === 0 ? 5 : currentDay === 6 ? 5 : currentDay; // No Saturday/Sunday

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1)); // Adjust to Monday

  const days = [];
  for (let i = 0; i < maxDays; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    days.push({
      date,
      label: date.toLocaleDateString("en-US", { weekday: "long", day: "2-digit", month: "short" }),
    });
  }

  return days.reverse(); // Reverse array so today is on top
};

const DailyTimesheet = () => {
  const [entries, setEntries] = useState([]);
  const [task, setTask] = useState("");
  const [project, setProject] = useState("");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [editIndex, setEditIndex] = useState(null);
  const [filterProject, setFilterProject] = useState("");
  const [expandedDays, setExpandedDays] = useState({});

  const weekDays = getCurrentWeekDays(); // Get only past and current days

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
      const newEntry = { task, project, duration, time: startTime.toLocaleTimeString(), date: new Date() };

      if (editIndex !== null) {
        const updatedEntries = [...entries];
        updatedEntries[editIndex] = newEntry;
        setEntries(updatedEntries);
        setEditIndex(null);
      } else {
        setEntries([...entries, newEntry]);
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

  const handleEdit = (index) => {
    setTask(entries[index].task);
    setProject(entries[index].project);
    setEditIndex(index);
    setIsTimerRunning(false);
  };

  const handleDelete = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const toggleDay = (day) => {
    setExpandedDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">🕒 Daily Timesheet</h2>

      {/* Task Form */}
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

      {/* Filters */}
      <div className="mt-4">
        <h5>
          <FaFilter /> Filters
        </h5>
        <Form>
          <Form.Group>
            <Form.Label>Filter by Project</Form.Label>
            <Form.Control as="select" value={filterProject} onChange={(e) => setFilterProject(e.target.value)}>
              <option value="">All Projects</option>
              <option value="Project A">Project A</option>
              <option value="Project B">Project B</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </div>

      {/* Weekly View with Collapsible Tables (Descending Order) */}
      <Accordion className="mt-4">
        {weekDays.map((day, index) => {
          const dayEntries = entries.filter((entry) => entry.date.toDateString() === day.date.toDateString());
          return (
            <Card key={index} className="mb-2">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <Button variant="link" className="text-dark fw-bold" onClick={() => toggleDay(day.label)}>
                  {day.label} {expandedDays[day.label] ? <FaChevronUp /> : <FaChevronDown />}
                </Button>
              </Card.Header>
              {expandedDays[day.label] && (
                <Card.Body>
                  {dayEntries.length > 0 ? (
                    <Table striped bordered hover className="shadow-sm">
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
                        {dayEntries.map((entry, index) => (
                          <tr key={index}>
                            <td>{entry.task}</td>
                            <td>{entry.project}</td>
                            <td>{entry.time}</td>
                            <td>{formatTime(entry.duration)}</td>
                            <td>
                              <Button variant="warning" size="sm" onClick={() => handleEdit(index)} className="me-2">
                                <FaEdit />
                              </Button>
                              <Button variant="danger" size="sm" onClick={() => handleDelete(index)}>
                                <FaTrash />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p className="text-muted">No tasks recorded for this day.</p>
                  )}
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
