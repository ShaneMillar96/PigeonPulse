import React, { useState } from 'react';
import { usePigeons } from '../hooks/usePigeons';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { useNavigate } from 'react-router-dom';

export const AddPigeon: React.FC = () => {
    const [form, setForm] = useState({ name: '', ringNumber: '' });
    const { createPigeon, loading, error } = usePigeons();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createPigeon(form);
        if (!error) {
            navigate('/pigeons'); // Redirect back to Pigeons page on success
        }
        setForm({ name: '', ringNumber: '' }); // Reset form
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Add Pigeon</h1>
                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                    <div className="mb-4">
                        <Input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Pigeon Name"
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            name="ringNumber"
                            value={form.ringNumber}
                            onChange={handleChange}
                            placeholder="Ring Number"
                        />
                    </div>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Pigeon'}
                    </Button>
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                </form>
            </main>
            <Footer />
        </div>
    );
};