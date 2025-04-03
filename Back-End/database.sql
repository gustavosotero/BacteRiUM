CREATE DATABASE cyanobox;

\c cyanobox

CREATE TABLE users (
    email TEXT PRIMARY KEY, 
    name TEXT NOT NULL,
    role INT CHECK (role IN (1, 2)) NOT NULL
);

CREATE TABLE sensors (
    timestamp TIMESTAMPTZ PRIMARY KEY,
    temperature DOUBLE PRECISION,
    humidity DOUBLE PRECISION,
    light_intensity DOUBLE PRECISION,
    image_url TEXT
);

CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    text TEXT NOT NULL,
    type INTEGER NOT NULL CHECK (type IN (1, 2))
);

CREATE TABLE light_intensity (
    id SERIAL PRIMARY KEY,
    value FLOAT NOT NULL
);

CREATE EXTENSION IF NOT EXISTS timescaledb;

SELECT create_hypertable('sensors', 'timestamp');

--info & shortcuts:
--uvicorn main:app --reload (running app)
--docker exec -it cyanobox psql -U postgres (activate the database)
--DB USER = postgres
--DB PASS.= postgres
--DB NAME = cyanobox
--\c cyanobox (connect to DB)

