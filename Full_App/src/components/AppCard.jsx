
import { Link } from 'react-router-dom';
import { Terminal } from 'lucide-react';

export default function AppCard({ project }) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-3">
                <div className="bg-brand-100 p-2 rounded-md text-brand-500">
                    <Terminal size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-gray-800">{project.title}</h3>
                    <p className="text-xs text-gray-500">By @{project.profiles?.username || 'Unknown'}</p>
                </div>
            </div>
            <p className="text-gray-600 text-sm flex-1 mb-4">{project.description}</p>
            <div className="mt-auto">
                <Link to={`/app/${project.id}`} className="text-brand-500 hover:text-brand-700 text-sm font-medium">
                    View Architecture &rarr;
                </Link>
            </div>
        </div>
    );
}