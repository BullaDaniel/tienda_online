
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import PageCard from "./pages/PageCard";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Ayuda from "./pages/Ayuda";

// Guarda de ruta: redirige a /login si no hay sesión
// o si el rol requerido no coincide
const RutaProtegida = ({ children, rolRequerido }) => {
    const { usuario } = useAuth();
    if (!usuario) return <Navigate to="/login" replace />;
    if (rolRequerido && usuario.rol !== rolRequerido) return <Navigate to="/" replace />;
    return children;
};

function App() {
    return (
        <Routes>
            <Route path="/"              element={<Home />} />
            <Route path="/producto/:id"  element={<PageCard />} />
            <Route path="/login"         element={<Login />} />
            <Route
                path="/admin"
                element={
                    <RutaProtegida rolRequerido="admin">
                        <Admin />
                    </RutaProtegida>
                }
                
            />
            <Route path="/ayuda" element={<Ayuda />} />
            {/* Ruta catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
            
        </Routes>
    );
}

export default App;
