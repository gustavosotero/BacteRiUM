from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, String, Float, Integer, DateTime, text, select, delete
from pydantic import BaseModel
from datetime import datetime
from datetime import datetime, timedelta
import os
import logging
from fastapi.middleware.cors import CORSMiddleware

#Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

#Database setup
DATABASE_URL = "postgresql+asyncpg://cyanobox_admin:AYmc1LRD9PPGcH8KbGhE@cyanobox-db.cu3weo4yye22.us-east-1.rds.amazonaws.com/cyanobox"
engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = async_sessionmaker(bind=engine, expire_on_commit=False)
Base = declarative_base()

app = FastAPI()

#CORS Header for Front-End Connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # localhost must be changed when web page is deployed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#database session
async def get_db():
    async with SessionLocal() as session:
        yield session

#Pydantic models
class UserPy(BaseModel):
    name: str
    email: str
    role: int

class SensorPy(BaseModel): 
    timestamp: datetime
    temperature: float
    humidity: float
    light_intensity: float
    image_url: str | None = None

class NotificationPy(BaseModel):
    timestamp: datetime
    text: str
    type: int

class LightIntensityPy(BaseModel):
    value: float

#Database models
class User(Base):
    __tablename__ = "users"
    email = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    role = Column(Integer, nullable=False)

class SensorReading(Base):
    __tablename__ = "sensors"
    timestamp = Column(DateTime(timezone=True), primary_key=True)
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    light_intensity = Column(Float, nullable=False)
    image_url = Column(String, nullable=True)

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, nullable=False)
    text = Column(String, nullable=False)
    type = Column(Integer, nullable=False)

class LightIntensity(Base):
    __tablename__ = "light_intensity"
    id = Column(Integer, primary_key=True, index=True)
    value = Column(Float, nullable=False)

#Routes

##Welcome Message
@app.get("/")
async def root():
    return {"message": "Welcome to the Cyanobox API by BacteRiUM!"}

##Create user
@app.post("/users/")
async def create_user(user: UserPy, db: AsyncSession = Depends(get_db)):
    new_user = User(name=user.name, email=user.email, role=user.role)
    async with db.begin():
        db.add(new_user)
    await db.commit()
    return {"message": "User added"}

##Get all users
@app.get("/users/")
async def get_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(text("SELECT * FROM users"))
    users = result.fetchall() 
    return [{"email": user[0], "name": user[1], "role": user[2]} for user in users]

