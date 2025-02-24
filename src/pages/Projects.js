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

  // Project Summary Counts
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === "Active").length;
  const completedProjects = projects.filter(p => p.status === "Completed").length;
  const pendingProjects = projects.filter(p => p.status === "Pending").length;

  // Open modal for adding/editing projects
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
        <Col md={3}>
          <Card className="summary-card bg-primary text-white">
            <Card.Body>
              <FaTasks size={24} className="me-2" />
              <h5>Total Projects</h5>
              <h4>{totalProjects}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="summary-card bg-success text-white">
            <Card.Body>
              <FaCheckCircle size={24} className="me-2" />
              <h5>Active Projects</h5>
              <h4>{activeProjects}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="summary-card bg-secondary text-white">
            <Card.Body>
              <FaCheckCircle size={24} className="me-2" />
              <h5>Completed Projects</h5>
              <h4>{completedProjects}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="summary-card bg-warning text-white">
            <Card.Body>
              <FaClock size={24} className="me-2" />
              <h5>Pending Projects</h5>
              <h4>{pendingProjects}</h4>
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

      {/* Project Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editProject ? "Edit Project" : "Add Project"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveProject}>
            <Form.Group>
              <Form.Label>Project Name</Form.Label>
              <Form.Control type="text" name="name" defaultValue={editProject?.name || ""} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" defaultValue={editProject?.description || ""} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <Form.Control type="date" name="startDate" defaultValue={editProject?.startDate || ""} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Expected End Date</Form.Label>
              <Form.Control type="date" name="endDate" defaultValue={editProject?.endDate || ""} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select name="status" defaultValue={editProject?.status || "Active"} required>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              {editProject ? "Save Changes" : "Add Project"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Projects;
