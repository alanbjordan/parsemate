FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Ensure python-dotenv is installed and .env is loaded by Flask
ENV PYTHONUNBUFFERED=1

CMD ["python", "app.py"]