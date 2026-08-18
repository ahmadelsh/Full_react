
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrainCircuit, LogOut, User } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-brand-900 text-white shadow-md p-4 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight">
                <BrainCircuit className="text-brand-400 h-6 w-6" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">DevAi</span>
            </Link>
            <div className="flex gap-4 items-center">
                <Link to="/" className="hover:text-brand-400 transition-colors">Showcase</Link>
                {user ? (
                    <>
                        <Link to="/generate" className="bg-brand-500 hover:bg-brand-400 px-4 py-2 rounded-md transition-colors font-medium">
                            New Project
                        </Link>
                        <Link to="/profile" className="flex items-center gap-1 hover:text-brand-400 transition-colors">
                            <User size={18} /> Profile
                        </Link>
                        <button onClick={handleLogout} className="flex items-center gap-1 hover:text-red-400 transition-colors">
                            <LogOut size={18} /> Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="flex items-center gap-1 hover:text-brand-400 transition-colors">
                        <User size={18} /> Login
                    </Link>
                )}
            </div>
        </nav>
    );
}