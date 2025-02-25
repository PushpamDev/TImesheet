import React, { useState } from "react";
import { Table, Button, Form, Modal, Card, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus, FaCheckCircle, FaClock, FaTasks } from "react-icons/fa";
import "../styles/Projects.css";

const Projects = () => {
  const [projects, setProjects] = useState([
    { id: 1, name: "Project Alpha", description: "First project", startDate: "2024-01-01", endDate: "2024-06-30", status: "Active" },
    { id: 2, name: "Project Beta", description: "Second project", startDate: "2024-02-15", endDate: "2024-09-30", status: "Completed" },
    { id: 3, name: "Project Gamma", description: "Third project", startDate: "2024-03-10", endDate: "2024-12-15", status: "Pending" }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");

  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === "Active").length;
  const completedProjects = projects.filter(p => p.status === "Completed").length;
  const pendingProjects = projects.filter(p => p.status === "Pending").length;

  const handleAddProject = () => {
    setEditProject(null);
    setShowModal(true);
  };

  const handleEdit = (project) => {
    setEditProject(project);
    setShowModal(true);
  };

  const handleSaveProject = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newProject = {
      id: editProject ? editProject.id : projects.length + 1,
      name: formData.get("name"),
      description: formData.get("description"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      status: formData.get("status"),
    };

    setProjects(editProject ? projects.map(p => (p.id === editProject.id ? newProject : p)) : [...projects, newProject]);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const filteredProjects = filterStatus ? projects.filter(p => p.status === filterStatus) : projects;

  return (
    <div className="container mt-4">
      <h2>📁 Projects</h2>

      {/* Project Summary Section */}
      <Row className="mb-4">
  <Col xs={6} md={3}>
    <Card className="summary-card shadow-sm">
      <Card.Body className="text-center">
        <div className="icon-circle bg-primary">
          <FaTasks size={20} className="text-white" />
        </div>
        <h6>Total Projects</h6>
        <h4 className="fw-bold">{totalProjects}</h4>
      </Card.Body>
    </Card>
  </Col>
  <Col xs={6} md={3}>
    <Card className="summary-card shadow-sm">
      <Card.Body className="text-center">
        <div className="icon-circle bg-success">
          <FaCheckCircle size={20} className="text-white" />
        </div>
        <h6>Active Projects</h6>
        <h4 className="fw-bold">{activeProjects}</h4>
      </Card.Body>
    </Card>
  </Col>
  <Col xs={6} md={3}>
    <Card className="summary-card shadow-sm">
      <Card.Body className="text-center">
        <div className="icon-circle bg-secondary">
          <FaCheckCircle size={20} className="text-white" />
        </div>
        <h6>Completed Projects</h6>
        <h4 className="fw-bold">{completedProjects}</h4>
      </Card.Body>
    </Card>
  </Col>
  <Col xs={6} md={3}>
    <Card className="summary-card shadow-sm">
      <Card.Body className="text-center">
        <div className="icon-circle bg-warning">
          <FaClock size={20} className="text-white" />
        </div>
        <h6>Pending Projects</h6>
        <h4 className="fw-bold">{pendingProjects}</h4>
      </Card.Body>
    </Card>
  </Col>
</Row>


      {/* Filter Projects */}
      <Card className="p-3 shadow-sm mb-3">
        <h5>Filter by Status</h5>
        <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
        </Form.Select>
      </Card>

      {/* Add Project Button */}
      <Button variant="success" className="mb-3" onClick={handleAddProject}>
        <FaPlus /> Add Project
      </Button>

      {/* Project Table */}
      <div className="table-responsive">
        <Table striped bordered hover className="shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Project Name</th>
              <th>Description</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project.id}>
                <td>{project.id}</td>
                <td>{project.name}</td>
                <td>{project.description}</td>
                <td>{project.startDate}</td>
                <td>{project.endDate}</td>
                <td>{project.status}</td>
                <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(project)}>
                    <FaEdit /> Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(project.id)}>
                    <FaTrash /> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Projects;
