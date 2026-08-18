import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Database, Terminal, Shield, ArrowRight, CheckCircle } from 'lucide-react';

export default function WhatWeDo() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCTA = () => {
        if (user) {
            navigate('/generate');
        } else {
            navigate('/login');
        }
    };

    return (
        <section className="bg-white border border-slate-200/80 rounded-2xl p-8 mb-12 shadow-sm relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-4xl mx-auto text-center">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                    <Sparkles className="h-3 w-3" /> Introducing DevAi
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl mb-4">
                    What We Do
                </h2>
                <p className="text-lg text-slate-650 max-w-2xl mx-auto leading-relaxed mb-10 text-slate-600">
                    DevAi is an intelligent application builder. Simply describe your database tables using standard SQL statements or JSON models, and our system compiles a fully structured React app structure in seconds.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto relative z-10">
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center p-5 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50/50 transition-all duration-300">
                    <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg mb-4">
                        1
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">Create Account</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Log in or sign up to activate the advanced compiler tools.
                    </p>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center p-5 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50/50 transition-all duration-300">
                    <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                        <Database className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">Describe Schema</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Input your database tables, keys, and schemas in SQL or JSON formats.
                    </p>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center p-5 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50/50 transition-all duration-300">
                    <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                        <Terminal className="h-6 w-6 animate-pulse" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">Generate App</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Our AI processes the schema and builds modules, preview scripts, and API maps.
                    </p>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center text-center p-5 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50/50 transition-all duration-300">
                    <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                        <Shield className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">Save & Privacy</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Choose to showcase it to the community (Public) or keep it in your collection (Private).
                    </p>
                </div>
            </div>

            <div className="mt-10 flex justify-center relative z-10">
                <button
                    onClick={handleCTA}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-900 hover:bg-brand-850 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer"
                >
                    <span>Launch App Studio</span>
                    <ArrowRight className="h-5 w-5" />
                </button>
            </div>
        </section>
    );
}
