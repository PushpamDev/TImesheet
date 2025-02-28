from flask import Blueprint, request, jsonify
from api.models import TimesheetEntry, Project  # ✅ Import Project model
from api.extensions import db  # ✅ Import db from extensions

# Define Blueprint
routes = Blueprint("routes", __name__)

# ✅ GET All Timesheets (For Today)
@routes.route("/api/timesheet/daily", methods=["GET"])
def get_timesheets():
    employee_id = request.args.get("employee_id")  # Get employee ID from request

    if employee_id:
        timesheets = TimesheetEntry.query.filter_by(employee_id=employee_id).all()
    else:
        timesheets = TimesheetEntry.query.all()  # If no employee_id is provided, return all timesheets

    return jsonify([entry.to_dict() for entry in timesheets]), 200


# ✅ ADD New Timesheet Entry
@routes.route("/api/timesheet/daily", methods=["POST"])
def add_timesheet():
    data = request.json
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    new_entry = TimesheetEntry(
        task=data.get("task"),
        project=data.get("project"),
        time_started=data.get("time_started"),
        duration=data.get("duration"),
        date=data.get("date"),  # Date should be passed from frontend
    )

    db.session.add(new_entry)
    db.session.commit()
    return jsonify(new_entry.to_dict()), 201

# ✅ UPDATE Existing Timesheet Entry
@routes.route("/api/timesheet/daily/<int:id>", methods=["PUT"])
def update_timesheet(id):
    entry = TimesheetEntry.query.get(id)
    if not entry:
        return jsonify({"error": "Entry not found"}), 404

    data = request.json
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    entry.task = data.get("task", entry.task)
    entry.project = data.get("project", entry.project)
    entry.time_started = data.get("time_started", entry.time_started)
    entry.duration = data.get("duration", entry.duration)
    entry.date = data.get("date", entry.date)

    db.session.commit()
    return jsonify(entry.to_dict()), 200

# ✅ DELETE Timesheet Entry
@routes.route("/api/timesheet/daily/<int:id>", methods=["DELETE"])
def delete_timesheet(id):
    entry = TimesheetEntry.query.get(id)
    if not entry:
        return jsonify({"error": "Entry not found"}), 404

    db.session.delete(entry)
    db.session.commit()
    return jsonify({"message": "Timesheet entry deleted successfully!"}), 200

# ✅ GET All Projects
@routes.route("/api/projects", methods=["GET"])
def get_projects():
    projects = Project.query.all()
    return jsonify([project.to_dict() for project in projects]), 200

# ✅ ADD New Project
@routes.route("/api/projects", methods=["POST"])
def add_project():
    data = request.json
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    new_project = Project(
        name=data.get("name"),
        description=data.get("description"),
        start_date=data.get("startDate"),
        end_date=data.get("endDate"),
        status=data.get("status")
    )

    db.session.add(new_project)
    db.session.commit()
    return jsonify(new_project.to_dict()), 201

# ✅ UPDATE Project
@routes.route("/api/projects/<int:id>", methods=["PUT"])
def update_project(id):
    project = Project.query.get(id)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    data = request.json
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    project.name = data.get("name", project.name)
    project.description = data.get("description", project.description)
    project.start_date = data.get("startDate", project.start_date)
    project.end_date = data.get("endDate", project.end_date)
    project.status = data.get("status", project.status)

    db.session.commit()
    return jsonify(project.to_dict()), 200

# ✅ DELETE Project
@routes.route("/api/projects/<int:id>", methods=["DELETE"])
def delete_project(id):
    project = Project.query.get(id)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    db.session.delete(project)
    db.session.commit()
    return jsonify({"message": "Project deleted successfully!"}), 200
