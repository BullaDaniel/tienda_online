// src/componentes/Navbar.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePetalos } from "../context/PetalosContext";

const Navbar = () => {
    const [menuAbierto, setMenuAbierto]     = useState(false);
    const [cuentaAbierta, setCuentaAbierta] = useState(false);
    const { usuario, logout }               = useAuth();
    const { petalosActivos, togglePetalos } = usePetalos();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setCuentaAbierta(false);
        navigate("/");
    };

    return (
        <header className="barraNavegacion">
            <div className="nav-izquierda">
                <Link to="/">
                    <img
                        src="/iconos/logo.png"
                        className="logo"
                        alt="Glossé"
                        onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "block";
                        }}
                    />
                    <span className="logo-texto" style={{ display: "none" }}>Glossé</span>
                </Link>
            </div>

            <nav className={`nav-centro ${menuAbierto ? "abierto" : ""}`}>
                <a href="/#colecciones" onClick={() => setMenuAbierto(false)}>Colecciones</a>
                <a href="/#catalogo"    onClick={() => setMenuAbierto(false)}>Hot Sale</a>
                <a href="/ayuda?tab=nosotros" onClick={() => setMenuAbierto(false)}>Sobre Nosotros</a>
            </nav>

            <div className="nav-derecha">

                <button
                    className={`nav-icono petalo-toggle ${petalosActivos ? "activo" : "inactivo"}`}
                    title={petalosActivos ? "Desactivar pétalos" : "Activar pétalos"}
                    onClick={togglePetalos}
                >
                    🌸
                    <span className="toggle-track">
                        <span className="toggle-thumb" />
                    </span>
                </button>

                <div className="cuenta-wrapper">
                    <button
                        className="nav-icono"
                        title="Mi cuenta"
                        onClick={() => setCuentaAbierta((p) => !p)}
                    >
                        👤
                        {usuario && <span className="cuenta-dot" />}
                    </button>

                    {cuentaAbierta && (
                        <div className="cuenta-dropdown">
                            {usuario ? (
                                <>
                                    <p className="cuenta-nombre">Hola, {usuario.nombre} ✨</p>
                                    {usuario.rol === "admin" && (
                                        <Link
                                            to="/admin"
                                            className="cuenta-link"
                                            onClick={() => setCuentaAbierta(false)}
                                        >
                                            🛠 Panel Admin
                                        </Link>
                                    )}
                                    <button className="cuenta-logout" onClick={handleLogout}>
                                        Cerrar sesión
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="cuenta-link"
                                    onClick={() => setCuentaAbierta(false)}
                                >
                                    Iniciar sesión →
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <button
                className="nav-hamburguesa"
                aria-label="Menú"
                onClick={() => setMenuAbierto((p) => !p)}
            >
                <span /><span /><span />
            </button>
        </header>
    );
};

export default Navbar;