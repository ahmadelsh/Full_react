import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is already logged in on page load
    useEffect(() => {
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
        // Supabase admin.createUser doesn't return a session automatically.
        // User needs to login after registering.
        return response.data;
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);