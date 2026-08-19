import { useEffect, useState } from 'react';
import { projectApi } from '../services/api';
import AppCard from '../components/AppCard';
import WhatWeDo from '../components/WhatWeDo';
import { Layers } from 'lucide-react';

export default function Home() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isRetrying, setIsRetrying] = useState(false);

    useEffect(() => {
        const fetchFeed = async (attempt = 1) => {
            try {
                const res = await projectApi.getPublicProjects();
                setProjects(res.projects || []);
                setError(null);
                setIsRetrying(false);
            } catch (err) {
                if (attempt < 6) {
                    setIsRetrying(true);
                    setError(`Server is waking up, please wait... (${attempt}/6)`);
                    setTimeout(() => fetchFeed(attempt + 1), 10000);
                } else {
                    setIsRetrying(false);
                    setError('Server took too long to respond. Please refresh the page.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchFeed();
    }, []);

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="text-center py-12 mb-8 bg-gradient-to-r from-brand-900 to-brand-800 text-white rounded-2xl shadow-xl">
                <Layers className="mx-auto mb-4 text-brand-400" size={48} />
                <h1 className="text-4xl font-extrabold mb-4">Community App Showcase</h1>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">Explore full-stack web applications generated entirely from raw database schemas by DevAi.</p>
            </div>

            <WhatWeDo />

            {loading && (
                <div className="text-center py-12 text-gray-500">
                    <p className="animate-pulse">Loading showcase...</p>
                </div>
            )}

            {error && (
                <div className={`text-center p-4 mb-6 rounded-xl text-sm font-medium ${isRetrying ? 'bg-amber-50 border border-amber-200 text-amber-800 animate-pulse' : 'bg-red-50 border border-red-200 text-red-600'}`}>
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(p => (
                    <AppCard key={p.id} project={p} />
                ))}
            </div>

            {!loading && !isRetrying && !error && projects.length === 0 && (
                <p className="text-center text-gray-500 mt-10">No public projects available yet.</p>
            )}
        </div>
    );
}