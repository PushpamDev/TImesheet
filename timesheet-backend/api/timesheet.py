import json
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Initialize Flask app
app = Flask(__name__)

# SQLite Database Configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///timesheet.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Timesheet Model (Daily Timesheet)
class TimesheetEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task = db.Column(db.String(200), nullable=False)
    project = db.Column(db.String(100), nullable=False)
    time_started = db.Column(db.String(20), nullable=False)
    duration = db.Column(db.Integer, nullable=False)  # Duration in seconds
    date = db.Column(db.String(20), nullable=False, default=datetime.utcnow().strftime("%Y-%m-%d"))

    def to_dict(self):
        return {
            "id": self.id,
            "task": self.task,
            "project": self.project,
            "time_started": self.time_started,
            "duration": self.duration,
            "date": self.date,
        }

# API routes

# Get all timesheet entries (for today)
@app.route("/api/timesheet/daily", methods=["GET"])
def get_timesheets():
    today = datetime.utcnow().strftime("%Y-%m-%d")
    timesheets = TimesheetEntry.query.filter_by(date=today).all()
    return jsonify([entry.to_dict() for entry in timesheets])

# Add a new timesheet entry (for today)
@app.route("/api/timesheet/daily", methods=["POST"])
def add_timesheet():
    data = request.json
    new_entry = TimesheetEntry(
        task=data["task"],
        project=data["project"],
        time_started=data["time_started"],
        duration=data["duration"],
        date=datetime.utcnow().strftime("%Y-%m-%d"),  # Today's date
    )
    db.session.add(new_entry)
    db.session.commit()
    return jsonify(new_entry.to_dict()), 201

# Edit an existing timesheet entry
@app.route("/api/timesheet/daily/<int:id>", methods=["PUT"])
def update_timesheet(id):
    entry = TimesheetEntry.query.get(id)
    if not entry:
        return jsonify({"error": "Entry not found"}), 404

    data = request.json
    entry.task = data.get("task", entry.task)
    entry.project = data.get("project", entry.project)
    entry.time_started = data.get("time_started", entry.time_started)
    entry.duration = data.get("duration", entry.duration)

    db.session.commit()
    return jsonify(entry.to_dict())

# Delete a timesheet entry
@app.route("/api/timesheet/daily/<int:id>", methods=["DELETE"])
def delete_timesheet(id):
    entry = TimesheetEntry.query.get(id)
    if not entry:
        return jsonify({"error": "Entry not found"}), 404

    db.session.delete(entry)
    db.session.commit()
    return jsonify({"message": "Timesheet entry deleted successfully!"})


# Serverless handler for Vercel
def handler(request):
    """Vercel serverless function entry point."""
    # Parse the request body (if any)
    req_data = request.get_json() if request.data else {}
    
    # Handle the app's routes
    with app.test_request_context(request.path, method=request.method, data=req_data):
        response = app.full_dispatch_request()
    
    return response

# For local development: Uncomment this to run the app locally
# if __name__ == "__main__":
#     app.run(debug=True)
