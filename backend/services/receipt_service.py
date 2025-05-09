from models.receipt import Receipt
from database import db
import json

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