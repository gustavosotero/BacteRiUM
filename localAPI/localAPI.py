from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File
from pydantic import BaseModel
import boto3
import uuid
import paho.mqtt.publish as publish
from typing import List

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your front-end origin like ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ Models ------------------
class SensorData(BaseModel):
    timestamp: str
    temperature: float
    humidity: float
    light_intensity: float
    fan_speed: float
    image_url: str = ""

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

IOT_BROKER = "your-iot-endpoint.amazonaws.com"
IOT_PORT = 8883
IOT_TOPIC_SENSOR = "bacterium/sensor"
IOT_TOPIC_NOTIFICATION = "bacterium/notification"

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

# ------------------ IoT Core ------------------
@app.post("/publish/sensordata")
def publish_sensor(data: SensorData):
    payload = data.dict()
    publish.single(IOT_TOPIC_SENSOR, payload=str(payload), hostname=IOT_BROKER, port=IOT_PORT)
    return {"message": "Sensor data published to IoT Core"}

@app.post("/publish/notification")
def publish_notification(notification: Notification):
    payload = notification.dict()
    publish.single(IOT_TOPIC_NOTIFICATION, payload=str(payload), hostname=IOT_BROKER, port=IOT_PORT)
    return {"message": "Notification published to IoT Core"}

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
