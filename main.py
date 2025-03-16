from fastapi import FastAPI, HTTPException, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.future import select
from sqlalchemy import Column, String, Float, Integer, DateTime
from pydantic import BaseModel, HttpUrl
from datetime import datetime
import os

#Database Configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost/cyanobox")
engine = create_async_engine(DATABASE_URL, future=True, echo=True)
SessionLocal = async_sessionmaker(bind=engine, expire_on_commit=False)
Base = declarative_base()

app = FastAPI()

#Dependency to get DB session
async def get_db():
    async with SessionLocal() as session:
        yield session

#Pydantic models for validation
class UserCreate(BaseModel):
    email: str
    name: str
    role: int

class SensorCreate(BaseModel):
    timestamp: str
    temperature: float
    humidity: float
    light_intensity: float
    image_url: HttpUrl | None = None

class NotificationCreate(BaseModel):
    timestamp: str
    text: str
    type: str

#Users Table Model
class User(Base):
    __tablename__ = "users"
    email = Column(String, primary_key=True, unique=True)
    name = Column(String, nullable=False)
    role = Column(Integer, nullable=False)

#Sensors Table Model
class SensorReading(Base):
    __tablename__ = "sensors"
    timestamp = Column(DateTime, primary_key=True, default=datetime.utcnow)
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    light_intensity = Column(Float, nullable=False)
    image_url = Column(String, nullable=True)

#Notifications Table Model
class Notification(Base):
    __tablename__ = "notifications"
    timestamp = Column(DateTime, primary_key=True, default=datetime.utcnow)
    text = Column(String, nullable=False)
    type = Column(String, nullable=False)  #'info' or 'warning'

#Initialize DB Tables
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

#Global error handler
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail=f"An unexpected error occurred: {str(exc)}"
    )

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

#Route: Create User
@app.post("/users/", status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    new_user = User(email=user.email, name=user.name, role=user.role)
    async with db.begin():
        db.add(new_user)
    return {"message": "User created successfully"}

#Route: Get All Users with Pagination
@app.get("/users/")
async def get_users(limit: int = 10, offset: int = 0, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).limit(limit).offset(offset))
    users = result.fetchall()
    return {"users": users}

#Route: Delete User
@app.delete("/users/{email}")
async def delete_user(email: str, db: AsyncSession = Depends(get_db)):
    async with db.begin():
        result = await db.execute(select(User).filter(User.email == email))
        user = result.scalar()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        await db.execute("DELETE FROM users WHERE email = :email", {"email": email})
    return {"message": "User deleted successfully"}

#Route: Get Sensor Data Within Time Range
@app.get("/sensors/")
async def get_sensor_data(start_date: str, end_date: str, limit: int = 10, offset: int = 0, db: AsyncSession = Depends(get_db)):
    start_dt = datetime.strptime(start_date, "%Y-%m-%d")
    end_dt = datetime.strptime(end_date, "%Y-%m-%d")
    
    result = await db.execute(
        select(SensorReading)
        .where(SensorReading.timestamp.between(start_dt, end_dt))
        .limit(limit)
        .offset(offset)
    )
    sensor_data = result.fetchall()
    return {"sensor_data": sensor_data}

#Route: Add Sensor Data
@app.post("/sensors/", status_code=status.HTTP_201_CREATED)
async def create_sensor_data(sensor: SensorCreate, db: AsyncSession = Depends(get_db)):
    timestamp = datetime.strptime(sensor.timestamp, "%Y-%m-%d %H:%M:%S")
    new_sensor_data = SensorReading(
        timestamp=timestamp, 
        temperature=sensor.temperature,
        humidity=sensor.humidity,
        light_intensity=sensor.light_intensity,
        image_url=sensor.image_url
    )
    async with db.begin():
        db.add(new_sensor_data)
    return {"message": "Sensor data added successfully"}

#Route: Add Notification
@app.post("/notifications/", status_code=status.HTTP_201_CREATED)
async def create_notification(notification: NotificationCreate, db: AsyncSession = Depends(get_db)):
    if notification.type not in ["info", "warning"]:
        raise HTTPException(status_code=400, detail="Invalid notification type. Must be 'info' or 'warning'.")
    
    timestamp = datetime.strptime(notification.timestamp, "%Y-%m-%d %H:%M:%S")
    new_notification = Notification(
        timestamp=timestamp, 
        text=notification.text, 
        type=notification.type
    )
    
    async with db.begin():
        db.add(new_notification)
    
    return {"message": "Notification added successfully"}

#Route: Get All Notifications
@app.get("/notifications/")
async def get_notifications(limit: int = 10, offset: int = 0, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Notification).limit(limit).offset(offset))
    notifications = result.fetchall()
    return {"notifications": notifications}

#Route: Get Pictures Within Time Range
@app.get("/images/")
async def get_images(start_date: str, end_date: str, db: AsyncSession = Depends(get_db)):
    start_dt = datetime.strptime(start_date, "%Y-%m-%d")
    end_dt = datetime.strptime(end_date, "%Y-%m-%d")
    
    result = await db.execute(
        select(SensorReading.image_url)
        .where(SensorReading.timestamp.between(start_dt, end_dt))
    )
    images = [row[0] for row in result.fetchall() if row[0]]  #Collect image URLs only
    return {"images": images}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)