import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');
    const nombre = localStorage.getItem('nombre');
    if (token && rol) return { token, rol, nombre };
    return null;
  });

  const login = (datos) => {
     console.log('AuthContext login llamado con:', datos);
    localStorage.setItem('token', datos.token);
    localStorage.setItem('rol', datos.rol);
    localStorage.setItem('nombre', datos.nombre);
    setUsuario({ token: datos.token, rol: datos.rol, nombre: datos.nombre });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombre');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}