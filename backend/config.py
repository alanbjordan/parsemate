# This file is part of the Flask application configuration.
# server/config.py

# Importing necessary libraries
import os
import dotenv

dotenv.load_dotenv()

# Flask configuration class
class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    # CORS settings
    CORS_ORIGINS = os.getenv("CORS_ORIGINS")
    CORS_SUPPORTS_CREDENTIALS = True