##Delete user w/ matching email
@app.delete("/users/{email}")
async def delete_user(email: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    await db.execute(delete(User).where(User.email == email))
    await db.commit()
    return {"message": "User deleted"}

##Create sensor reading
@app.post("/sensors/")
async def create_sensor_data(sensor: SensorPy, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(LightIntensity.value).order_by(LightIntensity.id.desc()).limit(1))
    latest_light_intensity = result.scalar_one_or_none()
    new_sensor_data = SensorReading(
        timestamp=sensor.timestamp,
        temperature=sensor.temperature,
        humidity=sensor.humidity,
        light_intensity=latest_light_intensity if latest_light_intensity is not None else 0.0,
        image_url=sensor.image_url
    )
    async with db.begin():
        db.add(new_sensor_data)
    await db.commit()
    return {"message": "Sensor data added", "light_intensity": new_sensor_data.light_intensity}

@app.post("/light_intensity/")
async def set_light_intensity(light_intensity: LightIntensityPy, db: AsyncSession = Depends(get_db)):
    try:
        await db.execute(delete(LightIntensity))
        new_light_intensity = LightIntensity(value=light_intensity.value)
        db.add(new_light_intensity)
        async with db.begin():
            await db.commit()
        return {"message": "Light intensity updated successfully"}
    except Exception as e:
        return {"error": str(e)}


##Get sensor readings (from date range)
@app.get("/sensors/")
async def get_sensor_data(start_date: datetime, end_date: datetime, db: AsyncSession = Depends(get_db)):
    logger.info(f"Querying sensor data from {start_date} to {end_date}")
    start_date = start_date - timedelta(days=1)
    result = await db.execute(
        text("SELECT * FROM sensors WHERE timestamp >= :start AND timestamp <= :end ORDER BY timestamp ASC"),
        {"start": start_date, "end": end_date}
    )
    sensor_data = result.fetchall()
    sensors = [{"timestamp": row.timestamp, 
                "temperature": row.temperature, 
                "humidity": row.humidity, 
                "light_intensity": row.light_intensity, 
                "image_url": row.image_url} for row in sensor_data]
    
    return sensors

##Get temperature readings by date range
@app.get("/sensors/temperature")
async def get_temperature_data(start_date: datetime, end_date: datetime, db: AsyncSession = Depends(get_db)):
    logger.info(f"Querying temperature data from {start_date} to {end_date}")
    start_date = start_date - timedelta(days=1)
    result = await db.execute(
        text("SELECT timestamp, temperature FROM sensors WHERE timestamp >= :start AND timestamp <= :end ORDER BY timestamp ASC"),
        {"start": start_date, "end": end_date}
    )
    sensor_data = result.fetchall()
    temperatures = [{"timestamp": row.timestamp, "temperature": row.temperature} for row in sensor_data]
    
    return temperatures

##Get humidity readings by date range
@app.get("/sensors/humidity")
async def get_humidity_data(start_date: datetime, end_date: datetime, db: AsyncSession = Depends(get_db)):
    logger.info(f"Querying humidity data from {start_date} to {end_date}")
    start_date = start_date - timedelta(days=1)
    result = await db.execute(
        text("SELECT timestamp, humidity FROM sensors WHERE timestamp >= :start AND timestamp <= :end ORDER BY timestamp ASC"),
        {"start": start_date, "end": end_date}
    )
    sensor_data = result.fetchall()
    humidity_data = [{"timestamp": row.timestamp, "humidity": row.humidity} for row in sensor_data]
    
    return humidity_data

##Get light intensity readings by date range
@app.get("/sensors/light_intensity")
async def get_light_intensity_data(start_date: datetime, end_date: datetime, db: AsyncSession = Depends(get_db)):
    logger.info(f"Querying light intensity data from {start_date} to {end_date}")
    start_date = start_date - timedelta(days=1)
    result = await db.execute(
        text("SELECT timestamp, light_intensity FROM sensors WHERE timestamp >= :start AND timestamp <= :end ORDER BY timestamp ASC"),
        {"start": start_date, "end": end_date}
    )
    sensor_data = result.fetchall()
    light_intensity_data = [{"timestamp": row.timestamp, "light_intensity": row.light_intensity} for row in sensor_data]
    
    return light_intensity_data

##Get image URL by date range
@app.get("/sensors/image_url")
async def get_image_url_data(start_date: datetime, end_date: datetime, db: AsyncSession = Depends(get_db)):
    logger.info(f"Querying image URL data from {start_date} to {end_date}")
    start_date = start_date - timedelta(days=1)
    result = await db.execute(
        text("SELECT timestamp, image_url FROM sensors WHERE timestamp >= :start AND timestamp <= :end ORDER BY timestamp ASC"),
        {"start": start_date, "end": end_date}
    )
    sensor_data = result.fetchall()
    image_urls = [{"timestamp": row.timestamp, "image_url": row.image_url} for row in sensor_data]
    
    return image_urls

##Create notification
@app.post("/notifications/")
async def create_notification(notification: NotificationPy, db: AsyncSession = Depends(get_db)):
    new_notification = Notification(**notification.dict())
    async with db.begin():
        db.add(new_notification)
    await db.commit()
    return {"message": "Notification added"}

#Get all notifications
@app.get("/notifications/")
async def get_notifications(db: AsyncSession = Depends(get_db)):
    result = await db.execute(text("SELECT * FROM notifications ORDER BY timestamp ASC"))
    notifications = result.fetchall()
    return [{"id": notification[0], "timestamp": notification[1], "text": notification[2], "type": notification[3]} for notification in notifications]


#uvicorn setup
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

#dates
#2025-03-18T00:00:00

#{
#  "user_id": 1,
#  "name": "John Doe",
#  "email": "johndoe@example.com",
#  "role": 2
#}

#{
#  "timestamp": "2025-03-19T12:00:00Z",
#  "temperature": 26.5,
#  "humidity": 65.2,
#  "light_intensity": 300,
#  "image_url": "https://example.com/images/sample.jpg"
#}

#{
#  "timestamp": "2025-03-19T12:05:00Z",
#  "text": "Temperature dropped below 25°C",
#  "type": 1
#}
