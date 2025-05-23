// Файл contexts/UserContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('userData');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => localStorage.getItem('token'));

    const login = (data) => {
        const userData = {
            id: data.user.id,
            displayName: data.user.display_name,
            firstName: data.user.first_name,
            lastName: data.user.last_name,
            middleName: data.user.middle_name,
            email: data.user.email,
            phone: data.user.phone,
            address: data.user.address,
            birthdate: data.user.birthdate,
            avatarUrl: data.user.avatar_url,
            isBlocked: data.user.is_blocked,
            roles: data.user.roles
        };
        setToken(data.token);
        setUser(userData);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userData', JSON.stringify(userData));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
    };

    // Проверка на роль пользователя
    const hasRole = (roleName) => {
        return user?.roles.some(role => role.name === roleName) || false;
    };

    const updateUserData = (updatedUserData) => {
        // Обновляем только предоставленные поля
        const updatedUser = { ...user, ...updatedUserData };

        // Обновляем состояние и localStorage
        setUser(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
    };

    return (
        <UserContext.Provider value={{
            user,
            token,
            login,
            logout,
            isAuthenticated: !!token,
            hasRole,
            updateUserData
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);