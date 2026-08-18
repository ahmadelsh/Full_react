import { useState } from 'react';
import { FileCode2, Server, Layout, Download } from 'lucide-react';
import { downloadProjectZip } from '../utils/zipGenerator';

export default function CodePreviewer({ codeData, projectName = 'generated-app' }) {
    const [activeTab, setActiveTab] = useState('appJsx');
    const [isDownloading, setIsDownloading] = useState(false);

    if (!codeData) {
        return (
            <div className="h-full flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                Generate code to see the preview here.
            </div>
        );
    }

    const handleDownloadZip = async () => {
        setIsDownloading(true);
        try {
            await downloadProjectZip(codeData, projectName);
        } catch (err) {
            console.error('Failed to generate ZIP archive:', err);
            alert('Failed to generate ZIP. Check console for details.');
        } finally {
            setIsDownloading(false);
        }
    };

    const tabs = [
        { id: 'appJsx', label: 'App.jsx', icon: <Layout size={16} /> },
        { id: 'serverRoutes', label: 'Routes (Express)', icon: <Server size={16} /> },
        { id: 'components', label: 'Components', icon: <FileCode2 size={16} /> }
    ];

    const renderCode = () => {
        if (activeTab === 'components' && codeData.components) {
            return Object.entries(codeData.components).map(([name, code]) => (
                <div key={name} className="mb-6">
                    <h4 className="text-brand-400 font-bold mb-2">// {name}.jsx</h4>
                    <pre className="text-sm font-mono whitespace-pre-wrap">{code}</pre>
                </div>
            ));
        }
        return <pre className="text-sm font-mono whitespace-pre-wrap">{codeData[activeTab]}</pre>;
    };

    return (
        <div className="bg-brand-900 text-gray-100 rounded-lg overflow-hidden h-full flex flex-col shadow-lg">
            <div className="flex bg-brand-800 border-b border-gray-700 justify-between items-center pr-3">
                <div className="flex">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-brand-900 text-brand-400 border-t-2 border-brand-500' : 'text-gray-400 hover:text-gray-200'}`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleDownloadZip}
                    disabled={isDownloading}
                    className="flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors shadow-sm disabled:opacity-50"
                    title="Download complete backend & frontend package as ZIP"
                >
                    <Download size={14} />
                    {isDownloading ? 'Preparing ZIP...' : 'Download ZIP'}
                </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
                {renderCode()}
            </div>
        </div>
    );
}