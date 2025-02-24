import React, { useState } from "react";
import { Table, Button, Form, Card, Modal, Alert } from "react-bootstrap";
import { FaTrash, FaUpload, FaPlus } from "react-icons/fa";
import Papa from "papaparse";
import EmployeeForm from "../components/EmployeeForm";
import "../styles/Employees.css";

const Employees = () => {
  const [employees, setEmployees] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Manager" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Employee" },
  ]);

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [csvError, setCsvError] = useState("");

  // Function to validate email format
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Function to validate role
  const isValidRole = (role) => ["Manager", "Employee"].includes(role);

  // Handle CSV Upload
  const handleCSVUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (result) => {
        const rows = result.data;
        const newEmployees = [];
        const existingEmails = employees.map((emp) => emp.email);
        let errorMessage = "";

        // Validate each row
        for (let i = 1; i < rows.length; i++) {
          const [name, email, role] = rows[i].map((item) => item.trim());

          if (!name || !email || !role) {
            errorMessage = "All fields (Name, Email, Role) are required.";
            break;
          }
          if (!isValidEmail(email)) {
            errorMessage = `Invalid email format: ${email}`;
            break;
          }
          if (!isValidRole(role)) {
            errorMessage = `Invalid role: ${role}. Allowed roles: Manager, Employee.`;
            break;
          }
          if (existingEmails.includes(email) || newEmployees.some((emp) => emp.email === email)) {
            errorMessage = `Duplicate email found: ${email}`;
            break;
          }

          newEmployees.push({ id: employees.length + newEmployees.length + 1, name, email, role });
        }

        if (errorMessage) {
          setCsvError(errorMessage);
        } else {
          setEmployees([...employees, ...newEmployees]);
          setCsvError(""); // Clear errors
        }
      },
      header: false,
      skipEmptyLines: true,
    });
  };

  // Add New Employee Manually
  const handleAddEmployee = (newEmployee) => {
    setEmployees([...employees, { id: employees.length + 1, ...newEmployee }]);
    setShowRegisterModal(false);
  };

  // Delete Employee
  const handleDelete = (id) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  return (
    <div className="container mt-4">
      <h2>👥 Employees</h2>

      {/* Bulk Upload Section */}
      <Card className="p-3 shadow-sm">
        <h5><FaUpload /> Bulk Upload Employees</h5>
        <Form.Group>
          <Form.Control type="file" accept=".csv" onChange={handleCSVUpload} />
        </Form.Group>
        {csvError && <Alert variant="danger" className="mt-2">{csvError}</Alert>}
      </Card>

      {/* Register New Employee */}
      <Button variant="success" className="mt-3" onClick={() => setShowRegisterModal(true)}>
        <FaPlus /> Register Employee
      </Button>

      {/* Employee List Table */}
      <Table striped bordered hover className="mt-4 shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.role}</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => handleDelete(employee.id)}>
                  <FaTrash /> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Register Employee Modal */}
      <Modal show={showRegisterModal} onHide={() => setShowRegisterModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Register New Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EmployeeForm onSave={handleAddEmployee} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Employees;
