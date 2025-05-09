from flask import Blueprint, request, jsonify
from services.receipt_service import save_receipt_to_db, process_upload
from database import db

# Create a blueprint for all routes
all_routes_bp = Blueprint("all_routes", __name__)

@all_routes_bp.route("/upload", methods=["POST"])
def upload_file():
    """Upload a file, parse it, and return the parsed data (do not save to DB)."""
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        # Orchestrate upload and parsing using the service
        file_path, parsed_pages = process_upload(file)

        return jsonify({
            "message": "File uploaded and parsed successfully",
            "filename": file.filename,
            "file_path": file_path,
            "parsed_data": parsed_pages
        }), 200
    except Exception as e:
        print("DEBUG: Exception encountered in upload file:", e)
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@all_routes_bp.route("/save-receipt", methods=["POST"])
def save_receipt():
    """Save a receipt to the database."""
    try:
        data = request.get_json(force=True)
        print("DEBUG: Received receipt data:", data)

        if not data:
            return jsonify({"error": "Missing JSON body"}), 400

        # Use the service function to save to DB
        receipt = save_receipt_to_db(data)

        return jsonify({
            "message": "Receipt saved successfully",
            "receipt_id": receipt.id
        }), 200

    except Exception as e:
        print("DEBUG: Exception encountered in save receipt:", e)
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@all_routes_bp.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "message": "Backend is healthy"}), 200