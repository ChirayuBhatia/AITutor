# Start with a Node.js base image
FROM node:18-slim

# Install system dependencies required by Electron for GUI applications
RUN apt-get update && apt-get install -y \
    libgtk-3-0 \
    libnss3 \
    libasound2 \
    libxss1 \
    libx11-xcb1 \
    libxtst6 \
    libxrandr2 \
    libxkbfile1 \
    libsecret-1-0 \
    libgbm1 \
    libpulse0 \
    libatk-bridge2.0-0 \
    libatspi2.0-0 \
    libdrm2 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxinerama1 \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy the rest of your application's source code
COPY frontend/ .

# The command to start your Electron application
CMD ["npm", "start"]
