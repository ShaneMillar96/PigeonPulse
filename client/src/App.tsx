import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Pigeons } from './pages/Pigeons';
import { Races } from './pages/Races'; 
import { AddPigeon } from './pages/AddPigeon';
import { AddRace } from './pages/AddRace'; 

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/pigeons" element={<Pigeons />} />
                <Route path="/races" element={<Races />} /> {/* New route */}
                <Route path="/add-pigeon" element={<AddPigeon />} />
                <Route path="/add-race" element={<AddRace />} /> {/* New route */}
            </Routes>
        </Router>
    );
}

export default App;