import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';


const Dashboard = () => {
    return (
        <Container fluid>
            <Row>
            
                {/* Main Content */}
                <Col md={10} className="p-4">
                    <h2>Timesheet Dashboard</h2>
                    <Row>
                        <Col md={4}>
                            <Card className="mb-3">
                                <Card.Body>
                                    <Card.Title>Total Hours</Card.Title>
                                    <Card.Text>40 hrs this week</Card.Text>
                                    <Button variant="primary">View Details</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="mb-3">
                                <Card.Body>
                                    <Card.Title>Pending Approvals</Card.Title>
                                    <Card.Text>3 timesheets pending</Card.Text>
                                    <Button variant="warning">Review</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="mb-3">
                                <Card.Body>
                                    <Card.Title>Overtime</Card.Title>
                                    <Card.Text>5 hrs this week</Card.Text>
                                    <Button variant="danger">Check</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
