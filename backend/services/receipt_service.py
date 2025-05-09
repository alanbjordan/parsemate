from models.receipt import Receipt
from database import db
import json
from helpers.file_upload_helpers import save_file_to_uploads
from helpers.pdf2img_helpers import handle_file_for_ocr

def save_receipt_to_db(data):
    """
    Save a receipt to the database given a dict of receipt data.
    Returns the created Receipt object.
    """
    receipt = Receipt(
        filename=data.get('filename'),
        file_path=data.get('file_path'),
        vendor=data.get('vendor'),
        date=data.get('date'),
        subtotal=data.get('subtotal'),
        tax=data.get('tax'),
        total=data.get('total'),
        items_json=json.dumps(data.get('items', []))
    )
    db.session.add(receipt)
    db.session.commit()
    return receipt


def process_upload(file):
    """
    Orchestrates the upload flow: saves the file, checks file type, and extracts data using helpers.
    Returns the file path and parsed data (list of page objects).
    """
    file_path = save_file_to_uploads(file)
    file.seek(0) 
    parsed_pages = handle_file_for_ocr(file)
    return file_path, parsed_pages 