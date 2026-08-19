import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectApi } from '../services/api';
import CodePreviewer from '../components/CodePreviewer';
import { ArrowLeft } from 'lucide-react';

export default function PublishedAppView() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRetrying, setIsRetrying] = useState(false);

    useEffect(() => {
        const fetchProject = async (attempt = 1) => {
            try {
                const res = await projectApi.getProjectById(id);
                setProject(res.project);
                setError(null);
                setIsRetrying(false);
            } catch (err) {
                if (attempt < 6) {
                    setIsRetrying(true);
                    setError(`Server is waking up, please wait... (${attempt}/6)`);
                    setTimeout(() => fetchProject(attempt + 1), 10000);
                } else {
                    setIsRetrying(false);
                    setError(err.message || 'Failed to load project.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading project architecture...</div>;
    
    if (error && !isRetrying) {
        return (
            <div className="max-w-2xl mx-auto p-8 text-center">
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl mb-4 text-sm font-medium">
                    {error}
                </div>
                <Link to="/" className="text-brand-500 hover:text-brand-700 font-semibold text-sm">
                    &larr; Return to Showcase
                </Link>
            </div>
        );
    }

    if (isRetrying) {
        return (
            <div className="max-w-2xl mx-auto p-8 text-center">
                <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl mb-4 text-sm font-medium animate-pulse">
                    {error}
                </div>
            </div>
        );
    }

    if (!project) return <div className="p-8 text-center text-gray-500">Project not found.</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 h-[calc(100vh-80px)] flex flex-col">
            <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-brand-500 mb-6 w-fit transition-colors">
                <ArrowLeft size={16} /> Back to Showcase
            </Link>

            <div className="mb-6">
                <h1 className="text-3xl font-bold">{project.title}</h1>
                <p className="text-gray-600 mt-2">Architected by <span className="font-semibold">@{project.profiles?.username}</span></p>
                <p className="text-sm text-gray-400 mt-1">Published on {new Date(project.created_at).toLocaleDateString()}</p>
            </div>

            <div className="flex-1 overflow-hidden rounded-lg shadow-xl">
                <CodePreviewer codeData={project.generated_code_json} projectName={project.title} />
            </div>
        </div>
    );
}