from models.receipt import Receipt
from database import db
import json
from helpers.file_upload_helpers import save_file_to_uploads
from helpers.pdf2img_helpers import handle_file_for_ocr

def save_receipt_to_db(data):
    """
    Save one or more receipts to the database given a dict or list of dicts of receipt data.
    Returns the created Receipt object(s).
    """
    receipts = []
    # If data is a list, save each receipt
    if isinstance(data, list):
        for entry in data:
            receipt = Receipt(
                filename=entry.get('filename'),
                file_path=entry.get('file'),
                vendor=entry.get('data', {}).get('Vendor') or entry.get('vendor'),
                date=entry.get('data', {}).get('Date') or entry.get('date'),
                subtotal=entry.get('data', {}).get('Subtotal') or entry.get('subtotal'),
                tax=entry.get('data', {}).get('Tax') or entry.get('tax'),
                total=entry.get('data', {}).get('Total') or entry.get('total'),
                items_json=json.dumps(entry.get('data', {}).get('items', entry.get('items', [])))
            )
            db.session.add(receipt)
            receipts.append(receipt)
        db.session.commit()
        return receipts
    else:
        # Single receipt dict
        entry = data
        receipt = Receipt(
            filename=entry.get('filename'),
            file_path=entry.get('file'),
            vendor=entry.get('data', {}).get('Vendor') or entry.get('vendor'),
            date=entry.get('data', {}).get('Date') or entry.get('date'),
            subtotal=entry.get('data', {}).get('Subtotal') or entry.get('subtotal'),
            tax=entry.get('data', {}).get('Tax') or entry.get('tax'),
            total=entry.get('data', {}).get('Total') or entry.get('total'),
            items_json=json.dumps(entry.get('data', {}).get('items', entry.get('items', [])))
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