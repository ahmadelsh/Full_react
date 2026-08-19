import { useState } from 'react';
import { generatorApi, projectApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CodePreviewer from '../components/CodePreviewer';
import { Play, Save, ShoppingBag, BookOpen, Columns, Dumbbell, Sparkles, Code2, Settings } from 'lucide-react';

const PRESETS = [
    {
        name: 'E-Commerce',
        icon: ShoppingBag,
        description: 'Store, products, and ordering system',
        sql: `CREATE TABLE products (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  price DECIMAL(10, 2),
  stock INT
);

CREATE TABLE orders (
  id INT PRIMARY KEY,
  user_id INT,
  status VARCHAR(50),
  total DECIMAL(10, 2),
  created_at TIMESTAMP
);

CREATE TABLE order_items (
  id INT PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT
);`
    },
    {
        name: 'Blog & CMS',
        icon: BookOpen,
        description: 'Posts, comments, and author relationships',
        sql: `CREATE TABLE posts (
  id INT PRIMARY KEY,
  title VARCHAR(150),
  content TEXT,
  author_id INT,
  published_at TIMESTAMP
);

CREATE TABLE comments (
  id INT PRIMARY KEY,
  post_id INT,
  author_name VARCHAR(100),
  content TEXT,
  created_at TIMESTAMP
);`
    },
    {
        name: 'Task Board',
        icon: Columns,
        description: 'Boards, columns, and tickets',
        sql: `CREATE TABLE boards (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  created_at TIMESTAMP
);

CREATE TABLE columns (
  id INT PRIMARY KEY,
  board_id INT,
  title VARCHAR(50),
  position INT
);

CREATE TABLE tasks (
  id INT PRIMARY KEY,
  column_id INT,
  title VARCHAR(150),
  description TEXT,
  due_date DATE
);`
    },
    {
        name: 'Gym Tracker',
        icon: Dumbbell,
        description: 'Workouts, exercises, sets and reps',
        sql: `CREATE TABLE workouts (
  id INT PRIMARY KEY,
  user_id INT,
  workout_type VARCHAR(100),
  duration_minutes INT,
  workout_date DATE
);

CREATE TABLE exercises (
  id INT PRIMARY KEY,
  workout_id INT,
  name VARCHAR(100),
  sets INT,
  reps INT
);`
    }
];

export default function GeneratorPage() {
    const { user } = useAuth();
    const [schema, setSchema] = useState('');
    const [title, setTitle] = useState('');
    const [generatedCode, setGeneratedCode] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublished, setIsPublished] = useState(true);
    const [message, setMessage] = useState('');
    const [mobileTab, setMobileTab] = useState('input');
    const [geminiKey, setGeminiKey] = useState(localStorage.getItem('gemini_api_key') || '');
    const [showKeyInput, setShowKeyInput] = useState(!localStorage.getItem('gemini_api_key'));

    const saveApiKey = (key) => {
        const trimmed = key.trim();
        setGeminiKey(trimmed);
        if (trimmed) {
            localStorage.setItem('gemini_api_key', trimmed);
            setShowKeyInput(false);
        } else {
            localStorage.removeItem('gemini_api_key');
        }
    };

    const handleGenerate = async () => {
        if (!schema.trim()) return;
        setIsGenerating(true);
        setMessage('');
        try {
            const res = await generatorApi.generateCode(schema);
            setGeneratedCode(res.data);
            setMessage('Code generated successfully!');
            setMobileTab('preview'); // Auto-switch to preview on mobile after generating
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePublish = async () => {
        if (!generatedCode || !title.trim() || !user) return;
        setIsSaving(true);
        try {
            await projectApi.saveProject({
                user_id: user.id,
                title,
                description: 'Generated via DevEngine',
                raw_schema_json: { raw: schema },
                generated_code_json: generatedCode,
                is_published: isPublished
            });
            setMessage(isPublished ? 'Project published to community feed!' : 'Project saved privately!');
        } catch (err) {
            setMessage(`Save Error: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const loadPreset = (sql, name) => {
        setSchema(sql);
        if (!title) {
            setTitle(`${name} System`);
        }
    };

    return (
        <div className="max-w-screen-2xl mx-auto p-3 md:p-4 flex flex-col h-[calc(100vh-80px)]">
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl md:text-2xl font-bold">DevAi Studio</h2>
                {message && <span className="text-xs md:text-sm font-medium text-brand-500 text-right max-w-[60%]">{message}</span>}
            </div>

            {/* Gemini API Key Banner */}
            {showKeyInput ? (
                <div className="mb-3 bg-amber-50 border border-amber-200 rounded-lg p-3 flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                    <span className="text-amber-700 text-sm font-medium whitespace-nowrap">🔑 Your Gemini API Key:</span>
                    <input
                        type="password"
                        className="flex-1 w-full border border-amber-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                        placeholder="AIzaSy..."
                        value={geminiKey}
                        onChange={(e) => setGeminiKey(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && saveApiKey(geminiKey)}
                    />
                    <button
                        onClick={() => saveApiKey(geminiKey)}
                        className="bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold px-4 py-1.5 rounded-md transition-colors whitespace-nowrap"
                    >
                        Save Key
                    </button>
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-xs text-amber-600 underline whitespace-nowrap">
                        Get free key →
                    </a>
                </div>
            ) : (
                <div className="mb-3 bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center justify-between">
                    <span className="text-green-700 text-sm">✅ Gemini API key saved</span>
                    <button onClick={() => setShowKeyInput(true)} className="text-xs text-green-600 underline hover:text-green-800">
                        Change key
                    </button>
                </div>
            )}

            {/* Mobile Tab Switcher — only visible on small screens */}
            <div className="flex lg:hidden mb-3 bg-gray-100 rounded-lg p-1">
                <button
                    onClick={() => setMobileTab('input')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-semibold transition-all ${mobileTab === 'input' ? 'bg-white shadow text-brand-700' : 'text-gray-500'}`}
                >
                    <Settings size={15} /> Input
                </button>
                <button
                    onClick={() => setMobileTab('preview')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-semibold transition-all ${mobileTab === 'preview' ? 'bg-white shadow text-brand-700' : 'text-gray-500'}`}
                >
                    <Code2 size={15} /> Preview
                    {generatedCode && <span className="bg-brand-500 text-white text-xs px-1.5 py-0.5 rounded-full">✓</span>}
                </button>
            </div>

            {/* Main Layout */}
            <div className="flex gap-4 flex-1 overflow-hidden">
                {/* Left Pane: Input */}
                <div className={`${mobileTab === 'input' ? 'flex' : 'hidden'} lg:flex w-full lg:w-1/3 flex-col gap-4 overflow-y-auto pr-1`}>
                    {/* Schema presets */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <label className="font-semibold mb-2 block text-sm flex items-center gap-1">
                            <Sparkles className="h-4 w-4 text-indigo-500" />
                            Select Schema Preset
                        </label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {PRESETS.map((preset) => {
                                const Icon = preset.icon;
                                return (
                                    <button
                                        key={preset.name}
                                        onClick={() => loadPreset(preset.sql, preset.name)}
                                        className="flex flex-col items-center text-center p-3 rounded-lg border border-slate-100 hover:border-brand-400 hover:bg-brand-50/10 transition-all text-xs"
                                    >
                                        <Icon className="h-5 w-5 text-brand-500 mb-1.5" />
                                        <span className="font-bold text-slate-800">{preset.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-1 flex flex-col min-h-[250px]">
                        <label className="font-semibold mb-2 block text-sm">1. Describe Your Schema (SQL or JSON)</label>
                        <textarea
                            className="flex-1 w-full p-3 border rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
                            placeholder="CREATE TABLE users ( id SERIAL PRIMARY KEY, name VARCHAR(100) );"
                            value={schema}
                            onChange={(e) => setSchema(e.target.value)}
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !schema.trim()}
                            className="mt-4 w-full bg-brand-900 text-white py-2.5 rounded-md hover:bg-brand-800 disabled:opacity-50 flex justify-center items-center gap-2 transition-colors font-semibold"
                        >
                            <Play size={18} /> {isGenerating ? 'Analyzing & Building...' : 'Generate Architecture'}
                        </button>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <label className="font-semibold mb-2 block text-sm">2. Save & Publish Options</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                            placeholder="App Title (e.g., Inventory Manager)"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <div className="mb-4">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Privacy Setting</label>
                            <select
                                value={isPublished ? 'public' : 'private'}
                                onChange={(e) => setIsPublished(e.target.value === 'public')}
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-white"
                            >
                                <option value="public">🌍 Public (Showcase to Everyone)</option>
                                <option value="private">🔒 Private (Only Visible on Profile)</option>
                            </select>
                        </div>
                        <button
                            onClick={handlePublish}
                            disabled={!generatedCode || !title.trim() || isSaving}
                            className="w-full bg-brand-500 text-white py-2 rounded-md hover:bg-brand-400 disabled:opacity-50 flex justify-center items-center gap-2 transition-colors font-semibold"
                        >
                            <Save size={18} /> {isSaving ? 'Saving...' : (isPublished ? 'Publish Project' : 'Save Private Project')}
                        </button>
                    </div>
                </div>

                {/* Right Pane: Preview */}
                <div className={`${mobileTab === 'preview' ? 'flex' : 'hidden'} lg:flex w-full lg:w-2/3 h-full flex-col`}>
                    <CodePreviewer codeData={generatedCode} projectName={title || 'generated-app'} />
                </div>
            </div>
        </div>
    );
}