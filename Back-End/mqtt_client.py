import ssl
import json
import threading
import paho.mqtt.client as mqtt
import requests

# AWS IoT connection
ENDPOINT = "a2sdtsja14nb5p-ats.iot.us-east-1.amazonaws.com"
PORT = 8883
CLIENT_ID = "fastapi-ec2"
TOPIC = "cyanobox/#"
PATH_TO_CERT = "certs/certificate.pem.crt"
PATH_TO_KEY = "certs/private.pem.key"
PATH_TO_ROOT = "certs/AmazonRootCA1.pem"

FASTAPI_URL = "http://127.0.0.1:8000"

def on_connect(client, userdata, flags, rc):
    print("Connected with result code", rc)
    client.subscribe(TOPIC)

def on_message(client, userdata, msg):
    print(f"Received message on topic {msg.topic}")
    
    try:
        payload = json.loads(msg.payload.decode())
        
        #Subtopics and interpretations
        if msg.topic == "cyanobox/sensor":
            requests.post(f"{FASTAPI_URL}/sensors/", json=payload)

        elif msg.topic == "cyanobox/notification":
            requests.post(f"{FASTAPI_URL}/notifications/", json=payload)

        elif msg.topic == "cyanobox/temperature":

            #TO DO: WEBSOCKETS LIVE DATA

            print(f"Live temp: {payload}")

        elif msg.topic == "cyanobox/humidity":

            #TO DO: WEBSOCKETS LIVE DATA

            print(f"Live humidity: {payload}")

    except Exception as e:
        print("Error handling message:", e)

def start_mqtt():
    client = mqtt.Client(client_id=CLIENT_ID)
    client.tls_set(ca_certs=PATH_TO_ROOT,
                   certfile=PATH_TO_CERT,
                   keyfile=PATH_TO_KEY,
                   tls_version=ssl.PROTOCOL_TLSv1_2)
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(ENDPOINT, PORT)
    thread = threading.Thread(target=client.loop_forever)
    thread.start()
