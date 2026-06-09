import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RutaProtegida({ children }) {
    const { usuario } = useAuth();
    console.log('RutaProtegida - usuario:', usuario);
    if (!usuario) return <Navigate to="/login" replace />;
    return children;
}

export default RutaProtegida;