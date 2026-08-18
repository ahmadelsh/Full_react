import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Loader2, Dumbbell, Sparkles, CheckCircle2, AlertCircle, KeyRound, ArrowLeft } from 'lucide-react';
import { authApi } from '../services/api';

export default function Login() {
    // Mode can be: 'login' | 'signup-request' | 'signup-verify' | 'signup-password' | 'forgot-request' | 'forgot-verify'
    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [otpToken, setOtpToken] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            if (mode === 'login') {
                await login({ email, password });
                navigate('/');
            } else if (mode === 'signup-request') {
                await authApi.sendOtp(email);
                setMessage('Verification code sent to your email!');
                setMode('signup-verify');
            } else if (mode === 'signup-verify') {
                await authApi.verifyOtp(email, otpToken);
                setMessage('Verification successful! Create your password.');
                setMode('signup-password');
            } else if (mode === 'signup-password') {
                await authApi.setPassword(email, password, username);
                setMessage('Account activated successfully! You can now log in.');
                setMode('login');
                setPassword('');
                setUsername('');
                setOtpToken('');
            } else if (mode === 'forgot-request') {
                await authApi.sendOtp(email);
                setMessage('Verification code sent to your email.');
                setMode('forgot-verify');
            } else if (mode === 'forgot-verify') {
                await authApi.verifyOtp(email, otpToken);
                await authApi.setPassword(email, password);
                setMessage('Password reset successful! You can now log in.');
                setMode('login');
                setPassword('');
                setOtpToken('');
            }
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || err.message || 'Action failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans">
            {/* Left Side: Rich visual/hero panel (Hidden on small screens) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 overflow-hidden items-center justify-center p-12 border-r border-slate-800">
                {/* Decorative radial gradients for glowing mesh effect */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="relative z-10 max-w-md text-center flex flex-col items-center">
                    <div className="inline-flex p-3 bg-indigo-600/10 border border-indigo-500/30 rounded-2xl mb-6 shadow-lg shadow-indigo-500/10">
                        <Dumbbell className="h-10 w-10 text-indigo-400 animate-pulse" />
                    </div>
                    
                    <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300">
                        Flex & Flow
                    </h1>
                    <p className="mt-4 text-slate-400 text-lg leading-relaxed">
                        Generate hyper-personalized workout schedules, track your health metrics, and reach your fitness targets with AI-crafted programs.
                    </p>

                    <div className="mt-12 space-y-6 text-left w-full">
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm transition-all duration-300 hover:border-slate-700/80">
                            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-200">AI Schedule Generator</h4>
                                <p className="text-sm text-slate-400 mt-1">Tailored training regimens based on your specific physical stats and availability.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm transition-all duration-300 hover:border-slate-700/80">
                            <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-200">Instant Activation</h4>
                                <p className="text-sm text-slate-400 mt-1">Start tracking workouts instantly. Create programs, log sets, and save progress.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Authentication form card */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:w-1/2 relative bg-slate-950">
                <div className="absolute top-10 left-10 lg:hidden flex items-center gap-2">
                    <Dumbbell className="h-6 w-6 text-indigo-400" />
                    <span className="font-bold text-lg tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-400">Flex & Flow</span>
                </div>

                <div className="w-full max-w-md space-y-8">
                    {/* Header */}
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-white">
                            {mode === 'login' && 'Welcome Back'}
                            {mode === 'signup-request' && 'Create an Account'}
                            {mode === 'signup-verify' && 'Verify Your Email'}
                            {mode === 'signup-password' && 'Choose Password'}
                            {mode === 'forgot-request' && 'Reset Password'}
                            {mode === 'forgot-verify' && 'Enter Verification Code'}
                        </h2>
                        <p className="mt-2 text-sm text-slate-400">
                            {mode === 'login' && 'Enter your details below to log in to your account.'}
                            {mode === 'signup-request' && 'Enter a unique username and your email address to get started.'}
                            {mode === 'signup-verify' && 'Please input the code sent to your email address.'}
                            {mode === 'signup-password' && 'Almost there! Set a password for your account to finish.'}
                            {mode === 'forgot-request' && 'Enter your email address to receive a verification code.'}
                            {mode === 'forgot-verify' && 'We have sent a verification code to your email. Enter it below with your new password.'}
                        </p>
                    </div>

                    {/* Alerts */}
                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-950/40 border border-red-800/60 text-red-200 rounded-xl text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                            <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                    {message && (
                        <div className="flex items-center gap-3 p-4 bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 rounded-xl text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                            <span>{message}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {mode === 'signup-request' && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Username</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                                        <User className="h-5 w-5" />
                                    </span>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        placeholder="cooluser123"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-200 placeholder-slate-600 outline-none transition-all duration-200 text-sm"
                                    />
                                </div>
                            </div>
                        )}

                        {(mode === 'login' || mode === 'signup-request' || mode === 'forgot-request') && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                                        <Mail className="h-5 w-5" />
                                    </span>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="name@example.com"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-200 placeholder-slate-600 outline-none transition-all duration-200 text-sm"
                                    />
                                </div>
                            </div>
                        )}

                        {(mode === 'signup-verify' || mode === 'forgot-verify') && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verification Code (OTP)</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                                        <KeyRound className="h-5 w-5" />
                                    </span>
                                    <input
                                        type="text"
                                        value={otpToken}
                                        onChange={(e) => setOtpToken(e.target.value)}
                                        required
                                        placeholder="123456"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-200 placeholder-slate-600 outline-none transition-all duration-200 text-sm"
                                    />
                                </div>
                            </div>
                        )}

                        {(mode === 'login' || mode === 'signup-password' || mode === 'forgot-verify') && (
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        {mode === 'signup-password' || mode === 'forgot-verify' ? 'Password' : 'Password'}
                                    </label>
                                    {mode === 'login' && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMode('forgot-request');
                                                setError('');
                                                setMessage('');
                                            }}
                                            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                                        >
                                            Forgot password?
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                                        <Lock className="h-5 w-5" />
                                    </span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-11 py-3 bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-200 placeholder-slate-600 outline-none transition-all duration-200 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 text-sm shadow-lg shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Please wait...</span>
                                </>
                            ) : (
                                <span>
                                    {mode === 'login' && 'Log In'}
                                    {mode === 'signup-request' && 'Send Code'}
                                    {mode === 'signup-verify' && 'Verify Code'}
                                    {mode === 'signup-password' && 'Complete Signup'}
                                    {mode === 'forgot-request' && 'Send Reset Code'}
                                    {mode === 'forgot-verify' && 'Reset Password'}
                                </span>
                            )}
                        </button>
                    </form>

                    {/* Footer toggles */}
                    <div className="text-center mt-6">
                        {mode === 'login' && (
                            <p className="text-sm text-slate-400">
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMode('signup-request');
                                        setError('');
                                        setMessage('');
                                    }}
                                    className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors bg-transparent border-none cursor-pointer p-0"
                                >
                                    Sign up
                                </button>
                            </p>
                        )}
                        {mode === 'signup-request' && (
                            <p className="text-sm text-slate-400">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMode('login');
                                        setError('');
                                        setMessage('');
                                    }}
                                    className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors bg-transparent border-none cursor-pointer p-0"
                                >
                                    Log in
                                </button>
                            </p>
                        )}
                        {(mode === 'signup-verify' || mode === 'signup-password' || mode === 'forgot-request' || mode === 'forgot-verify') && (
                            <button
                                type="button"
                                onClick={() => {
                                    setMode('login');
                                    setError('');
                                    setMessage('');
                                }}
                                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-slate-300 transition-colors bg-transparent border-none cursor-pointer p-0"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span>Back to log in</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}