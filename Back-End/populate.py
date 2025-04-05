import requests
import random
from datetime import datetime, timedelta
import uuid

API_URL = "http://api.cyanobox.online"  # Change to your deployed API base URL

# Users to insert
USERS = [
    ("jan.morales2@upr.edu", "Jan Morales", 1),
    ("gustavo.sotero@upr.edu", "Gustavo Sotero", 2),
    ("anton.wallentin@upr.edu", "Anton Wallentin", 2),
    ("edgar.suarez1@upr.edu", "Edgar Suarez", 2),
    ("francisco.rosario6@upr.edu", "Francisco Rosario", 2)
]

def insert_users():
    print("Inserting users...")
    for email, name, role in USERS:
        requests.post(f"{API_URL}/users", json={
            "email": email,
            "name": name,
            "role": role
        })

def generate_sensor_data():
    print("Generating sensor data...")
    now = datetime.now().replace(minute=0, second=0, microsecond=0)
    start_date = now - timedelta(days=180)
    hours = list(range(24))  # 0-23

    for day in range(180):
        current_day = start_date + timedelta(days=day)
        for hour in hours:
            timestamp = current_day.replace(hour=hour)
            temp = round(random.uniform(18.0, 32.0), 2)
            humidity = round(random.uniform(30.0, 80.0), 2)
            light = round(random.uniform(200, 800), 2)
            image_url = f"https://example.com/images/{uuid.uuid4()}.jpg" if 8 <= hour <= 19 else "camera off"

            requests.post(f"{API_URL}/sensors", json={
                "timestamp": timestamp.isoformat(),
                "temperature": temp,
                "humidity": humidity,
                "light_intensity": light,
                "image_url": image_url
            })

def generate_notifications():
    print("Generating notifications...")
    now = datetime.now().replace(minute=0, second=0, microsecond=0)
    start_date = now - timedelta(days=180)

    for day in range(180):
        current_day = start_date + timedelta(days=day)

        times = random.sample(range(24), 5)
        for i in range(5):
            hour = times[i]
            ts = current_day.replace(hour=hour)
            text = f"Random Notification {uuid.uuid4().hex[:8]}"
            n_type = 2 if i < 2 else 1  # First two are warnings
            requests.post(f"{API_URL}/notifications", json={
                "timestamp": ts.isoformat(),
                "text": text,
                "type": n_type
            })

def main():
    generate_notifications()
    print("✅ Done populating the database!")

if __name__ == "__main__":
    main()
