// src/componentes/Navbar.jsx
// ─────────────────────────────────────────────
// Navbar unificada. Incluye:
//   - Buscador (del Código A)
//   - Contador de carrito (del Código A)
//   - Botón de cuenta con menú: Login / Logout / Admin
//   - Menú hamburguesa responsive
// ─────────────────────────────────────────────
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ petalosActivos, setPetalosActivos }) => {
    const [carritoCount] = useState(2);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [cuentaAbierta, setCuentaAbierta] = useState(false);
    const { usuario, logout } = useAuth();
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
                <a href="/#nosotros"    onClick={() => setMenuAbierto(false)}>Sobre Nosotros</a>
            </nav>

            <div className="nav-derecha">
                <div className="buscador-wrapper">
                    <span className="icono-buscar">🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar pijamas..."
                        className="buscador"
                    />
                </div>
                
                <button
                    className={`nav-icono ${!petalosActivos ? "nav-icono--apagado" : ""}`}
                    title={petalosActivos ? "Quitar pétalos" : "Activar pétalos"}
                    onClick={() => setPetalosActivos(p => !p)}
                >
                    🌸
                </button>

                {/* Menú de cuenta */}
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
                <span />
                <span />
                <span />
            </button>
        </header>
    );
};

export default Navbar;
