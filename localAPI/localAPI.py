from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import boto3
import uuid
import paho.mqtt.publish as publish

app = FastAPI()

#--------------------- Models ---------------------
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

#--------------------- In-Memory State ---------------------
latest_sensor_data: SensorDataLocalDashboard | None = None
latest_user_control: UserControl | None = None

#---------------- AWS S3 CONFIG -------------------
AWS_BUCKET_NAME = "cyanobox-images"
AWS_REGION = "us-east-1"
AWS_ACCESS_KEY = ""  # Add your access key
AWS_SECRET_KEY = ""  # Add your secret key

s3 = boto3.client(
    "s3",
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY
)

#---------------- IoT Core CONFIG ------------------
IOT_BROKER = "your-iot-endpoint.amazonaws.com"  # Replace with actual endpoint
IOT_PORT = 8883  # Use 1883 if no TLS
IOT_TOPIC_SENSOR = "bacterium/sensor"
IOT_TOPIC_NOTIFICATION = "bacterium/notification"

#--------------------- API ROUTES ---------------------

@app.get("/")
async def root():
    return {"message": "Welcome to the Cyanobox LocalAPI by BacteRiUM!!!"}

#--------------------- Pictures Endpoint ---------------------

@app.post("/upload-image")
def upload_image(file: UploadFile = File(...)):
    filename = f"{uuid.uuid4()}.jpg"
    s3.upload_fileobj(file.file, AWS_BUCKET_NAME, filename)
    url = f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{filename}"
    return {"image_url": url}

#--------------------- AWS IoT Core Publish Endpoints ---------------------

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

#--------------------- Local Dashboard Communication ---------------------

#Raspberry Pi → Local Dashboard
@app.post("/sensor-data-local")
def post_sensor_data_local(data: SensorDataLocalDashboard):
    global latest_sensor_data
    latest_sensor_data = data
    return {"message": "Sensor data received by local dashboard"}

#Dashboard → Raspberry Pi
@app.post("/user-control")
def post_user_control(data: UserControl):
    global latest_user_control
    latest_user_control = data
    return {"message": "User control data received by Raspberry Pi"}

#Raspberry Pi GET user-defined control values
@app.get("/user-control")
def get_user_control():
    if latest_user_control is None:
        return {"message": "No user control data available yet"}
    return latest_user_control

#Local dashboard GET latest sensor data
@app.get("/sensor-data-local")
def get_sensor_data_local():
    if latest_sensor_data is None:
        return {"message": "No sensor data available yet"}
    return latest_sensor_data
