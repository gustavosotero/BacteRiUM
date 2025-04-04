from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File
from pydantic import BaseModel
import boto3
import uuid
import ssl
import paho.mqtt.client as mqtt
import logging
from typing import List

from fastapi.middleware.cors import CORSMiddleware

# ------------------ AWS IoT Core MQTT Config ------------------
IOT_BROKER = "a2sdtsja14nb5p-ats.iot.us-east-1.amazonaws.com"
IOT_PORT = 8883
CLIENT_ID = "cyanobox-localAPI"

CERT_PATH = "certs/device-certificate.pem.crt"
KEY_PATH = "certs/private.pem.key"
CA_PATH = "certs/AmazonRootCA1.pem"

IOT_TOPIC_SENSOR = "cyanobox/sensor"
IOT_TOPIC_NOTIFICATION = "cyanobox/notification"
IOT_TOPIC_RT_TEMP = "cyanobox/temperature"
IOT_TOPIC_RT_HUM = "cyanobox/humidity"

# ------------------ MQTT Publisher Helper ------------------
def publish_mqtt_message(topic: str, payload: str):
    import logging

    print(f"📡 Preparing to publish to topic: {topic}")
    print(f"📦 Payload: {payload}")

    # Set up logger
    logger = logging.getLogger("mqtt")
    logging.basicConfig(level=logging.DEBUG)

    client = mqtt.Client(client_id=CLIENT_ID)
    client.enable_logger(logger)

    # Callbacks
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("✅ MQTT Connected successfully.")
        else:
            print(f"❌ MQTT Connection failed with code {rc}.")

    def on_publish(client, userdata, mid):
        print(f"📨 Message published successfully with mid: {mid}")

    def on_disconnect(client, userdata, rc):
        print("🔌 MQTT Disconnected.")

    # Assign callbacks
    client.on_connect = on_connect
    client.on_publish = on_publish
    client.on_disconnect = on_disconnect

    try:
        client.tls_set(
            ca_certs=CA_PATH,
            certfile=CERT_PATH,
            keyfile=KEY_PATH,
            tls_version=ssl.PROTOCOL_TLSv1_2,
        )
        client.connect(IOT_BROKER, IOT_PORT)
        client.loop_start()

        result = client.publish(topic, payload)
        result.wait_for_publish()

        client.loop_stop()
        client.disconnect()
    except Exception as e:
        print(f"💥 Error during MQTT publish: {e}")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ Models ------------------
class SensorData(BaseModel):
    timestamp: str
    temperature: float
    humidity: float
    image_url: str = ""

class RT_Temperature(BaseModel):
    value: float

class RT_Humidity(BaseModel):
    value: float

class SensorDataLocalDashboard(BaseModel):
    temperature: float
    humidity: float
    fan_speed: float

class UserControl(BaseModel):
    target_temperature: float
    target_humidity: float

class Notification(BaseModel):
    notification_id: str
    timestamp: str
    message: str
    type: str

# ------------------ S3 / MQTT ------------------
AWS_BUCKET_NAME = "cyanobox-images"
AWS_REGION = "us-east-1"
AWS_ACCESS_KEY = ""
AWS_SECRET_KEY = ""

s3 = boto3.client(
    "s3",
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY
)


# ------------------ WebSocket Clients ------------------
connected_clients: List[WebSocket] = []

@app.websocket("/ws/sensor")
async def sensor_websocket(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        while True:
            await websocket.receive_text()  # keep alive
    except WebSocketDisconnect:
        connected_clients.remove(websocket)

@app.post("/broadcast-sensor")
async def broadcast_sensor(data: SensorDataLocalDashboard):
    for client in connected_clients:
        await client.send_json(data.dict())
    return {"message": "Sensor data sent to dashboard"}

# ------------------ Picture Upload ------------------
@app.post("/upload-image")
def upload_image(file: UploadFile = File(...)):
    filename = f"{uuid.uuid4()}.jpg"
    s3.upload_fileobj(file.file, AWS_BUCKET_NAME, filename)
    url = f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{filename}"
    return {"image_url": url}

# ------------------ IoT Core MQTT Endpoints ------------------
@app.post("/publish/sensordata")
def publish_sensor(data: SensorData):
    payload = data.model_dump_json()
    publish_mqtt_message(IOT_TOPIC_SENSOR, payload)
    return {"message": "Sensor data published to AWS IoT Core"}

@app.post("/publish/notification")
def publish_notification(notification: Notification):
    payload = notification.model_dump_json()
    publish_mqtt_message(IOT_TOPIC_NOTIFICATION, payload)
    return {"message": "Notification published to AWS IoT Core"}

@app.post("/publish/temperature")
def publish_temperature(temperature: RT_Temperature):
    payload = temperature.model_dump_json()
    publish_mqtt_message(IOT_TOPIC_RT_TEMP, payload)
    return {"message": "Real-time temperature published to AWS IoT Core"}

@app.post("/publish/humidity")
def publish_humidity(humidity: RT_Humidity):
    payload = humidity.model_dump_json()
    publish_mqtt_message(IOT_TOPIC_RT_HUM, payload)
    return {"message": "Real-time humidity published to AWS IoT Core"}

# ------------------ User Control ------------------
latest_user_control: UserControl | None = None

@app.post("/user-control")
def post_user_control(data: UserControl):
    global latest_user_control
    latest_user_control = data
    return {"message": "User control data received by Raspberry Pi"}

@app.get("/user-control")
def get_user_control():
    if latest_user_control is None:
        return {"message": "No user control data available yet"}
    return latest_user_control

@app.get("/")
async def root():
    return {"message": "Welcome to the Cyanobox LocalAPI by BacteRiUM!!!"}
