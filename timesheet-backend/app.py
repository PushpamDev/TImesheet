from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from api.extensions import db  # ✅ Import from extensions
from api.routes import routes  # ✅ Import Blueprint only after initializing db

app = Flask(__name__)
CORS(app)  # ✅ Enable CORS for frontend

# Configure database URI
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///timesheet.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize database
db.init_app(app)

# Register Blueprints
app.register_blueprint(routes)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # ✅ Ensure tables are created
    app.run(debug=True)
