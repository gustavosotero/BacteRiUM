from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import boto3
import uuid
import os
import datetime
import paho.mqtt.publish as publish
import uvicorn

app = FastAPI()

# --------------------- Models ---------------------
class SensorData(BaseModel):
    timestamp: str
    temperature: float
    humidity: float
    light_intensity: float
    fan_speed: float
    image_url: str = ""

class UserControl(BaseModel):
    target_temperature: float
    target_humidity: float

class Notification(BaseModel):
    notification_id: str
    timestamp: str
    message: str
    type: str

# ---------------- AWS S3 CONFIG -------------------
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

# --------------------- Endpoints ---------------------

# Upload image to S3 and get URL
@app.post("/upload-image")
def upload_image(file: UploadFile = File(...)):
    filename = f"{uuid.uuid4()}.jpg"
    s3.upload_fileobj(file.file, AWS_BUCKET_NAME, filename)
    url = f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{filename}"
    return {"image_url": url}

# --------------------- Models ---------------------

@app.get("/")
async def root():
    return{"message": "Welcome to the Cyanobox LocalAPI by BacteRiUM!!!"}
