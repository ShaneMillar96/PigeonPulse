CREATE TABLE Baskets (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    pigeon_id INT NOT NULL,
    race_id INT NOT NULL,
    basketed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (pigeon_id) REFERENCES Pigeons(id) ON DELETE CASCADE,
    FOREIGN KEY (race_id) REFERENCES Races(id) ON DELETE CASCADE,
    UNIQUE (pigeon_id, race_id)
);