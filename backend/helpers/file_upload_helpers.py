import os

def save_file_to_uploads(file):
    """
    Save an uploaded file to the uploads folder and return the file path.
    """
    upload_folder = os.path.join(os.path.dirname(__file__), '..', 'uploads')
    os.makedirs(upload_folder, exist_ok=True)
    file_path = os.path.join(upload_folder, file.filename)
    file.save(file_path)
    return file_path 