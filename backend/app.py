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

load_dotenv()

# create_app function to initialize the Flask application
def create_app():
    # Initialize Flask app
    app = Flask(__name__)

    return app

# Create the application instance
app = create_app()

# Register routes
app.register_blueprint(all_routes_bp)

# Enable CORS
CORS(app, origins=Config.CORS_ORIGINS, supports_credentials=True)

if __name__ == '__main__':
    # Run the application
    app.run(debug=True)
