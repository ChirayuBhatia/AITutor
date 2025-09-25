# Use an official Python image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app/backend

# Install wget
RUN apt-get update && apt-get install -y wget

# Copy the requirements file
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend source code
COPY backend/ .

# Download the Piper voice models
RUN wget https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/hfc_female/medium/en_US-hfc_female-medium.onnx.json

# Command to run the backend (adjust backend.sh if necessary)
CMD ["sh", "./backend.sh"]
