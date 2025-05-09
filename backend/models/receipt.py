from database import db
import datetime
import json

class Receipt(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    upload_time = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    vendor = db.Column(db.String(255))
    date = db.Column(db.String(50))
    subtotal = db.Column(db.String(50))
    tax = db.Column(db.String(50))
    total = db.Column(db.String(50))
    items_json = db.Column(db.Text)  # Store items as JSON string

    def to_dict(self):
        return {
            "id": self.id,
            "filename": self.filename,
            "file_path": self.file_path,
            "upload_time": self.upload_time.isoformat(),
            "vendor": self.vendor,
            "date": self.date,
            "subtotal": self.subtotal,
            "tax": self.tax,
            "total": self.total,
            "items": json.loads(self.items_json or "[]")
        }