import React, { useState, useEffect } from 'react';
import { usePigeons } from '../hooks/usePigeons';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const Pigeons: React.FC = () => {
    const [form, setForm] = useState({ name: '', ringNumber: '' });
    const { pigeons, fetchPigeons, createPigeon, loading, error } = usePigeons();

    useEffect(() => {
        fetchPigeons();
    }, [fetchPigeons]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createPigeon(form);
        setForm({ name: '', ringNumber: '' });
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">My Pigeons</h1>
                <form onSubmit={handleSubmit} className="mb-6 max-w-md">
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
                </form>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <ul className="space-y-2">
                    {pigeons.map((pigeon) => (
                        <li key={pigeon.id} className="p-2 border rounded">
                            {pigeon.name} - {pigeon.ringNumber}
                        </li>
                    ))}
                </ul>
            </main>
            <Footer />
        </div>
    );
};