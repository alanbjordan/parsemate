from flask import Blueprint, request, jsonify
from services.receipt_service import save_receipt_to_db, process_upload
from database import db
from models.receipt import Receipt

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

        # Handle both single and multiple receipts
        if isinstance(receipt, list):
            ids = [r.id for r in receipt]
            return jsonify({
                "message": "Receipts saved successfully",
                "receipt_ids": ids
            }), 200
        else:
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

@all_routes_bp.route("/receipts", methods=["GET"])
def get_receipts():
    """Return all receipts in the database as a list of dicts."""
    try:
        receipts = Receipt.query.order_by(Receipt.upload_time.desc()).all()
        return jsonify([r.to_dict() for r in receipts]), 200
    except Exception as e:
        print("DEBUG: Exception encountered in get_receipts:", e)
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@all_routes_bp.route("/receipts/summary", methods=["GET"])
def get_receipts_summary():
    """Return summary info for all receipts: filename, vendor, total."""
    try:
        receipts = Receipt.query.order_by(Receipt.upload_time.desc()).all()
        summary = [
            {
                "id": r.id,
                "filename": r.filename,
                "vendor": r.vendor,
                "total": r.total
            }
            for r in receipts
        ]
        return jsonify(summary), 200
    except Exception as e:
        print("DEBUG: Exception encountered in get_receipts_summary:", e)
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500