import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const EmployeeForm = ({ onSave }) => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    role: "Employee",
  });

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(employee); // Ensure this function is properly passed from Employees.js
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={employee.name}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={employee.email}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Role</Form.Label>
        <Form.Control
          as="select"
          name="role"
          value={employee.role}
          onChange={handleChange}
        >
          <option>Manager</option>
          <option>Employee</option>
        </Form.Control>
      </Form.Group>

      <Button variant="primary" type="submit" className="mt-3">
        Register Employee
      </Button>
    </Form>
  );
};

export default EmployeeForm;
