import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi, projectApi } from '../services/api';
import { Link } from 'react-router-dom';
import { User, KeyRound, Calendar, Globe, Lock, Shield, Settings, AppWindow, ExternalLink, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function Profile() {
    const { user } = useAuth();
    
    // Form states
    const [username, setUsername] = useState(user?.user_metadata?.username || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // UI states
    const [projects, setProjects] = useState([]);
    const [projectsLoading, setProjectsLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchMyProjects = async () => {
            try {
                const res = await projectApi.getMyProjects();
                setProjects(res.projects || []);
            } catch (err) {
                console.error('Error fetching personal projects:', err);
            } finally {
                setProjectsLoading(false);
            }
        };

        if (user) {
            fetchMyProjects();
        }
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password && password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setUpdating(true);
        try {
            await authApi.updateProfile(username, password || undefined);
            setMessage('Profile updated successfully!');
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Failed to update profile.');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard & Profile</h1>
                        <p className="text-slate-400 mt-1">Manage your account credentials, security settings, and personal applications.</p>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm">
                        <Shield className="h-4 w-4 text-indigo-400" />
                        <span className="text-slate-300 font-medium">Logged in as {user?.email}</span>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Profile Settings */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
                            
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Settings className="h-5 w-5 text-indigo-400" />
                                Account Settings
                            </h2>

                            {error && (
                                <div className="flex items-center gap-2.5 p-3.5 mb-5 bg-red-950/40 border border-red-800/60 text-red-200 rounded-xl text-xs animate-in fade-in slide-in-from-top-2">
                                    <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {message && (
                                <div className="flex items-center gap-2.5 p-3.5 mb-5 bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 rounded-xl text-xs animate-in fade-in slide-in-from-top-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                                    <span>{message}</span>
                                </div>
                            )}

                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Username</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                                            <User className="h-4 w-4" />
                                        </span>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                            className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-200 placeholder-slate-600 outline-none transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-slate-800/80 my-5 pt-4">
                                    <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-1.5">
                                        <KeyRound className="h-4 w-4 text-indigo-400" />
                                        Change Password
                                    </h3>
                                    <p className="text-xs text-slate-500 mb-4">Leave fields blank if you do not wish to change your password.</p>

                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">New Password</label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                                                    <Lock className="h-4 w-4" />
                                                </span>
                                                <input
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-200 placeholder-slate-600 outline-none transition-all text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirm New Password</label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                                                    <Lock className="h-4 w-4" />
                                                </span>
                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-200 placeholder-slate-600 outline-none transition-all text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all text-sm shadow-md flex items-center justify-center gap-2"
                                >
                                    {updating ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Saving Changes...</span>
                                        </>
                                    ) : (
                                        <span>Save Profile Settings</span>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: User's Projects */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <AppWindow className="h-5 w-5 text-indigo-400" />
                                My Generated Projects
                            </h2>

                            {projectsLoading ? (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
                                    <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
                                    <span>Retrieving your projects...</span>
                                </div>
                            ) : projects.length === 0 ? (
                                <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl">
                                    <AppWindow className="mx-auto h-12 w-12 text-slate-700 mb-3 animate-pulse" />
                                    <p className="text-slate-400 font-medium">You haven't generated any projects yet.</p>
                                    <p className="text-slate-500 text-sm mt-1">Head over to the App Studio to start building.</p>
                                    <Link
                                        to="/generate"
                                        className="mt-5 inline-flex bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-5 py-2.5 rounded-xl font-semibold transition-colors"
                                    >
                                        Create New Project
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {projects.map((project) => (
                                        <div
                                            key={project.id}
                                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-950/60 border border-slate-850 hover:border-slate-700/80 rounded-xl transition-all gap-4"
                                        >
                                            <div className="space-y-1">
                                                <h3 className="font-bold text-slate-100 flex items-center gap-2">
                                                    {project.title}
                                                    {project.is_published ? (
                                                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                                                            <Globe className="h-3 w-3" /> Public
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20 font-medium">
                                                            <Lock className="h-3 w-3" /> Private
                                                        </span>
                                                    )}
                                                </h3>
                                                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    Created on {new Date(project.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Link
                                                to={`/app/${project.id}`}
                                                className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold px-3 py-2 bg-indigo-500/5 hover:bg-indigo-500/10 rounded-lg border border-indigo-500/15 transition-all"
                                            >
                                                View App <ExternalLink className="h-3 w-3" />
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
