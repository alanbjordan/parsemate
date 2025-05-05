# receipt_parser.py

# Import necessary libraries
import os
import json

def get_file_info(file):
    """
    Accepts a file object (e.g., from Flask's request.files) and returns its filename and metadata/info.
    Prints the info to the backend log.
    """
    file_info = {
        'filename': file.filename,
        'content_type': getattr(file, 'content_type', None),
        'content_length': getattr(file, 'content_length', None),
        'mimetype': getattr(file, 'mimetype', None),
    }
    print(f"[File Info] {file_info}")
    return file_info

