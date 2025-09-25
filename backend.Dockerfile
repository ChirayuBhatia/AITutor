# Use an official Python image
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies for PyAudio and wget
# We set a non-interactive frontend to prevent prompts during build
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y \
    build-essential \
    portaudio19-dev \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file and install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend source code into the working directory
COPY backend/ .

# Download the Piper voice models
RUN wget https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/hfc_female/medium/en_US-hfc_female-medium.onnx

# Set the command to run the application
# This replaces 'python main.py' from your script
CMD ["python", "main.py"]
