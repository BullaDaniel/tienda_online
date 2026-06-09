import WhatsappBoton from "./componentes/WhatsappBoton";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import PageCard from "./pages/PageCard";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import RutaProtegida from "./componentes/RutaProtegida";
import Ayuda from "./pages/Ayuda";

function App() {
    return (
        <>
        <WhatsappBoton />  
        <Routes>
            <Route path="/"             element={<Home />} />
            <Route path="/producto/:id" element={<PageCard />} />
            <Route path="/login"        element={<Login />} />
            <Route
                path="/admin"
                element={
                    <RutaProtegida>
                        <Admin />
                    </RutaProtegida>
                }
                
            />
            <Route path="/ayuda" element={<Ayuda />} />
            {/* Ruta catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
           
        </Routes>
       </>
    );
}

export default App;
