import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Pigeons } from './pages/Pigeons';
import { AddPigeon } from './pages/AddPigeon';
import { Races } from './pages/Races';
import { AddRace } from './pages/AddRace';
import { RaceBasket } from './pages/RaceBasket';
import { RecordRaceResults } from './pages/RecordRaceResults';
import { Leaderboard } from './pages/Leaderboard';
import { Dashboard } from './pages/Dashboard';

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

            </Routes>
        </Router>
    );
}

export default App;
