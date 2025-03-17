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
    timestamp TIMESTAMPTZ PRIMARY KEY,
    text TEXT NOT NULL,
    type TEXT CHECK (type IN ('info', 'warning'))
);
