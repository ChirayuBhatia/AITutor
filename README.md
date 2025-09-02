# AI Tutor
## Installation
### Step-1: Clone Git Repository into Raspberry Pi
```bash
git clone https://github.com/ChirayuBhatia/AITutor.git
```
### Step-2: Create Virtual Environment
```bash
cd AITutor # Enter into the directory
python -m venv venv
source venv/bin/activate
```
Started virtual environment `venv`
To exit the virtual environment run command
```bash
deactivate
```
### Step-3: Install all requirements
```bash
# Installing all python dependencies
pip install -r requirements.txt

# Installing Node and NPM
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```
### Step-4: Create Service for Frontend
```bash
sudo nano /etc/systemd/system/aitutor.service
```
Now paste
```txt
[Unit]
Description=AITutor Frontend
After=network.target

[Service]
WorkingDirectory=/home/pi/AITutor
ExecStart=/home/pi/.nvm/versions/node/v18.20.8/bin/npm run start
Restart=always
RestartSec=10
User=kiosk
Environment=PATH=/home/pi/.nvm/versions/node/v18.20.8/bin:/usr/bin:/usr/local/bin
Environment=DISPLAY=:0

StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=my-npm-app

[Install]
WantedBy=multi-user.target
```
Exit the editor and run commands
```bash
sudo systemctl daemon-reload
```
To Start the program automatically on boot, run:
```bash
sudo systemctl enable aitutor.service
```
### Step-5: AutoStart Backend
Installing PM2
```bash
sudo npm install -g pm2
pm2 startup
```
Run the command by PM2 to complete startup setup.
Inside the cloned directory `AITutor`, run command:
```bash
pm2 start backend.sh
```
```bash
pm2 save
```
### Step-6: Add Piper Voices
Inside AITutor Directory Run
```bash
wget https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/hfc_female/medium/en_US-hfc_female-medium.onnx
wget https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/hfc_female/medium/en_US-hfc_female-medium.onnx.json
```