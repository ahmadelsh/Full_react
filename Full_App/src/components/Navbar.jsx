import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrainCircuit, LogOut, User, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMenuOpen(false);
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="bg-brand-900 text-white shadow-md relative z-50">
            {/* Top bar */}
            <div className="px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight">
                    <BrainCircuit className="text-brand-400 h-6 w-6" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">DevAi</span>
                </Link>

                {/* Desktop nav links */}
                <div className="hidden md:flex gap-4 items-center">
                    <Link to="/" className="hover:text-brand-400 transition-colors text-sm">Showcase</Link>
                    {user ? (
                        <>
                            <Link to="/generate" className="bg-brand-500 hover:bg-brand-400 px-4 py-2 rounded-md transition-colors font-medium text-sm">
                                New Project
                            </Link>
                            <Link to="/profile" className="flex items-center gap-1 hover:text-brand-400 transition-colors text-sm">
                                <User size={16} /> Profile
                            </Link>
                            <button onClick={handleLogout} className="flex items-center gap-1 hover:text-red-400 transition-colors text-sm">
                                <LogOut size={16} /> Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="flex items-center gap-1 hover:text-brand-400 transition-colors text-sm">
                            <User size={16} /> Login
                        </Link>
                    )}
                </div>

                {/* Mobile hamburger button */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden p-2 rounded-md hover:bg-brand-800 transition-colors"
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile dropdown menu */}
            {menuOpen && (
                <div className="md:hidden bg-brand-800 border-t border-brand-700 px-4 py-3 flex flex-col gap-3">
                    <Link to="/" onClick={closeMenu} className="flex items-center gap-2 py-2 hover:text-brand-400 transition-colors font-medium">
                        <Sparkles size={16} /> Showcase
                    </Link>
                    {user ? (
                        <>
                            <Link
                                to="/generate"
                                onClick={closeMenu}
                                className="flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 px-4 py-2.5 rounded-md transition-colors font-semibold"
                            >
                                + New Project
                            </Link>
                            <Link to="/profile" onClick={closeMenu} className="flex items-center gap-2 py-2 hover:text-brand-400 transition-colors font-medium">
                                <User size={16} /> Profile
                            </Link>
                            <button onClick={handleLogout} className="flex items-center gap-2 py-2 hover:text-red-400 transition-colors font-medium text-left">
                                <LogOut size={16} /> Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" onClick={closeMenu} className="flex items-center gap-2 py-2 hover:text-brand-400 transition-colors font-medium">
                            <User size={16} /> Login
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}