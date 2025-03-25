CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO users (id, email, username, password_hash, created_date)
VALUES
    (1, 'shane_millar96@hotmail.com', 'shanemillar', crypt('password', gen_salt('bf', 8)), NOW());

ALTER SEQUENCE users_id_seq RESTART WITH 2;

INSERT INTO pigeons (id, user_id, ring_number, color, sex, created_date)
VALUES
    (1, 1, 'RNG1001', 'Blue', 'Male', NOW()),
    (2, 1, 'RNG1002', 'Red', 'Female', NOW()),
    (3, 1, 'RNG1003', 'White', 'Male', NOW()),
    (4, 1, 'RNG1004', 'Black', 'Female', NOW()),
    (5, 1, 'RNG1005', 'Grey', 'Male', NOW()),
    (6, 1, 'RNG1006', 'Silver', 'Female', NOW()),
    (7, 1, 'RNG1007', 'Blue Bar', 'Male', NOW()),
    (8, 1, 'RNG1008', 'White', 'Female', NOW()),
    (9, 1, 'RNG1009', 'Black', 'Male', NOW()),
    (10, 1, 'RNG1010', 'Brown', 'Female', NOW()),
    (11, 1, 'RNG1011', 'Red', 'Male', NOW()),
    (12, 1, 'RNG1012', 'Grey', 'Female', NOW()),
    (13, 1, 'RNG1013', 'Blue', 'Male', NOW()),
    (14, 1, 'RNG1014', 'Yellow', 'Female', NOW()),
    (15, 1, 'RNG1015', 'Silver', 'Male', NOW()),
    (16, 1, 'RNG1016', 'Blue Bar', 'Female', NOW()),
    (17, 1, 'RNG1017', 'Black', 'Male', NOW()),
    (18, 1, 'RNG1018', 'White', 'Female', NOW()),
    (19, 1, 'RNG1019', 'Grey', 'Male', NOW()),
    (20, 1, 'RNG1020', 'Brown', 'Female', NOW());

ALTER SEQUENCE pigeons_id_seq RESTART WITH 21;

INSERT INTO races (id, user_id, name, date, distance, weather_conditions, race_status_id, created_date)
VALUES
    (1, 1, 'Spring Classic', '2025-04-15', 500, 'Sunny', 1, NOW()),
    (2, 1, 'Mountain Dash', '2025-05-10', 600, 'Cloudy', 1, NOW()),
    (3, 1, 'Skyline Cup', '2025-06-05', 700, 'Rainy', 1, NOW()),
    (4, 1, 'Thunder Wings', '2025-07-20', 800, 'Windy', 1, NOW()),
    (5, 1, 'Autumn Flyer', '2025-08-15', 550, 'Foggy', 1, NOW()),
    (6, 1, 'Coastal Sprint', '2025-09-12', 650, 'Clear', 1, NOW()),
    (7, 1, 'Winter Challenge', '2025-10-30', 750, 'Snowy', 1, NOW()),
    (8, 1, 'Endurance Championship', '2025-11-25', 1000, 'Stormy', 1, NOW());

ALTER SEQUENCE races_id_seq RESTART WITH 9;