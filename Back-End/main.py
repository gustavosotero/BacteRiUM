from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Enum, String, Float, Integer, DateTime, text
from sqlalchemy.future import select
from pydantic import BaseModel
from datetime import datetime
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost/cyanobox")
engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = async_sessionmaker(bind=engine, expire_on_commit=False)
Base = declarative_base()

app = FastAPI()

# Dependency to get database session
async def get_db():
    async with SessionLocal() as session:
        yield session

# Pydantic models
class UserCreate(BaseModel):
    name: str
    email: str
    role: int

class SensorCreate(BaseModel): 
    timestamp: datetime
    temperature: float
    humidity: float
    light_intensity: float
    image_url: str | None = None

class NotificationCreate(BaseModel):
    timestamp: datetime
    text: str
    type: int

# Database models
class User(Base):
    __tablename__ = "users"
    email = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    role = Column(Integer, nullable=False)

class SensorReading(Base):
    __tablename__ = "sensors"
    timestamp = Column(DateTime, primary_key=True)
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

# Initialize database tables
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Routes
@app.get("/")
async def root():
    return {"message": "Welcome to the Cyanobox API by BacteRiUM!"}

@app.post("/users/")
async def create_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    new_user = User(name=user.name, email=user.email, role=user.role)
    async with db.begin():
        db.add(new_user)
    await db.commit()
    return {"message": "User added"}

@app.get("/users/")
async def get_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(text("SELECT * FROM users"))
    users = result.fetchall()  # Get the result rows
    return [{"email": user[0], "name": user[1], "role": user[2]} for user in users]

@app.delete("/users/{email}")
async def delete_user(email: str, db: AsyncSession = Depends(get_db)):
    user = await db.get(User, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    async with db.begin():
        await db.delete(user)
    await db.commit()
    return {"message": "User deleted"}

@app.post("/sensors/")
async def create_sensor_data(sensor: SensorCreate, db: AsyncSession = Depends(get_db)):
    new_sensor_data = SensorReading(**sensor.dict())
    async with db.begin():
        db.add(new_sensor_data)
    await db.commit()
    return {"message": "Sensor data added"}

@app.get("/sensors/")
async def get_sensor_data(start_date: datetime = None, end_date: datetime = None, db: AsyncSession = Depends(get_db)):
    if start_date is None or end_date is None:
        result = await db.execute(
            text("SELECT * FROM sensors")
        )
        sensor_data = result.fetchall()
    else:
        result = await db.execute(
            text("SELECT * FROM sensors WHERE timestamp BETWEEN :start AND :end"),
            {"start": start_date, "end": end_date}
        )
    sensor_data = result.fetchall()
    sensors = [{"timestamp": row.timestamp, 
                "temperature": row.temperature, 
                "humidity": row.humidity, 
                "light_intensity": row.light_intensity, 
                "image_url": row.image_url} for row in sensor_data]
    return sensors

@app.post("/notifications/")
async def create_notification(notification: NotificationCreate, db: AsyncSession = Depends(get_db)):
    new_notification = Notification(**notification.dict())
    async with db.begin():
        db.add(new_notification)
    await db.commit()
    return {"message": "Notification added"}

@app.get("/notifications/")
async def get_notifications(db: AsyncSession = Depends(get_db)):
    result = await db.execute(text("SELECT * FROM notifications"))
    notifications = result.fetchall()  # Get the result rows
    return [{"id": notification[0], "timestamp": notification[1], "text": notification[2], "type": notification[3]} for notification in notifications]


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)