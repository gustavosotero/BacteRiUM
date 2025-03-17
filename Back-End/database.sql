CREATE DATABASE cyanobox;

\c cyanobox

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role INT CHECK (role IN (1, 2))
);

CREATE TABLE sensors (
    timestamp TIMESTAMPTZ PRIMARY KEY,
    temperature FLOAT NOT NULL,
    humidity FLOAT NOT NULL,
    light_intensity FLOAT NOT NULL,
    image_url TEXT
);

CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ,
    text TEXT NOT NULL,
    type INTEGER NOT NULL CHECK (type IN (1, 2))
);

CREATE EXTENSION IF NOT EXISTS timescaledb;

SELECT create_hypertable('sensors', 'timestamp');

docker exec -it cyanobox psql -U postgres --Command to activate the database

--info & shortcuts:
--
--