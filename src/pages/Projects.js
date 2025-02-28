import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal, Card, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus, FaCheckCircle, FaClock, FaTasks } from "react-icons/fa";
import axios from "axios";
import "../styles/Projects.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("https://timesheet-backend-k4ny.onrender.com/projects");
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleAddProject = () => {
    setEditProject(null);
    setShowModal(true);
  };

  const handleEdit = (project) => {
    setEditProject(project);
    setShowModal(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newProject = {
      name: formData.get("name"),
      description: formData.get("description"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      status: formData.get("status"),
    };

    try {
      if (editProject) {
        await axios.put(`https://timesheet-backend-k4ny.onrender.com/projects/${editProject.id}`, newProject);
      } else {
        await axios.post("https://timesheet-backend-k4ny.onrender.com/projects", newProject);
      }
      setShowModal(false);
      fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://timesheet-backend-k4ny.onrender.com/projects/${id}`);
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
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
              <h4 className="fw-bold">{projects.length}</h4>
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
              <h4 className="fw-bold">{projects.filter(p => p.status === "Active").length}</h4>
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
              <h4 className="fw-bold">{projects.filter(p => p.status === "Completed").length}</h4>
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
              <h4 className="fw-bold">{projects.filter(p => p.status === "Pending").length}</h4>
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

      {/* Add/Edit Project Modal */}
<Modal show={showModal} onHide={() => setShowModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>{editProject ? "Edit Project" : "Add Project"}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form onSubmit={handleSaveProject}>
      {/* Project ID (Read-only) */}
      {editProject && (
        <Form.Group className="mb-3">
          <Form.Label>Project ID</Form.Label>
          <Form.Control type="text" name="id" defaultValue={editProject.id} readOnly />
        </Form.Group>
      )}

      {/* Project Name */}
      <Form.Group className="mb-3">
        <Form.Label>Project Name</Form.Label>
        <Form.Control type="text" name="name" defaultValue={editProject?.name || ""} required />
      </Form.Group>

      {/* Description */}
      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" name="description" defaultValue={editProject?.description || ""} required />
      </Form.Group>

      {/* Start Date */}
      <Form.Group className="mb-3">
        <Form.Label>Start Date</Form.Label>
        <Form.Control type="date" name="startDate" defaultValue={editProject?.startDate || ""} required />
      </Form.Group>

      {/* End Date */}
      <Form.Group className="mb-3">
        <Form.Label>Expected End Date</Form.Label>
        <Form.Control type="date" name="endDate" defaultValue={editProject?.endDate || ""} required />
      </Form.Group>

      {/* Status */}
      <Form.Group className="mb-3">
        <Form.Label>Status</Form.Label>
        <Form.Select name="status" defaultValue={editProject?.status || ""} required>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
        </Form.Select>
      </Form.Group>

      {/* Submit Button */}
      <Button variant="primary" type="submit">
        {editProject ? "Update Project" : "Add Project"}
      </Button>
    </Form>
  </Modal.Body>
</Modal>

    </div>
  );
};

export default Projects;