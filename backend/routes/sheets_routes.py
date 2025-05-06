from flask import Blueprint, request, jsonify
from services.google_sheets_service import GoogleSheetsService
import os
from dotenv import load_dotenv

load_dotenv()

sheets_bp = Blueprint('sheets', __name__)

# Get spreadsheet ID from environment variable
SPREADSHEET_ID = os.getenv('GOOGLE_SHEET_ID')

@sheets_bp.route('/api/sheets/read', methods=['GET'])
def read_sheet():
    """Read data from a specific range in the spreadsheet."""
    try:
        range_name = request.args.get('range', 'Sheet1!A1:Z1000')
        sheets_service = GoogleSheetsService(SPREADSHEET_ID)
        data = sheets_service.read_range(range_name)
        return jsonify({'success': True, 'data': data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@sheets_bp.route('/api/sheets/write', methods=['POST'])
def write_sheet():
    """Write data to a specific range in the spreadsheet."""
    try:
        data = request.json
        range_name = data.get('range', 'Sheet1!A1')
        values = data.get('values', [])
        
        sheets_service = GoogleSheetsService(SPREADSHEET_ID)
        success = sheets_service.write_range(range_name, values)
        
        return jsonify({'success': success})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@sheets_bp.route('/api/sheets/append', methods=['POST'])
def append_sheet():
    """Append data to the end of a range in the spreadsheet."""
    try:
        data = request.json
        range_name = data.get('range', 'Sheet1!A1')
        values = data.get('values', [])
        
        sheets_service = GoogleSheetsService(SPREADSHEET_ID)
        success = sheets_service.append_rows(range_name, values)
        
        return jsonify({'success': success})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500 