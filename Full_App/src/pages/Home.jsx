import { useEffect, useState } from 'react';
import { projectApi } from '../services/api';
import AppCard from '../components/AppCard';
import WhatWeDo from '../components/WhatWeDo';
import { Layers } from 'lucide-react';

export default function Home() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const res = await projectApi.getPublicProjects();
                setProjects(res.projects);
            } catch (err) {
                setError(err.message);
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
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">Explore full-stack web applications generated entirely from raw database schemas by the DevAi powered by ElShami.</p>
            </div>

            <WhatWeDo />

            {loading && <p className="text-center text-gray-500">Loading showcase...</p>}
            {error && <p className="text-center text-red-500">Error: {error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(p => (
                    <AppCard key={p.id} project={p} />
                ))}
            </div>
            {!loading && projects.length === 0 && (
                <p className="text-center text-gray-500 mt-10">No public projects available yet.</p>
            )}
        </div>
    );
}