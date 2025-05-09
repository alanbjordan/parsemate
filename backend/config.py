# This file is part of the Flask application configuration.
# server/config.py

# Importing necessary libraries
import os
import dotenv

dotenv.load_dotenv()

# Flask configuration class
class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    CORS_ORIGINS = os.getenv("CORS_ORIGINS")
    CORS_SUPPORTS_CREDENTIALS = True
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    print(SQLALCHEMY_DATABASE_URI)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
