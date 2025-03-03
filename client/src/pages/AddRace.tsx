import React, { useState } from 'react';
import { useRaces } from '../hooks/useRaces';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const AddRace: React.FC = () => {
    const [form, setForm] = useState({
        name: '',
        date: '',
        distance: '',
        weatherConditions: '',
    });
    const { createRace, loading, error } = useRaces();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.date || !form.distance) {
            toast.error('Name, date, and distance are required.');
            return;
        }
        try {
            await createRace({
                name: form.name,
                date: form.date,
                distance: parseFloat(form.distance),
                weatherConditions: form.weatherConditions || null,
            });
            if (!error) {
                navigate('/races');
                setForm({ name: '', date: '', distance: '', weatherConditions: '' });
            }
        } catch (err) {
            // Error handled in hook
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Add Race</h1>
                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                    <div className="mb-4">
                        <Input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Race Name"
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            type="number"
                            name="distance"
                            value={form.distance}
                            onChange={handleChange}
                            placeholder="Distance (km)"
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            name="weatherConditions"
                            value={form.weatherConditions}
                            onChange={handleChange}
                            placeholder="Weather Conditions (optional)"
                        />
                    </div>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Race'}
                    </Button>
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                </form>
            </main>
            <Footer />
        </div>
    );
};