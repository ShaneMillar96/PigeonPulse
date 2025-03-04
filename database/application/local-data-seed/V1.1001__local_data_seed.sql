CREATE EXTENSION IF NOT EXISTS pgcrypto;


INSERT INTO users (id, email, username, password_hash, created_date)
VALUES
    (1, 'shane_millar96@hotmail.com', 'shanemillar', crypt('password', gen_salt('bf', 8)), NOW());

ALTER SEQUENCE users_id_seq RESTART WITH 2;

INSERT INTO pigeons (id, user_id, name, ring_number, color, strain, created_date)
VALUES
    (1, 1, 'Skyhawk', 'RNG1001', 'Blue', 'Janssen', NOW()),
    (2, 1, 'Storm', 'RNG1002', 'Red', 'Van Loon', NOW()),
    (3, 1, 'Thunderbolt', 'RNG1003', 'White', 'Houben', NOW()),
    (4, 1, 'Flash', 'RNG1004', 'Black', 'Janssen', NOW()),
    (5, 1, 'Falcon', 'RNG1005', 'Grey', 'Meuleman', NOW()),
    (6, 1, 'Lightning', 'RNG1006', 'Silver', 'Janssen', NOW()),
    (7, 1, 'Eagle', 'RNG1007', 'Blue Bar', 'Stichelbaut', NOW()),
    (8, 1, 'Phantom', 'RNG1008', 'White', 'Janssen', NOW()),
    (9, 1, 'Rocket', 'RNG1009', 'Black', 'Van Loon', NOW()),
    (10, 1, 'Comet', 'RNG1010', 'Brown', 'Houben', NOW()),
    (11, 1, 'Vortex', 'RNG1011', 'Red', 'Meuleman', NOW()),
    (12, 1, 'Cyclone', 'RNG1012', 'Grey', 'Janssen', NOW()),
    (13, 1, 'Tornado', 'RNG1013', 'Blue', 'Houben', NOW()),
    (14, 1, 'Blaze', 'RNG1014', 'Yellow', 'Van Loon', NOW()),
    (15, 1, 'Meteor', 'RNG1015', 'Silver', 'Stichelbaut', NOW()),
    (16, 1, 'Pegasus', 'RNG1016', 'Blue Bar', 'Janssen', NOW()),
    (17, 1, 'Shadow', 'RNG1017', 'Black', 'Houben', NOW()),
    (18, 1, 'Specter', 'RNG1018', 'White', 'Van Loon', NOW()),
    (19, 1, 'Nova', 'RNG1019', 'Grey', 'Meuleman', NOW()),
    (20, 1, 'Glider', 'RNG1020', 'Brown', 'Janssen', NOW());

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
