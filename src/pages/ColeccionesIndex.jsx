// src/pages/ColeccionesIndex.jsx
// ─────────────────────────────────────────────
// Vista pública: grid de todas las colecciones.
// Clic en una → navega a /colecciones/:slug
// ─────────────────────────────────────────────
import { Link } from "react-router-dom";
import { useColecciones } from "../context/ColeccionesContext";
import Navbar from "../componentes/Navbar";
import Footer from "../componentes/Footer";

const ColeccionesIndex = () => {
    const { colecciones, cargando, error } = useColecciones();

    return (
        <div>
            <Navbar />

            <div className="colindex-hero">
                <div className="colindex-hero-inner">
                    <span className="ayuda-tag">✦ Todas las colecciones</span>
                    <h1>Nuestras Colecciones</h1>
                    <p>Cada colección es una historia. Encuentra la que te represente.</p>
                </div>
            </div>

            <div className="colindex-contenido">
                {cargando && (
                    <div className="colindex-estado">
                        <div className="colindex-spinner" />
                        <p>Cargando colecciones...</p>
                    </div>
                )}

                {error && (
                    <div className="colindex-estado">
                        <p className="colindex-error">⚠️ {error}</p>
                    </div>
                )}

                {!cargando && !error && colecciones.length === 0 && (
                    <div className="colindex-estado">
                        <p>Aún no hay colecciones publicadas. ¡Pronto habrá novedades! 🌸</p>
                    </div>
                )}

                {!cargando && colecciones.length > 0 && (
                    <div className="colindex-grid">
                        {colecciones.map((col) => (
                            <Link
                                to={`/colecciones/${col.slug}`}
                                key={col.id}
                                className="colindex-card"
                            >
                                <div className="colindex-card-img">
                                    <img
                                        src={col.imagen_portada}
                                        alt={col.titulo}
                                        onError={(e) => { e.target.style.opacity = 0.2; }}
                                    />
                                    <div className="colindex-card-overlay">
                                        <span className="colindex-card-badge">
                                            {col.total_cards ?? col.cards?.length ?? 0} piezas
                                        </span>
                                    </div>
                                </div>
                                <div className="colindex-card-info">
                                    <h2>{col.titulo}</h2>
                                    <p>{col.descripcion}</p>
                                    <span className="colindex-card-cta">Ver colección →</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default ColeccionesIndex;
