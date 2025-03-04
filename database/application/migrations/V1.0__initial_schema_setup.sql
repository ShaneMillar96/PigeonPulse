
CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       username VARCHAR(50) NOT NULL UNIQUE,
                       email VARCHAR(100) NOT NULL UNIQUE,
                       password_hash VARCHAR(255) NOT NULL,
                       created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pigeons (
                         id SERIAL PRIMARY KEY,
                         user_id INT NOT NULL,
                         name VARCHAR(50) NOT NULL,
                         ring_number VARCHAR(20) NOT NULL UNIQUE,
                         color VARCHAR(50),
                         strain VARCHAR(50),
                         created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE race_status (
                            id SERIAL PRIMARY KEY,
                            name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO race_status (name) VALUES ('New'), ('Basketed'), ('Finished');

CREATE TABLE races (
                       id SERIAL PRIMARY KEY,
                       user_id INT NOT NULL,
                       name VARCHAR(100) NOT NULL,
                       date TIMESTAMP NOT NULL,
                       race_status_id INT NOT NULL,
                       distance DECIMAL(10,2) NOT NULL,
                       weather_conditions VARCHAR(100),
                       created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                       FOREIGN KEY (race_status_id) REFERENCES race_status(id)
);

CREATE TABLE baskets (
                         id SERIAL PRIMARY KEY,
                         user_id INT NOT NULL,
                         pigeon_id INT NOT NULL,
                         race_id INT NOT NULL,
                         basketed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                         FOREIGN KEY (pigeon_id) REFERENCES pigeons(id) ON DELETE CASCADE,
                         FOREIGN KEY (race_id) REFERENCES races(id) ON DELETE CASCADE,
                         UNIQUE (pigeon_id, race_id)
);

CREATE TABLE race_results (
                             id SERIAL PRIMARY KEY,
                             race_id INT NOT NULL,
                             pigeon_id INT NOT NULL,
                             user_id INT NOT NULL,
                             finish_time TIME NOT NULL,
                             FOREIGN KEY (race_id) REFERENCES races(id) ON DELETE CASCADE,
                             FOREIGN KEY (pigeon_id) REFERENCES pigeons(id) ON DELETE CASCADE,
                             FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                             UNIQUE (race_id, pigeon_id)
);
