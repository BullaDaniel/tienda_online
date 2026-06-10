import WhatsappBoton from "./componentes/WhatsappBoton";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { usePetalos } from "./context/PetalosContext";
import Petalo from "./componentes/Petalo";
import Home from "./pages/Home";
import PageCard from "./pages/PageCard";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import RutaProtegida from "./componentes/RutaProtegida";
import Ayuda from "./pages/Ayuda";
import Registro from "./pages/Registro";
import ColeccionesIndex from "./pages/ColeccionesIndex";
import ColeccionDetalle from "./pages/ColeccionDetalle";
import AdminColecciones from "./pages/Admin/AdminColecciones";

function App() {
    const { petalosActivos } = usePetalos();

    return (
        <>
            {petalosActivos && <Petalo />}
            <WhatsappBoton />
            <Routes>
                <Route path="/"             element={<Home />} />
                <Route path="/producto/:id" element={<PageCard />} />
                <Route path="/login"        element={<Login />} />
                <Route path="/registro"     element={<Registro />} />
                <Route path="/colecciones"       element={<ColeccionesIndex />} />
                <Route path="/colecciones/:slug" element={<ColeccionDetalle />} />
                <Route
                    path="/admin"
                    element={
                        <RutaProtegida>
                            <Admin />
                        </RutaProtegida>
                    }
                />
                <Route path="/ayuda" element={<Ayuda />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}

export default App;