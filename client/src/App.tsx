import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import components from features
import { Login, Register } from '@/features/auth';
import { Pigeons, AddPigeon, Pairing, Pedigree } from '@/features/pigeons';
import { Races, AddRace, RaceBasket, RecordRaceResults, Leaderboard } from '@/features/races';
import { Dashboard } from '@/features/dashboard';
import { Home } from '@/features/home';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/pigeons" element={<Pigeons />} />
                <Route path="/add-pigeon" element={<AddPigeon />} />
                <Route path="/edit-pigeon/:pigeonId" element={<AddPigeon />} />
                <Route path="/races" element={<Races />} />
                <Route path="/add-race" element={<AddRace />} />
                <Route path="/edit-race/:raceId" element={<AddRace />} />
                <Route path="/race/:raceId/basket" element={<RaceBasket />} />
                <Route path="/race/:raceId/results" element={<RecordRaceResults />} />
                <Route path="/race/:raceId/leaderboard" element={<Leaderboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/pair-pigeons" element={<Pairing />} />
                <Route path="/pedigree/:pigeonId" element={<Pedigree />} />
            </Routes>
        </Router>
    );
}

export default App;