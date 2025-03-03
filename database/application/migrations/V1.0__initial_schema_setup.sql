CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Pigeons (
     id SERIAL PRIMARY KEY,
     user_id INT NOT NULL,
     name VARCHAR(50) NOT NULL,
     ring_number VARCHAR(20) NOT NULL UNIQUE,
     created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
    );

CREATE TABLE race_status (
                             id SERIAL PRIMARY KEY,
                             name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO race_status (name) VALUES
                                   ('New'),
                                   ('Basketed'),
                                   ('Finished');

CREATE TABLE Races (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    date TIMESTAMP NOT NULL,
    race_status_id INT NOT NULL,
    distance DECIMAL(10,2) NOT NULL,
    weather_conditions VARCHAR(255),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (race_status_id) REFERENCES race_status(id) ON DELETE CASCADE
);

CREATE TABLE RaceResults (
     Id SERIAL PRIMARY KEY,
     pigeon_id INT NOT NULL,
     race_id INT NOT NULL,
     finish_time TIMESTAMP NOT NULL,
     speed DECIMAL(10,2),
     created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (pigeon_id) REFERENCES Pigeons(id) ON DELETE CASCADE,
     FOREIGN KEY (race_id) REFERENCES Races(id) ON DELETE CASCADE
);