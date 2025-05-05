# receipt_parser.py

# Import necessary libraries
import os
import json
import openai
import dotenv
import base64
from openai import OpenAI

dotenv.load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

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

def extract_text_with_openai(file):
    """
    Accepts an image file (not PDF), sends it to OpenAI Vision API, and prompts it to extract all text.
    Prints the extracted text to the backend log.
    """
    # Read file bytes and encode as base64
    file_bytes = file.read()
    base64_image = base64.b64encode(file_bytes).decode("utf-8")
    data_url = f"data:image/jpeg;base64,{base64_image}"  # Adjust MIME type if needed

    prompt = (
        "Extract all text from this receipt. "
        "Return only the extracted text."
    )

    response = client.responses.create(
        model="gpt-4.1-2025-04-14",  # or "gpt-4-vision-preview" if using chat.completions
        input=[{
            "role": "user",
            "content": [
                {"type": "input_text", "text": prompt},
                {"type": "input_image", "image_url": data_url, "detail": "high"}
            ],
        }],
    )

    print(response.output_text)
    return response.output_text

