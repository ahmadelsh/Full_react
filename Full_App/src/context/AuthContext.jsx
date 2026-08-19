import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is already logged in on page load or returning from OAuth redirect
    useEffect(() => {
        // Handle OAuth token redirect from Supabase (#access_token=...)
        const hash = window.location.hash;
        if (hash && hash.includes('access_token=')) {
            const params = new URLSearchParams(hash.substring(1));
            const accessToken = params.get('access_token');
            if (accessToken) {
                localStorage.setItem('token', accessToken);
                // Clean hash from URL bar
                window.history.replaceState(null, '', window.location.pathname);
            }
        }

        const token = localStorage.getItem('token');
        if (token) {
            authApi.getCurrentUser()
                .then((res) => {
                    setUser(res.data.user);
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    setUser(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    // Login with Google (Supabase OAuth)
    const loginWithGoogle = () => {
        const supabaseUrl = 'https://edkjxeygzorlowxggnnd.supabase.co';
        const redirectUrl = window.location.origin;
        window.location.href = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectUrl)}`;
    };

    // Login function
    const login = async (credentials) => {
        const response = await authApi.login(credentials);
        setUser(response.data.user);
        const token = response.data.session?.access_token || response.data.token;
        if (token) localStorage.setItem('token', token);
        return response.data;
    };

    // Signup function
    const signup = async (userData) => {
        const response = await authApi.signup(userData);
        return response.data;
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loginWithGoogle, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);