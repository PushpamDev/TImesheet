import React, { useState, useEffect } from "react";
import { Button, Form, Card, Accordion } from "react-bootstrap";
import { FaPlay, FaStop, FaChevronDown, FaChevronUp, FaPlus, FaSave, FaTimes } from "react-icons/fa";
import "../styles/DailyTimesheet.css";

const API_URL = "https://timesheet.vercel.app";

const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
};

const getCurrentWeekDays = () => {
  const today = new Date();
  const currentDay = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

  return [...Array(5)].map((_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return {
      date,
      label: date.toLocaleDateString("en-US", { weekday: "long", day: "2-digit", month: "short" }),
    };
  }).reverse();
};

const DailyTimesheet = () => {
  const [entries, setEntries] = useState([]);
  const [task, setTask] = useState("");
  const [project, setProject] = useState("");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [expandedDays, setExpandedDays] = useState({});
  const [manualEntries, setManualEntries] = useState({});
  const [showFormForDay, setShowFormForDay] = useState(null);

  const weekDays = getCurrentWeekDays();

  useEffect(() => {
    fetch(`${API_URL}/timesheet/daily`)
      .then((res) => res.json())
      .then(setEntries)
      .catch((err) => console.error("Error fetching timesheets:", err));
  }, []);

  useEffect(() => {
    if (isTimerRunning) {
      const timer = setInterval(() => setElapsedTime((prev) => prev + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isTimerRunning]);

  const handleStartStopTimer = () => {
    if (isTimerRunning) {
      const duration = Math.floor((new Date() - startTime) / 1000);
      const newEntry = {
        task,
        project,
        time_started: startTime.toLocaleTimeString(),
        duration: formatTime(duration),
        date: new Date().toISOString().split("T")[0],
      };

      fetch(`${API_URL}/timesheet/daily`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      })
      .then((res) => res.json())
      .then((data) => setEntries([...entries, data]))
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

  const handleAddEntryClick = (day) => {
    setShowFormForDay(day.label);
    setManualEntries((prev) => ({
      ...prev,
      [day.label]: { task: "", project: "", timeStarted: "", duration: "" },
    }));
  };

  const handleSaveManualEntry = (day) => {
    const newManualEntry = {
      ...manualEntries[day.label],
      date: day.date.toISOString().split("T")[0],
    };

    fetch(`${API_URL}/timesheet/daily`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newManualEntry),
    })
    .then((res) => res.json())
    .then((data) => setEntries([...entries, data]))
    .catch((err) => console.error("Error saving entry:", err));

    setShowFormForDay(null);
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
        {weekDays.map((day, index) => (
          <Card key={index} className="mb-2">
            <Card.Header>
              <Button variant="link" className="text-dark fw-bold" onClick={() => setExpandedDays((prev) => ({ ...prev, [day.label]: !prev[day.label] }))}>
                {day.label} {expandedDays[day.label] ? <FaChevronUp /> : <FaChevronDown />}
              </Button>
            </Card.Header>
            {expandedDays[day.label] && (
              <Card.Body>
                <Button variant="primary" className="mb-2" onClick={() => handleAddEntryClick(day)}>
                  <FaPlus /> Add Entry
                </Button>
                {showFormForDay === day.label && (
                  <Form>
                    <Form.Group className="mt-2">
                      <Form.Control type="text" placeholder="Task" onChange={(e) => setManualEntries(prev => ({ ...prev, [day.label]: { ...prev[day.label], task: e.target.value } }))} />
                    </Form.Group>
                    <Form.Group className="mt-2">
                      <Form.Control type="text" placeholder="Project" onChange={(e) => setManualEntries(prev => ({ ...prev, [day.label]: { ...prev[day.label], project: e.target.value } }))} />
                    </Form.Group>
                    <Form.Group className="mt-2">
                      <Form.Control type="time" placeholder="Time Started" onChange={(e) => setManualEntries(prev => ({ ...prev, [day.label]: { ...prev[day.label], timeStarted: e.target.value } }))} />
                    </Form.Group>
                    <Form.Group className="mt-2">
                      <Form.Control type="text" placeholder="Duration (HH:MM)" onChange={(e) => setManualEntries(prev => ({ ...prev, [day.label]: { ...prev[day.label], duration: e.target.value } }))} />
                    </Form.Group>
                    <Button className="mt-2 me-2" onClick={() => handleSaveManualEntry(day)}><FaSave /> Save</Button>
                    <Button className="mt-2" variant="secondary" onClick={() => setShowFormForDay(null)}><FaTimes /> Cancel</Button>
                  </Form>
                )}
              </Card.Body>
            )}
          </Card>
        ))}
      </Accordion>
    </div>
  );
};

export default DailyTimesheet;
