ALTER TABLE Pigeons
    ADD COLUMN fatherId INT NULL,
    ADD COLUMN motherId INT NULL;

ALTER TABLE Pigeons
    ADD CONSTRAINT FK_Pigeons_Father FOREIGN KEY (fatherId) REFERENCES Pigeons(id) ON DELETE SET NULL;

ALTER TABLE Pigeons
    ADD CONSTRAINT FK_Pigeons_Mother FOREIGN KEY (motherId) REFERENCES Pigeons(id) ON DELETE SET NULL;
