// src/context/AuthContext.jsx
// ─────────────────────────────────────────────
// Contexto global de autenticación.
// Provee: usuario actual, login y logout.
// Mock hardcoded — reemplaza con tu API real.
// ─────────────────────────────────────────────
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// Usuario admin de prueba (mock)
const MOCK_USERS = [
    { email: "admin@glosse.com", password: "glosse123", rol: "admin", nombre: "Admin Glossé" },
    { email: "user@glosse.com",  password: "user123",   rol: "user",  nombre: "Usuario" },
];

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [error, setError] = useState("");

    const login = (email, password) => {
        const encontrado = MOCK_USERS.find(
            (u) => u.email === email && u.password === password
        );
        if (encontrado) {
            setUsuario(encontrado);
            setError("");
            return true;
        } else {
            setError("Credenciales incorrectas. Verifica tu email y contraseña.");
            return false;
        }
    };

    const logout = () => setUsuario(null);

    return (
        <AuthContext.Provider value={{ usuario, login, logout, error, setError }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook de conveniencia
export const useAuth = () => useContext(AuthContext);
