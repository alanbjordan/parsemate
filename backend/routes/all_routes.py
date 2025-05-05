from flask import Blueprint, request, jsonify
import os
from services.receipt_parser import get_file_info, extract_text_with_openai

# Create a blueprint for all routes
all_routes_bp = Blueprint("all_routes", __name__)

@all_routes_bp.route("/upload", methods=["POST"])
def upload_file():
    """Upload a file to the server."""
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400
        file = request.files['file']
        print("DEBUG: Received file:", file)
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        # Optionally, save the file or process it here
        # file.save(os.path.join(UPLOAD_FOLDER, file.filename))
        file_info = extract_text_with_openai(file)
        # file_info is already printed in backend log by get_file_info
        return jsonify({
            "message": "File uploaded successfully",
            "filename": file.filename,
            "file_info": file_info
        }), 200
    except Exception as e:
        print("DEBUG: Exception encountered in upload file:", e)
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    
@all_routes_bp.route("/save-receipt", methods=["GET"])
def save_receipt():
    """Save a receipt to the google sheet."""
    try:
        data = request.get_json(force=True)
        print("DEBUG: Received receipt data:", data)
        
        if not data:
            return jsonify({"error": "Missing JSON body"}), 400
        
        if data:
            return jsonify({
                "message": "Receipt saved successfully",
            }), 200
        else:
            return jsonify({"error": "Failed to save receipt"}), 500

    except Exception as e:
        print("DEBUG: Exception encountered in save receipt:", e)
        import traceback

@all_routes_bp.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "message": "Backend is healthy"}), 200