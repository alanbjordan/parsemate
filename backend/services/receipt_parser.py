# receipt_parser.py

# Import necessary libraries
import os
import json
import openai
import dotenv
import base64
from openai import OpenAI
from models.llm_models import ReceiptData

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
    Accepts an image file (not PDF), sends it to OpenAI Vision API, and prompts it to extract only the specified fields in a structured JSON format.
    Prints the extracted structured data to the backend log.
    """
    # Read file bytes and encode as base64
    file_bytes = file.read()
    base64_image = base64.b64encode(file_bytes).decode("utf-8")
    data_url = f"data:image/jpeg;base64,{base64_image}"  # Adjust MIME type if needed

    prompt = (
        """
        Extract the following fields from this receipt if present: Date, Qty, Item_Number, Item_Name, Vendor, Amount, Tax, Total. 
        Return the result as a JSON object with this structure: 
        {"Date": "", "Vendor": "", "items": [{"Qty": "", "Item_Number": "", "Item_Name": "", "Amount": ""}], "Subtotal": "", "Tax": "", "Total": ""}
        If a field is not present, leave it as an empty string. 
        Do not include any explanation, only output the JSON.
        """
    )

    response = client.responses.parse(
        model="gpt-4.1-2025-04-14",  # or "gpt-4-vision-preview" if using chat.completions
        input=[
            {
            "role": "user",
            "content": [
                {"type": "input_text", "text": prompt},
                {"type": "input_image", "image_url": data_url, "detail": "high"}
            ],
        }],
        text_format=ReceiptData
    )

    # Parse and validate the response as ReceiptData
    try:
        data = json.loads(response.output_text)
        print(data)
        return data
    except Exception as e:
        print(f"[Receipt Parsing Error] {e}")
        print(response.output_text)
        return {"error": "Failed to parse receipt data", "raw": response.output_text}

