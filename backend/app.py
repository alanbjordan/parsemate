# This file is part of the Flask application for the project.
# app.py

# Importing necessary libraries
from flask import Flask
# Import the register_routes function
from routes.all_routes import all_routes_bp
from dotenv import load_dotenv
import os
from flask_cors import CORS
from config import Config
from create_app import create_app
from database import db
from models.receipt import Receipt  # Import your models so db.create_all() sees them

load_dotenv()

# Create the application instance
app = create_app()

# Register routes
app.register_blueprint(all_routes_bp)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Creates tables if they don't exist
    app.run(host='0.0.0.0', port=5000, debug=True)
