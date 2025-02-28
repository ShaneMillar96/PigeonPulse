import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import PigeonLogo from '../../public/pigeonpulse-logo.png';
export const Home: React.FC = () => (
    <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto p-4 flex flex-col items-center">
            <h1 className="text-3xl font-bold text-center">Welcome to PigeonPulse</h1>
            <p className="text-center mt-4">A platform for racing pigeon fanciers.</p>
            <img src={PigeonLogo} alt="PigeonPulse Logo" className="mt-8 w-48 h-auto" />
        </main>
        <Footer />
    </div>
);