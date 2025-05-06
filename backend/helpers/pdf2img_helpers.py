from pdf2image import convert_from_bytes
from io import BytesIO
from services.receipt_parser import extract_text_with_openai

# Error messages
ERROR_MESSAGE = "No valid items found on this page."

def pdf_to_images(file):
    """
    Converts all pages of a PDF file to JPEG images in memory.
    Returns a list of BytesIO objects containing the images.
    """
    file.seek(0)
    images = convert_from_bytes(file.read(), fmt='jpeg')
    if not images:
        raise ValueError("No images found in PDF")
    img_byte_arrs = []
    for img in images:
        img_byte_arr = BytesIO()
        img.save(img_byte_arr, format='JPEG')
        img_byte_arr.seek(0)
        img_byte_arrs.append(img_byte_arr)
    return img_byte_arrs

def handle_file_for_ocr(file):
    """
    Detects file type and converts PDF to images if needed, then extracts text from each page or image.
    Returns a list of page objects: [{"page": 1, "data": ...}, ...] (skipping pages with no valid items)
    """
    if file.mimetype == 'application/pdf' or file.filename.lower().endswith('.pdf'):
        print("[Info] PDF detected, converting to images...")
        image_files = pdf_to_images(file)
        all_pages = []
        for idx, image_file in enumerate(image_files):
            print(f"[Info] Processing page {idx+1} of PDF...")
            result = extract_text_with_openai(image_file)
            if isinstance(result, dict) and result.get("error"):
                # Only skip if error is about no valid items
                if result["error"] == ERROR_MESSAGE:
                    continue
                else:
                    all_pages.append({"page": idx+1, "error": result["error"]})
            elif result and result.get("items") and len(result["items"]):
                all_pages.append({"page": idx+1, "data": result})
            # else: skip pages with no valid items
        return all_pages
    else:
        file.seek(0)
        result = extract_text_with_openai(file)
        if isinstance(result, dict) and result.get("error"):
            if result["error"] == "No valid items found on this page.":
                return []
            else:
                return [{"page": 1, "error": result["error"]}]
        elif result and result.get("items") and len(result["items"]):
            return [{"page": 1, "data": result}]
        else:
            return []