from faster_whisper import WhisperModel
import google.generativeai as genai
from requests import post, get
import subprocess as sp
import RPi.GPIO as GPIO
from time import sleep
import json
import re


GENAI_API_KEY = ""
UNSPLASH_API_KEY = ""
GPIO.setmode(GPIO.BOARD)
GPIO.setup(3, GPIO.OUT)
pwm = GPIO.PWM(3, 50)
pwm.start(7)


def face_expression(expression):
    post('http://localhost:3000/'+expression)


def set_angle(angle):
    duty = angle / 18 + 2
    GPIO.output(3, True)
    pwm.ChangeDutyCycle(duty)
    sleep(1)
    GPIO.output(3, False)
    pwm.ChangeDutyCycle(0)


face_expression('closeeye')
genai.configure(api_key=f"{GENAI_API_KEY}")
headers = {"Authorization": f"Client-ID {UNSPLASH_API_KEY}"}

command = [
    "arecord", 
    "-f", "S16_LE", 
    "-r", "16000", 
    "-c", "1", 
    "-d", "5", 
    "-t", "wav", 
    "our_audio.wav"
]


def get_gemini_reply(prompt):
    model = genai.GenerativeModel("gemma-3n-e2b-it")
    response = model.generate_content(prompt+" Answer in max 50 words. If the response can be explained by an image provide object name at the end inside () else (None). For example to describe about orange (Orange_fruit)")
    return response.text


model = WhisperModel('base', device="cpu", compute_type="float32")

while True:
    try:
        # Recording Audio
        print("Listening...")
        face_expression('openeye')
        sp.run(command)
        face_expression('closeeye')
        print("Processing...")
        segments, _ = model.transcribe("our_audio.wav", language="en")
        print("Recorded Content: ", end='')
        query = ''
        for s in segments:
            query += s.text
        print(query)
        if not query:
            continue
        elif query.strip().lower() in ['see left', 'left', 'look left', 'sea left']:
            set_angle(10)
            continue
        elif query.strip().lower() in ['see right', 'right', 'look right', 'sea right']:
            set_angle(170)
            continue
        elif query.strip().lower() in ['see center', 'center', 'look center', 'sea center']:
            set_angle(90)
            continue
        response = get_gemini_reply(query)
        print(response)
        try:
            name = response[response.rfind('(')+1:response.rfind(')')]
            if not name == 'None':
                res = get(f'https://api.unsplash.com/search/photos?query={name}&per_page=1', headers=headers).json()
                post(
                    'http://localhost:3000/show-image',
                    data=json.dumps(
                        {
                            "imageUrl": res['results'][0]['urls']['raw']
                        }),
                    headers={'Content-Type': 'application/json'})
        except:
            pass
        response = re.sub(r'[^a-zA-Z0-9\s]', '', response)
        piper_command = ["piper", "-m", "en_US-hfc_female-medium.onnx", "--length_scale", "1.50", "-f", "output.wav"]
        result = sp.run(piper_command, input=response.encode('utf-8'))
        face_expression('openeye')
        face_expression('speak')
        sp.run(["aplay", "output.wav"])
        face_expression('remove-image')
        face_expression('stopspeak')
        face_expression('closeeye')

    except KeyboardInterrupt:
        print("\nExiting.")
        pwm.stop()
        GPIO.cleanup()
        break
    except Exception as e:
        print(f"Error: {e}")
        pwm.stop()
        GPIO.cleanup()
