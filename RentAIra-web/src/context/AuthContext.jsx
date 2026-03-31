import React, { createContext, useContext, useState, useEffect } from 'react';
import { USERS } from '../data/dummy';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check localStorage for logged in user
        const storedUser = localStorage.getItem('rentaira_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // First check registered users in localStorage
                const registeredUsers = JSON.parse(localStorage.getItem('rentaira_registered_users') || '[]');
                const allUsers = [...USERS, ...registeredUsers];

                const foundUser = allUsers.find(u => u.email === email && u.password === password);

                if (foundUser) {
                    const { password, ...userWithoutPass } = foundUser;
                    setUser(userWithoutPass);
                    localStorage.setItem('rentaira_user', JSON.stringify(userWithoutPass));
                    resolve(userWithoutPass);
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 500); // Fake delay
        });
    };

    const register = (userData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const registeredUsers = JSON.parse(localStorage.getItem('rentaira_registered_users') || '[]');
                const newUser = { ...userData, id: `u${Date.now()}` };
                registeredUsers.push(newUser);
                localStorage.setItem('rentaira_registered_users', JSON.stringify(registeredUsers));
                resolve(newUser);
            }, 500);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('rentaira_user');
    };

    const updateUser = (updatedData) => {
        setUser(prev => {
            const newUser = { ...prev, ...updatedData };
            localStorage.setItem('rentaira_user', JSON.stringify(newUser));
            return newUser;
        });
    }

    // Map user to currentUser for legacy Firebase code compatibility
    const currentUser = user ? { ...user, uid: user.uid || user.id } : null;

    return (
        <AuthContext.Provider value={{ user, currentUser, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
